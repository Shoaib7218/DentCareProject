import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getAllAppointments,
  updateAppointmentStatus,
} from "../../api/appointments";
import { getAdminDoctors } from "../../api/doctors";

import type { Appointment } from "../../types";
import { getDoctorLeaves } from "../../api/doctors";
import type { DoctorLeaveResponse } from "../../types";
import api from "../../api/axios";


const ManageAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [doctorLeaves, setDoctorLeaves] = useState<Record<string, string[]>>({});

  const fetchDoctorLeaves = async (appointments: Appointment[]) => {
 
  const allDoctors = await getAdminDoctors();
    const leavesMap: Record<string, string[]> = {};
   

  await Promise.all(
    allDoctors.map(async (doctor) => {
      try {
        const response = await api.get(`/api/doctor/leaves/doctor/${doctor.id}`);
        leavesMap[doctor.fullName] = response.data.map(
          (l: { leaveDate: string }) => l.leaveDate
        );
      } catch {
        leavesMap[doctor.fullName] = [];
      }
    })
  );
  setDoctorLeaves(leavesMap);
};

  const fetchAppointments = async () => {
  try {
    const data = await getAllAppointments();
    setAppointments(data);
    await fetchDoctorLeaves(data);
  } catch {
    setError("Failed to load appointments");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (
    id: number,
    status: string
  ) => {
    try {
      await updateAppointmentStatus(id, status);

      setSuccess(`Appointment marked as ${status}`);
      setError("");

      fetchAppointments();
    } catch {
      setError("Failed to update status");
      setSuccess("");
    }
  };

  const filtered =
    filterStatus === "ALL"
      ? appointments
      : appointments.filter(
          (a) => a.status === filterStatus
        );

  const getStatusStyle = (
    status: string
  ): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      PENDING: {
        background: "#f3f4f6",
        color: "#111827",
      },

      CONFIRMED: {
        background: "#eef2ff",
        color: "#111827",
      },

      COMPLETED: {
        background: "#ecfeff",
        color: "#111827",
      },

      CANCELLED: {
        background: "#f9fafb",
        color: "#111827",
      },
    };

    return map[status] || {};
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              Manage Appointments
            </h1>

            <p style={styles.subheading}>
              View and update appointment statuses.
            </p>
          </div>
        </div>

        {/* ALERTS */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

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
              onClick={() =>
                setFilterStatus(status)
              }
              style={{
                ...styles.filterBtn,
                ...(filterStatus === status
                  ? styles.activeFilter
                  : {}),
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* TABLE */}
        {loading ? (
          <div style={styles.loading}>
            Loading appointments...
          </div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyCard}>
            No appointments found
          </div>
        ) : (
          <div style={styles.tableCard}>
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>#</th>
                    <th style={styles.th}>Patient</th>
                    <th style={styles.th}>Doctor</th>
                    <th style={styles.th}>Service</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((a) => (
                    <tr
                      key={a.id}
                      style={styles.row}
                    >
                      <td style={styles.td}>
                        {a.id}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.patient}>
                          <div style={styles.avatar}>
                            {a.patientName
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>

                          {a.patientName}
                        </div>
                      </td>

                    <td style={styles.td}>
  {a.doctorName}
  {doctorLeaves[a.doctorName]?.includes(a.appointmentDate) && (
    <span style={styles.leaveWarning}>⚠️ On Leave</span>
  )}
</td>

                      <td style={styles.td}>
                        {a.serviceName}
                      </td>

                      <td style={styles.td}>
                        {a.appointmentDate}
                      </td>

                      <td style={styles.td}>
                        {a.appointmentTime}
                      </td>

                      <td style={styles.td}>
                        ₹{a.servicePrice}
                      </td>

                      <td style={styles.td}>
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
                      </td>

                      <td style={styles.td}>
                        <div
                          style={
                            styles.actionButtons
                          }
                        >
                          {a.status ===
                            "PENDING" && (
                            <button
                              style={
                                styles.actionBtn
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  a.id,
                                  "CONFIRMED"
                                )
                              }
                            >
                              Confirm
                            </button>
                          )}

                          {a.status ===
                            "CONFIRMED" && (
                            <button
                              style={
                                styles.actionBtn
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  a.id,
                                  "COMPLETED"
                                )
                              }
                            >
                              Complete
                            </button>
                          )}

                          {(a.status ===
                            "PENDING" ||
                            a.status ===
                              "CONFIRMED") && (
                            <button
                              style={
                                styles.cancelBtn
                              }
                              onClick={() =>
                                handleStatusUpdate(
                                  a.id,
                                  "CANCELLED"
                                )
                              }
                            >
                              Cancel
                            </button>
                          )}

                          {(a.status ===
                            "COMPLETED" ||
                            a.status ===
                              "CANCELLED") && (
                            <span
                              style={
                                styles.noAction
                              }
                            >
                              —
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "32px",
  },

  header: {
    marginBottom: "24px",
  },

  heading: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  },

  subheading: {
    fontSize: "14px",
    color: "#6b7280",
  },

  error: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#111827",
    padding: "14px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  success: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    color: "#111827",
    padding: "14px 16px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontSize: "14px",
  },

  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "24px",
  },

  filterBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },

  activeFilter: {
    background: "#111827",
    color: "#fff",
    border: "1px solid #111827",
  },

  loading: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "50px",
    textAlign: "center",
    color: "#6b7280",
  },

  emptyCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "50px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },

  tableCard: {
    background: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
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
    padding: "14px 20px",
    background: "#f9fafb",
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },

  row: {
    borderBottom: "1px solid #f3f4f6",
  },

  td: {
    padding: "18px 20px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
    whiteSpace: "nowrap",
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

  actionButtons: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  actionBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#111827",
    color: "#fff",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  cancelBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    color: "#111827",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },

  noAction: {
    color: "#9ca3af",
    fontSize: "14px",
  },

  leaveWarning: {
  display: "block",
  fontSize: "11px",
  color: "#e53e3e",
  fontWeight: "600",
  marginTop: "2px",
  },
  
  
};

export default ManageAppointments;