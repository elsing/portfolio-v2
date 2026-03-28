'use client';

import { createContext, useContext, useState, useRef } from 'react';

const IP_LIMIT      = 25;
const SESSION_LIMIT = 6;
const SESSION_KEY   = 'folio_session_count';

const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [lines,       setLines]       = useState([]);
  const [history,     setHistory]     = useState([]);
  const [connected,   setConnected]   = useState(null);
  const [ipRemaining, setIpRemaining] = useState(null);
  const [sessionLeft, setSessionLeft] = useState(() =>
    typeof window === 'undefined'
      ? SESSION_LIMIT
      : Math.max(0, SESSION_LIMIT - parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10))
  );
  const booted = useRef(false);

  return (
    <TerminalContext.Provider value={{
      lines, setLines,
      history, setHistory,
      connected, setConnected,
      ipRemaining, setIpRemaining,
      sessionLeft, setSessionLeft,
      booted,
      IP_LIMIT, SESSION_LIMIT, SESSION_KEY,
    }}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider');
  return ctx;
}
