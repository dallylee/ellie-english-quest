import { useEffect, useState } from "react";
import {
  createEliPin,
  createParentAccount,
  getEliPinStatus,
  listenForParentAuth,
  loadRemoteSaga,
  resetEliPin,
  sendParentPasswordReset,
  signInParent,
  signOutParent,
  verifyEliPin
} from "./firebaseClient.js";

function pinModeTitle(mode) {
  if (mode === "create") return "Create Eli PIN";
  if (mode === "reset") return "Reset Eli PIN";
  return "Enter Eli's PIN";
}

export function LoginScreen({ onReady, onLocalOnly }) {
  const [authUser, setAuthUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMode, setPinMode] = useState("enter");
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("Sign in with the parent account, then unlock Eli's profile.");
  const [busy, setBusy] = useState(false);

  useEffect(() => listenForParentAuth((user) => {
    setAuthUser(user);
    if (user) setEmail(user.email || "");
  }), []);

  useEffect(() => {
    let cancelled = false;
    async function loadPinState() {
      if (!authUser) return;
      setProfileLoading(true);
      setMessage("Checking Eli PIN setup...");
      try {
        const status = await getEliPinStatus(authUser.uid);
        if (cancelled) return;
        setPinMode(status.pinSet ? "enter" : "create");
        setMessage(status.pinSet
          ? "Parent login ready. Enter Eli's PIN."
          : "Parent login ready. Create Eli's PIN on this device.");
      } catch (error) {
        if (!cancelled) setMessage(error.message || "Could not check Eli's profile.");
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }
    loadPinState();
    return () => {
      cancelled = true;
    };
  }, [authUser]);

  async function submitAuth(event, createAccount = false) {
    event.preventDefault();
    setBusy(true);
    setMessage(createAccount ? "Creating the parent login..." : "Signing in...");

    try {
      const user = createAccount
        ? await createParentAccount(email, password)
        : await signInParent(email, password);
      setAuthUser(user);
      setMessage("Parent login ready. Checking Eli PIN setup...");
    } catch (error) {
      setMessage(error.message || "Login failed. Check the parent email and password.");
    } finally {
      setBusy(false);
    }
  }

  async function handleParentPasswordReset() {
    if (!email.trim()) {
      setMessage("Enter the parent email first.");
      return;
    }
    setBusy(true);
    try {
      await sendParentPasswordReset(email);
      setMessage("Parent password reset email sent. Eli's PIN is not sent by email.");
    } catch (error) {
      setMessage(error.message || "Could not send the parent password reset email.");
    } finally {
      setBusy(false);
    }
  }

  async function submitPin(event) {
    event.preventDefault();
    if (!authUser) return;
    if ((pinMode === "create" || pinMode === "reset") && pin !== confirmPin) {
      setMessage("The two PIN boxes must match.");
      return;
    }
    setBusy(true);
    setMessage(pinMode === "enter" ? "Checking Eli's PIN..." : "Saving Eli's new PIN...");

    try {
      const pinResult = pinMode === "create"
        ? await createEliPin(authUser.uid, pin)
        : pinMode === "reset"
          ? await resetEliPin(authUser.uid, pin)
          : await verifyEliPin(authUser.uid, pin);
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
      setConfirmPin("");
      setPinMode("enter");
      setMessage("Signed out. You can use the parent login again.");
    } finally {
      setBusy(false);
    }
  }

  function switchPinMode(nextMode) {
    setPin("");
    setConfirmPin("");
    setPinMode(nextMode);
    setMessage(nextMode === "reset"
      ? "Signed-in parent can create a new Eli PIN. The old PIN is not emailed."
      : "Enter Eli's PIN.");
  }

  const pinDisabled = busy || profileLoading;

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
              Parent password
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
            <button className="text-button" type="button" disabled={busy} onClick={handleParentPasswordReset}>
              Reset parent password
            </button>
          </form>
        ) : (
          <form className="saga-form" onSubmit={submitPin}>
            <div className="signed-in-row">
              <span>{authUser.email}</span>
              <button className="text-button" type="button" onClick={handleSignOut} disabled={busy}>Switch</button>
            </div>
            <h2 className="pin-mode-title">{pinModeTitle(pinMode)}</h2>
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
                disabled={pinDisabled}
              />
            </label>
            {pinMode === "create" || pinMode === "reset" ? (
              <label>
                Confirm Eli PIN
                <input
                  autoComplete="off"
                  inputMode="numeric"
                  type="password"
                  value={confirmPin}
                  onChange={(event) => setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  minLength={4}
                  required
                  disabled={pinDisabled}
                />
              </label>
            ) : null}
            <button className="primary" type="submit" disabled={pinDisabled}>
              {pinModeTitle(pinMode)}
            </button>
            {pinMode === "enter" ? (
              <button className="text-button" type="button" disabled={pinDisabled} onClick={() => switchPinMode("reset")}>
                Reset Eli PIN
              </button>
            ) : (
              <button className="text-button" type="button" disabled={pinDisabled} onClick={() => switchPinMode("enter")}>
                Enter existing PIN
              </button>
            )}
          </form>
        )}

        <button className="welcome-link" type="button" onClick={onLocalOnly} disabled={busy}>
          Continue on this browser (local save only)
        </button>
      </div>
    </section>
  );
}
