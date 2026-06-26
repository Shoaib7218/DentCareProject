import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useAuth();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await verifyOtp({ email, otp });
      setAuth(data);
      navigate("/patient/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    setSuccess("");

    try {
      await resendOtp({ email });
      setSuccess("A new OTP has been sent to your email.");
      setTimer(60);
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div>
          <h1 style={styles.brand}>DentCare</h1>

          <p style={styles.description}>
            Secure email verification ensures your account remains protected
            and gives you safe access to appointments, records and healthcare
            services.
          </p>

          <div style={styles.featureBox}>
            <p style={styles.feature}>✔ Secure OTP Authentication</p>
            <p style={styles.feature}>✔ Account Protection</p>
            <p style={styles.feature}>✔ Quick Verification Process</p>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Verify Your Email</h2>

            <p style={styles.subtitle}>
              Enter the 6-digit verification code sent to
            </p>

            <p style={styles.email}>
              <strong>{email}</strong>
            </p>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>OTP Code</label>

              <input
                style={styles.otpInput}
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, ""))
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={
                loading || otp.length !== 6
                  ? styles.buttonDisabled
                  : styles.button
              }
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <div style={styles.resendSection}>
            {timer > 0 ? (
              <p style={styles.timerText}>
                Resend OTP in {timer}s
              </p>
            ) : (
              <button
                style={styles.resendBtn}
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            )}
          </div>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Wrong email address?
            </p>

            <Link to="/register" style={styles.link}>
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#f4f7fb",
  },

  leftPanel: {
    flex: 1,
    background: "#1f2937",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  header: {
    marginBottom: "28px",
  },

  brand: {
    fontSize: "42px",
    fontWeight: 700,
    marginBottom: "16px",
    letterSpacing: "-1px",
  },

  description: {
    fontSize: "16px",
    lineHeight: 1.7,
    color: "#d1d5db",
    maxWidth: "420px",
  },

  featureBox: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  feature: {
    fontSize: "15px",
    color: "#f3f4f6",
  },

  title: {
    fontSize: "30px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },

  email: {
    fontSize: "14px",
    color: "#111827",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },

  otpInput: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "8px",
    outline: "none",
    backgroundColor: "#fff",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#111827",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
  },

  buttonDisabled: {
    marginTop: "10px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#9ca3af",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "not-allowed",
  },

  error: {
    marginBottom: "20px",
    padding: "14px",
    borderRadius: "10px",
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: "14px",
    border: "1px solid #fecaca",
  },

  successMsg: {
    marginBottom: "20px",
    padding: "14px",
    borderRadius: "10px",
    background: "#f0fdf4",
    color: "#166534",
    fontSize: "14px",
    border: "1px solid #bbf7d0",
  },

  resendSection: {
    textAlign: "center",
    marginTop: "20px",
  },

  timerText: {
    fontSize: "14px",
    color: "#6b7280",
  },

  resendBtn: {
    background: "none",
    border: "none",
    color: "#111827",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },

  footer: {
    marginTop: "28px",
    textAlign: "center",
  },

  footerText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "6px",
  },

  link: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
    textDecoration: "none",
  },
};

export default VerifyOtp;