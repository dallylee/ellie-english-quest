import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "firebase/firestore";

function readFirebaseEnv(value) {
  return String(value || "").trim();
}

export const firebaseConfig = {
  apiKey: readFirebaseEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: readFirebaseEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: readFirebaseEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: readFirebaseEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: readFirebaseEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: readFirebaseEnv(import.meta.env.VITE_FIREBASE_APP_ID)
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;

function missingFirebaseConfigError() {
  return new Error("Cloud login is not configured on this build. Continue on this browser or add the Firebase environment settings.");
}

function requireAuth() {
  if (!auth) throw missingFirebaseConfigError();
  return auth;
}

function requireDb() {
  if (!db) throw missingFirebaseConfigError();
  return db;
}

function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function hashPin(pin) {
  const encoded = new TextEncoder().encode(String(pin || ""));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function listenForParentAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentParentUser() {
  return auth?.currentUser || null;
}

export async function signInParent(email, password) {
  const credential = await signInWithEmailAndPassword(requireAuth(), normaliseEmail(email), password);
  return credential.user;
}

export async function sendParentPasswordReset(email) {
  await sendPasswordResetEmail(requireAuth(), normaliseEmail(email));
}

export async function createParentAccount(email, password) {
  const credential = await createUserWithEmailAndPassword(requireAuth(), normaliseEmail(email), password);
  const firestore = requireDb();
  await setDoc(doc(firestore, "users", credential.user.uid, "settings", "account"), {
    parentEmail: normaliseEmail(email),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
  return credential.user;
}

export async function signOutParent() {
  await signOut(requireAuth());
}

export async function loadEliProfile(uid) {
  const profileRef = doc(requireDb(), "users", uid, "profiles", "eli");
  const snapshot = await getDoc(profileRef);
  return snapshot.exists() ? snapshot.data() : null;
}

function requireSignedInParent(uid) {
  const user = getCurrentParentUser();
  if (!user || user.uid !== uid) {
    throw new Error("Please sign in with the parent account first.");
  }
}

export async function getEliPinStatus(uid) {
  const profile = await loadEliProfile(uid);
  return {
    pinSet: Boolean(profile?.pinHash)
  };
}

export async function createEliPin(uid, pin) {
  requireSignedInParent(uid);
  const pinHash = await hashPin(pin);
  const profileRef = doc(requireDb(), "users", uid, "profiles", "eli");
  const existing = await getDoc(profileRef);

  if (existing.exists() && existing.data()?.pinHash) {
    throw new Error("Eli already has a PIN. Use Reset Eli PIN to make a new one.");
  }

  await setDoc(profileRef, {
    displayName: "Eli",
    pinHash,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { status: "created" };
}

export async function verifyEliPin(uid, pin) {
  requireSignedInParent(uid);
  const pinHash = await hashPin(pin);
  const profileRef = doc(requireDb(), "users", uid, "profiles", "eli");
  const existing = await getDoc(profileRef);
  if (!existing.exists()) {
    throw new Error("Create Eli's PIN first.");
  }
  const profile = existing.data();
  if (profile.pinHash !== pinHash) {
    throw new Error("That PIN does not match Eli's profile.");
  }

  await setDoc(profileRef, {
    lastVerifiedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { status: "verified" };
}

export async function resetEliPin(uid, pin) {
  requireSignedInParent(uid);
  const pinHash = await hashPin(pin);
  const profileRef = doc(requireDb(), "users", uid, "profiles", "eli");
  await setDoc(profileRef, {
    displayName: "Eli",
    pinHash,
    pinResetAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
  return { status: "reset" };
}

export async function setOrVerifyEliPin(uid, pin) {
  const status = await getEliPinStatus(uid);
  return status.pinSet ? verifyEliPin(uid, pin) : createEliPin(uid, pin);
}

export async function loadRemoteSaga(uid) {
  const firestore = requireDb();
  const [skySnapshot, unlockSnapshot, settingsSnapshot, rewardsSnapshot] = await Promise.all([
    getDoc(doc(firestore, "users", uid, "progress", "sky-islands")),
    getDoc(doc(firestore, "users", uid, "progress", "sagaUnlocks")),
    getDoc(doc(firestore, "users", uid, "settings", "eli")),
    getDoc(doc(firestore, "users", uid, "rewards", "saga"))
  ]);

  return {
    skyIslands: skySnapshot.exists() ? skySnapshot.data().skyIslands : null,
    sagaUnlocks: unlockSnapshot.exists() ? unlockSnapshot.data().sagaUnlocks : null,
    settings: settingsSnapshot.exists() ? settingsSnapshot.data().settings : null,
    rewards: rewardsSnapshot.exists() ? rewardsSnapshot.data().rewards : null
  };
}

export async function saveRemoteSaga(uid, saga, appSettings = {}) {
  const firestore = requireDb();
  const now = serverTimestamp();
  await Promise.all([
    setDoc(doc(firestore, "users", uid, "progress", "sky-islands"), {
      skyIslands: saga.skyIslands,
      updatedAt: now
    }, { merge: true }),
    setDoc(doc(firestore, "users", uid, "progress", "sagaUnlocks"), {
      sagaUnlocks: saga.sagaUnlocks,
      updatedAt: now
    }, { merge: true }),
    setDoc(doc(firestore, "users", uid, "settings", "eli"), {
      settings: appSettings,
      updatedAt: now
    }, { merge: true }),
    setDoc(doc(firestore, "users", uid, "rewards", "saga"), {
      rewards: {
        skyIslands: saga.skyIslands?.collectedRewards || []
      },
      updatedAt: now
    }, { merge: true })
  ]);
}
