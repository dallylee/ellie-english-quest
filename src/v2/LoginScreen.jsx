import { useEffect, useState } from "react";
import {
  createParentAccount,
  listenForParentAuth,
  loadRemoteSaga,
  setOrVerifyEliPin,
  signInParent,
  signOutParent
} from "./firebaseClient.js";

export function LoginScreen({ onReady, onLocalOnly }) {
  const [authUser, setAuthUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("Sign in with the parent account, then unlock Eli's profile.");
  const [busy, setBusy] = useState(false);

  useEffect(() => listenForParentAuth((user) => {
    setAuthUser(user);
    if (user) setEmail(user.email || "");
  }), []);

  async function submitAuth(event, createAccount = false) {
    event.preventDefault();
    setBusy(true);
    setMessage(createAccount ? "Creating the parent login..." : "Signing in...");

    try {
      const user = createAccount
        ? await createParentAccount(email, password)
        : await signInParent(email, password);
      setAuthUser(user);
      setMessage("Parent login ready. Enter Eli's PIN.");
    } catch (error) {
      setMessage(error.message || "Login failed. Check the email and password.");
    } finally {
      setBusy(false);
    }
  }

  async function submitPin(event) {
    event.preventDefault();
    if (!authUser) return;
    setBusy(true);
    setMessage("Checking Eli's profile...");

    try {
      const pinResult = await setOrVerifyEliPin(authUser.uid, pin);
      const remoteSaga = await loadRemoteSaga(authUser.uid);
      onReady({
        user: authUser,
        pinResult,
        remoteSaga
      });
    } catch (error) {
      setMessage(error.message || "That PIN did not work.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOutParent();
      setAuthUser(null);
      setPin("");
      setMessage("Signed out. You can use the parent login again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="saga-login" aria-label="Parent login">
      <div className="saga-login-panel">
        <div className="orb-login-preview" aria-hidden="true">
          <span className="orb-eye left" />
          <span className="orb-eye right" />
          <span className="orb-brow left" />
          <span className="orb-brow right" />
          <span className="orb-mouth smile" />
        </div>
        <p className="eyebrow">New adventure</p>
        <h1>Eli's Sky Islands are ready.</h1>
        <p className="muted">{message}</p>

        {!authUser ? (
          <form className="saga-form" onSubmit={(event) => submitAuth(event, false)}>
            <label>
              Parent email
              <input
                autoComplete="email"
                inputMode="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                autoComplete="current-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
              />
            </label>
            <div className="saga-form-actions">
              <button className="primary" type="submit" disabled={busy}>Sign in</button>
              <button
                className="secondary"
                type="button"
                disabled={busy}
                onClick={(event) => submitAuth(event, true)}
              >
                Create login
              </button>
            </div>
          </form>
        ) : (
          <form className="saga-form" onSubmit={submitPin}>
            <div className="signed-in-row">
              <span>{authUser.email}</span>
              <button className="text-button" type="button" onClick={handleSignOut} disabled={busy}>Switch</button>
            </div>
            <label>
              Eli PIN
              <input
                autoComplete="off"
                inputMode="numeric"
                type="password"
                value={pin}
                onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                minLength={4}
                required
              />
            </label>
            <button className="primary" type="submit" disabled={busy}>Unlock Eli profile</button>
          </form>
        )}

        <button className="welcome-link" type="button" onClick={onLocalOnly} disabled={busy}>
          Continue on this browser
        </button>
      </div>
    </section>
  );
}
