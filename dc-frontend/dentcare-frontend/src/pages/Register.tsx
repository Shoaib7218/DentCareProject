import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logoContainer}>
            <div style={styles.logo}>🦷</div>

            <div>
              <h1 style={styles.brand}>DentCare</h1>
              <p style={styles.tagline}>
                Professional Dental Management
              </p>
            </div>
          </div>

          <h2 style={styles.heading}>
            Modern Healthcare Platform
          </h2>

          <p style={styles.description}>
            Streamline appointments, manage patient
            records, and deliver a seamless dental
            care experience with a secure and modern
            platform.
          </p>

          <div style={styles.featureBox}>
            <div style={styles.feature}>
              ✓ Smart Appointment Scheduling
            </div>

            <div style={styles.feature}>
              ✓ Secure Patient Management
            </div>

            <div style={styles.feature}>
              ✓ Real-time Dashboard Access
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              Create Your Account
            </h2>

            <p style={styles.subtitle}>
              Register as a patient to continue
            </p>
          </div>

          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <form
            onSubmit={handleSubmit}
            style={styles.form}
          >
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                style={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={
                loading
                  ? styles.buttonDisabled
                  : styles.button
              }
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?
            </p>

            <Link
              to="/login"
              style={styles.link}
            >
              Sign In
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
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    color: "#fff",
  },

  leftContent: {
    maxWidth: "460px",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "40px",
  },

  logo: {
    width: "72px",
    height: "72px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  brand: {
    fontSize: "34px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-1px",
  },

  tagline: {
    marginTop: "6px",
    color: "#9ca3af",
    fontSize: "14px",
  },

  heading: {
    fontSize: "42px",
    lineHeight: 1.2,
    marginBottom: "20px",
    fontWeight: 700,
    letterSpacing: "-1px",
  },

  description: {
    fontSize: "16px",
    lineHeight: 1.8,
    color: "#d1d5db",
  },

  featureBox: {
    marginTop: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  feature: {
    fontSize: "15px",
    color: "#f3f4f6",
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
    maxWidth: "460px",
    background: "#fff",
    borderRadius: "20px",
    padding: "42px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "30px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  error: {
    marginBottom: "20px",
    padding: "14px",
    borderRadius: "10px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "14px",
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

  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fff",
    transition: "0.2s ease",
  },

  button: {
    marginTop: "10px",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s ease",
  },

  buttonDisabled: {
    marginTop: "10px",
    padding: "15px",
    borderRadius: "10px",
    border: "none",
    background: "#9ca3af",
    color: "#fff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "not-allowed",
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

export default Register;