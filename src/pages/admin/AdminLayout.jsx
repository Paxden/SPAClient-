// pages/admin/AdminLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaFileAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaUserShield,
  FaChartBar,
  FaEnvelope,
  FaClipboardList,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import { MdDashboard, MdPendingActions, MdVerified } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileOpen(false);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const menuItems = [
    { path: "/admin", icon: <MdDashboard />, label: "Dashboard", end: true },
    {
      path: "/admin/applications",
      icon: <FaClipboardList />,
      label: "Applications",
    },
    { path: "/admin/students", icon: <FaUsers />, label: "Students" },
    { path: "/admin/reports", icon: <FaChartBar />, label: "Reports" },
    { path: "/admin/settings", icon: <FaCog />, label: "Settings" },
  ];

 

  return (
    <div className="admin-layout d-flex vh-100 bg-light">
      {/* Sidebar Overlay for Mobile */}
      {isMobile && mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`sidebar bg-dark text-white shadow-lg transition-sidebar ${
          isMobile
            ? mobileOpen
              ? "open"
              : "closed"
            : sidebarCollapsed
              ? "collapsed"
              : ""
        }`}
        style={{
          width: sidebarCollapsed && !isMobile ? "80px" : "280px",
          transition: "width 0.3s ease-in-out",
          zIndex: 1045,
          position: isMobile ? "fixed" : "relative",
          left: isMobile && !mobileOpen ? "-280px" : "0",
        }}
      >
        {/* Sidebar Header */}
        <div
          className={`p-3 border-bottom border-secondary d-flex align-items-center ${
            sidebarCollapsed && !isMobile
              ? "justify-content-center"
              : "justify-content-between"
          }`}
        >
          {(!sidebarCollapsed || isMobile) && (
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-gradient rounded-3 p-2 d-flex align-items-center justify-content-center"
                style={{ width: "40px", height: "40px" }}
              >
                <FaUserShield className="text-white" size={20} />
              </div>
              <div>
                <h6 className="fw-bold mb-0 text-white">Admin Portal</h6>
                <small className="text-white-50">Admissions Office</small>
              </div>
            </div>
          )}

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="btn btn-link text-white p-0"
              style={{ textDecoration: "none" }}
            >
              {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>
          )}

          {isMobile && mobileOpen && (
            <button
              onClick={toggleSidebar}
              className="btn btn-link text-white p-0"
              style={{ textDecoration: "none" }}
            >
              <FaTimes size={20} />
            </button>
          )}
        </div>

        {/* Admin Info */}
        {(!sidebarCollapsed || isMobile) && (
          <div className="p-3 border-bottom border-secondary">
            <div className="d-flex align-items-center gap-2">
              <div
                className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "45px", height: "45px" }}
              >
                <FaUserShield className="text-white" size={24} />
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold text-white small">
                  {user?.fullName || "Admin User"}
                </div>
                <small className="text-white-50">Administrator</small>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
          <div className="mb-4">
            {(!sidebarCollapsed || isMobile) && (
              <small
                className="text-white-50 text-uppercase d-block mb-2"
                style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
              >
                Main Menu
              </small>
            )}
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 text-decoration-none transition-all ${
                    isActive
                      ? "bg-gradient text-white shadow-sm"
                      : "text-white-50 hover-bg-light"
                  }`
                }
                onClick={() => isMobile && setMobileOpen(false)}
                title={sidebarCollapsed && !isMobile ? item.label : ""}
              >
                <span style={{ fontSize: "1.1rem", minWidth: "20px" }}>
                  {item.icon}
                </span>
                {(!sidebarCollapsed || isMobile) && (
                  <>
                    <span className="flex-grow-1">{item.label}</span>
                    {item.badge && (
                      <span className="badge bg-danger rounded-pill">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-top border-secondary">
          <button
            onClick={handleLogout}
            className={`btn btn-outline-light w-100 d-flex align-items-center gap-2 rounded-3 ${
              sidebarCollapsed && !isMobile ? "justify-content-center" : ""
            }`}
            style={{ transition: "all 0.3s ease" }}
            title={sidebarCollapsed && !isMobile ? "Logout" : ""}
          >
            <FaSignOutAlt />
            {(!sidebarCollapsed || isMobile) && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content d-flex flex-column flex-grow-1">
        {/* Top Navbar */}
        <nav className="bg-white shadow-sm px-3 px-md-4 py-2 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="btn btn-link text-dark p-0"
              style={{ textDecoration: "none", width: "32px", height: "32px" }}
            >
              <FaBars size={20} />
            </button>
            <h5 className="mb-0 d-none d-md-block">
              Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Notifications */}
            <button
              className="btn btn-link text-dark position-relative p-0"
              style={{ textDecoration: "none" }}
            >
              <FaBell size={18} />
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "10px", marginTop: "-5px" }}
              >
                5
              </span>
            </button>

            {/* Admin Dropdown */}
            <div className="dropdown">
              <button
                className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
                data-bs-toggle="dropdown"
              >
                <div
                  className="bg-gradient rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <FaUserShield className="text-white" size={18} />
                </div>
                <span className="d-none d-md-inline fw-semibold">
                  {user?.fullName || "Admin"}
                </span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
                style={{ borderRadius: "0.75rem" }}
              >
                <li>
                  <a className="dropdown-item" href="/admin/profile">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/admin/settings">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                    href="#"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Stats Cards - Only show on dashboard */}
        <div className="p-3 p-md-4">
          {/* Quick Stats Row - You can conditionally show this only on dashboard */}
          

          {/* Main Content Outlet */}
          <Outlet />
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .admin-layout {
          overflow: hidden;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar.closed {
          width: 80px;
        }

        .sidebar.open {
          left: 0;
        }

        .main-content {
          transition: all 0.3s ease;
          width: 100%;
          overflow-y: auto;
        }

        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hover-bg-light:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        .transition-sidebar {
          transition:
            width 0.3s ease-in-out,
            left 0.3s ease-in-out;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 5px;
        }

        ::-webkit-scrollbar-track {
          background: #2d2d2d;
        }

        ::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #764ba2;
        }

        /* Active link animation */
        .bg-gradient {
          position: relative;
          overflow: hidden;
        }

        .bg-gradient::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .bg-gradient:hover::after {
          transform: translateX(0);
        }

        .dropdown-item:hover {
          background-color: rgba(102, 126, 234, 0.1);
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            height: 100vh;
            top: 0;
            left: -280px;
          }

          .sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
