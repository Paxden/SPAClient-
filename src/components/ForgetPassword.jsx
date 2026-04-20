// ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowRight, FaUndo } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your password reset logic here
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div
              className="card border-0 shadow-lg animate-slide-up"
              style={{ borderRadius: "1.5rem" }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <FaUndo size={48} className="text-primary mb-3" />
                  <h2 className="fw-bold">Reset Password</h2>
                  <p className="text-muted">
                    {!submitted
                      ? "Enter your email to reset password"
                      : "Check your email for reset link"}
                  </p>
                </div>

                {!submitted ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="form-label fw-semibold">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="hello@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3"
                      style={{ borderRadius: "0.75rem", padding: "0.75rem" }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <>
                          Send Reset Link <FaArrowRight className="ms-2" />
                        </>
                      )}
                    </button>
                    <Link to="/login" className="text-decoration-none">
                      Back to Login
                    </Link>
                  </form>
                ) : (
                  <div className="text-center">
                    <div className="alert alert-success">
                      Password reset link sent to {email}
                    </div>
                    <Link to="/login" className="btn btn-primary">
                      Return to Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
