import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { JOB_CATEGORIES } from "../../constants/jobCategories";
import { formatSalary } from "../../utils/salaryFormat";

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
  const requiredFilled = title && companyName && category && country && city && description && (salaryType === 'Fixed Salary' ? fixedSalary : (salaryType === 'Ranged Salary' ? salaryFrom && salaryTo : false));

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
      <div className="job_post page" role="main" aria-labelledby="post-job-heading">
        <div className="container">
          <header className="job_post_header">
            <h1 className="job_post_title" id="post-job-heading">Post a job</h1>
            <p className="job_post_subtitle">Share an opportunity in a clear, compelling way. Fill in the essentials below and publish instantly.</p>
            <div className="job_stepper">
              <div className="step"><span className="circle">1</span><span className="label">Basics</span></div>
              <div className="divider" />
              <div className="step"><span className="circle">2</span><span className="label">Comp & Location</span></div>
              <div className="divider" />
              <div className="step"><span className="circle">3</span><span className="label">Preview & Publish</span></div>
            </div>
            <div className="job_stats">
              <div className="stat_card">
                <p className="kpi">10</p>
                <p className="kpi_sub">k candidates</p>
              </div>
              <div className="stat_card">
                <p className="kpi">95</p>
                <p className="kpi_sub">profile completeness</p>
              </div>
              <div className="stat_card">
                <p className="kpi">2</p>
                <p className="kpi_sub">min to publish</p>
              </div>
            </div>
          </header>
          <div className="form_card elevate fade-in-up" aria-live="polite">
            <div className="form_layout">
            <form onSubmit={handleJobPost} role="form" aria-describedby="post-job-helper" autoComplete="off">
              <div className="wrapper">
                <div className="field">
                  <label>Job title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Engineer"
                  />
                  <span className="helper_text">Keep it concise and descriptive. Avoid abbreviations.</span>
                </div>
                <div className="field">
                  <label>Company name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Acme Inc."
                  />
                  <span className="helper_text">Your brand name as candidates will see it.</span>
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
                  <span className="helper_text">Remote, Hybrid, or On-site with address details.</span>
                </div>
              </div>

              <div className="salary_wrapper">
                <label>Salary</label>
                <div className="salary_toggle_group" role="group" aria-label="Select salary type">
                  <button type="button" aria-pressed={salaryType === 'Fixed Salary'} className={`toggle_btn ${salaryType === 'Fixed Salary' ? 'active' : ''}`} onClick={() => setSalaryType('Fixed Salary')}>Fixed</button>
                  <button type="button" aria-pressed={salaryType === 'Ranged Salary'} className={`toggle_btn ${salaryType === 'Ranged Salary' ? 'active' : ''}`} onClick={() => setSalaryType('Ranged Salary')}>Range</button>
                </div>
                <div className="salary_inputs">
                  {salaryType === 'Fixed Salary' && (
                    <div className="lpa_input">
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g., 12"
                        value={fixedSalary}
                        onChange={(e) => setFixedSalary(e.target.value)}
                      />
                      <span className="suffix">LPA</span>
                    </div>
                  )}
                  {salaryType === 'Ranged Salary' && (
                    <div className="range_group">
                      <div className="lpa_input">
                        <input
                          type="number"
                          min="0"
                          placeholder="From"
                          value={salaryFrom}
                          onChange={(e) => setSalaryFrom(e.target.value)}
                        />
                        <span className="suffix">LPA</span>
                      </div>
                      <div className="lpa_input">
                        <input
                          type="number"
                          min="0"
                          placeholder="To"
                          value={salaryTo}
                          onChange={(e) => setSalaryTo(e.target.value)}
                        />
                        <span className="suffix">LPA</span>
                      </div>
                    </div>
                  )}
                  {salaryType === 'default' && <p className="helper_text warn">Select salary type to continue *</p>}
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
                <span className="helper_text">Tip: Mention tech stack, experience level and perks.</span>
              </div>

              <div className="submit_row">
                <button type="submit" className="job_post_btn" disabled={!requiredFilled} aria-disabled={!requiredFilled}>
                  Post job
                </button>
              </div>
              {!requiredFilled && (
                <p className="disabled_hint" id="post-job-helper">
                  Fill all required fields and choose a salary type to enable posting.
                </p>
              )}
            </form>

            {/* Live preview */}
            <aside className="job_preview">
              <div className="job_preview_head">
                <h4>Preview</h4>
                <p className="muted">This is how your job will appear to candidates.</p>
              </div>
              <div className="job_preview_card">
                <div className="job_preview_title">{title || "Your Job Title"}</div>
                <div className="job_preview_meta">
                  {companyName && <span className="company_chip">{companyName}</span>}
                  {(city || country) && <span className="muted">{city || country}</span>}
                </div>
                {category && <div className="pill mt-2" title={category}>{category}</div>}
                <div className="job_preview_salary">{formatSalary({ fixedSalary: Number(fixedSalary), salaryFrom: Number(salaryFrom), salaryTo: Number(salaryTo) })}</div>
                <div className="job_preview_desc">{description || "Write a concise overview of responsibilities, requirements and benefits."}</div>
              </div>
            </aside>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostJob;
