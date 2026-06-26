import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllAppointments } from "../../api/appointments";
import { getAdminDoctors } from "../../api/doctors";
import { getAllServices } from "../../api/services";

import type {
  Appointment,
  Doctor,
  DentalService,
} from "../../types";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<DentalService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [a, d, s] = await Promise.all([
          getAllAppointments(),
          getAdminDoctors(),
          getAllServices(),
        ]);

        setAppointments(a);
        setDoctors(d);
        setServices(s);
      } catch {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>Admin Dashboard</h1>
            <p style={styles.subHeading}>
              Monitor appointments, doctors and clinic activity.
            </p>
          </div>

          <div style={styles.statusBox}>
            <div style={styles.statusDot} />
            System Active
          </div>
        </div>

        {/* SIMPLE STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Appointments</p>
            <h2 style={styles.statValue}>{appointments.length}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Doctors</p>
            <h2 style={styles.statValue}>{doctors.length}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Services</p>
            <h2 style={styles.statValue}>{services.length}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Pending</p>
            <h2 style={styles.statValue}>{pending}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Confirmed</p>
            <h2 style={styles.statValue}>{confirmed}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Completed</p>
            <h2 style={styles.statValue}>{completed}</h2>
          </div>
        </div>

        {/* APPOINTMENTS TABLE */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.tableTitle}>Recent Appointments</h2>
              <p style={styles.tableSubtitle}>
                Latest appointment activity
              </p>
            </div>

            <button style={styles.button}>View All</button>
          </div>

          {loading ? (
            <div style={styles.loading}>Loading dashboard...</div>
          ) : appointments.length === 0 ? (
            <div style={styles.empty}>
              No appointments available
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Doctor</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.slice(0, 8).map((a) => (
                    <tr key={a.id} style={styles.row}>
                      <td style={styles.td}>
                        <div style={styles.patient}>
                          <div style={styles.avatar}>
                            {a.patientName?.charAt(0).toUpperCase()}
                          </div>

                          {a.patientName}
                        </div>
                      </td>

                      <td style={styles.td}>{a.doctorName}</td>

                      <td style={styles.td}>{a.serviceName}</td>

                      <td style={styles.td}>
                        {a.appointmentDate}
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.badge,
                            background:
                              a.status === "PENDING"
                                ? "#f3f4f6"
                                : a.status === "CONFIRMED"
                                ? "#eef2ff"
                                : "#ecfeff",
                            color: "#111827",
                          }}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    padding: "32px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "16px",
  },

  heading: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  },

  subHeading: {
    fontSize: "14px",
    color: "#6b7280",
  },

  statusBox: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },

  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },

  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "22px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "10px",
    fontWeight: 500,
  },

  statValue: {
    fontSize: "30px",
    color: "#111827",
    fontWeight: 700,
  },

  tableCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    overflow: "hidden",
  },

  tableHeader: {
    padding: "22px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },

  tableTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4px",
  },

  tableSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
  },

  button: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },

  loading: {
    padding: "60px",
    textAlign: "center",
    color: "#6b7280",
  },

  empty: {
    padding: "60px",
    textAlign: "center",
    color: "#9ca3af",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 22px",
    background: "#f9fafb",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  row: {
    borderBottom: "1px solid #f3f4f6",
  },

  td: {
    padding: "18px 22px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
  },

  patient: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#111827",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 600,
  },
};

export default AdminDashboard;