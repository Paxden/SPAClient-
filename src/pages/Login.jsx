import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  FaSignInAlt,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaGoogle,
  FaGithub,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await login(form);

    const user = res?.user; // 👈 important

    if (user?.role === "admin") {
      navigate("/admin/applications");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Login failed. Please check your credentials."
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
                    <FaSignInAlt
                      size={48}
                      className="mb-3"
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
                    Welcome Back
                  </h2>
                  <p className="text-muted">
                    Sign in to continue to your account
                  </p>
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
                  {/* Email Input */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <MdEmail className="me-2" size={14} />
                      Email Address
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-end-0 bg-light"
                        style={{ borderRadius: "0.75rem 0 0 0.75rem" }}
                      >
                        <FaEnvelope className="text-muted" />
                      </span>
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
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  {/* Password Input with Show/Hide */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <FaLock className="me-2" size={14} />
                      Password
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text border-end-0 bg-light"
                        style={{ borderRadius: "0.75rem 0 0 0.75rem" }}
                      >
                        <FaLock className="text-muted" />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
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
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-light border"
                        style={{ borderRadius: "0.75rem", marginLeft: "-1px" }}
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-end mb-4">
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none small"
                      style={{
                        color: "#667eea",
                        transition: "color 0.3s ease",
                      }}
                    >
                      Forgot Password?
                    </Link>
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
                        Signing in...
                      </span>
                    ) : (
                      <span>
                        Sign In <FaArrowRight className="ms-2" />
                      </span>
                    )}
                  </button>

                  {/* Signup Link */}
                  <div className="text-center">
                    <p className="text-muted mb-0">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-decoration-none fw-semibold"
                        style={{
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          transition: "opacity 0.3s ease",
                        }}
                      >
                        Create Account
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
