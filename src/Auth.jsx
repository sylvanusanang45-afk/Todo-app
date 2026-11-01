
import { useState } from "react";
import { supabase } from "./supabase";

const SITE_URL =
  "https://my-react-app-vko1.vercel.app";

function Auth() {
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);

  function changeMode(newMode) {
    setMode(newMode);
    setMessage("");
    setErrorMessage("");
    setPassword("");
    setShowResend(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      // LOGIN
      if (mode === "login") {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (error) {
          const isUnconfirmed =
            error.message.toLowerCase().includes("email not confirmed");

          if (isUnconfirmed) {
            setShowResend(true);
          }

          throw error;
        }
      }

      // SIGN UP
      else if (mode === "signup") {
        const { data, error } =
          await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
              emailRedirectTo: SITE_URL,
            },
          });

        if (error) throw error;

        if (data.session) {
          setMessage("Your account has been created.");
        } else {
          setMessage(
            "Account created! Check your email for the confirmation link."
          );
        }
      }

      // FORGOT PASSWORD
      else if (mode === "forgot") {
        const { error } =
          await supabase.auth.resetPasswordForEmail(
            email.trim(),
            {
              redirectTo: `${SITE_URL}/reset-password`,
            }
          );

        if (error) throw error;

        setMessage(
          "If an account exists for that email, a password-reset link will be sent. Check your inbox and spam folder."
        );
      }

      // RESEND CONFIRMATION
      else if (mode === "resend") {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email: email.trim(),
          options: {
            emailRedirectTo: SITE_URL,
          },
        });

        if (error) throw error;

        setMessage(
          "If your account needs confirmation, check your email for a new link."
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  const titles = {
    login: "Welcome Back",
    signup: "Create Account",
    forgot: "Forgot Password?",
    resend: "Confirm Your Email",
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1>{titles[mode]}</h1>

        <p className="auth-subtitle">
          {mode === "login" &&
            "Log in to access your Sticky Wall tasks."}

          {mode === "signup" &&
            "Create an account to get started."}

          {mode === "forgot" &&
            "Enter your email to request a password reset."}

          {mode === "resend" &&
            "Request a new confirmation email."}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {(mode === "login" || mode === "signup") && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                mode === "signup"
                  ? "new-password"
                  : "current-password"
              }
              minLength={6}
              required
            />
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : mode === "signup"
                  ? "Create Account"
                  : mode === "forgot"
                    ? "Send Reset Link"
                    : "Resend Confirmation"}
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

        <div className="auth-switch-container">
          {mode === "login" && (
            <>
              <button
                type="button"
                className="auth-switch"
                onClick={() => changeMode("forgot")}
              >
                Forgot password?
              </button>

              {showResend && (
                <button
                  type="button"
                  className="auth-switch"
                  onClick={() => changeMode("resend")}
                >
                  Resend confirmation email
                </button>
              )}

              <span>Don't have an account?</span>

              <button
                type="button"
                className="auth-switch"
                onClick={() => changeMode("signup")}
              >
                Sign Up
              </button>
            </>
          )}

          {mode !== "login" && (
            <button
              type="button"
              className="auth-switch"
              onClick={() => changeMode("login")}
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
