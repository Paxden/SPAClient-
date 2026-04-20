// components/Sidebar.jsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUserGraduate,
  FaBars,
  FaTimes,
  FaUniversity,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  

  const handleLogout = async () => {
    await logout();
    // Navigate to login page
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const navItems = [
    {
      to: "/dashboard",
      end: true,
      icon: <FaTachometerAlt />,
      label: "Overview",
    },
    { to: "/dashboard/application", icon: <FaFileAlt />, label: "Application" },
    {
      to: "/dashboard/profile",
      icon: <FaUserGraduate />,
      label: "Student Info",
    },
    { to: "/dashboard/courses", icon: <FaChartLine />, label: "Courses" },
    { to: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="btn btn-light position-fixed top-0 start-0 m-3 z-3 shadow-sm"
          onClick={toggleSidebar}
          style={{
            borderRadius: "0.75rem",
            padding: "0.75rem",
            zIndex: 1050,
            backgroundColor: "white",
            border: "none",
          }}
        >
          <FaBars size={20} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={` top-0 start-0 h-90 bg-white shadow-lg transition-sidebar ${
          isMobile
            ? isMobileOpen
              ? "translate-x-0"
              : "translate-x-minus-100"
            : "position-relative translate-x-0"
        }`}
        style={{
          width: "330px",
          position: isMobile ? "fixed" : "relative",
          zIndex: 1045,
          transition: "transform 0.3s ease-in-out",
          transform:
            isMobile && !isMobileOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-gradient rounded-3 p-2 d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              <FaUniversity className="text-primary p-0 m-0" size={32} />
            </div>
            <div>
              <h5
                className="fw-bold mb-0"
                style={{
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Student Portal
              </h5>
              <small className="text-muted">Class of 2025</small>
            </div>
          </div>

          {isMobile && (
            <button
              className="btn btn-link text-dark p-0"
              onClick={toggleSidebar}
              style={{ textDecoration: "none" }}
            >
              <FaTimes size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav
          className="flex-grow-1 p-3"
          style={{ overflowY: "auto", height: "calc(100% - 140px)" }}
        >
          <div className="mb-2">
            <small
              className="text-muted text-uppercase fw-semibold px-3 mb-2 d-block"
              style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
            >
              Main Menu
            </small>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 text-decoration-none transition-all ${
                    isActive
                      ? "bg-gradient text-primary shadow-sm"
                      : "text-secondary hover-bg-light"
                  }`
                }
                onClick={closeSidebar}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span className="fw-medium">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="border-top pt-3">
            <small
              className="text-muted text-uppercase fw-semibold px-3 mb-2 d-block"
              style={{ fontSize: "0.7rem", letterSpacing: "0.5px" }}
            >
              Quick Stats
            </small>
            <div className="bg-light rounded-3 p-3 mx-2 mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">Application Status</small>
                <span className="badge bg-warning text-dark">In Progress</span>
              </div>
              <div className="progress" style={{ height: "6px" }}>
                <div
                  className="progress-bar bg-gradient"
                  style={{ width: "65%" }}
                  role="progressbar"
                />
              </div>
              <small className="text-muted d-block mt-2">65% Completed</small>
            </div>
          </div>
        </nav>

        {/* Footer / Logout Button */}
        <div className="border-top p-3">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
            style={{ transition: "all 0.3s ease" }}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
          <div className="text-center mt-3">
            <small className="text-muted">Version 2.0.0</small>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default Sidebar;
