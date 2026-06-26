import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getDoctorAppointments } from "../../api/appointments";
import { useAuth } from "../../context/AuthContext";
import type { Appointment } from "../../types";

const DoctorDashboard = () => {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getDoctorAppointments();
        setAppointments(data);
      } catch {
        console.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter(
    (a) => a.status === "CONFIRMED"
  ).length;
  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const filtered =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter((a) => a.status === filterStatus);

  const getStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      PENDING: {
        background: "#fef3c7",
        color: "#92400e",
      },

      CONFIRMED: {
        background: "#dbeafe",
        color: "#1d4ed8",
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
        <div style={styles.layout}>
          {/* MAIN */}
          <div style={styles.mainContent}>
            {/* HEADER */}
            <div style={styles.header}>
              <div>
                <h1 style={styles.heading}>
                  👨‍⚕️ Welcome, Dr. {user?.fullName}
                </h1>

                <p style={styles.subheading}>
                  Manage appointments and patient schedules.
                </p>
              </div>

              <div style={styles.headerBadge}>
                Doctor Dashboard
              </div>
            </div>

            {/* STATS */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statTop}>
                  <span style={styles.statIcon}>📋</span>
                  <span style={styles.statLabel}>Total</span>
                </div>

                <h2 style={styles.statValue}>
                  {appointments.length}
                </h2>
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

            {/* APPOINTMENTS */}
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h3 style={styles.sectionTitle}>
                    📅 Appointments
                  </h3>

                  <p style={styles.sectionSubtitle}>
                    Today's patient schedule and appointments
                  </p>
                </div>
              </div>

              {/* FILTERS */}
              <div style={styles.filterRow}>
                {[
                  "ALL",
                  "PENDING",
                  "CONFIRMED",
                  "COMPLETED",
                  "CANCELLED",
                ].map((status) => (
                  <button
                    key={status}
                    style={{
                      ...styles.filterBtn,
                      ...(filterStatus === status
                        ? styles.activeFilter
                        : {}),
                    }}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* TABLE HEADER */}
              <div style={styles.tableHeader}>
                <span>Time</span>
                <span>Patient</span>
                <span>Status</span>
                <span>Price</span>
              </div>

              {/* DATA */}
              {loading ? (
                <div style={styles.loading}>
                  Loading appointments...
                </div>
              ) : filtered.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={styles.emptyIcon}>📅</p>

                  <p style={styles.emptyText}>
                    No appointments available
                  </p>
                </div>
              ) : (
                <div style={styles.appointmentList}>
                  {filtered.map((a) => (
                    <div
                      key={a.id}
                      style={styles.appointmentRow}
                    >
                      {/* TIME */}
                      <div style={styles.timeBlock}>
                        🕐 {a.appointmentTime}
                      </div>

                      {/* PATIENT */}
                      <div style={styles.patientSection}>
                        <h4 style={styles.patientName}>
                          👤 {a.patientName}
                        </h4>

                        <p style={styles.serviceText}>
                          🦷 {a.serviceName}
                        </p>

                        {a.notes && (
                          <p style={styles.notes}>
                            📝 {a.notes}
                          </p>
                        )}
                      </div>

                      {/* STATUS */}
                      <div style={styles.statusSection}>
                        <span
                          style={{
                            ...styles.badge,
                            ...getStatusStyle(a.status),
                          }}
                        >
                          {a.status}
                        </span>
                      </div>

                      {/* PRICE */}
                      <div style={styles.priceSection}>
                        ₹{a.servicePrice}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDE PANEL */}
          <div style={styles.sidePanel}>
            {/* PROFILE */}
            <div style={styles.sideCard}>
              <div style={styles.profileTop}>
                <div style={styles.avatar}>
                  👨‍⚕️
                </div>

                <div>
                  <h3 style={styles.profileName}>
                    Dr. {user?.fullName}
                  </h3>

                  <p style={styles.profileRole}>
                    Dental Specialist
                  </p>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>
                📊 Appointment Summary
              </h3>

              <div style={styles.summaryRow}>
                <span>Total Appointments</span>
                <strong>{appointments.length}</strong>
              </div>

              <div style={styles.summaryRow}>
                <span>Pending</span>
                <strong>{pending}</strong>
              </div>

              <div style={styles.summaryRow}>
                <span>Confirmed</span>
                <strong>{confirmed}</strong>
              </div>

              <div style={styles.summaryRow}>
                <span>Completed</span>
                <strong>{completed}</strong>
              </div>
            </div>

            {/* UPCOMING */}
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>
                📅 Upcoming Schedule
              </h3>

              {appointments.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  style={styles.upcomingItem}
                >
                  <div>
                    <p style={styles.upcomingPatient}>
                      👤 {a.patientName}
                    </p>

                    <span style={styles.upcomingTime}>
                      🕐 {a.appointmentTime}
                    </span>
                  </div>

                  <span
                    style={{
                      ...styles.smallBadge,
                      ...getStatusStyle(a.status),
                    }}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
    padding: "30px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: "24px",
    alignItems: "start",
  },

  mainContent: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  header: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  },

  subheading: {
    fontSize: "14px",
    color: "#6b7280",
  },

  headerBadge: {
    background: "#111827",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px",
  },

  statTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },

  statIcon: {
    fontSize: "20px",
  },

  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: 600,
  },

  statValue: {
    fontSize: "34px",
    fontWeight: 700,
    color: "#111827",
  },

  section: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
  },

  sectionHeader: {
    padding: "24px",
    borderBottom: "1px solid #f3f4f6",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4px",
  },

  sectionSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    padding: "20px 24px",
    flexWrap: "wrap",
    borderBottom: "1px solid #f3f4f6",
  },

  filterBtn: {
    padding: "9px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  activeFilter: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #111827",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "140px 1fr 140px 100px",
    padding: "14px 24px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    borderBottom: "1px solid #f3f4f6",
    background: "#f9fafb",
  },

  appointmentList: {
    display: "flex",
    flexDirection: "column",
  },

  appointmentRow: {
    display: "grid",
    gridTemplateColumns: "140px 1fr 140px 100px",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #f3f4f6",
  },

  timeBlock: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#111827",
  },

  patientSection: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  patientName: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#111827",
  },

  serviceText: {
    fontSize: "13px",
    color: "#6b7280",
  },

  notes: {
    fontSize: "12px",
    color: "#9ca3af",
  },

  statusSection: {
    display: "flex",
    justifyContent: "center",
  },

  badge: {
    padding: "5px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },

  smallBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
  },

  priceSection: {
    textAlign: "right",
    fontWeight: 700,
    color: "#111827",
    fontSize: "16px",
  },

  sideCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px",
  },

  profileTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  avatar: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#fff",
  },

  profileName: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4px",
  },

  profileRole: {
    fontSize: "13px",
    color: "#6b7280",
  },

  sideTitle: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "18px",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "14px",
    color: "#374151",
  },

  upcomingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #f3f4f6",
  },

  upcomingPatient: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
    marginBottom: "4px",
  },

  upcomingTime: {
    fontSize: "12px",
    color: "#6b7280",
  },

  loading: {
    padding: "40px",
    textAlign: "center",
    color: "#6b7280",
  },

  emptyState: {
    padding: "60px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },

  emptyText: {
    fontSize: "14px",
    color: "#9ca3af",
  },
};

export default DoctorDashboard;