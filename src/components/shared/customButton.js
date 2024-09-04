import React from "react";

const Button = ({ children, className, ...props }) => (
  <button className={`px-3 py-1.5 rounded text-sm ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
