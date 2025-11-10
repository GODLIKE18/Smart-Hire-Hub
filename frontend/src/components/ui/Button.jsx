import React from "react";

const VARIANTS = {
  primary:
    "bg-teal-600 hover:bg-teal-700 text-white border border-teal-700/30 shadow-sm",
  danger:
    "bg-red-600 hover:bg-red-700 text-white border border-red-700/30 shadow-sm",
  outline:
    "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-800 border border-transparent",
};

const SIZES = {
  sm: "px-3 py-2 text-sm rounded-md",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-5 py-3 text-base rounded-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed";
  const classes = `${base} ${VARIANTS[variant] || VARIANTS.primary} ${
    SIZES[size] || SIZES.md
  } ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
