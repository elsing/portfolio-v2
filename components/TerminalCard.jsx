'use client';

import { useState, useRef, useEffect } from 'react';

const IP_LIMIT      = 25;
const SESSION_LIMIT = 6;
const SESSION_KEY   = 'folio_session_count';
const WARN_AT       = 3;
const BOOT_RETRIES  = 4;
const BOOT_DELAY    = 2000;

const BOOT_OUTROS = [
  "try asking about elliot's experience or skills",
  "ask about the homelab, his background, or how to get in touch",
  "curious if elliot's the right fit? ask away",
  "not sure where to start? try: what does elliot do?",
  "ask anything — work history, skills, projects",
  "find out more about elliot — just type a question",
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
  const [mounted,     setMounted]     = useState(false);
  const [lines,       setLines]       = useState([]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [history,     setHistory]     = useState([]);
  const [connected,   setConnected]   = useState(null);
  const [ipRemaining, setIpRemaining] = useState(null);
  const [sessionLeft, setSessionLeft] = useState(() =>
    typeof window === 'undefined'
      ? SESSION_LIMIT
      : Math.max(0, SESSION_LIMIT - parseInt(sessionStorage.getItem(SESSION_KEY) ?? '0', 10))
  );

  const remaining = !mounted
    ? null
    : ipRemaining === null
    ? sessionLeft
    : Math.min(sessionLeft, ipRemaining);

  const outputRef    = useRef(null);
  const inputRef     = useRef(null);
  const wrapRef      = useRef(null);
  const cmdHistory   = useRef([]);
  const historyIndex = useRef(-1);

  // Mark as mounted (client only)
  useEffect(() => { setMounted(true); }, []);

  // Auto-scroll on new lines
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Prevent page scroll jump when iOS keyboard appears
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const handler = () => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    viewport.addEventListener('resize', handler);
    return () => viewport.removeEventListener('resize', handler);
  }, []);

  // Boot sequence
  useEffect(() => {
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
        afterLines.push({ type: 'hint', text: pickRandom(BOOT_OUTROS) });
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
  }, []);

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
        { type: 'out', text: 'PING singer.systems (10.10.0.1)' },
        { type: 'out', text: '64 bytes from 10.10.0.1: icmp_seq=1 ttl=64 time=0.4 ms' },
        { type: 'out', text: '64 bytes from 10.10.0.1: icmp_seq=2 ttl=64 time=0.3 ms' },
        { type: 'out', text: '64 bytes from 10.10.0.1: icmp_seq=3 ttl=64 time=0.4 ms' },
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
        const focusAfterType = () => inputRef.current?.focus({ preventScroll: true });

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
    <div ref={wrapRef} className="terminal-wrap">
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
          {lines.map((line, i) => <Line key={i} line={line} />)}
          {loading && (
            <div className="font-mono text-xs text-site-muted pl-4 leading-7">
              thinking<span className="term-blink">_</span>
            </div>
          )}
        </div>

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
            onChange={e => { historyIndex.current = -1; setInput(e.target.value); }}
            onKeyDown={handleKeyDown}
            disabled={isDisabled}
            placeholder={placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-mono text-[16px] md:text-xs text-site-text caret-site-green placeholder:text-site-muted"
          />
        </form>
      </div>
    </div>
  );
}
