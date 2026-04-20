// pages/dashboard/Application.jsx
import { useApplication } from "../../context/ApplicationContext";
import { useEffect, useState } from "react";
import ProgressBar from "../../components/ProgressBar";
import { useNavigate } from "react-router-dom";
import {
  FaSpinner,
  FaRocket,
  FaFileAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSave,
  FaCheckCircle,
} from "react-icons/fa";

import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5"; // Import Step5

const Application = () => {
  const { application, startApp, loading, updateStep, submitApp } =
    useApplication();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  useEffect(() => {
    if (application?.step) {
      setStep(application.step);
    }
  }, [application]);

  const handleStart = async () => {
    try {
      setError("");
      await startApp();
    } catch (err) {
      setError("Failed to start application. Please try again.");
      console.error(err);
    }
  };

  const handleNext = async (stepData) => {
    setSaving(true);
    setError("");
    try {
      await updateStep(step, stepData);
      setStep(step + 1);
    } catch (err) {
      setError("Failed to save your progress. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      await submitApp();
      setStep(5); // Move to step 5 after submission
    } catch (err) {
      setError("Failed to submit application. Please try again.");
      console.error(err);
    } finally {
      setSaving(false);
    }
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
          <h5 className="text-muted">Loading your application...</h5>
        </div>
      </div>
    );
  }

  // If no application yet
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
                style={{ width: "100px", height: "100px" }}
              >
                <FaFileAlt size={50} className="text-muted" />
              </div>
            </div>
            <h2
              className="fw-bold mb-3"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              No Application Found
            </h2>
            <p className="text-muted mb-4">
              You haven't started your application yet. Click the button below
              to begin your admission journey.
            </p>
            {error && (
              <div
                className="alert alert-danger mb-3"
                style={{ borderRadius: "0.75rem" }}
              >
                {error}
              </div>
            )}
            <button
              onClick={handleStart}
              className="btn btn-primary btn-lg px-5"
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
              Start Your Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If application is submitted or in review, show Step5
  if (
    application.isSubmitted ||
    application.status === "submitted" ||
    step === 5
  ) {
    return <Step5 />;
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
            Application Form
          </h1>
          <p className="text-muted mt-2">
            Complete your application to join our institution
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
            <FaFileAlt className="me-1" /> Step {step} of 4
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar step={step} />

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-danger animate-shake mt-3"
          style={{ borderRadius: "0.75rem" }}
        >
          {error}
        </div>
      )}

      {/* Saving Indicator */}
      {saving && (
        <div className="position-fixed bottom-0 end-0 m-3 z-3">
          <div className="bg-white shadow-lg rounded-3 px-4 py-2 d-flex align-items-center gap-2">
            <FaSpinner className="fa-spin text-primary" />
            <small className="text-muted">Saving your progress...</small>
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="mt-4">
        {step === 1 && (
          <Step1 next={(data) => handleNext(data)} saving={saving} />
        )}
        {step === 2 && (
          <Step2
            next={(data) => handleNext(data)}
            back={handleBack}
            saving={saving}
          />
        )}
        {step === 3 && (
          <Step3
            next={(data) => handleNext(data)}
            back={handleBack}
            saving={saving}
          />
        )}
        {step === 4 && (
          <Step4 back={handleBack} onSubmit={handleSubmit} saving={saving} />
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

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
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
      `}</style>
    </div>
  );
};

export default Application;
