// pages/dashboard/steps/Step4.jsx
import { useState, useRef } from "react";
import { useApplication } from "../../../context/ApplicationContext";
import {
  FaArrowLeft,
  FaSave,
  FaPaperPlane,
  FaSpinner,
  FaCloudUploadAlt,
  FaFilePdf,
  FaImage,
  FaCheckCircle,
  FaTrash,
  FaEye,
  FaFileAlt,
  FaIdCard,
} from "react-icons/fa";
import { MdDescription, MdPictureAsPdf } from "react-icons/md";

const Step4 = ({ back, saving }) => {
  const { updateStep, submitApp, application } = useApplication();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState({});

  const passportInputRef = useRef(null);
  const resultInputRef = useRef(null);
  const birthCertInputRef = useRef(null);

  const [form, setForm] = useState({
    passport: application?.documents?.passport || "",
    result: application?.documents?.result || "",
    birthCert: application?.documents?.birthCert || "",
  });

  const [previews, setPreviews] = useState({
    passport: application?.documents?.passport || null,
    result: application?.documents?.result || null,
    birthCert: application?.documents?.birthCert || null,
  });

  const validateForm = () => {
    const errors = {};
    if (!form.passport) errors.passport = "Passport photo is required";
    if (!form.result) errors.result = "Result document is required";
    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await updateStep(4, {
        passport: form.passport,
        result: form.result,
        birthCert: form.birthCert,
      });
      // Show success message (you can add a toast notification here)
    } catch (err) {
        console.error(err);
      setError({ submit: "Failed to save documents. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await submitApp();
      // Navigation will happen in the parent component
    } catch (err) {
        console.error(err);
      setError({ submit: "Failed to submit application. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Simulate file upload (replace with actual API call)
  const handleFileUpload = async (field, file) => {
    if (!file) return;

    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      // Create a fake URL (replace with actual upload endpoint)
      const fakeUrl = `uploads/${field}_${Date.now()}_${file.name}`;
      setForm({ ...form, [field]: fakeUrl });

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews({ ...previews, [field]: previewUrl });

      setUploading(false);

      // Clear error for this field
      if (error[field]) {
        setError({ ...error, [field]: "" });
      }
    }, 1500);
  };

  const handleFileChange = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError({ ...error, [field]: "File size must be less than 5MB" });
        return;
      }

      // Validate file type
      const allowedTypes =
        field === "passport"
          ? ["image/jpeg", "image/png", "image/jpg"]
          : ["application/pdf", "image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(file.type)) {
        setError({
          ...error,
          [field]:
            field === "passport"
              ? "Please upload a valid image (JPEG, PNG)"
              : "Please upload a PDF or image file",
        });
        return;
      }

      handleFileUpload(field, file);
    }
  };

  const removeFile = (field) => {
    setForm({ ...form, [field]: "" });
    setPreviews({ ...previews, [field]: null });

    // Clear the file input
    if (field === "passport" && passportInputRef.current)
      passportInputRef.current.value = "";
    if (field === "result" && resultInputRef.current)
      resultInputRef.current.value = "";
    if (field === "birthCert" && birthCertInputRef.current)
      birthCertInputRef.current.value = "";
  };

  const getFileIcon = (field) => {
    const value = form[field];
    if (!value) return <FaCloudUploadAlt size={40} className="text-muted" />;
    if (value.match(/\.(jpg|jpeg|png|gif)$/i))
      return <FaImage size={40} className="text-primary" />;
    if (value.match(/\.(pdf)$/i))
      return <FaFilePdf size={40} className="text-danger" />;
    return <FaFileAlt size={40} className="text-muted" />;
  };

  // 🔒 If already submitted
  if (application?.status === "submitted" || application?.isSubmitted) {
    return (
      <div className="animate-fade-in">
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem" }}
        >
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <FaCheckCircle size={40} className="text-success" />
              </div>
            </div>
            <h3 className="fw-bold mb-3 text-success">
              Application Submitted! 🎉
            </h3>
            <p className="text-muted mb-4">
              Your application has been successfully submitted and is under
              review. You will receive an email notification once a decision has
              been made.
            </p>
            <div className="bg-light rounded-3 p-3">
              <small className="text-muted">
                Application ID: {application?._id?.slice(-8) || "N/A"}
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "1rem", overflow: "hidden" }}
      >
        <div className="card-header bg-white border-0 pt-4 px-4">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-danger bg-opacity-10 rounded-3 p-2">
              <FaCloudUploadAlt className="text-danger" size={20} />
            </div>
            <div>
              <h4 className="fw-bold mb-0">Document Upload</h4>
              <small className="text-muted">
                Upload required documents for your application
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
            className="alert alert-info mb-4"
            style={{ borderRadius: "0.75rem" }}
          >
            <small className="d-block fw-semibold mb-2">
              Document Requirements:
            </small>
            <ul className="mb-0 small">
              <li>
                Passport photo must be a recent clear photo (JPEG or PNG format)
              </li>
              <li>
                Result document must be an official transcript or certificate
                (PDF or image)
              </li>
              <li>
                Birth certificate is optional but recommended (PDF or image)
              </li>
              <li>Maximum file size: 5MB per file</li>
            </ul>
          </div>

          <div className="row g-4">
            {/* Passport Upload */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <FaImage className="me-2 text-primary" size={14} />
                Passport Photograph <span className="text-danger">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-3 p-4 text-center ${error.passport ? "border-danger" : "border-secondary"}`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: "#f8f9fa",
                }}
                onClick={() => passportInputRef.current?.click()}
              >
                <input
                  ref={passportInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange("passport", e)}
                  className="d-none"
                  disabled={uploading || saving}
                />

                {uploading ? (
                  <div className="text-center">
                    <FaSpinner className="fa-spin mb-2" size={30} />
                    <p className="mb-0 small">Uploading...</p>
                  </div>
                ) : previews.passport ? (
                  <div className="position-relative">
                    <img
                      src={previews.passport}
                      alt="Passport preview"
                      className="rounded-3 mb-2"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("passport");
                      }}
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      style={{ borderRadius: "50%" }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    {getFileIcon("passport")}
                    <p className="mt-2 mb-1 fw-semibold">
                      Click to upload passport photo
                    </p>
                    <small className="text-muted">JPEG, PNG (max 5MB)</small>
                  </>
                )}
              </div>
              {error.passport && (
                <small className="text-danger d-block mt-1">
                  {error.passport}
                </small>
              )}
              {form.passport && !previews.passport && (
                <small className="text-success d-block mt-1">
                  <FaCheckCircle className="me-1" /> File uploaded:{" "}
                  {form.passport.split("/").pop()}
                </small>
              )}
            </div>

            {/* Result Upload */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <MdPictureAsPdf className="me-2 text-danger" size={14} />
                Result / Transcript <span className="text-danger">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-3 p-4 text-center ${error.result ? "border-danger" : "border-secondary"}`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: "#f8f9fa",
                }}
                onClick={() => resultInputRef.current?.click()}
              >
                <input
                  ref={resultInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange("result", e)}
                  className="d-none"
                  disabled={uploading || saving}
                />

                {uploading ? (
                  <div className="text-center">
                    <FaSpinner className="fa-spin mb-2" size={30} />
                    <p className="mb-0 small">Uploading...</p>
                  </div>
                ) : previews.result ? (
                  <div className="position-relative">
                    {previews.result.match(/\.(jpg|jpeg|png)$/i) ? (
                      <img
                        src={previews.result}
                        alt="Result preview"
                        className="rounded-3 mb-2"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "150px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <FaFilePdf size={40} className="text-danger mb-2" />
                        <p className="mb-1 small">PDF Document</p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("result");
                      }}
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      style={{ borderRadius: "50%" }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ) : (
                  <>
                    {getFileIcon("result")}
                    <p className="mt-2 mb-1 fw-semibold">
                      Click to upload result
                    </p>
                    <small className="text-muted">
                      PDF, JPEG, PNG (max 5MB)
                    </small>
                  </>
                )}
              </div>
              {error.result && (
                <small className="text-danger d-block mt-1">
                  {error.result}
                </small>
              )}
              {form.result && !previews.result && (
                <small className="text-success d-block mt-1">
                  <FaCheckCircle className="me-1" /> File uploaded:{" "}
                  {form.result.split("/").pop()}
                </small>
              )}
            </div>

            {/* Birth Certificate (Optional) */}
            <div className="col-12">
              <label className="form-label fw-semibold">
                <FaIdCard className="me-2 text-info" size={14} />
                Birth Certificate <span className="text-muted">(Optional)</span>
              </label>
              <div
                className="border-2 border-dashed rounded-3 p-4 text-center"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backgroundColor: "#f8f9fa",
                }}
                onClick={() => birthCertInputRef.current?.click()}
              >
                <input
                  ref={birthCertInputRef}
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/jpg"
                  onChange={(e) => handleFileChange("birthCert", e)}
                  className="d-none"
                  disabled={uploading || saving}
                />

                {uploading ? (
                  <div className="text-center">
                    <FaSpinner className="fa-spin mb-2" size={30} />
                    <p className="mb-0 small">Uploading...</p>
                  </div>
                ) : previews.birthCert ? (
                  <div className="position-relative d-inline-block">
                    {previews.birthCert.match(/\.(jpg|jpeg|png)$/i) ? (
                      <img
                        src={previews.birthCert}
                        alt="Birth cert preview"
                        className="rounded-3"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="text-center">
                        <FaFilePdf size={30} className="text-danger mb-1" />
                        <p className="mb-0 small">PDF Document</p>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile("birthCert");
                      }}
                      className="btn btn-danger btn-sm position-absolute top-0 end-0"
                      style={{
                        borderRadius: "50%",
                        transform: "translate(50%, -50%)",
                      }}
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ) : (
                  <>
                    {getFileIcon("birthCert")}
                    <p className="mt-2 mb-1 fw-semibold">
                      Click to upload birth certificate
                    </p>
                    <small className="text-muted">
                      PDF, JPEG, PNG (max 5MB) - Optional
                    </small>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-white border-0 pb-4 px-4">
          <div className="d-flex justify-content-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={back}
              className="btn btn-outline-secondary px-4 py-2"
              style={{ borderRadius: "0.75rem", transition: "all 0.3s ease" }}
              disabled={loading || saving}
            >
              <FaArrowLeft className="me-2" />
              Back
            </button>

            <div className="d-flex gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="btn btn-warning px-4 py-2"
                style={{ borderRadius: "0.75rem", transition: "all 0.3s ease" }}
                disabled={loading || saving || uploading}
              >
                {loading || saving ? (
                  <FaSpinner className="fa-spin me-2" />
                ) : (
                  <FaSave className="me-2" />
                )}
                Save Draft
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-success px-4 py-2"
                style={{
                  borderRadius: "0.75rem",
                  background:
                    "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                  border: "none",
                  transition: "transform 0.3s ease",
                  minWidth: "180px",
                }}
                disabled={loading || saving || uploading}
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="me-2" />
                    Submit Application
                  </>
                )}
              </button>
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

        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .border-dashed {
          border-style: dashed !important;
        }

        .border-2 {
          border-width: 2px !important;
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

        .btn-warning:hover {
          background-color: #e0a800;
          transform: translateY(-2px);
        }

        .btn-success:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Step4;
