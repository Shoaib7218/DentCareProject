import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllHolidays, addHoliday, deleteHoliday } from "../../api/holidays";
import type { ClinicHolidayResponse, ClinicHolidayRequest } from "../../types";

const ManageHolidays = () => {
  const [holidays, setHolidays] = useState<ClinicHolidayResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState<ClinicHolidayRequest>({
    holidayDate: "",
    reason: "",
  });

  const fetchHolidays = async () => {
    try {
      const data = await getAllHolidays();
      setHolidays(data);
    } catch {
      setError("Failed to load holidays");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      await addHoliday(form);
      setSuccess("Holiday added successfully");
      setShowForm(false);
      setForm({ holidayDate: "", reason: "" });
      fetchHolidays();
    } catch {
      setError("Failed to add holiday. Date may already be marked.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this holiday?")) return;
    try {
      await deleteHoliday(id);
      setSuccess("Holiday removed successfully");
      fetchHolidays();
    } catch {
      setError("Failed to remove holiday");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const upcoming = holidays.filter((h) => h.holidayDate >= today);
  const past = holidays.filter((h) => h.holidayDate < today);

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>Clinic Holidays</h2>
            <p style={styles.subheading}>Manage clinic closure dates</p>
          </div>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "+ Add Holiday"}
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Add Clinic Holiday</h3>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Holiday Date</label>
                  <input
                    style={styles.input}
                    type="date"
                    name="holidayDate"
                    value={form.holidayDate}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Reason</label>
                  <input
                    style={styles.input}
                    type="text"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    placeholder="Diwali, Christmas, Staff Training..."
                    required
                  />
                </div>
              </div>
              <button
                style={submitting ? styles.buttonDisabled : styles.submitBtn}
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Add Holiday"}
              </button>
            </form>
          </div>
        )}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Upcoming Holidays</h3>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : upcoming.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyIcon}>📅</p>
              <p style={styles.emptyText}>No upcoming holidays marked</p>
            </div>
          ) : (
            <div style={styles.list}>
              {upcoming.map((h) => (
                <div key={h.id} style={styles.holidayCard}>
                  <div style={styles.holidayLeft}>
                    <div style={styles.dateBox}>
                      <span style={styles.dateDay}>
                        {h.holidayDate.split("-")[2]}
                      </span>
                      <span style={styles.dateMonth}>
                        {new Date(h.holidayDate).toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <p style={styles.holidayDate}>{h.holidayDate}</p>
                      <p style={styles.holidayReason}>{h.reason}</p>
                    </div>
                  </div>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(h.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {past.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Past Holidays</h3>
            <div style={styles.list}>
              {past.map((h) => (
                <div
                  key={h.id}
                  style={{ ...styles.holidayCard, opacity: 0.6 }}
                >
                  <div style={styles.holidayLeft}>
                    <div
                      style={{ ...styles.dateBox, background: "#a0aec0" }}
                    >
                      <span style={styles.dateDay}>
                        {h.holidayDate.split("-")[2]}
                      </span>
                      <span style={styles.dateMonth}>
                        {new Date(h.holidayDate).toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div>
                      <p style={styles.holidayDate}>{h.holidayDate}</p>
                      <p style={styles.holidayReason}>{h.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  addBtn: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
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
  formCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    outline: "none",
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
    width: "fit-content",
  },
  buttonDisabled: {
    padding: "12px 24px",
    background: "#ccc",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    width: "fit-content",
  },
  section: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  sectionTitle: {
    fontSize: "18px",
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
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  holidayCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    background: "#f7fafc",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
  },
  holidayLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  dateBox: {
    background: "linear-gradient(135deg, #fc8181 0%, #e53e3e 100%)",
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
  holidayDate: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "2px",
  },
  holidayReason: {
    fontSize: "13px",
    color: "#718096",
  },
  deleteBtn: {
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

export default ManageHolidays;