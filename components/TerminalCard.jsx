'use client';

import { useState, useRef, useEffect } from 'react';
import { useTerminal } from '@/components/TerminalContext';

const WARN_AT      = 3;
const BOOT_RETRIES = 4;
const BOOT_DELAY   = 2000;
const MAX_CHARS    = 200;
const CHAR_WARN_AT = 20;
const DECRYPT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

const SUGGESTIONS = [
  "type anything — ask about elliot's experience",
  "try: what is elliot like to work with?",
  "try: tell me about the homelab",
  "try: what has he built?",
  "try: is elliot the right fit for us?",
  "try: how do I get in touch with elliot?",
  "try: what does elliot actually do day to day?",
];

function RotatingHint({ onScroll }) {
  const [index,   setIndex]   = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(i => (i + 1) % SUGGESTIONS.length);
        setVisible(true);
        onScroll?.();
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="font-mono text-xs leading-7 pl-4 text-site-green italic transition-opacity duration-300"
      style={{ opacity: visible ? 0.75 : 0 }}
    >
      <span className="term-blink inline-block w-1.5 h-2.5 bg-site-green align-middle mr-1.5 not-italic" style={{ opacity: 0.7 }} />
      {SUGGESTIONS[index]}
    </div>
  );
}

function randomChar() {
  return DECRYPT_CHARS[Math.floor(Math.random() * DECRYPT_CHARS.length)];
}

function scrambleLine(text, revealedFraction) {
  if (!text) return text;
  const revealed = Math.floor(text.length * revealedFraction);
  return text.split('').map((ch, i) => {
    if (i < revealed) return ch;
    if (ch === ' ' || ch === '—' || ch === '·') return ch;
    return randomChar();
  }).join('');
}

function DisclaimerDecrypt({ text }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    const DURATION = 600;
    const FPS      = 30;
    const interval = 1000 / FPS;
    const steps    = DURATION / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const fraction = step / steps;
      setDisplayed(scrambleLine(text, fraction));
      if (step >= steps) {
        clearInterval(timer);
        setDisplayed(text);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className="font-mono text-xs leading-7 pl-4 text-site-muted opacity-50 italic">
      {displayed}
    </div>
  );
}

function Line({ line }) {
  if (line.type === 'gap')     return <div className="h-1" />;
  if (line.type === 'divider') return <div className="h-px bg-white/5 my-1.5" />;

  if (line.type === 'cmd') return (
    <div className="flex gap-2 font-mono text-xs leading-7 flex-wrap">
      <span className="text-site-green shrink-0">portfolio@prod-ai-01 ~</span>
      <span className="text-site-text">{line.text}</span>
    </div>
  );

  if (line.type === 'status') return (
    <div className="font-mono text-xs leading-7 pl-4 text-site-muted">
      {line.text}<span className="term-checking-dots" />
    </div>
  );

  if (line.type === 'typing') return (
    <TypewriterLine text={line.text} onScroll={line.onScroll} onDone={line.onDone} />
  );

  if (line.type === 'rotating') return null;

  if (line.type === 'disclaimer-decrypt') return (
    <DisclaimerDecrypt text={line.text} onDone={line.onDone} />
  );

  if (line.type === 'disclaimer') return (
    <div className={`font-mono text-xs leading-7 pl-4 italic ${line.short ? 'text-site-muted opacity-50' : 'text-site-red opacity-70'}`}>
      {line.text}
    </div>
  );

  if (line.type === 'hint') return (
    <div className="font-mono text-xs leading-7 pl-4 text-site-muted italic opacity-70">
      {line.text}
    </div>
  );

  const colour =
    line.type === 'err'       ? 'text-site-red'
    : line.type === 'warn'    ? 'text-site-amber'
    : line.type === 'success' ? 'text-site-green'
    : 'text-site-muted-hi';

  return (
    <div className={`font-mono text-xs leading-7 pl-4 ${colour}`}>
      {line.text}
    </div>
  );
}

function TypewriterLine({ text, colour = 'text-site-muted-hi', onDone, onScroll }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!text) { onDone?.(); return; }
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      onScroll?.();
      if (i >= text.length) {
        clearInterval(timer);
        onDone?.();
      }
    }, 18);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <div className={`font-mono text-xs leading-7 pl-4 ${colour}`}>
      {displayed}
      {displayed.length < text.length && (
        <span className="term-blink inline-block w-1.5 h-3 bg-current align-middle ml-px opacity-70" />
      )}
    </div>
  );
}

function FadeIn({ children, className = '' }) {
  return <div className={`term-fadein ${className}`}>{children}</div>;
}

export default function TerminalCard() {
  const {
    lines, setLines,
    history, setHistory,
    connected, setConnected,
    ipRemaining, setIpRemaining,
    sessionLeft, setSessionLeft,
    booted, restoreState,
    IP_LIMIT, SESSION_LIMIT, SESSION_KEY,
  } = useTerminal();

  const [mounted,       setMounted]       = useState(false);
  const [input,         setInput]         = useState('');
  const [loading,       setLoading]       = useState(false);
  const [decryptLines,  setDecryptLines]  = useState(null); // null = not decrypting

  const remaining = !mounted
    ? null
    : ipRemaining === null
    ? sessionLeft
    : Math.min(sessionLeft, ipRemaining);

  const outputRef    = useRef(null);
  const inputRef     = useRef(null);
  const cmdHistory   = useRef([]);
  const historyIndex = useRef(-1);

  // Restore cmd history from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('folio_cmd_history');
      if (saved) cmdHistory.current = JSON.parse(saved);
    } catch {}
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Auto-scroll on new lines
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Decrypt effect when returning to page or reloading with saved session
  useEffect(() => {
    if (restoreState !== true || lines.length === 0) return;

    // Re-check connection silently in background
    fetch('/api/terminal/health')
      .then(r => r.json())
      .then(d => setConnected(d.connected ?? false))
      .catch(() => setConnected(false));

    const DURATION = 600;
    const FPS      = 30;
    const interval = 1000 / FPS;
    const steps    = DURATION / interval;
    let   step     = 0;

    // Capture the real lines at start
    const realLines = lines;

    const timer = setInterval(() => {
      step++;
      const fraction = step / steps;

      setDecryptLines(
        realLines.map(line => {
          if (!line.text || line.type === 'gap' || line.type === 'divider' || line.type === 'status') return line;
          const type = line.type === 'typing' ? 'out' : line.type;
          return { ...line, type, text: scrambleLine(line.text, fraction) };
        })
      );

      if (step >= steps) {
        clearInterval(timer);
        setDecryptLines(null); // snap back to real lines
      }
    }, interval);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoreState]);

  // Boot sequence — only runs on fresh session (no saved state)
  useEffect(() => {
    if (restoreState !== false) return;
    if (booted.current) return;
    booted.current = true;

    async function boot() {
      setLines([
        { type: 'out',    text: 'folio-ai — singer.systems' },
        { type: 'status', text: 'checking connection' },
      ]);

      let remNum = IP_LIMIT;
      try {
        const remRes = await fetch('/api/terminal/remaining');
        const rem    = await remRes.json();
        remNum = rem.remaining ?? IP_LIMIT;
        setIpRemaining(remNum);
      } catch {}

      const sessionUsed        = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10);
      const sessLeft           = Math.max(0, SESSION_LIMIT - sessionUsed);
      const effectiveRemaining = Math.min(sessLeft, remNum);

      let ok = false;
      for (let attempt = 0; attempt < BOOT_RETRIES; attempt++) {
        try {
          const res  = await fetch('/api/terminal/health');
          const data = await res.json();
          ok = data.connected;
          if (ok) break;
        } catch {}
        if (attempt < BOOT_RETRIES - 1) {
          await new Promise(r => setTimeout(r, BOOT_DELAY));
        }
      }

      setConnected(ok);

      const statusLine = !ok
        ? { type: 'err',     text: 'disconnected — AI feature unavailable' }
        : effectiveRemaining === 0
        ? { type: 'warn',    text: 'rate limited — try again later in an hour or so' }
        : { type: 'success', text: 'connected to proxmox cluster' };

      const afterLines = [{ type: 'gap' }];

      if (ok && effectiveRemaining > 0) {
        afterLines.push({ type: 'rotating' });
        afterLines.push({ type: 'gap' });
        afterLines.push({ type: 'disclaimer', text: 'folio-ai is an AI and may occasionally get things wrong — always verify anything important.' });
      } else if (!ok) {
        afterLines.push({ type: 'warn', text: 'offline for now — check back soon.' });
      }

      setLines([
        { type: 'out', text: 'folio-ai — singer.systems' },
        statusLine,
        ...afterLines,
      ]);

      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    }

    boot().catch(() => {
      setConnected(false);
      setLines([
        { type: 'out', text: 'folio-ai — singer.systems'              },
        { type: 'err', text: 'disconnected — could not reach backend' },
      ]);
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    });
  }, [restoreState]);

  function append(newLines) {
    setLines(prev => [...prev, ...newLines]);
  }

  function handleKeyDown(e) {
    const cmds = cmdHistory.current;
    if (!cmds.length) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = historyIndex.current < cmds.length - 1
        ? historyIndex.current + 1
        : cmds.length - 1;
      historyIndex.current = next;
      setInput(cmds[cmds.length - 1 - next]);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex.current <= 0) {
        historyIndex.current = -1;
        setInput('');
      } else {
        historyIndex.current -= 1;
        setInput(cmds[cmds.length - 1 - historyIndex.current]);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const cmd = input.trim();
    if (!cmd || loading || !connected || !remaining || remaining === 0) return;

    cmdHistory.current = [...cmdHistory.current, cmd];
    historyIndex.current = -1;
    try { sessionStorage.setItem('folio_cmd_history', JSON.stringify(cmdHistory.current)); } catch {}

    // On first message, replace rotating hint and long disclaimer
    if (history.length === 0) {
      const SHORT = 'AI may occasionally get things wrong.';
      setLines(prev => prev.map(l => {
        if (l.type === 'rotating')   return { type: 'gap' }; // remove, gap keeps layout
        if (l.type === 'disclaimer') return { type: 'disclaimer-decrypt', text: SHORT, short: true };
        return l;
      }));
    }

    setInput('');

    append([{ type: 'gap' }, { type: 'cmd', text: `$ ${cmd}` }]);

    if (cmd === 'clear')  { setLines([]); return; }
    if (cmd === 'help')   {
      append([
        { type: 'out', text: 'local: whoami, uptime, clear, help' },
        { type: 'out', text: 'everything else goes to folio-ai.'  },
      ]);
      return;
    }
    if (cmd === 'uptime') { append([{ type: 'out', text: 'up 3 years, still running. mostly.' }]); return; }
    if (cmd === 'whoami') { append([{ type: 'out', text: 'elliot singer — it engineer & self-hoster' }]); return; }
    if (cmd.startsWith('sudo')) {
      append([{ type: 'err', text: 'nice try.' }]);
      return;
    }
    if (cmd === 'ls') {
      append([
        { type: 'out', text: 'drwxr-xr-x  proxmox-cluster/' },
        { type: 'out', text: 'drwxr-xr-x  wireguard-mesh/'  },
        { type: 'out', text: 'drwxr-xr-x  homelab-docs/'    },
        { type: 'out', text: '-rw-r--r--  2am-incidents.log' },
        { type: 'out', text: '-rw-r--r--  things-i-shouldnt-have-done.txt' },
      ]);
      return;
    }
    if (cmd === 'ping singer.systems') {
      append([
        { type: 'out',     text: 'PING singer.systems (10.10.0.1)' },
        { type: 'out',     text: '64 bytes from 10.10.0.1: icmp_seq=1 ttl=64 time=0.4 ms' },
        { type: 'out',     text: '64 bytes from 10.10.0.1: icmp_seq=2 ttl=64 time=0.3 ms' },
        { type: 'out',     text: '64 bytes from 10.10.0.1: icmp_seq=3 ttl=64 time=0.4 ms' },
        { type: 'success', text: '3 packets transmitted, 3 received, 0% packet loss' },
      ]);
      return;
    }

    setLoading(true);
    const newHistory = [...history, { role: 'user', content: cmd }];

    try {
      const res  = await fetch('/api/terminal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: newHistory,
          sessionRemaining: Math.max(0, SESSION_LIMIT - parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10)),
        }),
      });
      const data = await res.json();

      if (res.status === 429) {
        append([{ type: 'err', text: 'rate limited — try again in an hour or so' }]);
        setIpRemaining(0);
        return;
      }

      if (res.ok && data.reply) {
        const used = parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10) + 1;
        sessionStorage.setItem(SESSION_KEY, String(used));
        setSessionLeft(Math.max(0, SESSION_LIMIT - used));

        const scrollToBottom = () => {
          const el = outputRef.current;
          if (el) el.scrollTop = el.scrollHeight;
        };
        const focusAfterType = () => {
          inputRef.current?.focus({ preventScroll: true });
          // Promote completed typing line to plain out so it doesn't replay on re-mount
          setLines(prev => prev.map(l =>
            l.type === 'typing' && l.text === data.reply
              ? { ...l, type: 'out' }
              : l
          ));
        };

        append([{ type: 'typing', text: data.reply, onScroll: scrollToBottom, onDone: focusAfterType }]);
        setHistory([...newHistory, { role: 'assistant', content: data.reply }]);
        if (typeof data.remaining === 'number') setIpRemaining(data.remaining);
      } else {
        append([{ type: 'err', text: data.error ?? 'no response' }]);
      }
    } catch {
      append([{ type: 'err', text: 'connection failed — is the mesh up?' }]);
    } finally {
      setLoading(false);
    }
  }

  const showCounter   = mounted && ipRemaining !== null && remaining !== null && remaining <= WARN_AT && remaining > 0;
  const counterColour = remaining === 1 ? 'text-site-red' : 'text-site-amber';
  const isDisabled    = loading || connected === null || connected === false || (mounted && remaining === 0);

  const placeholder = !mounted
    ? 'ask me anything about elliot'
    : connected === null
    ? 'checking connection...'
    : connected === false
    ? 'offline for now — check back soon.'
    : remaining === 0
    ? 'rate limited — try again in an hour or so.'
    : loading
    ? 'running...'
    : 'ask me anything about elliot';

  return (
    <div className="terminal-wrap">
      <div
        className="relative z-10 rounded-lg overflow-hidden w-full bg-bg2 border border-white/[0.12] cursor-text"
        onClick={() => inputRef.current?.focus({ preventScroll: true })}
      >
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-bg3 border-b border-white/[0.07] select-none shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-site-red   shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-site-amber shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-site-green shrink-0" />
          <span className="font-mono text-[11px] text-site-muted ml-1.5 tracking-[0.04em] flex-1">
            bash — portfolio@prod-ai-01
          </span>

          {showCounter && (
            <FadeIn>
              <span className={`font-mono text-[10px] tracking-[0.06em] mr-2 ${counterColour}`}>
                {remaining} msg{remaining === 1 ? '' : 's'} left
              </span>
            </FadeIn>
          )}

          {connected !== null && (
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${connected ? 'bg-site-green term-pulse' : 'bg-site-red'}`} />
          )}
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          className="terminal-output px-[18px] pt-3.5 pb-1 overflow-y-auto overflow-x-hidden"
          style={{ height: '360px' }}
        >
          {(decryptLines ?? lines).map((line, i) => <Line key={i} line={line} />)}
          {loading && (
            <div className="font-mono text-xs text-site-muted pl-4 leading-7">
              thinking<span className="term-blink">_</span>
            </div>
          )}
        </div>

        {/* Rotating hint — shown above input until first interaction */}
        {lines.some(l => l.type === 'rotating') && (
          <div className="px-[18px] py-1.5 border-t border-white/[0.04]">
            <RotatingHint onScroll={() => {}} />
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className={`flex items-center gap-2 px-[18px] py-2.5 pb-3.5 border-t border-white/[0.07] shrink-0 transition-opacity ${
            isDisabled ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <span className="font-mono text-xs text-site-green shrink-0">portfolio@prod-ai-01 ~</span>
          <span className="font-mono text-xs text-site-text  shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => { historyIndex.current = -1; setInput(e.target.value.slice(0, MAX_CHARS)); }}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-mono text-[16px] md:text-xs text-site-text caret-site-green placeholder:text-site-muted"
          />
          <span
            className={`font-mono text-[10px] shrink-0 transition-all duration-200 overflow-hidden ${
              input.length >= MAX_CHARS - CHAR_WARN_AT
                ? 'opacity-100 max-w-[3rem]'
                : 'opacity-0 max-w-0'
            } ${
              input.length >= MAX_CHARS - 5
                ? 'text-site-red'
                : 'text-site-amber'
            }`}
          >
            {MAX_CHARS - input.length}
          </span>
        </form>
      </div>
    </div>
  );
}
