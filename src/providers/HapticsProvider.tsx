'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import Snackbar from '../components/Snackbar';

// Define the shape of the context
interface HapticsContextProps {
  snackbar: (message: string, severity?: "error" | "warning" | "info" | "success") => void;
}

// Create the context with a default value
export const HapticsContext = createContext<HapticsContextProps>({
  snackbar: () => {},
});

export const useHapticsContext = () => useContext(HapticsContext);

interface HapticsContextProviderProps {
  children: ReactNode;
}

export function HapticsContextProvider({ children }: HapticsContextProviderProps): JSX.Element {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("info");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const snackbar = (
    message: string,
    severity: "error" | "warning" | "info" | "success" = "error"
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
    
    timeoutRef.current = setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  return (
    <HapticsContext.Provider value={{ snackbar }}>
      {children}
      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => {setShowSnackbar(false)}}
        />
      )}
    </HapticsContext.Provider>
  );
}
