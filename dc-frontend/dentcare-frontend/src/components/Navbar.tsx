import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkStyle = (path: string): React.CSSProperties => ({
    ...styles.link,
    ...(isActive(path) ? styles.activeLink : {}),
  });

  const getNavLinks = () => {
    if (user?.role === "ADMIN") {
      return (
        <>
          <Link to="/admin/dashboard" style={navLinkStyle("/admin/dashboard")}>
            📊 Dashboard
          </Link>

          <Link to="/admin/doctors" style={navLinkStyle("/admin/doctors")}>
            👨‍⚕️ Doctors
          </Link>

          <Link to="/admin/services" style={navLinkStyle("/admin/services")}>
            🦷 Services
          </Link>

          <Link
            to="/admin/appointments"
            style={navLinkStyle("/admin/appointments")}
          >
            📅 Appointments
          </Link>
          <Link to="/admin/holidays" style={navLinkStyle("/admin/holidays")}>
  🚫 Holidays
</Link>
          <Link to="/admin/reports" style={navLinkStyle("/admin/reports")}>
  📈 Reports
</Link>
        </>
      );
    }

    if (user?.role === "PATIENT") {
      return (
        <>
          <Link to="/patient/profile" style={navLinkStyle("/patient/profile")}>
  👤 My Profile
</Link>
          <Link
            to="/patient/dashboard"
            style={navLinkStyle("/patient/dashboard")}
          >
            📊 Dashboard
          </Link>

          <Link to="/patient/book" style={navLinkStyle("/patient/book")}>
            📝 Book Appointment
          </Link>

          <Link
            to="/patient/appointments"
            style={navLinkStyle("/patient/appointments")}
          >
            📅 My Appointments
          </Link>
        </>
      );
    }

    if (user?.role === "DOCTOR") {
      return (
        <>
          <Link
            to="/doctor/dashboard"
            style={navLinkStyle("/doctor/dashboard")}
          >
            📊 Dashboard
          </Link>
          <Link to="/doctor/schedule" style={navLinkStyle("/doctor/schedule")}>
  📅 My Schedule
</Link>
        </>
      );
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* LEFT */}
      <div style={styles.brand}>
        <div style={styles.logoBox}>🦷</div>

        <div>
          <h2 style={styles.brandName}>DentCare</h2>
          <p style={styles.brandSubtext}>Dental Management</p>
        </div>
      </div>

      {/* CENTER */}
      <div style={styles.links}>
        {getNavLinks()}
      </div>

      {/* RIGHT */}
      <div style={styles.userSection}>
        <div style={styles.userInfo}>
          <span style={styles.userName}>
            👤 {user?.fullName}
          </span>

          <span style={styles.roleBadge}>
            {user?.role}
          </span>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles: Record<string, React.CSSProperties> = {
  navbar: {
    height: "72px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: "220px",
  },

  logoBox: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    background: "#111827",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    color: "#fff",
    flexShrink: 0,
  },

  brandName: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
    margin: 0,
    lineHeight: 1.1,
  },

  brandSubtext: {
    fontSize: "12px",
    color: "#6b7280",
    margin: 0,
    marginTop: "2px",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  link: {
    textDecoration: "none",
    color: "#4b5563",
    fontSize: "14px",
    fontWeight: 600,
    padding: "10px 14px",
    borderRadius: "10px",
    transition: "0.2s ease",
  },

  activeLink: {
    background: "#111827",
    color: "#ffffff",
  },

  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },

  userName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#111827",
  },

  roleBadge: {
    background: "#f3f4f6",
    color: "#374151",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.04em",
  },

  logoutBtn: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Navbar;