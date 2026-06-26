import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  getAllServices,
  addService,
  updateService,
  deleteService,
} from "../../api/services";

import type {
  DentalService,
  DentalServiceRequest,
} from "../../types";

const ManageServices = () => {
  const [services, setServices] = useState<DentalService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<DentalServiceRequest>({
    name: "",
    description: "",
    price: 0,
    durationMinutes: 0,
  });

  const fetchServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch {
      console.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (editingId !== null) {
        await updateService(editingId, {
          ...form,
          price: Number(form.price),
          durationMinutes: Number(form.durationMinutes),
        });

        setSuccess("Service updated successfully");
      } else {
        await addService({
          ...form,
          price: Number(form.price),
          durationMinutes: Number(form.durationMinutes),
        });

        setSuccess("Service added successfully");
      }

      setShowForm(false);
      setEditingId(null);

      setForm({
        name: "",
        description: "",
        price: 0,
        durationMinutes: 0,
      });

      fetchServices();
    } catch {
      setError("Failed to save service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: DentalService) => {
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
    });

    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to deactivate this service?")) return;

    try {
      await deleteService(id);
      setSuccess("Service deactivated successfully");
      fetchServices();
    } catch {
      setError("Failed to deactivate service");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      price: 0,
      durationMinutes: 0,
    });
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.heading}>🦷 Manage Services</h2>
            <p style={styles.subheading}>
              Manage clinic dental services and pricing
            </p>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close" : "+ Add Service"}
          </button>
        </div>

        {/* ALERTS */}
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        {/* FORM */}
        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h3 style={styles.formTitle}>
                {editingId !== null
                  ? "✏️ Edit Service"
                  : "➕ Add New Service"}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Service Name</label>
                  <input
                    style={styles.input}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tooth Cleaning"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Price (₹)</label>
                  <input
                    style={styles.input}
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="500"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Duration (Minutes)</label>
                  <input
                    style={styles.input}
                    type="number"
                    name="durationMinutes"
                    value={form.durationMinutes}
                    onChange={handleChange}
                    placeholder="30"
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Description</label>
                  <input
                    style={styles.input}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Brief service description"
                    required
                  />
                </div>
              </div>

              <div style={styles.formActions}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={
                    submitting
                      ? styles.disabledButton
                      : styles.primaryButton
                  }
                >
                  {submitting
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Service"
                    : "Add Service"}
                </button>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div style={styles.loading}>Loading services...</div>
        ) : services.length === 0 ? (
          <div style={styles.emptyCard}>
            <div style={styles.emptyIcon}>🦷</div>
            <p style={styles.emptyText}>No services available</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {services.map((service) => (
              <div key={service.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.iconBox}>🦷</div>

                  <div>
                    <h4 style={styles.serviceName}>{service.name}</h4>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background: service.active
                          ? "#dcfce7"
                          : "#fee2e2",
                        color: service.active
                          ? "#166534"
                          : "#991b1b",
                      }}
                    >
                      {service.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <p style={styles.description}>
                  {service.description}
                </p>

                <div style={styles.details}>
                  <div style={styles.detailRow}>
                    <span>💰 Price</span>
                    <strong>₹{service.price}</strong>
                  </div>

                  <div style={styles.detailRow}>
                    <span>⏰ Duration</span>
                    <strong>{service.durationMinutes} mins</strong>
                  </div>
                </div>

                <div style={styles.actions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(service.id)}
                  >
                    Deactivate
                  </button>
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
    fontFamily: "'Inter', sans-serif",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 24px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    gap: "16px",
    flexWrap: "wrap",
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

  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  secondaryButton: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "11px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  disabledButton: {
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "not-allowed",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "14px 16px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #bbf7d0",
    padding: "14px 16px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontSize: "14px",
  },

  formCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "28px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
  },

  formHeader: {
    marginBottom: "20px",
  },

  formTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#111827",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    marginBottom: "22px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    background: "#fff",
  },

  formActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  loading: {
    textAlign: "center",
    padding: "60px",
    color: "#6b7280",
  },

  emptyCard: {
    background: "#fff",
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    padding: "60px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: "15px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  iconBox: {
    width: "54px",
    height: "54px",
    borderRadius: "14px",
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    flexShrink: 0,
  },

  serviceName: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#111827",
    marginBottom: "6px",
  },

  statusBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },

  description: {
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#6b7280",
  },

  details: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "14px",
  },

  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    color: "#374151",
  },

  actions: {
    display: "flex",
    gap: "10px",
  },

  editButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },

  deleteButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "10px",
    border: "1px solid #fee2e2",
    background: "#fee2e2",
    color: "#991b1b",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default ManageServices;