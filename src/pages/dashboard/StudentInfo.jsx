/* eslint-disable no-unused-vars */
// pages/dashboard/StudentInfo.jsx
import { useApplication } from "../../context/ApplicationContext";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaHome,
  FaSchool,
  FaBook,
  FaCalendarCheck,
  FaFilePdf,
  FaImage,
  FaCheckCircle,
  FaGraduationCap,
  FaIdCard,
  FaPrint,
  FaDownload,
  FaShareAlt,
  FaLock,
} from "react-icons/fa";
import { MdEmail, MdLocationOn, MdVerified, MdSchool } from "react-icons/md";

const StudentInfo = () => {
  const { application, loading } = useApplication();
  const { user } = useAuth();
  const [showFullDetails, setShowFullDetails] = useState(false);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ color: "#667eea" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading student information...</h5>
        </div>
      </div>
    );
  }

  if (!application) {
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
            <h3 className="fw-bold mb-3">No Student Information Found</h3>
            <p className="text-muted mb-4">
              Please complete your application to view your student information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if application status is approved
  const isApproved = application.status === "approved";

  // If not approved, show access denied message
  if (!isApproved) {
    return (
      <div className="animate-fade-in">
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "100px", height: "100px" }}
              >
                <FaLock size={50} className="text-warning" />
              </div>
            </div>
            <h3 className="fw-bold mb-3">Access Restricted</h3>
            <p className="text-muted mb-4">
              Your student information will be available once your application
              has been <strong className="text-success">approved</strong>.
            </p>
            <div className="d-inline-block">
              <div className="alert alert-info mb-0" role="alert">
                <FaCheckCircle className="me-2" />
                Current Status:{" "}
                <strong className="text-uppercase">{application.status}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFullName = () => {
    const { firstName, lastName } = application.personalInfo || {};
    return `${firstName || ""} ${lastName || ""}`.trim();
  };

  const getStatusBadge = () => {
    const status = application.status;
    switch (status) {
      case "approved":
        return { text: "Approved", color: "success", icon: <MdVerified /> };
      case "submitted":
        return {
          text: "Under Review",
          color: "warning",
          icon: <FaCheckCircle />,
        };
      case "rejected":
        return { text: "Rejected", color: "danger", icon: <FaCheckCircle /> };
      default:
        return { text: "Draft", color: "secondary", icon: <FaCheckCircle /> };
    }
  };

  const statusBadge = getStatusBadge();

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
            Student Information
          </h1>
          <p className="text-muted mt-2">
            View and manage your personal and academic details
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "0.5rem" }}
            onClick={() => window.print()}
          >
            <FaPrint className="me-1" size={14} /> Print
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "0.5rem" }}
          >
            <FaDownload className="me-1" size={14} /> Download
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Summary Card */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm text-center"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="bg-gradient p-4">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  border: "4px solid white",
                }}
              >
                <FaUser size={50} className="text-primary" />
              </div>
              <h4 className="fw-bold text-white mb-1">{getFullName()}</h4>
              <p className="text-white-50 mb-0">
                {application.personalInfo?.email || user?.email}
              </p>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Application Status</span>
                <span
                  className={`badge bg-${statusBadge.color} px-3 py-2 rounded-pill`}
                >
                  {statusBadge.icon} {statusBadge.text}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Application ID</span>
                <span className="fw-semibold">
                  {application._id?.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <span className="text-muted">Submitted Date</span>
                <span className="fw-semibold">
                  {formatDate(application.createdAt)}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Step Completed</span>
                <span className="fw-semibold">{application.step}/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-8">
          {/* Personal Information */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                  <FaUser className="text-primary" size={18} />
                </div>
                <h5 className="fw-bold mb-0">Personal Information</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaUser className="me-1" size={12} /> Full Name
                  </label>
                  <p className="fw-semibold mb-0">{getFullName()}</p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <MdEmail className="me-1" size={12} /> Email Address
                  </label>
                  <p className="fw-semibold mb-0">
                    {user?.email || "Not provided"}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaCalendarAlt className="me-1" size={12} /> Date of Birth
                  </label>
                  <p className="fw-semibold mb-0">
                    {formatDate(application.personalInfo?.dob)}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaVenusMars className="me-1" size={12} /> Gender
                  </label>
                  <p className="fw-semibold mb-0">
                    {application.personalInfo?.gender || "Not specified"}
                  </p>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaPhone className="me-1" size={12} /> Phone Number
                  </label>
                  <p className="fw-semibold mb-0">
                    {application.personalInfo?.phone || "Not provided"}
                  </p>
                </div>
                <div className="col-12">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <MdLocationOn className="me-1" size={12} /> Address
                  </label>
                  <p className="fw-semibold mb-0">
                    {application.personalInfo?.address || "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div
            className="card border-0 shadow-sm mb-4"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-info bg-opacity-10 rounded-3 p-2">
                  <FaGraduationCap className="text-info" size={18} />
                </div>
                <h5 className="fw-bold mb-0">Academic Information</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaSchool className="me-1" size={12} /> Secondary School
                  </label>
                  <p className="fw-semibold mb-0">
                    {application.academicInfo?.secondarySchool ||
                      "Not provided"}
                  </p>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaBook className="me-1" size={12} /> Exam Type
                  </label>
                  <p className="fw-semibold mb-0">
                    {application.academicInfo?.examType || "Not provided"}
                  </p>
                </div>
                <div className="col-md-3">
                  <label className="text-muted small fw-semibold mb-1 d-block">
                    <FaCalendarCheck className="me-1" size={12} /> Exam Year
                  </label>
                  <p className="fw-semibold mb-0">
                    {application.academicInfo?.examYear || "Not provided"}
                  </p>
                </div>
              </div>

              <h6 className="fw-semibold mb-3">Subjects & Grades</h6>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 rounded-start">Subject</th>
                      <th className="border-0">Grade</th>
                      <th className="border-0 rounded-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {application.academicInfo?.subjects?.map(
                      (subject, index) => (
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
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-danger bg-opacity-10 rounded-3 p-2">
                  <FaFilePdf className="text-danger" size={18} />
                </div>
                <h5 className="fw-bold mb-0">Uploaded Documents</h5>
              </div>
            </div>
            <div className="card-body p-4">
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="bg-light rounded-3 p-3 text-center h-100">
                    <FaImage size={40} className="text-primary mb-2" />
                    <h6 className="fw-semibold mb-1">Passport Photograph</h6>
                    {application.documents?.passport ? (
                      <>
                        <p className="small text-muted mb-2">
                          {application.documents.passport.split("/").pop()}
                        </p>
                        <button className="btn btn-sm btn-outline-primary">
                          <FaFilePdf className="me-1" /> View
                        </button>
                      </>
                    ) : (
                      <p className="small text-muted mb-0">Not uploaded yet</p>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light rounded-3 p-3 text-center h-100">
                    <FaFilePdf size={40} className="text-danger mb-2" />
                    <h6 className="fw-semibold mb-1">Result Document</h6>
                    {application.documents?.result ? (
                      <>
                        <p className="small text-muted mb-2">
                          {application.documents.result.split("/").pop()}
                        </p>
                        <button className="btn btn-sm btn-outline-primary">
                          <FaFilePdf className="me-1" /> View
                        </button>
                      </>
                    ) : (
                      <p className="small text-muted mb-0">Not uploaded yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
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

        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .table > :not(caption) > * > * {
          padding: 1rem;
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.05);
        }

        .btn-outline-secondary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        @media print {
          .btn,
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

export default StudentInfo;
