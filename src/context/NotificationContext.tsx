'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Snackbar from '../components/Snackbar';

// Define the shape of the context
interface NotificationContextProps {
  snackbar: (message: string, severity?: "error" | "warning" | "info" | "success") => void;
}

// Create the context with a default value
export const NotificationContext = createContext<NotificationContextProps>({
  snackbar: () => {},
});

export const useNotificationContext = () => useContext(NotificationContext);

interface NotificationContextProviderProps {
  children: ReactNode;
}

export function NotificationContextProvider({ children }: NotificationContextProviderProps): JSX.Element {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "warning" | "info" | "success">("info");

  const snackbar = (
    message: string,
    severity: "error" | "warning" | "info" | "success" = "error"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
    
    // Auto-hide the Snackbar after 3 seconds
    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ snackbar }}>
      {children}
      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => {setShowSnackbar(false)}}
        />
      )}
    </NotificationContext.Provider>
  );
}
