import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await login(form);
      setAuth(data);
      if (data.role === "ADMIN") navigate("/admin/dashboard");
      else if (data.role === "DOCTOR") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message;
      if (message && message.includes("not verified")) {
        navigate("/verify-otp", { state: { email: form.email } });
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div>
          <h1 style={styles.brand}>DentCare</h1>

          <p style={styles.description}>
            Professional dental management platform for clinics,
            doctors, and patients.
          </p>

          <div style={styles.featureBox}>
            <p style={styles.feature}>✔ Appointment Management</p>
            <p style={styles.feature}>✔ Patient Records</p>
            <p style={styles.feature}>✔ Secure Authentication</p>
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Sign In</h2>
            <p style={styles.subtitle}>
              Enter your credentials to continue
            </p>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
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
              <label style={styles.label}>Password</label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                style={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={
                loading ? styles.buttonDisabled : styles.button
              }
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don’t have an account?
            </p>

            <Link to="/register" style={styles.link}>
              Create Account
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
    transition: "0.2s ease",
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
    transition: "0.2s ease",
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

export default Login;