import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import AuthLayout from "./AuthLayout"; // retained import though wrapper replaced for consistency (not used now)

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    if(!email || !password || !role){
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Login response", data);
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      console.error("Login error", error?.response || error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }

  return (
    <section className="auth-template login-frame">
      <div className="auth-tpl-left">
        <div className="login-card">
          <div className="auth-form-head">
            <h2>Smart Hire Hub</h2>
            <p>Access your hiring dashboard to post roles and track applicants.</p>
          </div>
          <form onSubmit={handleLogin} className="template-form">
            <div className="tpl-field">
              <label className="tpl-label">Login As</label>
              <div className="tpl-input-wrap">
                <select value={role} onChange={(e) => setRole(e.target.value)} className="tpl-input">
                  <option value="">Select Role</option>
                  <option value="Employer">Employer</option>
                  <option value="Job Seeker">Job Seeker</option>
                </select>
                <FaRegUser />
              </div>
            </div>
            <div className="tpl-field">
              <label className="tpl-label">Username</label>
              <div className="tpl-input-wrap">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tpl-input"
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="tpl-field">
              <label className="tpl-label">Password</label>
              <div className="tpl-input-wrap">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tpl-input"
                />
                <RiLock2Fill />
              </div>
            </div>
            <div className="tpl-row">
              <label className="remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span>Remember me</span>
              </label>
            </div>
            <button type="submit" disabled={loading} className="tpl-btn tpl-primary">
              {loading ? 'Logging in…' : 'Log In'}
            </button>
            <p className="tpl-alt">Don’t have an account? <Link to="/register">Sign up</Link></p>
          </form>
        </div>
      </div>
      <div className="auth-tpl-right">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop"
          alt="login"
        />
      </div>
    </section>
  );
};

export default Login;
