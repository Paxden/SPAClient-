// pages/dashboard/steps/Step5.jsx
import { useApplication } from "../../../context/ApplicationContext";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaHome,
  FaFileAlt,
  FaSpinner,
  FaBell,
  FaCalendarCheck,
  FaUserCheck,
} from "react-icons/fa";
import { MdVerified, MdPending } from "react-icons/md";
import { useState, useEffect } from "react";

const Step5 = () => {
  const { application } = useApplication();
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState({});

  // Estimate review time (3-5 business days)
  useEffect(() => {
    const createdDate = new Date(application?.createdAt);
    const estimatedDate = new Date(createdDate);
    estimatedDate.setDate(createdDate.getDate() + 5);

    const today = new Date();
    const daysLeft = Math.ceil((estimatedDate - today) / (1000 * 60 * 60 * 24));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeRemaining({
      estimated: estimatedDate,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
    });
  }, [application]);

  const getStatusIcon = () => {
    switch (application?.status) {
      case "approved":
        return <MdVerified size={60} className="text-success" />;
      case "rejected":
        return <FaBell size={60} className="text-danger" />;
      default:
        return <MdPending size={60} className="text-warning" />;
    }
  };

  const getStatusMessage = () => {
    switch (application?.status) {
      case "approved":
        return {
          title: "Application Approved! 🎉",
          message: "Congratulations! Your application has been approved.",
          color: "success",
        };
      case "rejected":
        return {
          title: "Application Update",
          message:
            "Your application has been reviewed. Please check your email for details.",
          color: "danger",
        };
      default:
        return {
          title: "Application Under Review",
          message:
            "Your application is being carefully reviewed by our admissions team.",
          color: "warning",
        };
    }
  };

  const status = getStatusMessage();

  return (
    <div className="animate-fade-in">
      <div
        className="card border-0 shadow-lg"
        style={{ borderRadius: "1.5rem", overflow: "hidden" }}
      >
        {/* Header with gradient */}
        <div
          className={`bg-${status.color} bg-opacity-10 p-4 p-md-5 text-center`}
        >
          <div className="mb-4">{getStatusIcon()}</div>
          <h2
            className="fw-bold mb-2"
            style={{
              background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {status.title}
          </h2>
          <p className="text-muted mb-0">
            Application ID:{" "}
            <strong>{application?._id?.slice(-8).toUpperCase()}</strong>
          </p>
        </div>

        <div className="card-body p-4 p-md-5">
          {/* Main Message */}
          <div className="text-center mb-5">
            <p className="lead mb-3">{status.message}</p>
            {application?.status !== "approved" &&
              application?.status !== "rejected" && (
                <div className="d-flex align-items-center justify-content-center gap-2 text-muted">
                  <FaSpinner className="fa-spin" />
                  <small>Estimated review time: 3-5 business days</small>
                </div>
              )}
          </div>

          {/* Timeline / Progress Steps */}
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <div className="text-center">
                <div
                  className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaCheckCircle className="text-success" size={24} />
                </div>
                <h6 className="fw-semibold mb-1">Application Submitted</h6>
                <small className="text-muted">
                  {new Date(application?.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="text-center">
                <div
                  className={`bg-${application?.status === "approved" ? "success" : "warning"} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3`}
                  style={{ width: "50px", height: "50px" }}
                >
                  {application?.status === "approved" ? (
                    <FaUserCheck className="text-success" size={24} />
                  ) : (
                    <FaClock className="text-warning" size={24} />
                  )}
                </div>
                <h6 className="fw-semibold mb-1">Under Review</h6>
                <small className="text-muted">
                  {application?.status === "approved"
                    ? "Completed"
                    : "In Progress"}
                </small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="text-center">
                <div
                  className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaEnvelope className="text-info" size={24} />
                </div>
                <h6 className="fw-semibold mb-1">Decision Notification</h6>
                <small className="text-muted">Via Email</small>
              </div>
            </div>

            <div className="col-md-3">
              <div className="text-center">
                <div
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: "50px", height: "50px" }}
                >
                  <FaCalendarCheck className="text-primary" size={24} />
                </div>
                <h6 className="fw-semibold mb-1">Final Decision</h6>
                <small className="text-muted">
                  {timeRemaining.estimated
                    ? `Est. ${timeRemaining.estimated.toLocaleDateString()}`
                    : "Awaiting decision"}
                </small>
              </div>
            </div>
          </div>

          {/* What happens next section */}
          {application?.status !== "approved" &&
            application?.status !== "rejected" && (
              <>
                <div className="bg-light rounded-3 p-4 mb-4">
                  <h5 className="fw-bold mb-3">What happens next?</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="d-flex gap-3">
                        <div className="text-primary">
                          <FaClock size={20} />
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">Review Process</h6>
                          <small className="text-muted">
                            Our admissions team will review your application
                            within 3-5 business days
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex gap-3">
                        <div className="text-primary">
                          <FaEnvelope size={20} />
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">
                            Email Notification
                          </h6>
                          <small className="text-muted">
                            You'll receive an email once a decision has been
                            made
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex gap-3">
                        <div className="text-primary">
                          <FaFileAlt size={20} />
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">
                            Document Verification
                          </h6>
                          <small className="text-muted">
                            Your documents will be verified for authenticity
                          </small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="d-flex gap-3">
                        <div className="text-primary">
                          <FaUserCheck size={20} />
                        </div>
                        <div>
                          <h6 className="fw-semibold mb-1">Final Decision</h6>
                          <small className="text-muted">
                            You'll be notified of the admission decision
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimated timeline bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <small className="text-muted">Review Progress</small>
                    <small className="text-muted">Estimated completion</small>
                  </div>
                  <div
                    className="progress"
                    style={{ height: "8px", borderRadius: "4px" }}
                  >
                    <div
                      className="progress-bar bg-gradient progress-bar-striped progress-bar-animated"
                      style={{ width: "60%" }}
                      role="progressbar"
                    />
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small className="text-muted">Application Received</small>
                    <small className="text-success">Review in Progress</small>
                    <small className="text-muted">Decision</small>
                  </div>
                </div>
              </>
            )}

          {/* Action Buttons */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary px-4 py-2"
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
              <FaHome className="me-2" />
              Go to Dashboard
            </button>

            <button
              onClick={() => window.location.reload()}
              className="btn btn-outline-secondary px-4 py-2"
              style={{ borderRadius: "0.75rem" }}
            >
              <FaSpinner className="me-2" />
              Check Status
            </button>
          </div>

          {/* Support Contact */}
          <div className="text-center mt-4 pt-3 border-top">
            <small className="text-muted">
              Have questions? Contact our admissions office at{" "}
              <a
                href="mailto:admissions@university.edu"
                className="text-decoration-none"
              >
                admissions@university.edu
              </a>
            </small>
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
          animation: fadeIn 0.6s ease-out;
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

        .progress-bar-animated {
          animation: progress-bar-stripes 1s linear infinite;
        }

        @keyframes progress-bar-stripes {
          0% {
            background-position: 1rem 0;
          }
          100% {
            background-position: 0 0;
          }
        }

        .bg-gradient {
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </div>
  );
};

export default Step5;
