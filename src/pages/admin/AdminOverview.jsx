// pages/admin/Overview.jsx
import { useEffect, useState } from "react";
import API from "../../api/api";
import {
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaChartLine,
  FaCalendarAlt,
  FaEnvelope,
  FaIdCard,
  FaArrowRight,
} from "react-icons/fa";
import { MdVerified, MdPending, MdSchool } from "react-icons/md";

const Overview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ color: "#667eea", width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading dashboard data...</h5>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="animate-fade-in">
        <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem" }}>
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <FaChartLine size={40} className="text-danger" />
              </div>
            </div>
            <h3 className="fw-bold mb-3">Error Loading Dashboard</h3>
            <p className="text-muted mb-0">{error || "Unable to fetch statistics"}</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentApplications } = data;

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: <FaUsers size={20} />,
      color: "#667eea",
    },
    {
      title: "Pending Review",
      value: stats.pending,
      icon: <MdPending size={20} />,
      color: "#f5576c",
    },
    {
      title: "Approved",
      value: stats.approved,
      icon: <MdVerified size={20} />,
      color: "#4facfe",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: <FaTimesCircle size={20} />,
      color: "#fa709a",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return { text: "Approved", color: "success", icon: <MdVerified size={12} /> };
      case "rejected":
        return { text: "Rejected", color: "danger", icon: <FaTimesCircle size={12} /> };
      case "submitted":
        return { text: "Pending", color: "warning", icon: <FaClock size={12} /> };
      default:
        return { text: "Draft", color: "secondary", icon: <FaClock size={12} /> };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1
            className="display-6 fw-bold mb-0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Dashboard
          </h1>
          <p className="text-muted mt-2">
            Welcome back! Here's what's happening with your applications today.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "0.5rem" }}
            onClick={() => window.location.reload()}
          >
            <FaChartLine className="me-1" size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Minimalist Statistics Cards */}
      <div className="row g-4 mb-4">
        {statCards.map((card, index) => (
          <div className="col-md-3" key={index}>
            <div
              className="card border-0 shadow-sm h-100"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div
                    className="rounded p-2"
                    style={{
                      backgroundColor: `${card.color}10`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </div>
                <h2 className="fw-bold mb-1" style={{ fontSize: "1.75rem" }}>
                  {card.value}
                </h2>
                </div>
                <p className="text-muted mb-0 small">{card.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Stats Row - Minimalist */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="mb-2">
                    <FaUserGraduate size={20} className="text-primary" />
                  </div>
                  <h6 className="text-muted mb-1">Total Students</h6>
                  <h2 className="fw-bold mb-0">{stats.totalStudents}</h2>
                </div>
              </div>
              <div className="mt-3 pt-2 border-top">
                <small className="text-muted">
                  {Math.round((stats.totalStudents / (stats.totalApplications || 1)) * 100)}% conversion rate
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="mb-2">
                    <FaChartLine size={20} className="text-success" />
                  </div>
                  <h6 className="text-muted mb-1">Completion Rate</h6>
                  <h2 className="fw-bold mb-0">
                    {Math.round((stats.approved / (stats.totalApplications || 1)) * 100)}%
                  </h2>
                </div>
              </div>
              <div className="mt-3 pt-2 border-top">
                <small className="text-muted">
                  {stats.approved} approved out of {stats.totalApplications}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="row g-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <FaClock className="text-primary" size={18} />
                  <h5 className="fw-bold mb-0">Recent Applications</h5>
                </div>
                <button className="btn btn-sm btn-link text-primary p-0">
                  View All <FaArrowRight size={12} className="ms-1" />
                </button>
              </div>
            </div>
            <div className="card-body p-0">
              {recentApplications.length === 0 ? (
                <div className="text-center p-5">
                  <FaUsers size={40} className="text-muted mb-3" />
                  <p className="text-muted mb-0">No recent applications found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="border-0 p-3">Student</th>
                        <th className="border-0 p-3">Email</th>
                        <th className="border-0 p-3">Applied Date</th>
                        <th className="border-0 p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app) => {
                        const statusBadge = getStatusBadge(app.status);
                        return (
                          <tr key={app._id} className="border-top">
                            <td className="p-3">
                              <div>
                                <p className="fw-semibold mb-0">
                                  {app.user?.fullName || "Unknown"}
                                </p>
                                {app.matricNumber && (
                                  <small className="text-muted">
                                    <FaIdCard size={10} className="me-1" />
                                    {app.matricNumber}
                                  </small>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="d-flex align-items-center gap-2">
                                <FaEnvelope size={12} className="text-muted" />
                                <span>{app.user?.email || "N/A"}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="d-flex align-items-center gap-2">
                                <FaCalendarAlt size={12} className="text-muted" />
                                <span>{formatDate(app.createdAt)}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`badge bg-${statusBadge.color} bg-opacity-10 text-${statusBadge.color} px-3 py-2 rounded-pill`}
                                style={{ fontSize: "0.75rem" }}
                              >
                                {statusBadge.icon} {statusBadge.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {recentApplications.length > 0 && (
              <div className="card-footer bg-white border-0 pb-4 px-4">
                <div className="d-flex justify-content-end">
                  <button className="btn btn-sm btn-outline-primary" style={{ borderRadius: "0.5rem" }}>
                    View All Applications <FaArrowRight size={12} className="ms-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .table > :not(caption) > * > * {
          padding: 1rem;
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.05);
        }

        .btn-outline-primary {
          border-color: #667eea;
          color: #667eea;
        }

        .btn-outline-primary:hover {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .btn-link {
          text-decoration: none;
          color: #667eea;
        }

        .btn-link:hover {
          color: #764ba2;
        }

        .card {
          transition: box-shadow 0.3s ease;
        }

        .card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
        }

        @media (max-width: 768px) {
          .display-6 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;