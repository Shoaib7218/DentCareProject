import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getPatientAppointments } from "../../api/appointments";
import { useAuth } from "../../context/AuthContext";
import type { Appointment } from "../../types";

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getPatientAppointments();
        setAppointments(data);
      } catch {
        console.error("Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const pending = appointments.filter(
    (a) => a.status === "PENDING"
  ).length;

  const confirmed = appointments.filter(
    (a) => a.status === "CONFIRMED"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "COMPLETED"
  ).length;

  const upcomingAppointment = appointments.find(
    (a) =>
      a.status === "CONFIRMED" ||
      a.status === "PENDING"
  );

  const getStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const map: Record<
      string,
      React.CSSProperties
    > = {
      PENDING: {
        background: "#fef3c7",
        color: "#92400e",
      },

      CONFIRMED: {
        background: "#dbeafe",
        color: "#1e40af",
      },

      COMPLETED: {
        background: "#d1fae5",
        color: "#065f46",
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
        <div style={styles.heroSection}>
          <div>
            <p style={styles.heroTag}>
              ✨ Patient Dashboard
            </p>

            <h1 style={styles.heroTitle}>
              Welcome back, {user?.fullName} 👋
            </h1>

            <p style={styles.heroSubtitle}>
              Easily manage your appointments,
              track your dental visits and book
              services with a modern experience.
            </p>

            <div style={styles.heroButtons}>
              <button
                style={styles.primaryBtn}
                onClick={() =>
                  navigate("/patient/book")
                }
              >
                📅 Book Appointment
              </button>

              <button
                style={styles.secondaryBtn}
                onClick={() =>
                  navigate(
                    "/patient/appointments"
                  )
                }
              >
                📋 My Appointments
              </button>
            </div>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.heroCardTop}>
              <div style={styles.heroIcon}>
                🦷
              </div>

              <div>
                <p style={styles.heroCardLabel}>
                  Dental Care Progress
                </p>

                <h3 style={styles.heroCardTitle}>
                  Healthy Smile Journey
                </h3>
              </div>
            </div>

            <div style={styles.progressSection}>
              <div style={styles.progressInfo}>
                <span>
                  Appointments Completed
                </span>

                <span>{completed}</span>
              </div>

              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${
                      appointments.length
                        ? (completed /
                            appointments.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ⏳
            </div>

            <div>
              <p style={styles.statValue}>
                {pending}
              </p>

              <p style={styles.statLabel}>
                Pending
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              ✅
            </div>

            <div>
              <p style={styles.statValue}>
                {confirmed}
              </p>

              <p style={styles.statLabel}>
                Confirmed
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              🏁
            </div>

            <div>
              <p style={styles.statValue}>
                {completed}
              </p>

              <p style={styles.statLabel}>
                Completed
              </p>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              📋
            </div>

            <div>
              <p style={styles.statValue}>
                {appointments.length}
              </p>

              <p style={styles.statLabel}>
                Total Visits
              </p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={styles.mainGrid}>
          {/* RECENT APPOINTMENTS */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle}>
                  📅 Recent Appointments
                </h3>

                <p
                  style={styles.sectionSubtitle}
                >
                  Your latest dental visits and
                  schedules
                </p>
              </div>

              <button
                style={styles.viewAllBtn}
                onClick={() =>
                  navigate(
                    "/patient/appointments"
                  )
                }
              >
                View All
              </button>
            </div>

            {loading ? (
              <div style={styles.loadingBox}>
                <p style={styles.loading}>
                  Loading appointments...
                </p>
              </div>
            ) : appointments.length === 0 ? (
              <div style={styles.emptyState}>
                <div
                  style={styles.emptyCircle}
                >
                  🦷
                </div>

                <h3 style={styles.emptyTitle}>
                  No appointments yet
                </h3>

                <p style={styles.emptyText}>
                  Start your dental care journey
                  by booking your first
                  appointment.
                </p>

                <button
                  style={styles.bookNowBtn}
                  onClick={() =>
                    navigate("/patient/book")
                  }
                >
                  📅 Book Appointment
                </button>
              </div>
            ) : (
              <div style={styles.appointmentList}>
                {appointments
                  .slice(0, 5)
                  .map((a) => (
                    <div
                      key={a.id}
                      style={
                        styles.appointmentCard
                      }
                    >
                      <div
                        style={
                          styles.appointmentLeft
                        }
                      >
                        <div
                          style={styles.dateCard}
                        >
                          <span
                            style={
                              styles.dateDay
                            }
                          >
                            {
                              a.appointmentDate.split(
                                "-"
                              )[2]
                            }
                          </span>

                          <span
                            style={
                              styles.dateMonth
                            }
                          >
                            {new Date(
                              a.appointmentDate
                            ).toLocaleString(
                              "default",
                              {
                                month: "short",
                              }
                            )}
                          </span>
                        </div>

                        <div>
                          <h4
                            style={
                              styles.serviceName
                            }
                          >
                            🦷 {a.serviceName}
                          </h4>

                          <p
                            style={
                              styles.doctorName
                            }
                          >
                            👨‍⚕️ Dr.{" "}
                            {a.doctorName}
                          </p>

                          <p
                            style={
                              styles.timeText
                            }
                          >
                            🕐{" "}
                            {a.appointmentTime}
                          </p>
                        </div>
                      </div>

                      <div
                        style={
                          styles.appointmentRight
                        }
                      >
                        <span
                          style={{
                            ...styles.badge,
                            ...getStatusStyle(
                              a.status
                            ),
                          }}
                        >
                          {a.status}
                        </span>

                        <p style={styles.price}>
                          ₹{a.servicePrice}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* SIDE PANEL */}
          <div style={styles.sidePanel}>
            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>
                🧾 Upcoming Visit
              </h3>

              {upcomingAppointment ? (
                <>
                  <div
                    style={styles.upcomingBox}
                  >
                    <p
                      style={
                        styles.upcomingService
                      }
                    >
                      {
                        upcomingAppointment.serviceName
                      }
                    </p>

                    <p
                      style={
                        styles.upcomingDoctor
                      }
                    >
                      👨‍⚕️ Dr.{" "}
                      {
                        upcomingAppointment.doctorName
                      }
                    </p>

                    <p
                      style={
                        styles.upcomingTime
                      }
                    >
                      📅{" "}
                      {
                        upcomingAppointment.appointmentDate
                      }
                    </p>

                    <p
                      style={
                        styles.upcomingTime
                      }
                    >
                      🕐{" "}
                      {
                        upcomingAppointment.appointmentTime
                      }
                    </p>
                  </div>

                  <button
                    style={styles.manageBtn}
                    onClick={() =>
                      navigate(
                        "/patient/appointments"
                      )
                    }
                  >
                    Manage Appointment
                  </button>
                </>
              ) : (
                <div style={styles.noUpcoming}>
                  <p>
                    No upcoming appointments
                  </p>
                </div>
              )}
            </div>

            <div style={styles.sideCard}>
              <h3 style={styles.sideTitle}>
                💡 Dental Tips
              </h3>

              <div style={styles.tipBox}>
                <p style={styles.tipText}>
                  🪥 Brush twice daily for at
                  least 2 minutes.
                </p>

                <p style={styles.tipText}>
                  🧵 Floss regularly to maintain
                  healthy gums.
                </p>

                <p style={styles.tipText}>
                  🥤 Reduce sugary drinks for
                  stronger teeth.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
  },

  container: {
    maxWidth: "1350px",
    margin: "0 auto",
    padding: "32px 24px",
  },

  heroSection: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    display: "grid",
    gridTemplateColumns: "1.5fr 380px",
    gap: "24px",
    marginBottom: "28px",
    border: "1px solid #e6ecf5",
    boxShadow:
      "0 8px 24px rgba(15, 23, 42, 0.05)",
  },

  heroTag: {
    color: "#4f46e5",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "12px",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  heroTitle: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#111827",
    lineHeight: "1.1",
    marginBottom: "14px",
  },

  heroSubtitle: {
    color: "#6b7280",
    fontSize: "15px",
    lineHeight: "1.7",
    maxWidth: "700px",
    marginBottom: "28px",
  },

  heroButtons: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    border: "none",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow:
      "0 10px 20px rgba(79,70,229,0.25)",
  },

  secondaryBtn: {
    border: "1px solid #dbe3ee",
    background: "#fff",
    color: "#4f46e5",
    padding: "14px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
  },

  heroCard: {
    background: "#f8fafc",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e5e7eb",
  },

  heroCardTop: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },

  heroIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "18px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  heroCardLabel: {
    color: "#6b7280",
    fontSize: "13px",
    marginBottom: "4px",
  },

  heroCardTitle: {
    color: "#111827",
    fontSize: "20px",
    fontWeight: "700",
  },

  progressSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  progressInfo: {
    display: "flex",
    justifyContent: "space-between",
    color: "#374151",
    fontSize: "14px",
    fontWeight: "600",
  },

  progressBar: {
    width: "100%",
    height: "12px",
    background: "#e5e7eb",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    borderRadius: "999px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  statCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 8px 24px rgba(15,23,42,0.05)",
  },

  statIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef2ff",
    fontSize: "28px",
  },

  statValue: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "4px",
  },

  statLabel: {
    color: "#6b7280",
    fontSize: "13px",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.5fr 380px",
    gap: "24px",
    alignItems: "start",
  },

  section: {
    background: "#fff",
    borderRadius: "24px",
    padding: "28px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px",
  },

  sectionSubtitle: {
    color: "#6b7280",
    fontSize: "14px",
  },

  viewAllBtn: {
    background: "#eef2ff",
    border: "1px solid #c7d2fe",
    color: "#4f46e5",
    padding: "10px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },

  loadingBox: {
    padding: "30px",
    textAlign: "center",
  },

  loading: {
    color: "#6b7280",
  },

  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },

  emptyCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    margin: "0 auto 18px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
  },

  emptyTitle: {
    color: "#111827",
    fontSize: "22px",
    marginBottom: "10px",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "15px",
    maxWidth: "400px",
    margin: "0 auto 22px",
    lineHeight: "1.6",
  },

  bookNowBtn: {
    border: "none",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  appointmentList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  appointmentCard: {
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e5e7eb",
  },

  appointmentLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  dateCard: {
    minWidth: "72px",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    borderRadius: "16px",
    padding: "14px 10px",
    textAlign: "center",
    boxShadow:
      "0 10px 20px rgba(79,70,229,0.25)",
  },

  dateDay: {
    display: "block",
    fontSize: "26px",
    fontWeight: "800",
    color: "#fff",
    lineHeight: "1",
  },

  dateMonth: {
    display: "block",
    color: "rgba(255,255,255,0.8)",
    fontSize: "11px",
    marginTop: "4px",
    textTransform: "uppercase",
  },

  serviceName: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px",
  },

  doctorName: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },

  timeText: {
    fontSize: "13px",
    color: "#9ca3af",
  },

  appointmentRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },

  badge: {
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  price: {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "800",
  },

  sidePanel: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  sideCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow:
      "0 10px 30px rgba(15,23,42,0.05)",
  },

  sideTitle: {
    color: "#111827",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "18px",
  },

  upcomingBox: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "18px",
    marginBottom: "18px",
  },

  upcomingService: {
    color: "#111827",
    fontSize: "17px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  upcomingDoctor: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "6px",
  },

  upcomingTime: {
    color: "#9ca3af",
    fontSize: "13px",
    marginBottom: "4px",
  },

  manageBtn: {
    width: "100%",
    border: "none",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    padding: "13px",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  noUpcoming: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "18px",
    textAlign: "center",
    color: "#94a3b8",
  },

  tipBox: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  tipText: {
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: "1.6",
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "14px",
  },
};

export default PatientDashboard;