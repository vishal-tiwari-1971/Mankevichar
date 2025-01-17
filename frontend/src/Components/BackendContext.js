import React, { createContext, useContext } from "react";

// Create Context for backend URL
const BackendContext = createContext();

// Backend Provider to wrap the app and provide the backend URL
export const BackendProvider = ({ children }) => {
  const backendUrl = "https://mankevichar-preshiv-git-6d8d8a-vishal-tiwaris-projects-86797c2a.vercel.app";
  
  return (
    <BackendContext.Provider value={backendUrl}>
      {children}
    </BackendContext.Provider>
  );
};

// Custom Hook to use the backend URL in components
export const useBackendUrl = () => {
  return useContext(BackendContext);
};
