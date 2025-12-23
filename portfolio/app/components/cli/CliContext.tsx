"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface CliContextProps {
  isOpen: boolean;
  openCli: () => void;
  closeCli: () => void;
  toggleCli: () => void;
}

const CliContext = createContext<CliContextProps | undefined>(undefined);

export function CliProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCli = () => setIsOpen(true);
  const closeCli = () => setIsOpen(false);
  const toggleCli = () => setIsOpen((prev) => !prev);

  return (
    <CliContext.Provider value={{ isOpen, openCli, closeCli, toggleCli }}>
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
