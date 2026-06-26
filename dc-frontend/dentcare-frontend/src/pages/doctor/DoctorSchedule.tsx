import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

interface DoctorLeave {
  id: number;
  leaveDate: string;
  reason: string;
}

const DoctorSchedule = () => {
  const [leaves, setLeaves] = useState<DoctorLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    leaveDate: "",
    reason: "",
  });

  const fetchLeaves = async () => {
    try {
      const response = await api.get("/api/doctor/leaves");
      setLeaves(response.data);
    } catch {
      setError("Failed to load schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/doctor/leaves", form);
      setSuccess("Leave marked successfully");
      setForm({ leaveDate: "", reason: "" });
      fetchLeaves();
    } catch {
      setError("Failed to mark leave. Date may already be marked.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id: number) => {
    if (!confirm("Remove this leave date?")) return;
    try {
      await api.delete(`/api/doctor/leaves/${id}`);
      setSuccess("Leave removed successfully");
      fetchLeaves();
    } catch {
      setError("Failed to remove leave");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const upcoming = leaves
    .filter((l) => l.leaveDate >= today)
    .sort((a, b) => a.leaveDate.localeCompare(b.leaveDate));

  const past = leaves
    .filter((l) => l.leaveDate < today)
    .sort((a, b) => b.leaveDate.localeCompare(a.leaveDate));

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>My Schedule</h2>
            <p style={styles.subheading}>Mark dates when you are unavailable</p>
          </div>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        <div style={styles.layout}>
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Mark Leave Date</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Leave Date</label>
                <input
                  style={styles.input}
                  type="date"
                  name="leaveDate"
                  value={form.leaveDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Reason (Optional)</label>
                <input
                  style={styles.input}
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Personal, medical, holiday..."
                />
              </div>
              <button
                style={submitting ? styles.buttonDisabled : styles.submitBtn}
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Mark as Unavailable"}
              </button>
            </form>
          </div>

          <div style={styles.listSection}>
            <div style={styles.listCard}>
              <h3 style={styles.listTitle}>Upcoming Leave Dates</h3>
              {loading ? (
                <p style={styles.loading}>Loading...</p>
              ) : upcoming.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyIcon}>📅</p>
                  <p style={styles.emptyText}>No upcoming leaves marked</p>
                </div>
              ) : (
                <div style={styles.leaveList}>
                  {upcoming.map((leave) => (
                    <div key={leave.id} style={styles.leaveCard}>
                      <div style={styles.leaveLeft}>
                        <div style={styles.dateBox}>
                          <span style={styles.dateDay}>
                            {leave.leaveDate.split("-")[2]}
                          </span>
                          <span style={styles.dateMonth}>
                            {new Date(leave.leaveDate).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                        </div>
                        <div>
                          <p style={styles.leaveDate}>{leave.leaveDate}</p>
                          <p style={styles.leaveReason}>
                            {leave.reason || "No reason provided"}
                          </p>
                        </div>
                      </div>
                      <button
                        style={styles.removeBtn}
                        onClick={() => handleRemove(leave.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div style={styles.listCard}>
                <h3 style={styles.listTitle}>Past Leave Dates</h3>
                <div style={styles.leaveList}>
                  {past.map((leave) => (
                    <div
                      key={leave.id}
                      style={{ ...styles.leaveCard, opacity: 0.6 }}
                    >
                      <div style={styles.leaveLeft}>
                        <div
                          style={{
                            ...styles.dateBox,
                            background: "#a0aec0",
                          }}
                        >
                          <span style={styles.dateDay}>
                            {leave.leaveDate.split("-")[2]}
                          </span>
                          <span style={styles.dateMonth}>
                            {new Date(leave.leaveDate).toLocaleString(
                              "default",
                              { month: "short" }
                            )}
                          </span>
                        </div>
                        <div>
                          <p style={styles.leaveDate}>{leave.leaveDate}</p>
                          <p style={styles.leaveReason}>
                            {leave.reason || "No reason provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "32px 24px",
  },
  header: {
    marginBottom: "24px",
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
  error: {
    background: "#fff0f0",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    border: "1px solid #fed7d7",
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
  layout: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  formCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    position: "sticky",
    top: "80px",
  },
  formTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
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
  submitBtn: {
    padding: "12px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  buttonDisabled: {
    padding: "12px",
    background: "#ccc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },
  listSection: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  listCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  listTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "16px",
  },
  loading: {
    textAlign: "center",
    color: "#718096",
    padding: "20px",
  },
  emptyState: {
    textAlign: "center",
    padding: "32px",
  },
  emptyIcon: {
    fontSize: "40px",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#a0aec0",
    fontSize: "14px",
  },
  leaveList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  leaveCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
    background: "#f7fafc",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  leaveLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  dateBox: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "8px",
    padding: "8px 12px",
    textAlign: "center",
    minWidth: "48px",
  },
  dateDay: {
    display: "block",
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    lineHeight: "1",
  },
  dateMonth: {
    display: "block",
    fontSize: "11px",
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  leaveDate: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "2px",
  },
  leaveReason: {
    fontSize: "13px",
    color: "#718096",
  },
  removeBtn: {
    padding: "6px 14px",
    background: "#fff5f5",
    color: "#e53e3e",
    border: "1px solid #fed7d7",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default DoctorSchedule;