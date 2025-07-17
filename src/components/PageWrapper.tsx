// src/components/PageWrapper.tsx
import React from "react";

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-hospital-light text-hospital-dark p-6 space-y-6">
    {children}
  </div>
);

export default PageWrapper;
