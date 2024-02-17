// LoadingSpinner.js
import React from "react";

const LoadingSpinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-3 "
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0012 20c4.418 0 8-3.582 8-8h-2c0 3.313-2.687 6-6 6-3.313 0-6-2.687-6-6H6c0 1.121.229 2.199.65 3.182z"
    ></path>
  </svg>
);

export default LoadingSpinner;
