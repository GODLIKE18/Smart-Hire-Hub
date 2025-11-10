import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { JOB_CATEGORIES } from "../../constants/jobCategories";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "Fixed Salary") {
      setSalaryFrom("");
      setSalaryFrom("");
    } else if (salaryType === "Ranged Salary") {
      setFixedSalary("");
    } else {
      setSalaryFrom("");
      setSalaryTo("");
      setFixedSalary("");
    }
    await axios
      .post(
        "http://localhost:4000/api/v1/job/post",
        fixedSalary.length >= 4
          ? {
              companyName,
              title,
              description,
              category,
              country,
              city,
              location,
              fixedSalary,
            }
          : {
              companyName,
              title,
              description,
              category,
              country,
              city,
              location,
              salaryFrom,
              salaryTo,
            },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setTitle("");
        setCompanyName("");
        setDescription("");
        setCategory("");
        setCountry("");
        setCity("");
        setLocation("");
        setSalaryFrom("");
        setSalaryTo("");
        setFixedSalary("");
        setSalaryType("default");
        navigateTo("/job/me");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  return (
    <>
      <div className="job_post page">
        <div className="container">
          <header className="job_post_header">
            <h1 className="job_post_title">Post a job</h1>
            <p className="job_post_subtitle">Share an opportunity in a clear, compelling way. Fill in the essentials below and publish instantly.</p>
          </header>
          <div className="form_card elevate fade-in-up">
            <form onSubmit={handleJobPost}>
              <div className="wrapper">
                <div className="field">
                  <label>Job title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Engineer"
                  />
                </div>
                <div className="field">
                  <label>Company name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Acme Inc."
                  />
                </div>
                <div className="field">
                  <label>Select Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {JOB_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="wrapper">
                <div className="field">
                  <label>Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., India"
                  />
                </div>
                <div className="field">
                  <label>City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Bengaluru"
                  />
                </div>
                <div className="field">
                  <label>Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Remote or On-site address"
                  />
                </div>
              </div>

              <div className="salary_wrapper">
                <label>Salary</label>
                <select
                  value={salaryType}
                  onChange={(e) => setSalaryType(e.target.value)}
                >
                  <option value="default">Select Salary Type</option>
                  <option value="Fixed Salary">Fixed Salary</option>
                  <option value="Ranged Salary">Ranged Salary</option>
                </select>
                <div>
                  {salaryType === "default" ? (
                    <p>Select salary type to continue *</p>
                  ) : salaryType === "Fixed Salary" ? (
                    <input
                      type="number"
                      placeholder="Fixed salary (total amount)"
                      value={fixedSalary}
                      onChange={(e) => setFixedSalary(e.target.value)}
                    />
                  ) : (
                    <div className="ranged_salary">
                      <input
                        type="number"
                        placeholder="Salary from"
                        value={salaryFrom}
                        onChange={(e) => setSalaryFrom(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Salary to"
                        value={salaryTo}
                        onChange={(e) => setSalaryTo(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="field">
                <label>Job description</label>
                <textarea
                  rows="8"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe responsibilities, requirements, and benefits"
                />
              </div>

              <div className="submit_row">
                <button type="submit" className="job_post_btn">Post job</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostJob;
