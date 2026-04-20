// components/Navbar.jsx (Using Context)
import { useState } from "react";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaChevronDown,
  FaSearch,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useApplication } from "../context/ApplicationContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { application, loading } = useApplication();
  const { user } = useAuth();

  // Get full name from application data
  const getFullName = () => {
    if (application?.personalInfo) {
      const { firstName, lastName } = application.personalInfo;
      return `${firstName || ""} ${lastName || ""}`.trim();
    }
    return user?.fullName || "Student";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const name = getFullName();
    if (name === "Student") return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get first name for greeting
  const getFirstName = () => {
    const fullName = getFullName();
    return fullName.split(" ")[0];
  };

  return (
    <nav className="bg-white shadow-sm px-3 px-md-4 py-2 d-flex align-items-center justify-content-between">
      <div className="d-block d-md-none">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-link text-dark p-0 d-flex align-items-center"
            onClick={toggleSidebar}
            style={{ textDecoration: "none", width: "32px", height: "32px" }}
          >
            <FaBars className="d-block d-md-none" size={20} />
          </button>
        </div>
      </div>

      {/* Welcome Greeting - Desktop */}
      <div className="d-none d-lg-block">
        <small className="text-muted">Welcome back,</small>
        <span className="fw-semibold ms-1">
          {loading ? "..." : getFirstName()}
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="dropdown">
          <button
            className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
            onClick={() => setShowDropdown(!showDropdown)}
            data-bs-toggle="dropdown"
          >
            <div
              className="bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: "36px", height: "36px", fontSize: "14px" }}
            >
              {loading ? <FaUserCircle size={24} /> : getUserInitials()}
            </div>

            <span className="d-none d-md-inline fw-semibold">
              {loading ? "Loading..." : getFullName()}
            </span>

            <FaChevronDown
              size={12}
              className="d-none d-md-inline text-muted"
            />
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
            style={{ borderRadius: "0.75rem" }}
          >
            <li className="px-3 py-2 d-md-none">
              <div className="fw-semibold">{getFullName()}</div>
              <small className="text-muted">
                {user?.email || "student@example.com"}
              </small>
            </li>
            <li>
              <hr className="dropdown-divider d-md-none" />
            </li>
            <li>
              <a
                className="dropdown-item d-flex align-items-center gap-2 py-2"
                href="/dashboard/profile"
              >
                <FaUserCircle size={16} /> My Profile
              </a>
            </li>
            <li>
              <a
                className="dropdown-item d-flex align-items-center gap-2 py-2"
                href="/dashboard/settings"
              >
                <FaCog size={16} /> Settings
              </a>
            </li>
            <li>
              <a
                className="dropdown-item d-flex align-items-center gap-2 py-2"
                href="/dashboard/application"
              >
                <FaCog size={16} /> My Application
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                href="/login"
              >
                <FaSignOutAlt size={16} /> Logout
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .dropdown-item:hover {
          background-color: rgba(102, 126, 234, 0.1);
        }

        .dropdown-item {
          transition: all 0.3s ease;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
