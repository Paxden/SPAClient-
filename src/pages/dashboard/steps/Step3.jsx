// pages/dashboard/steps/Step3.jsx
import { useState } from "react";
import { useApplication } from "../../../context/ApplicationContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaGraduationCap,
  FaBookOpen,
  FaStar,
  FaCheckCircle,
  FaUniversity,
} from "react-icons/fa";
import {
  MdOutlineSchool,
  MdScience,
  MdComputer,
  MdBusiness,
  MdEngineering,
} from "react-icons/md";

const Step3 = ({ next, back, saving }) => {
  const { updateStep, application } = useApplication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [form, setForm] = useState({
    firstChoice: application?.programChoice?.firstChoice || "",
    secondChoice: application?.programChoice?.secondChoice || "",
  });

  // Available programs (you can fetch these from an API)
  const availablePrograms = [
    {
      id: 1,
      name: "Computer Science",
      category: "Engineering",
      icon: <MdComputer />,
      duration: "4 years",
    },
    {
      id: 2,
      name: "Software Engineering",
      category: "Engineering",
      icon: <MdComputer />,
      duration: "4 years",
    },
    {
      id: 3,
      name: "Information Technology",
      category: "Engineering",
      icon: <MdComputer />,
      duration: "4 years",
    },
    {
      id: 4,
      name: "Business Administration",
      category: "Business",
      icon: <MdBusiness />,
      duration: "3 years",
    },
    {
      id: 5,
      name: "Accounting",
      category: "Business",
      icon: <MdBusiness />,
      duration: "3 years",
    },
    {
      id: 6,
      name: "Economics",
      category: "Social Sciences",
      icon: <MdScience />,
      duration: "3 years",
    },
    {
      id: 7,
      name: "Mechanical Engineering",
      category: "Engineering",
      icon: <MdEngineering />,
      duration: "5 years",
    },
    {
      id: 8,
      name: "Civil Engineering",
      category: "Engineering",
      icon: <MdEngineering />,
      duration: "5 years",
    },
    {
      id: 9,
      name: "Electrical Engineering",
      category: "Engineering",
      icon: <MdEngineering />,
      duration: "5 years",
    },
    {
      id: 10,
      name: "Medicine",
      category: "Medical Sciences",
      icon: <MdScience />,
      duration: "6 years",
    },
    {
      id: 11,
      name: "Law",
      category: "Law",
      icon: <FaBookOpen />,
      duration: "5 years",
    },
    {
      id: 12,
      name: "Mass Communication",
      category: "Arts",
      icon: <FaBookOpen />,
      duration: "3 years",
    },
  ];

  const validateForm = () => {
    const errors = {};
    if (!form.firstChoice)
      errors.firstChoice = "Please select your first choice program";
    if (form.firstChoice === form.secondChoice && form.secondChoice) {
      errors.secondChoice = "Second choice must be different from first choice";
    }
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateStep(3, form);
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

  const getProgramDetails = (programName) => {
    return availablePrograms.find((p) => p.name === programName);
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
              <div className="bg-success bg-opacity-10 rounded-3 p-2">
                <FaGraduationCap className="text-success" size={20} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">Program Selection</h4>
                <small className="text-muted">
                  Choose your desired course of study
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

            {/* Info Alert */}
            <div
              className="alert alert-info mb-4 d-flex align-items-center"
              style={{ borderRadius: "0.75rem" }}
            >
              <FaUniversity className="me-2" size={18} />
              <div>
                <small className="fw-semibold">Program Information</small>
                <small className="d-block">
                  Select your preferred programs. Your first choice is your
                  primary application.
                </small>
              </div>
            </div>

            <div className="row g-4">
              {/* First Choice */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <FaStar className="me-2 text-warning" size={14} />
                  First Choice Program <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-lg ${error.firstChoice ? "is-invalid" : ""}`}
                  value={form.firstChoice}
                  onChange={(e) => handleChange("firstChoice", e.target.value)}
                  disabled={loading || saving}
                  style={{ borderRadius: "0.75rem", padding: "0.75rem" }}
                >
                  <option value="">Select your first choice program</option>
                  {availablePrograms.map((program) => (
                    <option key={program.id} value={program.name}>
                      {program.name} - {program.duration} ({program.category})
                    </option>
                  ))}
                </select>
                {error.firstChoice && (
                  <small className="text-danger">{error.firstChoice}</small>
                )}

                {/* Selected Program Details */}
                {form.firstChoice && (
                  <div className="mt-3 p-3 bg-light rounded-3 d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2">
                      <FaCheckCircle className="text-success" size={20} />
                    </div>
                    <div>
                      <small className="text-muted">Selected Program</small>
                      <p className="fw-semibold mb-0">{form.firstChoice}</p>
                      {getProgramDetails(form.firstChoice) && (
                        <small className="text-muted">
                          Duration:{" "}
                          {getProgramDetails(form.firstChoice).duration} |
                          Category:{" "}
                          {getProgramDetails(form.firstChoice).category}
                        </small>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Second Choice (Optional) */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <FaBookOpen className="me-2" size={14} />
                  Second Choice Program{" "}
                  <span className="text-muted">(Optional)</span>
                </label>
                <select
                  className={`form-select form-select-lg ${error.secondChoice ? "is-invalid" : ""}`}
                  value={form.secondChoice}
                  onChange={(e) => handleChange("secondChoice", e.target.value)}
                  disabled={loading || saving}
                  style={{ borderRadius: "0.75rem", padding: "0.75rem" }}
                >
                  <option value="">
                    Select your second choice program (optional)
                  </option>
                  {availablePrograms
                    .filter((p) => p.name !== form.firstChoice)
                    .map((program) => (
                      <option key={program.id} value={program.name}>
                        {program.name} - {program.duration} ({program.category})
                      </option>
                    ))}
                </select>
                {error.secondChoice && (
                  <small className="text-danger">{error.secondChoice}</small>
                )}
                {form.secondChoice && (
                  <small className="text-muted d-block mt-2">
                    <FaCheckCircle className="text-success me-1" size={12} />
                    Backup program selected
                  </small>
                )}
              </div>

              {/* Program Categories Overview */}
              <div className="col-12 mt-3">
                <label className="form-label fw-semibold mb-3">
                  Program Categories
                </label>
                <div className="row g-2">
                  {[...new Set(availablePrograms.map((p) => p.category))].map(
                    (category) => (
                      <div key={category} className="col-6 col-md-3">
                        <div className="bg-light rounded-3 p-2 text-center">
                          <small className="text-muted d-block">
                            {category}
                          </small>
                          <small className="fw-semibold">
                            {
                              availablePrograms.filter(
                                (p) => p.category === category,
                              ).length
                            }{" "}
                            programs
                          </small>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card-footer bg-white border-0 pb-4 px-4">
            <div className="d-flex justify-content-between gap-3">
              <button
                type="button"
                onClick={back}
                className="btn btn-outline-secondary px-4 py-2"
                style={{ borderRadius: "0.75rem", transition: "all 0.3s ease" }}
                disabled={loading || saving}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateX(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateX(0)")
                }
              >
                <FaArrowLeft className="me-2" />
                Back
              </button>

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

        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
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

        .form-select-lg {
          font-size: 1rem;
        }

        .bg-light {
          transition: all 0.3s ease;
        }

        .bg-light:hover {
          background-color: #e9ecef !important;
        }
      `}</style>
    </div>
  );
};

export default Step3;
