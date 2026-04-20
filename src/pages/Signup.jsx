import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaGoogle,
  FaGithub,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
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
            {/* Card with animation */}
            <div
              className="card border-0 shadow-lg animate-slide-up"
              style={{
                borderRadius: "1.5rem",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="animate-bounce">
                    <FaUserPlus
                      size={48}
                      className="text-primary mb-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    />
                  </div>
                  <h2
                    className="fw-bold"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Create Account
                  </h2>
                  <p className="text-muted">Join us and start your journey</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div
                    className="alert alert-danger animate-shake"
                    role="alert"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  {/* Full Name Input */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <FaUser className="me-2" size={14} />
                      Full Name
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control border-start-0 bg-light"
                        style={{
                          borderRadius: "0 0.75rem 0.75rem 0",
                          padding: "0.75rem",
                        }}
                        placeholder="John Doe"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <MdEmail className="me-2" size={14} />
                      Email Address
                    </label>
                    <div className="input-group">
                      <input
                        type="email"
                        className="form-control border-start-0 bg-light"
                        style={{
                          borderRadius: "0 0.75rem 0.75rem 0",
                          padding: "0.75rem",
                        }}
                        placeholder="hello@example.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <FaLock className="me-2" size={14} />
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type="password"
                        className="form-control border-start-0 bg-light"
                        style={{
                          borderRadius: "0 0.75rem 0.75rem 0",
                          padding: "0.75rem",
                        }}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                        disabled={loading}
                        minLength={6}
                      />
                    </div>
                    <small className="text-muted">
                      Password must be at least 6 characters
                    </small>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3 position-relative overflow-hidden"
                    style={{
                      borderRadius: "0.75rem",
                      padding: "0.75rem",
                      fontWeight: "bold",
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      border: "none",
                      transition: "transform 0.3s ease",
                    }}
                    disabled={loading}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {loading ? (
                      <span>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating account...
                      </span>
                    ) : (
                      <span>
                        Sign Up <FaArrowRight className="ms-2" />
                      </span>
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-decoration-none fw-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
