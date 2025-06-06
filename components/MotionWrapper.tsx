// app/components/MotionWrapper.tsx
'use client'; // This directive makes this file and anything it imports a Client Component

import { motion } from "framer-motion";
import React from "react"; // You need React imported for JSX

interface MotionWrapperProps {
  children: React.ReactNode;
  className?: string; // Optional: to pass the class name
}

export function MotionWrapper({ children, className }: MotionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className} // Apply the class name here
    >
      {children}
    </motion.div>
  );
}