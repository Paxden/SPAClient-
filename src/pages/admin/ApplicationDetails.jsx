// pages/admin/ApplicationDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaPhone,
  FaHome,
  FaSchool,
  FaBook,
  FaFilePdf,
  FaImage,
  FaDownload,
  FaPrint,
  FaStar,
  FaGraduationCap,
  FaIdCard,
  FaVenusMars,
  FaClock,
  FaEye,
  FaUserGraduate 
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdVerified, MdPending } from "react-icons/md";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  localStorage.getItem("token")

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/admin/applications/${id}`);
      setApp(res.data);
    } catch (error) {
      console.error("Error fetching application:", error);
      // Fallback to filtering from all applications
      const allRes = await API.get(`/admin/applications`);
      const found = allRes.data.find((a) => a._id === id);
      setApp(found);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to approve this application?"))
      return;

    setUpdating(true);
    try {
      await API.put(`/admin/approve/${id}`);
      await fetchApplication();
      alert("Application approved successfully!");
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this application?"))
      return;

    setUpdating(true);
    try {
      await API.put(`/admin/reject/${id}`);
      await fetchApplication();
      alert("Application rejected successfully!");
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application. Please try again.");
    } finally {
      setUpdating(false);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFullName = () => {
    if (!app?.personalInfo) return "N/A";
    const { firstName, lastName } = app.personalInfo;
    return `${firstName || ""} ${lastName || ""}`.trim();
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
          <h5 className="text-muted">Loading application details...</h5>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="animate-fade-in">
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem" }}
        >
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <FaUser size={40} className="text-muted" />
              </div>
            </div>
            <h3 className="fw-bold mb-3">Application Not Found</h3>
            <p className="text-muted mb-4">
              The application you're looking for doesn't exist or has been
              removed.
            </p>
            <button
              onClick={() => navigate("/admin/applications")}
              className="btn btn-primary"
              style={{ borderRadius: "0.75rem" }}
            >
              <FaArrowLeft className="me-2" /> Back to Applications
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(app.status);
  const canModify = app.status === "submitted" || app.status === "draft";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <button
            onClick={() => navigate("/admin/applications")}
            className="btn btn-link text-decoration-none text-muted p-0 mb-2"
            style={{ fontSize: "0.9rem" }}
          >
            <FaArrowLeft className="me-1" /> Back to Applications
          </button>
          <h1
            className="display-6 fw-bold mb-0"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Application Details
          </h1>
          <p className="text-muted mt-2">
            Review and manage student application
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
            <FaDownload className="me-1" size={14} /> Export PDF
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column - Student Info & Actions */}
        <div className="col-lg-4">
          {/* Student Profile Card */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="bg-gradient p-4 text-center">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  border: "4px solid white",
                }}
              >
                <FaUserGraduate size={50} className="text-primary" />
              </div>
              <h4 className="fw-bold text-white mb-1">{getFullName()}</h4>
              <p className="text-white-50 mb-0">{app.user?.email}</p>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Application ID</span>
                <span className="fw-semibold">
                  {app._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Status</span>
                <span
                  className={`badge ${statusBadge.class} px-3 py-2 rounded-pill d-inline-flex align-items-center gap-2`}
                >
                  {statusBadge.icon}
                  {statusBadge.text}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Submitted Date</span>
                <span className="fw-semibold">{formatDate(app.createdAt)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Last Updated</span>
                <span className="fw-semibold">
                  {formatDate(app.updatedAt || app.createdAt)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Step Completed</span>
                <span className="fw-semibold">{app.step}/5</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {canModify && (
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Review Actions</h6>
                <div className="d-grid gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={updating}
                    className="btn btn-success"
                    style={{ borderRadius: "0.75rem", padding: "0.75rem" }}
                  >
                    {updating ? (
                      <FaSpinner className="fa-spin me-2" />
                    ) : (
                      <FaCheckCircle className="me-2" />
                    )}
                    Approve Application
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={updating}
                    className="btn btn-danger"
                    style={{ borderRadius: "0.75rem", padding: "0.75rem" }}
                  >
                    {updating ? (
                      <FaSpinner className="fa-spin me-2" />
                    ) : (
                      <FaTimesCircle className="me-2" />
                    )}
                    Reject Application
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Application Details */}
        <div className="col-lg-8">
          {/* Tabs */}
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="card-header bg-white border-0 p-0">
              <div className="d-flex border-bottom">
                <button
                  className={`btn btn-link text-decoration-none px-4 py-3 ${activeTab === "personal" ? "fw-bold text-primary border-bottom border-primary border-2" : "text-muted"}`}
                  onClick={() => setActiveTab("personal")}
                >
                  <FaUser className="me-2" /> Personal Info
                </button>
                <button
                  className={`btn btn-link text-decoration-none px-4 py-3 ${activeTab === "academic" ? "fw-bold text-primary border-bottom border-primary border-2" : "text-muted"}`}
                  onClick={() => setActiveTab("academic")}
                >
                  <FaGraduationCap className="me-2" /> Academic Info
                </button>
                <button
                  className={`btn btn-link text-decoration-none px-4 py-3 ${activeTab === "documents" ? "fw-bold text-primary border-bottom border-primary border-2" : "text-muted"}`}
                  onClick={() => setActiveTab("documents")}
                >
                  <FaFilePdf className="me-2" /> Documents
                </button>
              </div>
            </div>

            <div className="card-body p-4">
              {/* Personal Information Tab */}
              {activeTab === "personal" && (
                <div className="animate-fade-in">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaUser className="me-1" size={12} /> First Name
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.personalInfo?.firstName || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaUser className="me-1" size={12} /> Last Name
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.personalInfo?.lastName || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaEnvelope className="me-1" size={12} /> Email Address
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.user?.email || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaPhone className="me-1" size={12} /> Phone Number
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.personalInfo?.phone || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaCalendarAlt className="me-1" size={12} /> Date of
                        Birth
                      </label>
                      <p className="fw-semibold mb-3">
                        {formatDate(app.personalInfo?.dob)}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaVenusMars className="me-1" size={12} /> Gender
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.personalInfo?.gender || "N/A"}
                      </p>
                    </div>
                    <div className="col-12">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <MdLocationOn className="me-1" size={12} /> Address
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.personalInfo?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Information Tab */}
              {activeTab === "academic" && (
                <div className="animate-fade-in">
                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaSchool className="me-1" size={12} /> Secondary School
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.academicInfo?.secondarySchool || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaBook className="me-1" size={12} /> Exam Type
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.academicInfo?.examType || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-3">
                      <label className="text-muted small fw-semibold mb-1 d-block">
                        <FaCalendarAlt className="me-1" size={12} /> Exam Year
                      </label>
                      <p className="fw-semibold mb-3">
                        {app.academicInfo?.examYear || "N/A"}
                      </p>
                    </div>
                  </div>

                  <h6 className="fw-semibold mb-3">Subjects & Grades</h6>
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="bg-light">
                        <tr>
                          <th className="border-0 rounded-start">Subject</th>
                          <th className="border-0">Grade</th>
                          <th className="border-0 rounded-end">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {app.academicInfo?.subjects?.map((subject, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">{subject.name}</td>
                            <td>
                              <span
                                className={`badge ${
                                  subject.grade === "A1"
                                    ? "bg-success"
                                    : subject.grade === "B2" ||
                                        subject.grade === "B3"
                                      ? "bg-info"
                                      : "bg-warning"
                                }`}
                              >
                                {subject.grade}
                              </span>
                            </td>
                            <td>
                              <small className="text-success">
                                <FaCheckCircle className="me-1" size={12} />{" "}
                                Verified
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {app.programChoice && (
                    <>
                      <h6 className="fw-semibold mb-3 mt-4">Program Choices</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="bg-light rounded-3 p-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <FaStar className="text-warning" />
                              <strong>First Choice</strong>
                            </div>
                            <p className="mb-0">
                              {app.programChoice.firstChoice || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="bg-light rounded-3 p-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <FaStar className="text-muted" />
                              <strong>Second Choice</strong>
                            </div>
                            <p className="mb-0">
                              {app.programChoice.secondChoice || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
                <div className="animate-fade-in">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div
                        className="card border-0 bg-light"
                        style={{ borderRadius: "1rem" }}
                      >
                        <div className="card-body p-4 text-center">
                          <FaImage size={48} className="text-primary mb-3" />
                          <h6 className="fw-semibold mb-2">
                            Passport Photograph
                          </h6>
                          {app.documents?.passport ? (
                            <>
                              <p className="small text-muted mb-3">
                                {app.documents.passport.split("/").pop()}
                              </p>
                              <button className="btn btn-sm btn-outline-primary me-2">
                                <FaEye className="me-1" /> View
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <FaDownload className="me-1" /> Download
                              </button>
                            </>
                          ) : (
                            <p className="text-muted mb-0">Not uploaded yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="card border-0 bg-light"
                        style={{ borderRadius: "1rem" }}
                      >
                        <div className="card-body p-4 text-center">
                          <FaFilePdf size={48} className="text-danger mb-3" />
                          <h6 className="fw-semibold mb-2">Result Document</h6>
                          {app.documents?.result ? (
                            <>
                              <p className="small text-muted mb-3">
                                {app.documents.result.split("/").pop()}
                              </p>
                              <button className="btn btn-sm btn-outline-primary me-2">
                                <FaEye className="me-1" /> View
                              </button>
                              <button className="btn btn-sm btn-outline-secondary">
                                <FaDownload className="me-1" /> Download
                              </button>
                            </>
                          ) : (
                            <p className="text-muted mb-0">Not uploaded yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
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
          animation: fadeIn 0.3s ease-out;
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

        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .btn-link:hover {
          background-color: transparent;
        }

        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
        }

        @media print {
          .btn,
          .btn-link,
          .d-flex.gap-2 {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ApplicationDetails;
