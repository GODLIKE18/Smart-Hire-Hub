// Utility to format numeric salary values stored as LPA (Lakhs Per Annum)
// Accepts either fixedSalary or a range (salaryFrom, salaryTo). Assumes numbers represent whole LPA units.
// Examples: 10 -> "10 LPA", 6 to 10 -> "6 - 10 LPA"

export function formatSalary(job) {
  if (!job) return "Not disclosed";
  const { fixedSalary, salaryFrom, salaryTo } = job;
  if (typeof fixedSalary === 'number' && !Number.isNaN(fixedSalary)) {
    return `${fixedSalary} LPA`;
  }
  if ((typeof salaryFrom === 'number' && !Number.isNaN(salaryFrom)) || (typeof salaryTo === 'number' && !Number.isNaN(salaryTo))) {
    const from = (typeof salaryFrom === 'number' && !Number.isNaN(salaryFrom)) ? salaryFrom : salaryTo;
    const to = (typeof salaryTo === 'number' && !Number.isNaN(salaryTo)) ? salaryTo : salaryFrom;
    if (from === to) return `${from} LPA`;
    return `${from} - ${to} LPA`;
  }
  return "Not disclosed";
}
