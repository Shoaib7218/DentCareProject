import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getPatientAppointments,
  cancelAppointment,
} from "../../api/appointments";
import type { Appointment } from "../../types";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const fetchAppointments = async () => {
    try {
      const data = await getPatientAppointments();
      setAppointments(data);
    } catch {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await cancelAppointment(id);
      setSuccess("Appointment cancelled successfully");
      fetchAppointments();
    } catch {
      setError("Failed to cancel appointment");
    }
  };

  const filtered =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter(
    (a) => a.status === "CONFIRMED"
  ).length;
  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const getStatusStyle = (status: string): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      PENDING: {
        background: "#fef3c7",
        color: "#92400e",
      },
      CONFIRMED: {
        background: "#dbeafe",
        color: "#1e40af",
      },
      COMPLETED: {
        background: "#dcfce7",
        color: "#166534",
      },
      CANCELLED: {
        background: "#fee2e2",
        color: "#991b1b",
      },
    };

    return map[status] || {};
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HERO */}
        <div style={styles.hero}>
          <div>
            <p style={styles.heroTag}>📅 Appointment Center</p>
            <h1 style={styles.heroTitle}>My Appointments</h1>
            <p style={styles.heroSubtitle}>
              Track your upcoming visits, treatment history, and appointment
              status.
            </p>
          </div>

          <div style={styles.heroCircle}>
            <span style={styles.heroEmoji}>🦷</span>
          </div>
        </div>

        {/* ALERTS */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>{success}</div>}

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>📋</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <h2 style={styles.statValue}>{appointments.length}</h2>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>⏳</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
            <h2 style={styles.statValue}>{pending}</h2>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>✅</span>
              <span style={styles.statLabel}>Confirmed</span>
            </div>
            <h2 style={styles.statValue}>{confirmed}</h2>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statTop}>
              <span style={styles.statIcon}>🏁</span>
              <span style={styles.statLabel}>Completed</span>
            </div>
            <h2 style={styles.statValue}>{completed}</h2>
          </div>
        </div>

        {/* FILTER BAR */}
        <div style={styles.toolbar}>
          <div>
            <h3 style={styles.sectionTitle}>Recent Appointments</h3>
            <p style={styles.sectionSubtitle}>
              Manage all your dental bookings
            </p>
          </div>

          <div style={styles.filterRow}>
            {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(
              (status) => (
                <button
                  key={status}
                  style={{
                    ...styles.filterBtn,
                    ...(filterStatus === status
                      ? styles.filterBtnActive
                      : {}),
                  }}
                  onClick={() => setFilterStatus(status)}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div style={styles.loadingCard}>
            <p style={styles.loading}>Loading appointments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIconWrap}>📅</div>
            <h3 style={styles.emptyTitle}>No appointments found</h3>
            <p style={styles.emptyText}>
              Your booked appointments will appear here.
            </p>
          </div>
        ) : (
          <div style={styles.appointmentGrid}>
            {filtered.map((a) => (
              <div key={a.id} style={styles.card}>
                {/* TOP */}
                <div style={styles.cardTop}>
                  <div style={styles.dateCard}>
                    <span style={styles.dateDay}>
                      {a.appointmentDate.split("-")[2]}
                    </span>

                    <span style={styles.dateMonth}>
                      {new Date(a.appointmentDate).toLocaleString("default", {
                        month: "short",
                      })}
                    </span>

                    <span style={styles.dateYear}>
                      {a.appointmentDate.split("-")[0]}
                    </span>
                  </div>

                  <div style={styles.cardInfo}>
                    <h3 style={styles.serviceName}>🦷 {a.serviceName}</h3>

                    <p style={styles.infoText}>
                      👨‍⚕️ Dr. {a.doctorName}
                    </p>

                    <p style={styles.infoText}>
                      🕐 {a.appointmentTime.substring(0, 5)}
                    </p>

                    {a.notes && (
                      <p style={styles.notes}>📝 {a.notes}</p>
                    )}
                  </div>
                </div>

                {/* BOTTOM */}
                <div style={styles.cardBottom}>
                  <div>
                    <span
                      style={{
                        ...styles.badge,
                        ...getStatusStyle(a.status),
                      }}
                    >
                      {a.status}
                    </span>

                    <h3 style={styles.price}>₹{a.servicePrice}</h3>
                  </div>

                  {(a.status === "PENDING" ||
                    a.status === "CONFIRMED") && (
                    <button
                      style={styles.cancelBtn}
                      onClick={() => handleCancel(a.id)}
                    >
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    padding: "32px 24px 60px",
  },

  hero: {
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderRadius: "28px",
    padding: "38px",
    marginBottom: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    boxShadow: "0 15px 40px rgba(15,23,42,0.15)",
  },

  heroTag: {
    fontSize: "13px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "1px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },

  heroTitle: {
    fontSize: "36px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  heroSubtitle: {
    fontSize: "15px",
    color: "rgba(255,255,255,0.75)",
    maxWidth: "520px",
    lineHeight: "1.7",
  },

  heroCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(10px)",
  },

  heroEmoji: {
    fontSize: "42px",
  },

  error: {
    background: "#fff1f2",
    color: "#be123c",
    border: "1px solid #fecdd3",
    padding: "14px 18px",
    borderRadius: "14px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "500",
  },

  successMsg: {
    background: "#ecfdf5",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "14px 18px",
    borderRadius: "14px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: "500",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },

  statIcon: {
    fontSize: "22px",
  },

  statLabel: {
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
  },

  statValue: {
    fontSize: "34px",
    fontWeight: "800",
    color: "#0f172a",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
    gap: "20px",
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },

  sectionSubtitle: {
    fontSize: "14px",
    color: "#64748b",
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  filterBtn: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid #dbe3ee",
    background: "#fff",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.2s",
  },

  filterBtnActive: {
    background: "#0f172a",
    color: "#fff",
    border: "1px solid #0f172a",
  },

  loadingCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "22px",
    textAlign: "center",
  },

  loading: {
    color: "#64748b",
    fontSize: "15px",
  },

  emptyCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "70px 30px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },

  emptyIconWrap: {
    width: "90px",
    height: "90px",
    borderRadius: "24px",
    background: "#f1f5f9",
    margin: "0 auto 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
  },

  emptyTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },

  emptyText: {
    color: "#64748b",
    fontSize: "15px",
  },

  appointmentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  cardTop: {
    display: "flex",
    gap: "18px",
    alignItems: "flex-start",
  },

  dateCard: {
    minWidth: "82px",
    background: "#0f172a",
    borderRadius: "22px",
    padding: "16px 12px",
    textAlign: "center",
  },

  dateDay: {
    display: "block",
    color: "#fff",
    fontSize: "28px",
    fontWeight: "800",
    lineHeight: 1,
  },

  dateMonth: {
    display: "block",
    color: "rgba(255,255,255,0.75)",
    marginTop: "6px",
    textTransform: "uppercase",
    fontSize: "12px",
    fontWeight: "700",
  },

  dateYear: {
    display: "block",
    color: "rgba(255,255,255,0.5)",
    marginTop: "4px",
    fontSize: "11px",
  },

  cardInfo: {
    flex: 1,
  },

  serviceName: {
    fontSize: "19px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "10px",
  },

  infoText: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "6px",
  },

  notes: {
    marginTop: "10px",
    background: "#f8fafc",
    padding: "12px",
    borderRadius: "12px",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
  },

  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "18px",
  },

  badge: {
    padding: "7px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "12px",
  },

  price: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#0f172a",
  },

  cancelBtn: {
    padding: "12px 18px",
    borderRadius: "14px",
    border: "none",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default MyAppointments;