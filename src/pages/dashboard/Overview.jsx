// pages/dashboard/Overview.jsx
import { useApplication } from "../../context/ApplicationContext";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaRocket,
  FaCheckCircle,
  FaClock,
  FaUserCheck,
  FaBell,
  FaChartLine,
  FaArrowRight,
  FaSpinner,
  FaExclamationTriangle,
  FaPercent,
  FaGraduationCap,
  FaUser,
  FaBook,
  FaFilePdf,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdPending, MdVerified } from "react-icons/md";

const Overview = () => {
  const { application, loading, startApp } = useApplication();
  const navigate = useNavigate();

  const handleStart = async () => {
    await startApp();
    navigate("/dashboard/application");
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
          <h5 className="text-muted">Loading your dashboard...</h5>
        </div>
      </div>
    );
  }

  // Calculate profile completion percentage based on actual data
  const calculateProfileCompletion = () => {
    if (!application) return 0;

    let completed = 0;
    let total = 0;

    // Personal Info Section
    if (application.personalInfo) {
      total += 5;
      if (application.personalInfo.firstName) completed++;
      if (application.personalInfo.lastName) completed++;
      if (application.personalInfo.dob) completed++;
      if (application.personalInfo.gender) completed++;
      if (application.personalInfo.phone) completed++;
    }

    // Academic Info Section
    if (application.academicInfo) {
      total += 3;
      if (application.academicInfo.secondarySchool) completed++;
      if (application.academicInfo.examType) completed++;
      if (application.academicInfo.subjects?.length > 0) completed++;
    }

    // Documents Section
    if (application.documents) {
      total += 2;
      if (application.documents.passport) completed++;
      if (application.documents.result) completed++;
    }

    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  // Get application progress based on step
  const getApplicationProgress = () => {
    if (!application) return 0;
    const step = application.step || 0;
    const totalSteps = 5;
    return Math.round((step / totalSteps) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "success";
      case "in-review":
        return "info";
      case "approved":
        return "success";
      case "rejected":
        return "danger";
      default:
        return "warning";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <FaCheckCircle />;
      case "in-review":
        return <FaClock />;
      case "approved":
        return <MdVerified />;
      case "rejected":
        return <FaExclamationTriangle />;
      default:
        return <FaFileAlt />;
    }
  };

  const profileCompletion = calculateProfileCompletion();
  const applicationProgress = getApplicationProgress();

  const stats = [
    {
      title: "Profile Completion",
      value: `${profileCompletion}%`,
      icon: <FaPercent />,
      color: "primary",
      progress: profileCompletion,
      description:
        profileCompletion === 100 ? "Complete!" : "Complete your profile",
    },
    {
      title: "Application Progress",
      value: `${applicationProgress}%`,
      icon: <FaChartLine />,
      color: "info",
      progress: applicationProgress,
      description: application?.isSubmitted ? "Submitted" : "In progress",
    },
    {
      title: "Application Status",
      value: application?.status?.toUpperCase() || "NOT STARTED",
      icon: <FaGraduationCap />,
      color: getStatusColor(application?.status),
      description:
        application?.status === "approved"
          ? "Congratulations!"
          : application?.status === "submitted"
            ? "Under review"
            : application?.isSubmitted
              ? "Submitted"
              : "Ready to start",
    },
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get full name from application
  const getFullName = () => {
    if (application?.personalInfo) {
      const { firstName, lastName } = application.personalInfo;
      return `${firstName || ""} ${lastName || ""}`.trim();
    }
    return null;
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
            Dashboard Overview
          </h1>
          <p className="text-muted mt-2">
            {getFullName() ? (
              <>
                Welcome back, <strong>{getFullName()}</strong>! Here's what's
                happening with your application.
              </>
            ) : (
              <>Welcome back! Here's what's happening with your application.</>
            )}
          </p>
        </div>

        {/* Quick Action Button */}
        {(!application ||
          (!application.isSubmitted && application.status !== "submitted")) && (
          <button
            onClick={handleStart}
            className="btn btn-primary btn-lg shadow-sm"
            style={{
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              border: "none",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <FaRocket className="me-2" />
            {application ? "Continue Application" : "Start Application"}
            <FaArrowRight className="ms-2" />
          </button>
        )}
      </div>

      {/* Application Status Card */}
      <div
        className="card border-0 shadow-sm mb-4 animate-slide-up"
        style={{ borderRadius: "1rem", overflow: "hidden" }}
      >
        <div className="card-body p-4">
          {!application ? (
            <div className="text-center py-4">
              <div className="mb-4">
                <div
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                  style={{ width: "80px", height: "80px" }}
                >
                  <FaFileAlt size={40} className="text-muted" />
                </div>
              </div>
              <h3 className="fw-bold mb-3">No Application Yet</h3>
              <p className="text-muted mb-4">
                Start your application to begin the admission process. It only
                takes a few minutes!
              </p>
              <button
                onClick={handleStart}
                className="btn btn-primary px-4 py-2"
                style={{
                  borderRadius: "0.75rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                }}
              >
                <FaRocket className="me-2" />
                Start Your Journey
              </button>
            </div>
          ) : (
            <div>
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="fw-bold mb-2">Application Status</h3>
                  <div className="d-flex align-items-center gap-3 flex-wrap">
                    <span
                      className={`badge bg-${getStatusColor(application.status)} px-3 py-2 rounded-pill`}
                    >
                      {getStatusIcon(application.status)}{" "}
                      <span className="ms-1">
                        {application.status?.toUpperCase() || "DRAFT"}
                      </span>
                    </span>
                    {application.isSubmitted && (
                      <span className="badge bg-success px-3 py-2 rounded-pill">
                        <FaCheckCircle className="me-1" /> Submitted
                      </span>
                    )}
                    <span className="text-muted">
                      <FaClock className="me-1" />
                      Created: {formatDate(application.createdAt)}
                    </span>
                  </div>
                </div>

                {!application.isSubmitted &&
                  application.status !== "submitted" && (
                    <button
                      onClick={() => navigate("/dashboard/application")}
                      className="btn btn-outline-primary px-4"
                      style={{ borderRadius: "0.75rem" }}
                    >
                      Continue Application <FaArrowRight className="ms-2" />
                    </button>
                  )}
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <small className="text-muted">
                    Application Progress (Step {application.step || 0}/5)
                  </small>
                  <small className="fw-semibold">{applicationProgress}%</small>
                </div>
                <div
                  className="progress"
                  style={{ height: "8px", borderRadius: "4px" }}
                >
                  <div
                    className="progress-bar bg-gradient"
                    style={{ width: `${applicationProgress}%` }}
                    role="progressbar"
                  />
                </div>
              </div>

              {/* Personal Info Summary */}
              {application.personalInfo && (
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <FaUser size={14} />
                      <span>
                        Name: <strong>{getFullName() || "Not provided"}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <FaCalendarAlt size={14} />
                      <span>
                        DOB:{" "}
                        <strong>
                          {application.personalInfo.dob
                            ? formatDate(application.personalInfo.dob)
                            : "Not provided"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {application.status === "submitted" && (
                <div
                  className="alert alert-success mt-3 d-flex align-items-center"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaCheckCircle size={20} className="me-2" />
                  <div>
                    <strong>Application Submitted Successfully!</strong>
                    <p className="mb-0 small">
                      Your application is being reviewed. We'll notify you once
                      there's an update.
                    </p>
                  </div>
                </div>
              )}

              {application.status === "approved" && (
                <div
                  className="alert alert-success mt-3 d-flex align-items-center"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <MdVerified size={20} className="me-2" />
                  <div>
                    <strong>Congratulations! You've been accepted! 🎉</strong>
                    <p className="mb-0 small">
                      Check your email for further instructions.
                    </p>
                  </div>
                </div>
              )}

              {application.status === "rejected" && (
                <div
                  className="alert alert-danger mt-3 d-flex align-items-center"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <FaExclamationTriangle size={20} className="me-2" />
                  <div>
                    <strong>Application Status Update</strong>
                    <p className="mb-0 small">
                      Your application has been reviewed. Please check your
                      email for more information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-4">
            <div
              className="card border-0 shadow-sm h-100 animate-slide-up"
              style={{
                borderRadius: "1rem",
                transition: "transform 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className={`bg-${stat.color} bg-opacity-10 rounded-3 p-3`}
                  >
                    <div
                      className={`text-${stat.color}`}
                      style={{ fontSize: "1.5rem" }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <h2 className="fw-bold mb-0">{stat.value}</h2>
                </div>
                <h6 className="fw-semibold mb-1">{stat.title}</h6>
                <p className="text-muted small mb-0">{stat.description}</p>

                {/* Progress bar for profile completion */}
                {stat.progress !== undefined && (
                  <div className="mt-3">
                    <div className="progress" style={{ height: "4px" }}>
                      <div
                        className={`progress-bar bg-${stat.color}`}
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="row g-4">
        <div className="col-md-7">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Application Summary</h5>
            </div>
            <div className="card-body p-4">
              {!application ? (
                <div className="text-center py-4">
                  <p className="text-muted">
                    No application data yet. Start your application!
                  </p>
                </div>
              ) : (
                <div className="vstack gap-3">
                  {/* Personal Information Section */}
                  {application.personalInfo && (
                    <div className="d-flex gap-3 p-3 bg-light rounded-3">
                      <FaUser className="text-primary mt-1" />
                      <div>
                        <h6 className="fw-semibold mb-2">
                          Personal Information
                        </h6>
                        <div className="row small">
                          <div className="col-6">
                            <span className="text-muted">Name:</span>{" "}
                            {getFullName() || "-"}
                          </div>
                          <div className="col-6">
                            <span className="text-muted">Gender:</span>{" "}
                            {application.personalInfo.gender || "-"}
                          </div>
                          <div className="col-12 mt-1">
                            <span className="text-muted">Phone:</span>{" "}
                            {application.personalInfo.phone || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Academic Information Section */}
                  {application.academicInfo && (
                    <div className="d-flex gap-3 p-3 bg-light rounded-3">
                      <FaBook className="text-info mt-1" />
                      <div className="flex-grow-1">
                        <h6 className="fw-semibold mb-2">
                          Academic Information
                        </h6>
                        <div className="row small">
                          <div className="col-12">
                            <span className="text-muted">
                              Secondary School:
                            </span>{" "}
                            {application.academicInfo.secondarySchool || "-"}
                          </div>
                          <div className="col-6 mt-1">
                            <span className="text-muted">Exam Type:</span>{" "}
                            {application.academicInfo.examType || "-"}
                          </div>
                          <div className="col-6 mt-1">
                            <span className="text-muted">Exam Year:</span>{" "}
                            {application.academicInfo.examYear || "-"}
                          </div>
                          {application.academicInfo.subjects?.length > 0 && (
                            <div className="col-12 mt-1">
                              <span className="text-muted">Subjects:</span>{" "}
                              {application.academicInfo.subjects.length}{" "}
                              subjects added
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Documents Section */}
                  {application.documents && (
                    <div className="d-flex gap-3 p-3 bg-light rounded-3">
                      <FaFilePdf className="text-danger mt-1" />
                      <div>
                        <h6 className="fw-semibold mb-2">Documents Uploaded</h6>
                        <div className="small">
                          {application.documents.passport && (
                            <div>✓ Passport Photo</div>
                          )}
                          {application.documents.result && (
                            <div>✓ Result Document</div>
                          )}
                          {!application.documents.passport &&
                            !application.documents.result && (
                              <div className="text-muted">
                                No documents uploaded yet
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <h5 className="fw-bold mb-0">Quick Links</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-grid gap-2">
                <button
                  onClick={() => navigate("/dashboard/application")}
                  className="btn btn-light text-start d-flex align-items-center gap-3 p-3 rounded-3"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <FaFileAlt className="text-primary" />
                  <div>
                    <small className="fw-semibold d-block">
                      Application Form
                    </small>
                    <small className="text-muted">
                      Fill or review your application
                    </small>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="btn btn-light text-start d-flex align-items-center gap-3 p-3 rounded-3"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <FaUserCheck className="text-info" />
                  <div>
                    <small className="fw-semibold d-block">
                      Student Profile
                    </small>
                    <small className="text-muted">
                      Update your personal information
                    </small>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/dashboard/progress")}
                  className="btn btn-light text-start d-flex align-items-center gap-3 p-3 rounded-3"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <FaChartLine className="text-success" />
                  <div>
                    <small className="fw-semibold d-block">
                      Track Progress
                    </small>
                    <small className="text-muted">
                      Monitor your application status
                    </small>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .bg-gradient {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .progress-bar {
          transition: width 0.6s ease;
        }

        .btn-light:hover {
          background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
          transform: translateX(5px);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .display-6 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Overview;
