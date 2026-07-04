'use client';

import { createContext, useContext, useState, useRef, useEffect } from 'react';

const IP_LIMIT      = 25;
const SESSION_LIMIT = 6;
const SESSION_KEY   = 'folio_session_count';
const LINES_KEY     = 'folio_terminal_lines';
const HISTORY_KEY   = 'folio_terminal_history';

const TerminalContext = createContext(null);

export function TerminalProvider({ children }) {
  const [lines,       setLinesState]   = useState([]);
  const [history,     setHistoryState] = useState([]);
  const [connected,   setConnected]    = useState(null);
  const [ipRemaining, setIpRemaining]  = useState(null);
  const [sessionLeft, setSessionLeft]  = useState(SESSION_LIMIT);
  // null = not yet checked, true = had saved session, false = fresh
  const [restoreState, setRestoreState] = useState(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const savedLines   = sessionStorage.getItem(LINES_KEY);
        const savedHistory = sessionStorage.getItem(HISTORY_KEY);
        const sessionUsed  = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10);
        const parsedLines  = savedLines ? JSON.parse(savedLines) : [];

        if (parsedLines.length > 0) {
          setLinesState(parsedLines);
          bootedRef.current = true;
          setRestoreState(true);
        } else {
          setRestoreState(false);
        }

        if (savedHistory) setHistoryState(JSON.parse(savedHistory));
        setSessionLeft(Math.max(0, SESSION_LIMIT - sessionUsed));
      } catch {
        setRestoreState(false);
      }
    })();
  }, []);

  function setLines(val) {
    setLinesState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        const serialisable = next.map(({ onScroll, onDone, ...rest }) => rest);
        sessionStorage.setItem(LINES_KEY, JSON.stringify(serialisable));
      } catch {}
      return next;
    });
  }

  function setHistory(val) {
    setHistoryState(prev => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        sessionStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  return (
    <TerminalContext.Provider value={{
      lines, setLines,
      history, setHistory,
      connected, setConnected,
      ipRemaining, setIpRemaining,
      sessionLeft, setSessionLeft,
      bootedRef, restoreState,
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
