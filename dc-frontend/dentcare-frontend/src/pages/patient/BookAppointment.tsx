import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getAllDoctors } from "../../api/doctors";
import { getActiveServices } from "../../api/services";
import { bookAppointment } from "../../api/appointments";
import type { Doctor, DentalService } from "../../types";
import { getUpcomingHolidays } from "../../api/holidays";
import type { ClinicHolidayResponse } from "../../types";
import api from "../../api/axios";

const timeSlots = [
  "09:00:00",
  "09:30:00",
  "10:00:00",
  "10:30:00",
  "11:00:00",
  "11:30:00",
  "12:00:00",
  "14:00:00",
  "14:30:00",
  "15:00:00",
  "15:30:00",
  "16:00:00",
  "16:30:00",
];

const BookAppointment = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<DentalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [holidays, setHolidays] = useState<ClinicHolidayResponse[]>([]);
  const [doctorLeaveDates, setDoctorLeaveDates] = useState<string[]>([]);

  const [form, setForm] = useState({
    doctorId: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  useEffect(() => {
  const fetchData = async () => {
    try {
      const [d, s, h] = await Promise.all([
        getAllDoctors(),
        getActiveServices(),
        getUpcomingHolidays(),
      ]);
      setDoctors(d);
      setServices(s);
      setHolidays(h);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
  if (name === "doctorId" && value) {
    fetchDoctorLeaves(Number(value));
    setForm((prev) => ({ ...prev, doctorId: value, appointmentDate: "" }));
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await bookAppointment({
        doctorId: Number(form.doctorId),
        serviceId: Number(form.serviceId),
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        notes: form.notes,
      });

      setSuccess("Appointment booked successfully 🎉");

      setTimeout(() => {
        navigate("/patient/appointments");
      }, 1500);
    } catch {
      setError("Failed to book appointment. Slot may already be taken.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedDoctor = doctors.find(
    (d) => d.id === Number(form.doctorId)
  );

  const selectedService = services.find(
    (s) => s.id === Number(form.serviceId)
  );

  const today = new Date().toISOString().split("T")[0];

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:00`;
};

const isSlotDisabled = (slot: string): boolean => {
  if (form.appointmentDate !== today) return false;
  return slot <= getCurrentTime();
};

  const isHoliday = (date: string): boolean => {
  return holidays.some((h) => h.holidayDate === date);
};

const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedDate = e.target.value;
  if (isHoliday(selectedDate)) {
    setError("This date is a clinic holiday. Please select another date.");
    setForm({ ...form, appointmentDate: "" });
  } else if (doctorLeaveDates.includes(selectedDate)) {
    setError("The selected doctor is on leave on this date. Please select another date.");
    setForm({ ...form, appointmentDate: "" });
  } else {
  setError("");
  const newForm = { ...form, appointmentDate: selectedDate };
  if (selectedDate === today && form.appointmentTime && form.appointmentTime <= getCurrentTime()) {
    newForm.appointmentTime = "";
  }
  setForm(newForm);
}
};
  
 const fetchDoctorLeaves = async (doctorId: number) => {
  try {
    const response = await api.get(`/api/patient/doctors/${doctorId}/leaves`);
    setDoctorLeaveDates(response.data.map((l: { leaveDate: string }) => l.leaveDate));
  } catch {
    setDoctorLeaveDates([]);
  }
};

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.heroSection}>
          <div>
            <h1 style={styles.heroTitle}>Book Your Appointment 🦷</h1>
            <p style={styles.heroSubtitle}>
              Choose your doctor, service and preferred time slot easily.
            </p>
          </div>

          <div style={styles.heroBadge}>
            📅 Fast & Secure Booking
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingCard}>
            <p style={styles.loading}>Loading appointment details...</p>
          </div>
        ) : (
          <div style={styles.layout}>
            <div style={styles.leftSection}>
              <div style={styles.formCard}>
                <div style={styles.sectionTop}>
                  <div>
                    <h3 style={styles.cardTitle}>
                      Appointment Details
                    </h3>
                    <p style={styles.cardSubtitle}>
                      Fill the form to schedule your visit
                    </p>
                  </div>

                  <div style={styles.sectionIcon}>
                    📝
                  </div>
                </div>

                {error && (
                  <div style={styles.error}>
                    ⚠️ {error}
                  </div>
                )}

                {success && (
                  <div style={styles.successMsg}>
                    ✅ {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={styles.form}>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        👨‍⚕️ Select Doctor
                      </label>

                      <select
                        style={styles.select}
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Choose a doctor
                        </option>

                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.fullName} — {d.specialization}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        🦷 Select Service
                      </label>

                      <select
                        style={styles.select}
                        name="serviceId"
                        value={form.serviceId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">
                          Choose a service
                        </option>

                        {services.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — ₹{s.price}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        📅 Appointment Date
                      </label>

                      <input
  style={styles.input}
  type="date"
  name="appointmentDate"
  value={form.appointmentDate}
  onChange={handleDateChange}
  min={today}
  required
                        />
                        {holidays.length > 0 && (
  <div style={styles.holidayNotice}>
    <p style={styles.holidayNoticeTitle}>🚫 Clinic Closed Dates:</p>
    {holidays.slice(0, 3).map((h) => (
      <p key={h.id} style={styles.holidayItem}>
        {h.holidayDate} — {h.reason}
      </p>
    ))}
                          </div>
                          
                          
                        )}
                        {doctorLeaveDates.length > 0 && form.doctorId && (
  <div style={styles.leaveNotice}>
    <p style={styles.leaveNoticeTitle}>⚠️ Doctor Unavailable Dates:</p>
    {doctorLeaveDates.map((date) => (
      <p key={date} style={styles.leaveItem}>{date}</p>
    ))}
  </div>
)}
                    </div>
                  </div>

                  <div style={styles.slotCard}>
                    <div style={styles.slotHeader}>
                      <div>
                        <h4 style={styles.slotTitle}>
                          🕐 Available Time Slots
                        </h4>

                        <p style={styles.slotSubtitle}>
                          Select your preferred appointment timing
                        </p>
                      </div>
                    </div>

                    <div style={styles.timeGrid}>
                      {timeSlots.map((slot) => (
  <button
    key={slot}
    type="button"
    disabled={isSlotDisabled(slot)}
    style={{
      ...styles.timeSlot,
      ...(form.appointmentTime === slot ? styles.timeSlotActive : {}),
      ...(isSlotDisabled(slot) ? styles.timeSlotDisabled : {}),
    }}
    onClick={() => {
      if (!isSlotDisabled(slot)) {
        setForm({ ...form, appointmentTime: slot });
      }
    }}
  >
    {slot.substring(0, 5)}
  </button>
))}
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>
                      📝 Additional Notes
                    </label>

                    <textarea
                      style={styles.textarea}
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Mention pain, sensitivity, previous treatments, etc..."
                      rows={4}
                    />
                  </div>

                  <button
                    style={
                      submitting
                        ? styles.buttonDisabled
                        : styles.submitBtn
                    }
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting
                      ? "Booking Appointment..."
                      : "Confirm Appointment ✅"}
                  </button>
                </form>
              </div>
            </div>

            <div style={styles.summaryWrapper}>
              <div style={styles.summaryCard}>
                <div style={styles.summaryHeader}>
                  <h3 style={styles.summaryTitle}>
                    📋 Booking Summary
                  </h3>
                </div>

                {selectedDoctor ? (
                  <div style={styles.summarySection}>
                    <div style={styles.summaryTop}>
                      <div style={styles.summaryAvatar}>
                        👨‍⚕️
                      </div>

                      <div>
                        <p style={styles.summaryValue}>
                          {selectedDoctor.fullName}
                        </p>

                        <p style={styles.summaryMeta}>
                          {selectedDoctor.specialization}
                        </p>
                      </div>
                    </div>

                    <div style={styles.summaryInfoGrid}>
                      <div style={styles.infoBox}>
                        <span style={styles.infoLabel}>
                          🎓 Qualification
                        </span>

                        <span style={styles.infoValue}>
                          {selectedDoctor.qualifications}
                        </span>
                      </div>

                      <div style={styles.infoBox}>
                        <span style={styles.infoLabel}>
                          ⏰ Availability
                        </span>

                        <span style={styles.infoValue}>
                          {selectedDoctor.availableTimeStart} -{" "}
                          {selectedDoctor.availableTimeEnd}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.emptySummary}>
                    👨‍⚕️ Select a doctor to view details
                  </div>
                )}

                {selectedService ? (
                  <div style={styles.summarySection}>
                    <p style={styles.summaryHeading}>
                      🦷 Service Details
                    </p>

                    <div style={styles.serviceCard}>
                      <div>
                        <h4 style={styles.serviceName}>
                          {selectedService.name}
                        </h4>

                        <p style={styles.serviceDesc}>
                          {selectedService.description}
                        </p>
                      </div>

                      <div style={styles.serviceMeta}>
                        <span style={styles.durationBadge}>
                          ⏱ {selectedService.durationMinutes} mins
                        </span>

                        <span style={styles.price}>
                          ₹{selectedService.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.emptySummary}>
                    🦷 Select a service to continue
                  </div>
                )}

                {form.appointmentDate && (
                  <div style={styles.summarySection}>
                    <p style={styles.summaryHeading}>
                      📅 Appointment Schedule
                    </p>

                    <div style={styles.scheduleCard}>
                      <p style={styles.scheduleDate}>
                        {form.appointmentDate}
                      </p>

                      {form.appointmentTime && (
                        <p style={styles.scheduleTime}>
                          🕐 {form.appointmentTime.substring(0, 5)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {selectedService && (
                  <div style={styles.totalCard}>
                    <div>
                      <p style={styles.totalLabel}>
                        Total Payable
                      </p>

                      <p style={styles.totalSub}>
                        Inclusive of consultation
                      </p>
                    </div>

                    <h2 style={styles.totalValue}>
                      ₹{selectedService.price}
                    </h2>
                  </div>
                )}
              </div>
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    border: "1px solid #e6ecf5",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
  },

  heroTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "8px",
  },

  heroSubtitle: {
    fontSize: "15px",
    color: "#6b7280",
  },

  heroBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "14px",
  },

  loadingCard: {
    background: "#fff",
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
  },

  loading: {
    color: "#6b7280",
    fontSize: "15px",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 370px",
    gap: "24px",
    alignItems: "start",
  },

  leftSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  formCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "30px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
  },

  sectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  cardTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px",
  },

  cardSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
  },

  sectionIcon: {
    width: "54px",
    height: "54px",
    borderRadius: "16px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  error: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  successMsg: {
    background: "#ecfdf5",
    color: "#059669",
    border: "1px solid #a7f3d0",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },

  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
  },

  select: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
  },

  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
  },

  slotCard: {
    background: "#f8fafc",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid #e5e7eb",
  },

  slotHeader: {
    marginBottom: "18px",
  },

  slotTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px",
  },

  slotSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))",
    gap: "12px",
  },

  timeSlot: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #dbe3ee",
    background: "#fff",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    transition: "0.2s",
  },

  timeSlotDisabled: {
  background: "#f0f0f0",
  color: "#c0c0c0",
  border: "1px solid #e0e0e0",
  cursor: "not-allowed",
  opacity: 0.6,
},

  timeSlotActive: {
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    border: "none",
    boxShadow: "0 8px 18px rgba(79,70,229,0.25)",
  },

  submitBtn: {
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(79,70,229,0.25)",
  },

  buttonDisabled: {
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "#cbd5e1",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "700",
  },

  summaryWrapper: {
    position: "sticky",
    top: "90px",
  },

  summaryCard: {
    background: "#fff",
    borderRadius: "24px",
    padding: "26px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
  },

  summaryHeader: {
    marginBottom: "20px",
  },

  summaryTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },

  summarySection: {
    marginBottom: "22px",
  },

  summaryTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },

  summaryAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    background: "#eef2ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },

  summaryValue: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "4px",
  },

  summaryMeta: {
    fontSize: "13px",
    color: "#6b7280",
  },

  summaryInfoGrid: {
    display: "grid",
    gap: "10px",
  },

  infoBox: {
    background: "#f8fafc",
    borderRadius: "12px",
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  infoLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: "13px",
    color: "#111827",
    fontWeight: "600",
  },

  emptySummary: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "14px",
    color: "#94a3b8",
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "16px",
  },

  summaryHeading: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#374151",
    marginBottom: "12px",
  },

  serviceCard: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "16px",
  },

  serviceName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "6px",
  },

  serviceDesc: {
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  serviceMeta: {
    marginTop: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  durationBadge: {
    background: "#eef2ff",
    color: "#4f46e5",
    padding: "8px 12px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "700",
  },

  price: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },

  scheduleCard: {
    background: "#f8fafc",
    padding: "16px",
    borderRadius: "16px",
  },

  scheduleDate: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "6px",
  },

  scheduleTime: {
    fontSize: "14px",
    color: "#6b7280",
  },

  totalCard: {
    marginTop: "28px",
    background:
      "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#fff",
  },

  totalSub: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.8)",
    marginTop: "4px",
  },

  totalValue: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
  },

  holidayNotice: {
  background: "#fff5f5",
  border: "1px solid #fed7d7",
  borderRadius: "8px",
  padding: "12px",
  marginTop: "4px",
},
holidayNoticeTitle: {
  fontSize: "13px",
  fontWeight: "600",
  color: "#e53e3e",
  marginBottom: "6px",
},
holidayItem: {
  fontSize: "12px",
  color: "#e53e3e",
  marginBottom: "2px",
  },

  leaveNotice: {
  background: "#fffbeb",
  border: "1px solid #fbd38d",
  borderRadius: "8px",
  padding: "12px",
  marginTop: "4px",
},
leaveNoticeTitle: {
  fontSize: "13px",
  fontWeight: "600",
  color: "#92400e",
  marginBottom: "6px",
},
leaveItem: {
  fontSize: "12px",
  color: "#92400e",
  marginBottom: "2px",
},
};



export default BookAppointment;