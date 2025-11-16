import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import AuthLayout from "./AuthLayout";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    if(!name || !email || !password || !phone || !role){
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  if(isAuthorized){
    return <Navigate to={'/'}/>
  }


  return (
    <section className="auth-template signup-frame">
      <div className="auth-tpl-left">
        <div className="signup-card">
          <div className="auth-form-head">
            <h2>Smart Hire Hub</h2>
            <p>Create your account to discover roles, apply confidently, or hire top talent.</p>
          </div>
          <form onSubmit={handleRegister} className="template-form">
            <div className="tpl-field">
              <label className="tpl-label">Register As</label>
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
              <label className="tpl-label">Name</label>
              <div className="tpl-input-wrap">
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tpl-input"
                />
                <FaPencilAlt />
              </div>
            </div>
            <div className="tpl-field">
              <label className="tpl-label">Email Address</label>
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
              <label className="tpl-label">Phone Number</label>
              <div className="tpl-input-wrap">
                <input
                  type="number"
                  placeholder="e.g., 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="tpl-input"
                />
                <FaPhoneFlip />
              </div>
            </div>
            <div className="tpl-field">
              <label className="tpl-label">Password</label>
              <div className="tpl-input-wrap">
                <input
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="tpl-input"
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" disabled={loading} className="tpl-btn tpl-primary">
              {loading ? 'Creating…' : 'Sign Up'}
            </button>
            <p className="tpl-alt">Already have an account? <Link to="/login">Log in</Link></p>
          </form>
        </div>
      </div>
      <div className="auth-tpl-right">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop"
          alt="register"
        />
      </div>
    </section>
  );
};

export default Register;
