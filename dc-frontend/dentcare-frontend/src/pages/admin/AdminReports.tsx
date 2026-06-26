import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllAppointments } from "../../api/appointments";
import { getAdminDoctors } from "../../api/doctors";
import { getAllServices } from "../../api/services";
import type { Appointment, Doctor, DentalService } from "../../types";

const AdminReports = () => {
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
        console.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = appointments
    .filter((a) => a.status === "COMPLETED")
    .reduce((sum, a) => sum + a.servicePrice, 0);

  const pending = appointments.filter((a) => a.status === "PENDING").length;
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED").length;
  const completed = appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelled = appointments.filter((a) => a.status === "CANCELLED").length;

  const serviceCount: Record<string, number> = {};
  appointments.forEach((a) => {
    serviceCount[a.serviceName] = (serviceCount[a.serviceName] || 0) + 1;
  });
  const sortedServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]);

  const doctorCount: Record<string, number> = {};
  appointments.forEach((a) => {
    doctorCount[a.doctorName] = (doctorCount[a.doctorName] || 0) + 1;
  });
  const sortedDoctors = Object.entries(doctorCount).sort((a, b) => b[1] - a[1]);

  const monthlyCount: Record<string, number> = {};
  appointments.forEach((a) => {
    const month = a.appointmentDate.substring(0, 7);
    monthlyCount[month] = (monthlyCount[month] || 0) + 1;
  });
  const sortedMonths = Object.entries(monthlyCount).sort((a, b) => a[0].localeCompare(b[0]));
  const maxMonthly = Math.max(...Object.values(monthlyCount), 1);

  const maxService = sortedServices[0]?.[1] || 1;
  const maxDoctor = sortedDoctors[0]?.[1] || 1;

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>Reports & Analytics</h2>
            <p style={styles.subheading}>Overview of clinic performance</p>
          </div>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading reports...</p>
        ) : (
          <>
            <div style={styles.statsGrid}>
              <div style={{ ...styles.statCard, borderTop: "4px solid #48bb78" }}>
                <div style={styles.statIcon}>💰</div>
                <div style={styles.statValue}>₹{totalRevenue.toLocaleString()}</div>
                <div style={styles.statLabel}>Total Revenue</div>
                <div style={styles.statSub}>From completed appointments</div>
              </div>
              <div style={{ ...styles.statCard, borderTop: "4px solid #667eea" }}>
                <div style={styles.statIcon}>📋</div>
                <div style={styles.statValue}>{appointments.length}</div>
                <div style={styles.statLabel}>Total Appointments</div>
                <div style={styles.statSub}>All time</div>
              </div>
              <div style={{ ...styles.statCard, borderTop: "4px solid #4299e1" }}>
                <div style={styles.statIcon}>👨‍⚕️</div>
                <div style={styles.statValue}>{doctors.length}</div>
                <div style={styles.statLabel}>Active Doctors</div>
                <div style={styles.statSub}>Currently registered</div>
              </div>
              <div style={{ ...styles.statCard, borderTop: "4px solid #ed8936" }}>
                <div style={styles.statIcon}>🦷</div>
                <div style={styles.statValue}>{services.filter(s => s.active).length}</div>
                <div style={styles.statLabel}>Active Services</div>
                <div style={styles.statSub}>Available for booking</div>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Appointment Status Breakdown</h3>
                <div style={styles.statusList}>
                  {[
                    { label: "Pending", value: pending, color: "#f6ad55", total: appointments.length },
                    { label: "Confirmed", value: confirmed, color: "#4299e1", total: appointments.length },
                    { label: "Completed", value: completed, color: "#48bb78", total: appointments.length },
                    { label: "Cancelled", value: cancelled, color: "#fc8181", total: appointments.length },
                  ].map((item) => (
                    <div key={item.label} style={styles.statusRow}>
                      <div style={styles.statusLeft}>
                        <span style={{ ...styles.statusDot, background: item.color }} />
                        <span style={styles.statusLabel}>{item.label}</span>
                      </div>
                      <div style={styles.barWrapper}>
                        <div
                          style={{
                            ...styles.bar,
                            width: item.total === 0 ? "0%" : `${(item.value / item.total) * 100}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <span style={styles.statusCount}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Monthly Appointments</h3>
                {sortedMonths.length === 0 ? (
                  <p style={styles.empty}>No data available</p>
                ) : (
                  <div style={styles.monthList}>
                    {sortedMonths.map(([month, count]) => (
                      <div key={month} style={styles.monthRow}>
                        <span style={styles.monthLabel}>{month}</span>
                        <div style={styles.barWrapper}>
                          <div
                            style={{
                              ...styles.bar,
                              width: `${(count / maxMonthly) * 100}%`,
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          />
                        </div>
                        <span style={styles.statusCount}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Most Booked Services</h3>
                {sortedServices.length === 0 ? (
                  <p style={styles.empty}>No data available</p>
                ) : (
                  <div style={styles.monthList}>
                    {sortedServices.map(([name, count]) => (
                      <div key={name} style={styles.monthRow}>
                        <span style={styles.monthLabel}>{name}</span>
                        <div style={styles.barWrapper}>
                          <div
                            style={{
                              ...styles.bar,
                              width: `${(count / maxService) * 100}%`,
                              background: "linear-gradient(135deg, #48bb78 0%, #38a169 100%)",
                            }}
                          />
                        </div>
                        <span style={styles.statusCount}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Busiest Doctors</h3>
                {sortedDoctors.length === 0 ? (
                  <p style={styles.empty}>No data available</p>
                ) : (
                  <div style={styles.monthList}>
                    {sortedDoctors.map(([name, count]) => (
                      <div key={name} style={styles.monthRow}>
                        <span style={styles.monthLabel}>{name}</span>
                        <div style={styles.barWrapper}>
                          <div
                            style={{
                              ...styles.bar,
                              width: `${(count / maxDoctor) * 100}%`,
                              background: "linear-gradient(135deg, #4299e1 0%, #3182ce 100%)",
                            }}
                          />
                        </div>
                        <span style={styles.statusCount}>{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
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
    maxWidth: "1200px",
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
  loading: {
    textAlign: "center",
    color: "#718096",
    marginTop: "40px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    textAlign: "center",
  },
  statIcon: {
    fontSize: "32px",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: "2px",
  },
  statSub: {
    fontSize: "12px",
    color: "#a0aec0",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  chartCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
  },
  chartTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: "20px",
  },
  statusList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statusLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "90px",
    flexShrink: 0,
  },
  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: "13px",
    color: "#4a5568",
    fontWeight: "500",
  },
  barWrapper: {
    flex: 1,
    background: "#f0f4f8",
    borderRadius: "4px",
    height: "10px",
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.5s ease",
  },
  statusCount: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2d3748",
    width: "24px",
    textAlign: "right",
    flexShrink: 0,
  },
  monthList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  monthRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  monthLabel: {
    fontSize: "13px",
    color: "#4a5568",
    width: "110px",
    flexShrink: 0,
    fontWeight: "500",
  },
  empty: {
    color: "#a0aec0",
    textAlign: "center",
    padding: "20px",
    fontSize: "14px",
  },
};

export default AdminReports;