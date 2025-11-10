import React from "react";
import { motion } from "framer-motion";
import { Building2, Briefcase } from "lucide-react";
// Generic icon used for all companies to avoid brand-icon import issues
const iconMap = {
  default: <Building2 size={26} className="text-teal-700" />,
};

const PopularCompanies = () => {
  // Localized list: Indian companies only (sample data)
  const companies = [
    { id: 1, title: "TCS", location: "Mumbai", openPositions: 42 },
    { id: 2, title: "Infosys", location: "Bengaluru", openPositions: 36 },
    { id: 3, title: "Wipro", location: "Bengaluru", openPositions: 28 },
    { id: 4, title: "HCLTech", location: "Noida", openPositions: 24 },
    { id: 5, title: "Reliance Jio", location: "Mumbai", openPositions: 31 },
    { id: 6, title: "Flipkart", location: "Bengaluru", openPositions: 18 },
    { id: 7, title: "Paytm", location: "Noida", openPositions: 15 },
    { id: 8, title: "Zomato", location: "Gurugram", openPositions: 12 },
    { id: 9, title: "Ola", location: "Bengaluru", openPositions: 10 },
    { id: 10, title: "BYJU'S", location: "Bengaluru", openPositions: 9 },
    { id: 11, title: "PhonePe", location: "Bengaluru", openPositions: 14 },
    { id: 12, title: "Zoho", location: "Chennai", openPositions: 20 },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05 } }),
  };
  // Show exactly 5 companies in one view (first five from the list)
  const current = companies.slice(0, 5);
  return (
    <section className="companies py-4">
      <div className="container">
        <h3 className="text-center text-3xl font-extrabold tracking-tight mb-2">TOP COMPANIES IN INDIA</h3>
        <p className="text-center text-slate-500 mb-8">Discover leading Indian employers actively hiring across major tech hubs.</p>
        <div className="banner">
          {current.map((c, i) => (
            <motion.div
              key={c.id}
              className="card relative overflow-hidden group flex flex-col justify-between h-[220px] transition-shadow duration-300 hover:shadow-xl hover:shadow-teal-500/20"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={i}
              whileHover={{ y: -6 }}
            >
              {/* top gradient bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500" />
              {/* subtle shine */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -top-1/4 -left-1/4 w-[160%] h-[160%] rotate-12 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" />
              </div>
              <div className="flex items-start gap-4 mt-4 px-4">
                <div className="shrink-0 p-2 rounded-md bg-teal-50 ring-1 ring-teal-100 shadow-sm">
                  {iconMap.default}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-slate-900 tracking-tight mb-1 break-words">{c.title}</p>
                  <p className="text-sm font-medium text-slate-500 flex items-center gap-1"><Briefcase size={14} className="text-teal-600" /> {c.location}</p>
                </div>
              </div>
              <div className="px-4 mt-4">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-teal-50 text-teal-800 font-semibold text-sm h-12 tracking-wide ring-1 ring-teal-100 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
                  aria-label={`View open positions at ${c.title}`}
                >
                  Open Positions
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCompanies;
