// pages/admin/Students.jsx
import { useEffect, useState } from "react";
import API from "../../api/Auth";
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaGraduationCap,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaBuilding,
  FaUserGraduate,
  FaDownload,
  FaPrint,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
} from "react-icons/fa";
import { MdVerified, MdSchool, MdEmail } from "react-icons/md";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await API.get("/admin/students");
        setStudents(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Get unique departments for filter
  const departments = [
    "all",
    ...new Set(students.map((s) => s.department).filter(Boolean)),
  ];

  // Filter students based on search and department
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.user?.fullName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "all" || student.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ color: "#667eea", width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading students data...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem" }}
        >
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <FaUsers size={40} className="text-danger" />
              </div>
            </div>
            <h3 className="fw-bold mb-3">Error Loading Students</h3>
            <p className="text-muted mb-0">{error}</p>
          </div>
        </div>
      </div>
    );
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
            Students Management
          </h1>
          <p className="text-muted mt-2">
            Manage and view all registered students
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "0.5rem" }}
            onClick={() => window.print()}
          >
            <FaPrint className="me-1" size={14} /> Print
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            style={{ borderRadius: "0.5rem" }}
          >
            <FaDownload className="me-1" size={14} /> Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-white mb-1">Total Students</p>
                  <h2 className="text-white fw-bold mb-0">{students.length}</h2>
                </div>
                <div className="bg-white bg-opacity-20 rounded-3 p-3">
                  <FaUsers size={30} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-white mb-1">Departments</p>
                  <h2 className="text-white fw-bold mb-0">
                    {departments.length - 1}
                  </h2>
                </div>
                <div className="bg-white bg-opacity-20 rounded-3 p-3">
                  <FaBuilding size={30} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-white mb-1">Recent Admissions</p>
                  <h2 className="text-white fw-bold mb-0">
                    {
                      students.filter(
                        (s) =>
                          new Date(s.admittedAt).getMonth() ===
                          new Date().getMonth(),
                      ).length
                    }
                  </h2>
                </div>
                <div className="bg-white bg-opacity-20 rounded-3 p-3">
                  <FaUserGraduate size={30} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: "1rem",
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
            }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-white mb-1">Active Students</p>
                  <h2 className="text-white fw-bold mb-0">{students.length}</h2>
                </div>
                <div className="bg-white bg-opacity-20 rounded-3 p-3">
                  <MdVerified size={30} className="text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "1rem" }}
      >
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="position-relative">
                <FaSearch
                  className="position-absolute text-muted"
                  style={{ top: "12px", left: "12px" }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by matric number, name, or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ paddingLeft: "40px", borderRadius: "0.5rem" }}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex gap-2">
                <div className="position-relative flex-grow-1">
                  <FaFilter
                    className="position-absolute text-muted"
                    style={{ top: "12px", left: "12px" }}
                  />
                  <select
                    className="form-select"
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{ paddingLeft: "40px", borderRadius: "0.5rem" }}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem" }}
        >
          <div className="card-body p-4 p-md-5 text-center">
            <div className="mb-4">
              <div
                className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "80px", height: "80px" }}
              >
                <FaUsers size={40} className="text-muted" />
              </div>
            </div>
            <h3 className="fw-bold mb-3">No Students Found</h3>
            <p className="text-muted mb-0">
              {searchTerm || selectedDepartment !== "all"
                ? "No students match your search criteria"
                : "No students have been admitted yet"}
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light">
                  <tr>
                    <th
                      className="border-0 p-3"
                      style={{ borderTopLeftRadius: "1rem" }}
                    >
                      <FaIdCard className="me-2 text-muted" size={14} /> Matric
                      No
                    </th>
                    <th className="border-0 p-3">
                      <FaUserGraduate className="me-2 text-muted" size={14} />{" "}
                      Name
                    </th>
                    <th className="border-0 p-3">
                      <MdEmail className="me-2 text-muted" size={14} /> Email
                    </th>
                    <th className="border-0 p-3">
                      <MdSchool className="me-2 text-muted" size={14} />{" "}
                      Department
                    </th>
                    <th className="border-0 p-3">
                      <FaCalendarAlt className="me-2 text-muted" size={14} />{" "}
                      Admitted At
                    </th>
                    <th
                      className="border-0 p-3"
                      style={{ borderTopRightRadius: "1rem" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr key={student._id} className="border-top">
                      <td className="p-3">
                        <span className="fw-semibold text-primary">
                          {student.matricNumber || "N/A"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-gradient rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              background:
                                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            }}
                          >
                            <span className="text-white fw-semibold small">
                              {student.user?.fullName?.charAt(0) || "S"}
                            </span>
                          </div>
                          <span className="fw-semibold">
                            {student.user?.fullName || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="d-flex align-items-center gap-2">
                          <FaEnvelope size={12} className="text-muted" />
                          <span>{student.user?.email || "N/A"}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                          {student.department || "N/A"}
                        </span>
                      </td>
                      <td className="p-3">
                        <small className="text-muted">
                          {student.admittedAt
                            ? new Date(student.admittedAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "N/A"}
                        </small>
                      </td>
                      <td className="p-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          style={{ borderRadius: "0.5rem" }}
                          onClick={() => {
                            /* View student details */
                          }}
                        >
                          <FaEye size={12} className="me-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted small">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </div>
              <nav>
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      style={{ borderRadius: "0.5rem", marginRight: "5px" }}
                    >
                      <FaChevronLeft size={12} />
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <li
                          key={pageNumber}
                          className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => paginate(pageNumber)}
                            style={{
                              borderRadius: "0.5rem",
                              marginRight: "5px",
                              background:
                                currentPage === pageNumber
                                  ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                                  : "transparent",
                              borderColor:
                                currentPage === pageNumber
                                  ? "transparent"
                                  : "#dee2e6",
                              color:
                                currentPage === pageNumber
                                  ? "white"
                                  : "#667eea",
                            }}
                          >
                            {pageNumber}
                          </button>
                        </li>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 &&
                        currentPage < totalPages - 2)
                    ) {
                      return (
                        <li key={pageNumber} className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      );
                    }
                    return null;
                  })}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      style={{ borderRadius: "0.5rem" }}
                    >
                      <FaChevronRight size={12} />
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}

      {/* Custom CSS */}
      <style>{`
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
          animation: fadeIn 0.5s ease-out;
        }

        .table > :not(caption) > * > * {
          padding: 1rem;
          vertical-align: middle;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(102, 126, 234, 0.05);
          cursor: pointer;
        }

        .page-link {
          color: #667eea;
          border: none;
          padding: 0.5rem 0.75rem;
          transition: all 0.3s ease;
        }

        .page-link:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
        }

        .page-item.active .page-link {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
        }

        .form-control:focus,
        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        .btn-outline-primary {
          border-color: #667eea;
          color: #667eea;
        }

        .btn-outline-primary:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: transparent;
          color: white;
        }

        @media print {
          .btn,
          .d-flex.gap-2,
          .row.g-4.mb-4,
          .card-body .row,
          nav {
            display: none !important;
          }
          .card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Students;
