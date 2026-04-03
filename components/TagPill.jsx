export const TAG_COLOURS = {
  proxmox:    { color: '#e8822a', bg: 'rgba(232,130,42,0.1)',  border: 'rgba(232,130,42,0.25)'  },
  traefik:    { color: '#5b9fd4', bg: 'rgba(91,159,212,0.1)',  border: 'rgba(91,159,212,0.25)'  },
  docker:     { color: '#5b9fd4', bg: 'rgba(91,159,212,0.1)',  border: 'rgba(91,159,212,0.25)'  },
  networking: { color: '#9d7fea', bg: 'rgba(157,127,234,0.1)', border: 'rgba(157,127,234,0.25)' },
  zabbix:     { color: '#d4a84b', bg: 'rgba(212,168,75,0.1)',  border: 'rgba(212,168,75,0.25)'  },
  devops:     { color: '#3ddb72', bg: 'rgba(61,219,114,0.08)', border: 'rgba(61,219,114,0.25)'  },
  incident:   { color: '#e05050', bg: 'rgba(224,80,80,0.1)',   border: 'rgba(224,80,80,0.25)'   },
  ai:         { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
  portfolio:  { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.25)'  },
  design:     { color: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.25)' },
  deployment: { color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.25)' },
};

export default function TagPill({ tag, small }) {
  const c = TAG_COLOURS[tag] ?? { color: 'var(--muted-hi)', bg: 'transparent', border: 'var(--border-mid)' };
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: small ? '11px' : '12px', letterSpacing: '0.06em',
      textTransform: 'uppercase', padding: small ? '2px 7px' : '3px 9px', borderRadius: '3px',
      color: c.color, background: c.bg, border: `1px solid ${c.border}`,
    }}>
      {tag}
    </span>
  );
}
