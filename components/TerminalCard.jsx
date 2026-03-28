'use client';

import { useState, useRef, useEffect } from 'react';

const WARN_AT = 3;

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

function FadeIn({ children, className = '' }) {
  return <div className={`term-fadein ${className}`}>{children}</div>;
}

export default function TerminalCard() {
  const [lines,     setLines]     = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [history,   setHistory]   = useState([]);
  const [remaining, setRemaining] = useState(null);
  const [connected, setConnected] = useState(null);

  const outputRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    async function boot() {
      try {
        const [healthRes, remainingRes] = await Promise.all([
          fetch('/api/terminal/health'),
          fetch('/api/terminal/remaining'),
        ]);

        const health    = await healthRes.json();
        const rem       = await remainingRes.json();
        const ok        = health.connected;
        const remNum    = rem.remaining ?? 0;

        setConnected(ok);
        setRemaining(remNum);

        const bootLines = [
          { type: 'out', text: 'folio-ai — singer.systems' },
          !ok
            ? { type: 'err',     text: 'disconnected — AI feature unavailable'                   }
            : remNum === 0
            ? { type: 'warn',    text: 'rate limited — try again later.'  }
            : { type: 'success', text: 'connected to proxmox cluster' },
          { type: 'gap' },
        ];

        if (ok && remNum > 0) {
          bootLines.push(
            { type: 'hint', text: pickRandom(BOOT_OUTROS) },
          );
        } else if (ok && remNum === 0) {
          bootLines.push({ type: 'warn', text: 'rate limited — try again in an hour or so.' });
        } else {
          bootLines.push({ type: 'warn', text: 'offline for now — check back soon.' });
        }

        setLines(bootLines);
      } catch {
        setConnected(false);
        setLines([
          { type: 'out', text: 'folio-ai — singer.systems'              },
          { type: 'err', text: 'disconnected — could not reach backend' },
        ]);
      } finally {
        setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
      }
    }
    boot();
  }, []);

  function append(newLines) {
    setLines(prev => [...prev, ...newLines]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const cmd = input.trim();
    if (!cmd || loading || !connected || remaining === 0) return;
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

    setLoading(true);
    const newHistory = [...history, { role: 'user', content: cmd }];

    try {
      const res  = await fetch('/api/terminal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();

      if (res.status === 429) {
        append([{ type: 'err', text: 'rate limited — try again later.' }]);
        setRemaining(0);
        return;
      }

      if (res.ok && data.reply) {
        append([{ type: 'out', text: data.reply }]);
        setHistory([...newHistory, { role: 'assistant', content: data.reply }]);
        if (typeof data.remaining === 'number') setRemaining(data.remaining);
      } else {
        append([{ type: 'err', text: data.error ?? 'no response' }]);
      }
    } catch {
      append([{ type: 'err', text: 'connection failed — is the mesh up?' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  }

  const showCounter   = remaining <= WARN_AT && remaining > 0;
  const counterColour = remaining === 1 ? 'text-site-red' : 'text-site-amber';

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

          {/* Message counter in title bar — never overlaps output */}
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
            connected === false || remaining === 0 ? 'opacity-40' : 'opacity-100'
          }`}
        >
          <span className="font-mono text-xs text-site-green shrink-0">portfolio@prod-ai-01 ~</span>
          <span className="font-mono text-xs text-site-text  shrink-0">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading || connected === false || remaining === 0}
            placeholder={
              connected === false ? 'offline'
              : remaining === 0   ? 'rate limited — try again later'
              : loading           ? ''
              : 'type a command...'
            }
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent border-none outline-none font-mono text-xs text-site-text caret-site-green placeholder:text-site-muted"
          />
        </form>
      </div>
    </div>
  );
}
