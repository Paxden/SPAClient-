// pages/dashboard/steps/Step2.jsx
import { useState } from "react";
import { useApplication } from "../../../context/ApplicationContext";
import { 
  FaSchool, 
  FaBook, 
  FaCalendarAlt, 
  FaPlus, 
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaGraduationCap,
  FaChartLine
} from "react-icons/fa";
import { MdAddCircle, MdDeleteOutline } from "react-icons/md";

const Step2 = ({ next, back, saving }) => {
  const { updateStep, application } = useApplication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const [form, setForm] = useState({
    secondarySchool: application?.academicInfo?.secondarySchool || "",
    examType: application?.academicInfo?.examType || "WAEC",
    examYear: application?.academicInfo?.examYear || "",
    subjects: application?.academicInfo?.subjects || [
      { name: "", grade: "" }
    ],
  });

  const examTypes = ["WAEC", "NECO", "IGCSE", "SSCE", "GCE", "Other"];
  const grades = ["A1", "B2", "B3", "C4", "C5", "C6", "D7", "E8", "F9"];

  const validateForm = () => {
    const errors = {};
    if (!form.secondarySchool.trim()) errors.secondarySchool = "Secondary school name is required";
    if (!form.examType) errors.examType = "Exam type is required";
    if (!form.examYear) errors.examYear = "Exam year is required";
    if (form.examYear && (form.examYear < 1990 || form.examYear > new Date().getFullYear())) {
      errors.examYear = "Please enter a valid year (1990-current)";
    }
    
    // Validate subjects
    const subjectErrors = [];
    form.subjects.forEach((subject, index) => {
      if (!subject.name.trim()) subjectErrors[index] = { ...subjectErrors[index], name: "Subject name required" };
      if (!subject.grade) subjectErrors[index] = { ...subjectErrors[index], grade: "Grade required" };
    });
    if (subjectErrors.length > 0) errors.subjects = subjectErrors;
    
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Filter out empty subjects
      const filteredSubjects = form.subjects.filter(s => s.name.trim() !== "");
      await updateStep(2, {
        ...form,
        subjects: filteredSubjects
      });
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

  const addSubject = () => {
    setForm({
      ...form,
      subjects: [...form.subjects, { name: "", grade: "" }]
    });
  };

  const removeSubject = (index) => {
    const newSubjects = form.subjects.filter((_, i) => i !== index);
    setForm({ ...form, subjects: newSubjects.length ? newSubjects : [{ name: "", grade: "" }] });
  };

  const updateSubject = (index, field, value) => {
    const newSubjects = [...form.subjects];
    newSubjects[index][field] = value;
    setForm({ ...form, subjects: newSubjects });
    
    // Clear subject errors
    if (error.subjects?.[index]?.[field]) {
      const newSubjectErrors = [...(error.subjects || [])];
      newSubjectErrors[index] = { ...newSubjectErrors[index], [field]: "" };
      setError({ ...error, subjects: newSubjectErrors });
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);

  return (
    <div className="animate-slide-up">
      <form onSubmit={handleSubmit}>
        <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem", overflow: "hidden" }}>
          <div className="card-header bg-white border-0 pt-4 px-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-info bg-opacity-10 rounded-3 p-2">
                <FaGraduationCap className="text-info" size={20} />
              </div>
              <div>
                <h4 className="fw-bold mb-0">Academic Information</h4>
                <small className="text-muted">Tell us about your educational background</small>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {/* Error Alert */}
            {error.submit && (
              <div className="alert alert-danger mb-4" style={{ borderRadius: "0.75rem" }}>
                {error.submit}
              </div>
            )}

            <div className="row g-4">
              {/* Secondary School */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  <FaSchool className="me-2" size={14} />
                  Secondary School / High School <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaSchool className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${error.secondarySchool ? 'is-invalid' : ''}`}
                    style={{ borderRadius: "0 0.5rem 0.5rem 0" }}
                    placeholder="e.g., ABC Secondary School"
                    value={form.secondarySchool}
                    onChange={(e) => handleChange("secondarySchool", e.target.value)}
                    disabled={loading || saving}
                  />
                </div>
                {error.secondarySchool && (
                  <small className="text-danger">{error.secondarySchool}</small>
                )}
              </div>

              {/* Exam Type and Year */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaBook className="me-2" size={14} />
                  Examination Type <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${error.examType ? 'is-invalid' : ''}`}
                  value={form.examType}
                  onChange={(e) => handleChange("examType", e.target.value)}
                  disabled={loading || saving}
                  style={{ borderRadius: "0.5rem" }}
                >
                  {examTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {error.examType && (
                  <small className="text-danger">{error.examType}</small>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  <FaCalendarAlt className="me-2" size={14} />
                  Examination Year <span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select ${error.examYear ? 'is-invalid' : ''}`}
                  value={form.examYear}
                  onChange={(e) => handleChange("examYear", parseInt(e.target.value))}
                  disabled={loading || saving}
                  style={{ borderRadius: "0.5rem" }}
                >
                  <option value="">Select year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {error.examYear && (
                  <small className="text-danger">{error.examYear}</small>
                )}
              </div>

              {/* Subjects Section */}
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="form-label fw-semibold mb-0">
                    <FaChartLine className="me-2" size={14} />
                    Subjects & Grades <span className="text-danger">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="btn btn-sm btn-outline-primary"
                    style={{ borderRadius: "0.5rem" }}
                    disabled={loading || saving}
                  >
                    <FaPlus className="me-1" size={12} />
                    Add Subject
                  </button>
                </div>

                <div className="vstack gap-3">
                  {form.subjects.map((subject, index) => (
                    <div key={index} className="bg-light p-3 rounded-3 position-relative">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-semibold">Subject Name</label>
                          <input
                            type="text"
                            className={`form-control ${error.subjects?.[index]?.name ? 'is-invalid' : ''}`}
                            placeholder="e.g., Mathematics"
                            value={subject.name}
                            onChange={(e) => updateSubject(index, "name", e.target.value)}
                            disabled={loading || saving}
                          />
                          {error.subjects?.[index]?.name && (
                            <small className="text-danger">{error.subjects[index].name}</small>
                          )}
                        </div>
                        <div className="col-md-5">
                          <label className="form-label small fw-semibold">Grade</label>
                          <select
                            className={`form-select ${error.subjects?.[index]?.grade ? 'is-invalid' : ''}`}
                            value={subject.grade}
                            onChange={(e) => updateSubject(index, "grade", e.target.value)}
                            disabled={loading || saving}
                          >
                            <option value="">Select grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>{grade}</option>
                            ))}
                          </select>
                          {error.subjects?.[index]?.grade && (
                            <small className="text-danger">{error.subjects[index].grade}</small>
                          )}
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                          <button
                            type="button"
                            onClick={() => removeSubject(index)}
                            className="btn btn-outline-danger"
                            style={{ borderRadius: "0.5rem" }}
                            disabled={loading || saving || form.subjects.length === 1}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <small className="text-muted mt-2 d-block">
                  Add all subjects you sat for in your examination
                </small>
              </div>
            </div>
          </div>

          <div className="card-footer bg-white border-0 pb-4 px-4">
            <div className="d-flex justify-content-between gap-3">
              <button
                type="button"
                onClick={back}
                className="btn btn-outline-secondary px-4 py-2"
                style={{ borderRadius: "0.75rem" }}
                disabled={loading || saving}
              >
                <FaArrowLeft className="me-2" />
                Back
              </button>
              
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                style={{
                  borderRadius: "0.75rem",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  border: "none",
                  transition: "transform 0.3s ease",
                  minWidth: "160px"
                }}
                disabled={loading || saving}
                onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                {(loading || saving) ? (
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
        
        .form-control:focus, .form-select:focus {
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
        
        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default Step2;