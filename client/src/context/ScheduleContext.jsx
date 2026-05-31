import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ScheduleContext = createContext(null);
const storageKey = 'conference-connect-schedule';

export function ScheduleProvider({ children }) {
  const [scheduleIds, setScheduleIds] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      localStorage.removeItem(storageKey);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(scheduleIds));
  }, [scheduleIds]);

  function addSession(sessionId) {
    setScheduleIds((current) => current.includes(sessionId) ? current : [...current, sessionId]);
  }

  function removeSession(sessionId) {
    setScheduleIds((current) => current.filter((id) => id !== sessionId));
  }

  const value = useMemo(() => ({ scheduleIds, addSession, removeSession }), [scheduleIds]);

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
