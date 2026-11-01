
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error } =
        await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        setErrorMessage(error.message);
      }

      if (data.session) {
        setHasRecoverySession(true);
      }

      setCheckingSession(false);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setHasRecoverySession(true);
          setErrorMessage("");
        }

        if (event === "SIGNED_OUT") {
          setHasRecoverySession(false);
        }
      }
    );

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!hasRecoverySession) {
      setErrorMessage(
        "Your reset session is missing or has expired. Open a fresh password-reset link from your email."
      );
      return;
    }

    if (password.length < 6) {
      setErrorMessage(
        "Your password must contain at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.getSession();

      if (error) throw error;

      if (!data.session) {
        setHasRecoverySession(false);
        throw new Error(
          "Your reset session has expired. Request a new password-reset link."
        );
      }

      const { error: updateError } =
        await supabase.auth.updateUser({
          password,
        });

      if (updateError) throw updateError;

      setMessage(
        "Password changed successfully. Redirecting to login..."
      );

      setPassword("");
      setConfirmPassword("");

      const { error: signOutError } =
        await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      window.history.replaceState({}, "", "/");

      window.location.reload();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="auth-page">
        <div className="auth-box">
          <p>Verifying your reset session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>Choose a New Password</h1>

        <p className="auth-subtitle">
          Enter your new password below.
        </p>

        {!hasRecoverySession && (
          <p className="auth-message auth-error" role="alert">
            Open this page using a valid password-reset
            link from your email.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            minLength={6}
            autoComplete="new-password"
            required
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            minLength={6}
            autoComplete="new-password"
            required
          />

          <button
            type="submit"
            disabled={loading || !hasRecoverySession}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        {errorMessage && (
          <p className="auth-message auth-error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;
