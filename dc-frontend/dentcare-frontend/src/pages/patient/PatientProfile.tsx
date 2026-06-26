import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const PatientProfile = () => {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.put("/api/patient/profile", {
        fullName: form.fullName,
        phone: form.phone,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword || undefined,
      });
      setSuccess("Profile updated successfully");
      setEditing(false);
      login({ ...user!, fullName: form.fullName });
    } catch {
      setError("Failed to update profile. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.heading}>My Profile</h2>
          <p style={styles.subheading}>View and update your account details</p>
        </div>

        <div style={styles.layout}>
          <div style={styles.avatarCard}>
            <div style={styles.avatarCircle}>
              {user?.fullName?.charAt(0).toUpperCase()}
            </div>
            <h3 style={styles.avatarName}>{user?.fullName}</h3>
            <p style={styles.avatarEmail}>{user?.email}</p>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>

          <div style={styles.formCard}>
            {success && <div style={styles.successMsg}>{success}</div>}
            {error && <div style={styles.errorMsg}>{error}</div>}

            {!editing ? (
              <div style={styles.viewMode}>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Full Name</span>
                  <span style={styles.infoValue}>{user?.fullName}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Email Address</span>
                  <span style={styles.infoValue}>{user?.email}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Role</span>
                  <span style={styles.infoValue}>{user?.role}</span>
                </div>
                <button style={styles.editBtn} onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    style={styles.input}
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Phone Number</label>
                  <input
                    style={styles.input}
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter new phone number"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input
                    style={styles.input}
                    name="currentPassword"
                    type="password"
                    value={form.currentPassword}
                    onChange={handleChange}
                    placeholder="Required to save changes"
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password (optional)</label>
                  <input
                    style={styles.input}
                    name="newPassword"
                    type="password"
                    value={form.newPassword}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div style={styles.formActions}>
                  <button
                    style={loading ? styles.buttonDisabled : styles.submitBtn}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    style={styles.cancelBtn}
                    type="button"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f0f4f8",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  header: {
    marginBottom: "28px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "4px",
  },
  subheading: {
    fontSize: "15px",
    color: "#718096",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  avatarCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "32px 24px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  avatarCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    fontSize: "32px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  avatarName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "4px",
  },
  avatarEmail: {
    fontSize: "13px",
    color: "#718096",
    marginBottom: "12px",
    wordBreak: "break-all",
  },
  roleBadge: {
    background: "#ebf4ff",
    color: "#3182ce",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  formCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  successMsg: {
    background: "#f0fff4",
    color: "#276749",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    border: "1px solid #c6f6d5",
  },
  errorMsg: {
    background: "#fff0f0",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    border: "1px solid #fed7d7",
  },
  viewMode: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  infoRow: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f0f4f8",
  },
  infoLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#a0aec0",
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: "16px",
    color: "#2d3748",
    fontWeight: "500",
  },
  editBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    width: "fit-content",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#4a5568",
  },
  input: {
    padding: "11px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
  },
  formActions: {
    display: "flex",
    gap: "12px",
  },
  submitBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "12px 24px",
    background: "#ccc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },
  cancelBtn: {
    padding: "12px 24px",
    background: "#fff",
    color: "#718096",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default PatientProfile;