import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();
  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);
  if (!isAuthorized) {
    navigateTo("/");
  }

  // derive filtered jobs from API response
  const allJobs = jobs?.jobs || [];
  // unique categories and locations for selects
  const categories = Array.from(new Set(allJobs.map((j) => j.category).filter(Boolean)));
  const locations = Array.from(new Set(allJobs.map((j) => j.city || j.location || j.country).filter(Boolean)));

  const filtered = allJobs.filter((j) => {
    const q = query.trim().toLowerCase();
    if (q) {
      const matchesQuery = (j.title || "").toLowerCase().includes(q) || (j.companyName || "").toLowerCase().includes(q) || (j.category || "").toLowerCase().includes(q);
      if (!matchesQuery) return false;
    }
    if (category && j.category !== category) return false;
    const jobLoc = j.city || j.location || j.country || "";
    if (location && jobLoc !== location) return false;
    return true;
  });

  return (
    <section className="jobs page">
      <div className="container">
        <h1>Open roles</h1>
        <p className="lead">Find a job that suits your interests and skills — browse roles by company, category and location.</p>

        <div className="jobs-filters" aria-label="Job search filters">
          <input
            className="jobs-search"
            placeholder="Search by title, company or keyword"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select className="jobs-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select className="jobs-select" value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <button className="btn-clear" onClick={() => { setQuery(""); setCategory(""); setLocation(""); }} aria-label="Clear filters">Clear</button>
        </div>

        <div className="banner">
          {filtered.length === 0 && (
            <div className="empty-state">No roles match your filters.</div>
          )}
          {filtered.map((element) => {
            return (
              <div className="card" key={element._id}>
                <p>{element.title}</p>
                {element.companyName && (
                  <p>
                    <span className="badge company">{element.companyName}</span>
                  </p>
                )}
                <p>{element.category}</p>
                <p>{element.city || element.location || element.country}</p>
                <Link to={`/job/${element._id}`}>View details</Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
