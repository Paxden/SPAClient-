/* eslint-disable react-refresh/only-export-components */
// context/ApplicationContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

const AppContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchApplication = async () => {
    try {
      const res = await API.get("/application/me");
      setApplication(res.data);
    } catch (err) {
      console.error("Error fetching application:", err);
      setApplication(null); // no application yet
    } finally {
      setLoading(false);
    }
  };

  const startApp = async () => {
    const res = await API.post("/application/start");
    setApplication(res.data);
  };

  const updateStep = async (step, data) => {
    const res = await API.put(`/application/step/${step}`, data);
    setApplication(res.data);
  };

  const submitApp = async () => {
    const res = await API.post("/application/submit");
    setApplication(res.data.app); // 🔥 important
  };

  useEffect(() => {
    fetchApplication();
  }, []);

  return (
    <AppContext.Provider
      value={{
        application,
        loading,
        startApp,
        updateStep,
        submitApp,
        fetchApplication,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApplication = () => useContext(AppContext);
