// pages/dashboard/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="dashboard-layout d-flex vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="main-content d-flex flex-column flex-grow-1">
        <Navbar
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-grow-1 overflow-auto p-3 p-md-4">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>

        {/* Footer (Optional) */}
        <footer className="bg-white border-top py-3 px-4 text-center text-muted">
          <small>&copy; 2025 Student Portal. All rights reserved.</small>
        </footer>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .dashboard-layout {
          overflow: hidden;
          display: flex;
        }

        .main-content {
          transition: all 0.3s ease;
          width: 100%;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        /* Custom scrollbar for main content */
        .overflow-auto::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .overflow-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-auto::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .p-3 {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
