import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
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

export const firebaseConfig = {
  apiKey: "AIzaSyBvzPNeJRODcfIOoy2Y1cJcojPcAfqpDU4",
  authDomain: "eliv2-52f56.firebaseapp.com",
  projectId: "eliv2-52f56",
  storageBucket: "eliv2-52f56.firebasestorage.app",
  messagingSenderId: "558567782708",
  appId: "1:558567782708:web:239d8891ca8ffd89378d61"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function normaliseEmail(email) {
  return String(email || "").trim().toLowerCase();
}

async function hashPin(pin) {
  const encoded = new TextEncoder().encode(String(pin || ""));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function listenForParentAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentParentUser() {
  return auth.currentUser;
}

export async function signInParent(email, password) {
  const credential = await signInWithEmailAndPassword(auth, normaliseEmail(email), password);
  return credential.user;
}

export async function createParentAccount(email, password) {
  const credential = await createUserWithEmailAndPassword(auth, normaliseEmail(email), password);
  await setDoc(doc(db, "users", credential.user.uid, "settings", "account"), {
    parentEmail: normaliseEmail(email),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
  return credential.user;
}

export async function signOutParent() {
  await signOut(auth);
}

export async function loadEliProfile(uid) {
  const profileRef = doc(db, "users", uid, "profiles", "eli");
  const snapshot = await getDoc(profileRef);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function setOrVerifyEliPin(uid, pin) {
  const pinHash = await hashPin(pin);
  const profileRef = doc(db, "users", uid, "profiles", "eli");
  const existing = await getDoc(profileRef);

  if (!existing.exists()) {
    await setDoc(profileRef, {
      displayName: "Eli",
      pinHash,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { status: "created" };
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

export async function loadRemoteSaga(uid) {
  const [skySnapshot, unlockSnapshot, settingsSnapshot, rewardsSnapshot] = await Promise.all([
    getDoc(doc(db, "users", uid, "progress", "sky-islands")),
    getDoc(doc(db, "users", uid, "progress", "sagaUnlocks")),
    getDoc(doc(db, "users", uid, "settings", "eli")),
    getDoc(doc(db, "users", uid, "rewards", "saga"))
  ]);

  return {
    skyIslands: skySnapshot.exists() ? skySnapshot.data().skyIslands : null,
    sagaUnlocks: unlockSnapshot.exists() ? unlockSnapshot.data().sagaUnlocks : null,
    settings: settingsSnapshot.exists() ? settingsSnapshot.data().settings : null,
    rewards: rewardsSnapshot.exists() ? rewardsSnapshot.data().rewards : null
  };
}

export async function saveRemoteSaga(uid, saga, appSettings = {}) {
  const now = serverTimestamp();
  await Promise.all([
    setDoc(doc(db, "users", uid, "progress", "sky-islands"), {
      skyIslands: saga.skyIslands,
      updatedAt: now
    }, { merge: true }),
    setDoc(doc(db, "users", uid, "progress", "sagaUnlocks"), {
      sagaUnlocks: saga.sagaUnlocks,
      updatedAt: now
    }, { merge: true }),
    setDoc(doc(db, "users", uid, "settings", "eli"), {
      settings: appSettings,
      updatedAt: now
    }, { merge: true }),
    setDoc(doc(db, "users", uid, "rewards", "saga"), {
      rewards: {
        skyIslands: saga.skyIslands?.collectedRewards || []
      },
      updatedAt: now
    }, { merge: true })
  ]);
}
