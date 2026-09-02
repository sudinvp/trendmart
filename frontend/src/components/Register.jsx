import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../Context/AuthContext";

const Register = () => {
  const { register, authError } = useContext(AuthContext);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
    adminCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await register(form);
    setSubmitting(false);
    if (success) navigate("/");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Account Type</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="USER">User (browse &amp; shop)</option>
              <option value="ADMIN">Admin (manage products)</option>
            </select>
          </div>
          {form.role === "ADMIN" && (
            <div className="mb-3">
              <label className="form-label">Admin Code</label>
              <input
                name="adminCode"
                type="password"
                className="form-control"
                value={form.adminCode}
                onChange={handleChange}
                placeholder="Required for admin accounts"
              />
            </div>
          )}
          {authError && (
            <div className="alert alert-danger py-2">{String(authError)}</div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
