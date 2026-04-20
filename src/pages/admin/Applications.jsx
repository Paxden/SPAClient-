/* eslint-disable no-unused-vars */
// pages/admin/Applications.jsx
import { useEffect, useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaEye,
  FaFilter,
  FaSpinner,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserGraduate,
  FaEnvelope,
  FaCalendarAlt,
  FaDownload,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { MdPending, MdVerified } from "react-icons/md";

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/applications");
      setApps(res.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: <MdVerified />,
          text: "Approved",
          color: "success",
          class: "bg-success bg-opacity-10 text-success",
        };
      case "submitted":
        return {
          icon: <FaClock />,
          text: "Under Review",
          color: "warning",
          class: "bg-warning bg-opacity-10 text-warning",
        };
      case "rejected":
        return {
          icon: <FaTimesCircle />,
          text: "Rejected",
          color: "danger",
          class: "bg-danger bg-opacity-10 text-danger",
        };
      default:
        return {
          icon: <MdPending />,
          text: "Draft",
          color: "secondary",
          class: "bg-secondary bg-opacity-10 text-secondary",
        };
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-muted" size={12} />;
    return sortOrder === "asc" ? (
      <FaSortUp className="text-primary" />
    ) : (
      <FaSortDown className="text-primary" />
    );
  };

  // Filter and sort applications
  const filteredApps = apps
    .filter((app) => {
      const matchesSearch =
        (app.user?.fullName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (app.user?.email || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (app._id || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal, bVal;
      if (sortField === "fullName") {
        aVal = a.user?.fullName || "";
        bVal = b.user?.fullName || "";
      } else if (sortField === "email") {
        aVal = a.user?.email || "";
        bVal = b.user?.email || "";
      } else {
        aVal = a[sortField];
        bVal = b[sortField];
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusCount = (status) => {
    if (status === "all") return apps.length;
    return apps.filter((app) => app.status === status).length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <FaSpinner
            className="fa-spin mb-3"
            size={48}
            style={{ color: "#667eea" }}
          />
          <h5 className="text-muted">Loading applications...</h5>
        </div>
      </div>
    );
  }

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
            Applications Management
          </h1>
          <p className="text-muted mt-2">
            Review and manage student applications
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.print()}
          >
            <FaPrint className="me-1" size={14} /> Print
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <FaDownload className="me-1" size={14} /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Total Applications</small>
                  <h3 className="fw-bold mb-0">{apps.length}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-3 p-3">
                  <FaUserGraduate className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Pending Review</small>
                  <h3 className="fw-bold mb-0">
                    {getStatusCount("submitted")}
                  </h3>
                </div>
                <div className="bg-warning bg-opacity-10 rounded-3 p-3">
                  <FaClock className="text-warning" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Approved</small>
                  <h3 className="fw-bold mb-0">{getStatusCount("approved")}</h3>
                </div>
                <div className="bg-success bg-opacity-10 rounded-3 p-3">
                  <FaCheckCircle className="text-success" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <small className="text-muted">Rejected</small>
                  <h3 className="fw-bold mb-0">{getStatusCount("rejected")}</h3>
                </div>
                <div className="bg-danger bg-opacity-10 rounded-3 p-3">
                  <FaTimesCircle className="text-danger" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "1rem" }}
      >
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="position-relative">
                <FaSearch
                  className="position-absolute text-muted"
                  style={{
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or application ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: "35px", borderRadius: "0.75rem" }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ borderRadius: "0.75rem" }}
                >
                  <option value="all">All Status ({apps.length})</option>
                  <option value="submitted">
                    Under Review ({getStatusCount("submitted")})
                  </option>
                  <option value="approved">
                    Approved ({getStatusCount("approved")})
                  </option>
                  <option value="rejected">
                    Rejected ({getStatusCount("rejected")})
                  </option>
                  <option value="draft">
                    Draft ({getStatusCount("draft")})
                  </option>
                </select>
                <button
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaFilter /> Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "1rem", overflow: "hidden" }}
      >
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="bg-light">
              <tr>
                <th
                  className="border-0 py-3 px-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("fullName")}
                >
                  <div className="d-flex align-items-center gap-1">
                    Student Name {getSortIcon("fullName")}
                  </div>
                </th>
                <th
                  className="border-0 py-3 px-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("email")}
                >
                  <div className="d-flex align-items-center gap-1">
                    Email {getSortIcon("email")}
                  </div>
                </th>
                <th
                  className="border-0 py-3 px-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("status")}
                >
                  <div className="d-flex align-items-center gap-1">
                    Status {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="border-0 py-3 px-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="d-flex align-items-center gap-1">
                    Submitted Date {getSortIcon("createdAt")}
                  </div>
                </th>
                <th className="border-0 py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <div className="text-muted">
                      <FaSearch size={48} className="mb-3 opacity-25" />
                      <p>No applications found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app, index) => {
                  const statusBadge = getStatusBadge(app.status);
                  return (
                    <tr key={app._id} className="border-bottom">
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "32px", height: "32px" }}
                          >
                            <FaUserGraduate size={16} className="text-muted" />
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {app.user?.fullName || "N/A"}
                            </div>
                            <small className="text-muted">
                              ID: {app._id?.slice(-8).toUpperCase()}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-2">
                          <FaEnvelope className="text-muted" size={14} />
                          <span>{app.user?.email || "N/A"}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${statusBadge.class} px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2`}
                        >
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="d-flex align-items-center gap-2">
                          <FaCalendarAlt className="text-muted" size={14} />
                          <span>{formatDate(app.createdAt)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() =>
                            navigate(`/admin/applications/${app._id}`)
                          }
                          className="btn btn-sm btn-outline-primary"
                          style={{ borderRadius: "0.5rem" }}
                        >
                          <FaEye className="me-1" size={12} /> View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer bg-white border-0 py-3 px-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="text-muted small">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredApps.length)} of{" "}
                {filteredApps.length} applications
              </div>
              <div className="d-flex gap-1">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  style={{ borderRadius: "0.5rem" }}
                >
                  <FaChevronLeft size={12} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${currentPage === i + 1 ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setCurrentPage(i + 1)}
                    style={{ borderRadius: "0.5rem", minWidth: "35px" }}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  style={{ borderRadius: "0.5rem" }}
                >
                  <FaChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        )}
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

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.05);
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default Applications;
