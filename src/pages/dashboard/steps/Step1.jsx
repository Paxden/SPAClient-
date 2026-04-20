// pages/dashboard/steps/Step1.jsx
import { useState } from "react";
import { useApplication } from "../../../context/ApplicationContext";
import {
  FaUser,
  FaUserCircle,
  FaPhone,
  FaCalendarAlt,
  FaVenusMars,
  FaHome,
  FaSave,
  FaArrowRight,
  FaSpinner,
} from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";

const Step1 = ({ next, saving }) => {
  const { updateStep, application } = useApplication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [form, setForm] = useState({
    firstName: application?.personalInfo?.firstName || "",
    lastName: application?.personalInfo?.lastName || "",
    dob: application?.personalInfo?.dob
      ? application.personalInfo.dob.split("T")[0]
      : "",
    gender: application?.personalInfo?.gender || "",
    phone: application?.personalInfo?.phone || "",
    address: application?.personalInfo?.address || "",
  });

  const validateForm = () => {
    const errors = {};
    if (!form.firstName.trim()) errors.firstName = "First name is required";
    if (!form.lastName.trim()) errors.lastName = "Last name is required";
    if (!form.dob) errors.dob = "Date of birth is required";
    if (!form.gender) errors.gender = "Gender is required";
    if (!form.phone.trim()) errors.phone = "Phone number is required";
    if (!form.phone.match(/^[0-9]{10,15}$/))
      errors.phone = "Please enter a valid phone number";
    if (!form.address.trim()) errors.address = "Address is required";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateStep(1, form);
      next();
    } catch (err) {
        console.error(err);
      setError({ submit: "Failed to save. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (error[field]) {
      setError({ ...error, [field]: "" });
    }
  };

  return (
    <div className="animate-slide-up">
      <form onSubmit={handleSubmit}>
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          <div className="card-header bg-white border-0 pt-4 px-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 rounded-3 p-2">
                <FaUser className="text-primary" size={20} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">Personal Information</h4>
                <small className="text-muted">
                  Please provide your personal details
                </small>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {/* Error Alert */}
            {error.submit && (
              <div
                className="alert alert-danger mb-4"
                style={{ borderRadius: "0.75rem" }}
              >
                {error.submit}
              </div>
            )}

            <div className="row g-4">
              {/* First Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaUserCircle className="me-2" size={14} />
                  First Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaUser className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${error.firstName ? "is-invalid" : ""}`}
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    placeholder="Enter your first name"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
                {error.firstName && (
                  <small className="text-danger">{error.firstName}</small>
                )}
              </div>

              {/* Last Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaUserCircle className="me-2" size={14} />
                  Last Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaUser className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${error.lastName ? "is-invalid" : ""}`}
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    placeholder="Enter your last name"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
                {error.lastName && (
                  <small className="text-danger">{error.lastName}</small>
                )}
              </div>

              {/* Date of Birth */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaCalendarAlt className="me-2" size={14} />
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaCalendarAlt className="text-muted" />
                  </span>
                  <input
                    type="date"
                    className={`form-control ${error.dob ? "is-invalid" : ""}`}
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    value={form.dob}
                    onChange={(e) => handleChange("dob", e.target.value)}
                    disabled={loading || saving}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {error.dob && (
                  <small className="text-danger">{error.dob}</small>
                )}
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaVenusMars className="me-2" size={14} />
                  Gender <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="male"
                      name="gender"
                      value="Male"
                      checked={form.gender === "Male"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      disabled={loading || saving}
                    />
                    <label className="form-check-label" htmlFor="male">
                      Male
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="female"
                      name="gender"
                      value="Female"
                      checked={form.gender === "Female"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      disabled={loading || saving}
                    />
                    <label className="form-check-label" htmlFor="female">
                      Female
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="other"
                      name="gender"
                      value="Other"
                      checked={form.gender === "Other"}
                      onChange={(e) => handleChange("gender", e.target.value)}
                      disabled={loading || saving}
                    />
                    <label className="form-check-label" htmlFor="other">
                      Other
                    </label>
                  </div>
                </div>
                {error.gender && (
                  <small className="text-danger d-block">{error.gender}</small>
                )}
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaPhone className="me-2" size={14} />
                  Phone Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaPhone className="text-muted" />
                  </span>
                  <input
                    type="tel"
                    className={`form-control ${error.phone ? "is-invalid" : ""}`}
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    placeholder="e.g., 08012345678"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
                {error.phone && (
                  <small className="text-danger">{error.phone}</small>
                )}
                <small className="text-muted">
                  Enter a valid phone number (10-15 digits)
                </small>
              </div>

              {/* Email (Read-only from auth) */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <MdEmail className="me-2" size={14} />
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <MdEmail className="text-muted" />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light"
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    value={application?.user?.email || "student@example.com"}
                    disabled
                    readOnly
                  />
                </div>
                <small className="text-muted">
                  Email is linked to your account
                </small>
              </div>

              {/* Address */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <MdLocationOn className="me-2" size={14} />
                  Address <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaHome className="text-muted" />
                  </span>
                  <textarea
                    className={`form-control ${error.address ? "is-invalid" : ""}`}
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    rows="3"
                    placeholder="Enter your full address"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
                {error.address && (
                  <small className="text-danger">{error.address}</small>
                )}
              </div>
            </div>
          </div>

          <div className="card-footer bg-white border-0 pb-4 px-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-muted small">
                <span className="text-danger">*</span> Required fields
              </div>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                style={{
                  borderRadius: "0.75rem",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  transition: "transform 0.3s ease",
                  minWidth: "160px",
                }}
                disabled={loading || saving}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                {loading || saving ? (
                  <>
                    <FaSpinner className="fa-spin me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <FaArrowRight className="ms-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

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

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        .form-control:focus,
        .form-check-input:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #667eea;
        }

        .form-check-input:checked {
          background-color: #667eea;
          border-color: #667eea;
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

        textarea {
          resize: vertical;
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Step1;
