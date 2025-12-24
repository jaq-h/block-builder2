import { createContext, useContext } from "react";
import type { CardAssemblyContextType } from "./CardAssemblyTypes";

// Create context with null default
export const CardAssemblyContext =
  createContext<CardAssemblyContextType | null>(null);

// Hook to use the context
export function useCardAssembly(): CardAssemblyContextType {
  const context = useContext(CardAssemblyContext);
  if (!context) {
    throw new Error("useCardAssembly must be used within CardAssemblyProvider");
  }
  return context;
}
