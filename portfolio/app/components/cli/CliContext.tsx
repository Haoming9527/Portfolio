"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CliContextProps {
  isOpen: boolean;
  isMinimized: boolean;
  openCli: () => void;
  closeCli: () => void;
  toggleCli: () => void;
  setIsMinimized: (value: boolean) => void;
}

const CliContext = createContext<CliContextProps | undefined>(undefined);

export function CliProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const openCli = () => {
      setIsOpen(true);
      setIsMinimized(false);
  };
  
  const closeCli = () => setIsOpen(false);
  
  const toggleCli = () => {
      if (isOpen && isMinimized) {
          setIsMinimized(false);
      } else {
          setIsOpen((prev) => !prev);
          setIsMinimized(false); // Ensure unminimized when opening or closing
      }
  };

  return (
    <CliContext.Provider value={{ isOpen, isMinimized, openCli, closeCli, toggleCli, setIsMinimized }}>
      {children}
    </CliContext.Provider>
  );
}

export function useCli() {
  const context = useContext(CliContext);
  if (!context) {
    throw new Error("useCli must be used within a CliProvider");
  }
  return context;
}
