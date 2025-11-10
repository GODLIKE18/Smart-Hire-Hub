import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiUser3Line, RiMapPinLine } from "react-icons/ri";
import { FiPhone, FiUpload } from "react-icons/fi";
const Application = () => {
  // const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const [job, setJob] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);

  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setResume(null);
      return;
    }
    // Client-side validation to avoid huge uploads slowing UX
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a PDF, JPG, or PNG file.");
      event.target.value = "";
      return;
    }
    if (file.size > maxBytes) {
      toast.error("File is too large. Max 5MB.");
      event.target.value = "";
      return;
    }
    setResume(file);
  };

  const { id } = useParams();
  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        setJobLoading(true);
        const { data } = await axios.get(
          `http://localhost:4000/api/v1/job/${id}`,
          { withCredentials: true }
        );
        setJob(data.job);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load job details.";
        toast.error(msg);
        setJob(null);
      } finally {
        setJobLoading(false);
      }
    };
    fetchJob();
  }, [id]);
  // Load profile to prefill
  useEffect(() => {
    const prefillFromProfile = async () => {
      if (!isAuthorized || !user || user.role !== "Job Seeker") return;
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/profile/me",
          { withCredentials: true }
        );
        const profile = data?.profile;
        if (profile) {
          if (!name && user?.name) setName(user.name);
          if (!email && user?.email) setEmail(user.email);
          if (!phone && user?.phone) setPhone(String(user.phone));
          if (!address && profile.address) setAddress(profile.address);
          if (!coverLetter && profile.defaultCoverLetter)
            setCoverLetter(profile.defaultCoverLetter);
        } else {
          // fallback to user data only
          if (!name && user?.name) setName(user.name);
          if (!email && user?.email) setEmail(user.email);
          if (!phone && user?.phone) setPhone(String(user.phone));
        }
      } catch (err) {
        // ignore failure; user may not have profile yet
        if (!name && user?.name) setName(user.name);
        if (!email && user?.email) setEmail(user.email);
        if (!phone && user?.phone) setPhone(String(user.phone));
      }
    };
    prefillFromProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, user]);

  const handleApplication = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    // Basic client-side validation for nicer UX
    const nameOk = /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(name.trim());
    if (!nameOk) {
      toast.error("Please enter a valid full name.");
      return;
    }
    const phoneOk = /^\d{10}$/.test(phone.trim());
    if (!phoneOk) {
      toast.error("Please enter a 10-digit phone number.");
      return;
    }
    if (!resume) {
      toast.error("Please attach your resume before submitting.");
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);
    const formData = new FormData();
    // formData.append("title", title);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const controller = new AbortController();
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
          signal: controller.signal,
        }
      );
      // setTitle("");
  // Don't clear userEmail/name fully to encourage repeated quick applies
  setName(user?.name || "");
  setEmail(user?.email || "");
      setCoverLetter("");
  setPhone(user?.phone ? String(user.phone) : "");
  setAddress("");
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success(data.message);
      navigateTo("/job/getall", { replace: true });
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to submit application.";
      toast.error(msg);
    }
    finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };
  // Redirect safely (avoid navigating during render)
  useEffect(() => {
    if (isAuthorized === false) {
      navigateTo("/login");
      return;
    }
    if (isAuthorized === true && user && user.role === "Employer") {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  return (
    <section
      className="application relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-800 dark:to-slate-950 py-16"
    >
      {/* decorative glow to separate from navbar/footer */}
      <div className="pointer-events-none absolute inset-0 opacity-70 [mask-image:radial-gradient(60%_50%_at_50%_20%,#000_40%,transparent_80%)] bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.08),transparent_60%)]"></div>
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {jobLoading ? "Apply for this role" : job?.title || "Apply for this role"}
          </h3>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Tell us a bit about you and upload your resume. It only takes a minute.
          </p>
          {!jobLoading && job && (
            <div className="mt-3 flex items-center justify-center gap-4">
              <span className="badge company">{job.companyName}</span>
              <span className="text-sm text-slate-500">
                {job.category || "General"} • {job.city || job.location || "Remote"}
              </span>
            </div>
          )}
        </div>
        <form
          onSubmit={handleApplication}
          className="relative z-10 bg-white/90 dark:bg-slate-900/70 backdrop-blur rounded-2xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 p-6 sm:p-8 space-y-5"
        >
        {/* <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setName(e.target.value)}
          /> */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center h-12 rounded-lg border border-slate-300 bg-white/80 dark:bg-slate-800/60 px-3">
              <RiUser3Line className="mr-2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center h-12 rounded-lg border border-slate-300 bg-white/80 dark:bg-slate-800/60 px-3">
              <MdOutlineMailOutline className="mr-2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
            <div className="flex items-center h-12 rounded-lg border border-slate-300 bg-white/80 dark:bg-slate-800/60 px-3">
              <FiPhone className="mr-2 h-5 w-5 text-slate-400" />
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 dark:text-slate-100"
                maxLength={10}
              />
            </div>
            <div className="flex items-center h-12 rounded-lg border border-slate-300 bg-white/80 dark:bg-slate-800/60 px-3">
              <RiMapPinLine className="mr-2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="City, country (address)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <textarea
              placeholder="Cover letter (optional)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/60 focus:border-teal-500/60 bg-white/70 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Upload resume
            </label>
            <div className="flex items-center gap-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 bg-white/60 dark:bg-slate-800/40">
              <FiUpload className="h-5 w-5 text-slate-500 shrink-0" />
              <input
                type="file"
                accept=".pdf, .jpg, .png"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={isSubmitting}
                className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100"
              />
            </div>
          </div>
          {isSubmitting && (
            <div className="mt-2">
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-2 bg-teal-500 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">Uploading… {uploadProgress}%</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-medium shadow-md hover:shadow-lg hover:from-teal-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting…" : "Submit application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
