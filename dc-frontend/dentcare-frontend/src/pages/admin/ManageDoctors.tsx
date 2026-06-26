import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getAdminDoctors,
  addDoctor,
  deleteDoctor,
} from "../../api/doctors";

import type {
  Doctor,
  DoctorRequest,
} from "../../types";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState<
    Doctor[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [showForm, setShowForm] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const [form, setForm] =
    useState<DoctorRequest>({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      qualifications: "",
      experienceYears: 0,
      availableDays: "",
      availableTimeStart: "",
      availableTimeEnd: "",
    });

  const fetchDoctors = async () => {
    try {
      const data =
        await getAdminDoctors();

      setDoctors(data);
    } catch {
      setError(
        "Failed to fetch doctors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await addDoctor({
        ...form,
        experienceYears: Number(
          form.experienceYears
        ),
      });

      setSuccess(
        "Doctor added successfully"
      );

      setShowForm(false);

      setForm({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        qualifications: "",
        experienceYears: 0,
        availableDays: "",
        availableTimeStart: "",
        availableTimeEnd: "",
      });

      fetchDoctors();
    } catch {
      setError(
        "Failed to add doctor"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (
    id: number
  ) => {
    if (
      !confirm(
        "Delete this doctor?"
      )
    )
      return;

    try {
      await deleteDoctor(id);

      setSuccess(
        "Doctor deleted successfully"
      );

      fetchDoctors();
    } catch {
      setError(
        "Failed to delete doctor"
      );
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.heading}>
              Manage Doctors
            </h1>

            <p style={styles.subheading}>
              Add and manage clinic
              doctors.
            </p>
          </div>

          <button
            style={styles.addBtn}
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Close"
              : "+ Add Doctor"}
          </button>
        </div>

        {/* ALERTS */}
        {error && (
          <div style={styles.alert}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.alert}>
            {success}
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>
              Add Doctor
            </h3>

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <div style={styles.formGrid}>
                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Full Name
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="fullName"
                    value={
                      form.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Dr. John Doe"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    style={
                      styles.input
                    }
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="doctor@dentcare.com"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    style={
                      styles.input
                    }
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Minimum 6 characters"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Phone
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="phone"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="9876543210"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Specialization
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="specialization"
                    value={
                      form.specialization
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Orthodontist"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Qualifications
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="qualifications"
                    value={
                      form.qualifications
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="BDS, MDS"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Experience
                  </label>

                  <input
                    type="number"
                    style={
                      styles.input
                    }
                    name="experienceYears"
                    value={
                      form.experienceYears
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="5"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Available Days
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="availableDays"
                    value={
                      form.availableDays
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Monday, Tuesday"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Available From
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="availableTimeStart"
                    value={
                      form.availableTimeStart
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="09:00"
                    required
                  />
                </div>

                <div
                  style={
                    styles.inputGroup
                  }
                >
                  <label
                    style={
                      styles.label
                    }
                  >
                    Available To
                  </label>

                  <input
                    style={
                      styles.input
                    }
                    name="availableTimeEnd"
                    value={
                      form.availableTimeEnd
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="17:00"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={
                  submitting
                    ? styles.disabledBtn
                    : styles.submitBtn
                }
              >
                {submitting
                  ? "Adding..."
                  : "Add Doctor"}
              </button>
            </form>
          </div>
        )}

        {/* DOCTORS */}
        {loading ? (
          <div style={styles.loading}>
            Loading doctors...
          </div>
        ) : doctors.length === 0 ? (
          <div style={styles.empty}>
            No doctors available
          </div>
        ) : (
          <div style={styles.grid}>
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                style={
                  styles.doctorCard
                }
              >
                {/* TOP */}
                <div
                  style={
                    styles.doctorHeader
                  }
                >
                  <div
                    style={
                      styles.avatar
                    }
                  >
                    👨‍⚕️
                  </div>

                  <div>
                    <h3
                      style={
                        styles.doctorName
                      }
                    >
                      {
                        doctor.fullName
                      }
                    </h3>

                    <p
                      style={
                        styles.specialization
                      }
                    >
                      {
                        doctor.specialization
                      }
                    </p>
                  </div>
                </div>

                {/* INFO */}
                <div
                  style={
                    styles.infoSection
                  }
                >
                  <div
                    style={
                      styles.infoRow
                    }
                  >
                    <span>📧</span>
                    <span>
                      {
                        doctor.email
                      }
                    </span>
                  </div>

                  <div
                    style={
                      styles.infoRow
                    }
                  >
                    <span>📞</span>
                    <span>
                      {
                        doctor.phone
                      }
                    </span>
                  </div>

                  <div
                    style={
                      styles.infoRow
                    }
                  >
                    <span>🎓</span>
                    <span>
                      {
                        doctor.qualifications
                      }
                    </span>
                  </div>

                  <div
                    style={
                      styles.infoRow
                    }
                  >
                    <span>💼</span>
                    <span>
                      {
                        doctor.experienceYears
                      }{" "}
                      years experience
                    </span>
                  </div>

                  <div
                    style={
                      styles.infoRow
                    }
                  >
                    <span>📅</span>
                    <span>
                      {
                        doctor.availableDays
                      }
                    </span>
                  </div>

                  <div
                    style={
                      styles.infoRow
                    }
                  >
                    <span>⏰</span>
                    <span>
                      {
                        doctor.availableTimeStart
                      }{" "}
                      -{" "}
                      {
                        doctor.availableTimeEnd
                      }
                    </span>
                  </div>
                </div>

                <button
                  style={
                    styles.deleteBtn
                  }
                  onClick={() =>
                    handleDelete(
                      doctor.id
                    )
                  }
                >
                  Delete Doctor
                </button>
              </div>
            ))}
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
    maxWidth: "1350px",
    margin: "0 auto",
    padding: "32px",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },

  heading: {
    fontSize: "30px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4px",
  },

  subheading: {
    fontSize: "14px",
    color: "#6b7280",
  },

  addBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  alert: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px 16px",
    marginBottom: "18px",
    color: "#111827",
    fontSize: "14px",
  },

  formCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "26px",
    marginBottom: "28px",
  },

  formTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
    color: "#111827",
  },

  submitBtn: {
    width: "180px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#111827",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  disabledBtn: {
    width: "180px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#9ca3af",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
  },

  loading: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "50px",
    textAlign: "center",
    color: "#6b7280",
  },

  empty: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "50px",
    textAlign: "center",
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },

  doctorCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  doctorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    paddingBottom: "16px",
    borderBottom:
      "1px solid #f3f4f6",
  },

  avatar: {
    width: "58px",
    height: "58px",
    borderRadius: "14px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    flexShrink: 0,
  },

  doctorName: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "4px",
  },

  specialization: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
  },

  infoSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    color: "#374151",
    lineHeight: 1.5,
  },

  deleteBtn: {
    marginTop: "6px",
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#111827",
    color: "#fff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default ManageDoctors;