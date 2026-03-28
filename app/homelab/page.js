import Nav  from '@/components/Nav';
import Link from 'next/link';

export const metadata = {
  title:       'Homelab — Elliot Singer',
  description: 'singer.systems hybrid private cloud — architecture, topology, and write-ups.',
};

export default function HomelabPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />

      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ padding: '48px 40px 36px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: 'var(--muted-hi)', letterSpacing: '0.1em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '18px', height: '1px', background: 'var(--muted-hi)', display: 'inline-block' }} />
            hybrid private cloud
          </div>
          <h1 style={{ fontFamily: 'var(--mono)', fontSize: '38px', fontWeight: '500', color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: '10px' }}>
            ./homelab
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--muted-hi)', fontWeight: '300', maxWidth: '560px' }}>
            A self-hosted hybrid cloud spanning on-premise Proxmox nodes, three VPS, and a WireGuard mesh — nothing internet-facing, everything highly available.
          </p>
        </div>

        {/* Stats strip */}
        <div style={{ padding: '20px 40px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {[
            { val: '3',   lbl: 'proxmox nodes' },
            { val: '3',   lbl: 'vps'           },
            { val: '20+', lbl: 'servers'        },
            { val: 'HA',  lbl: 'availability'   },
            { val: '99%+',lbl: 'uptime'         },
          ].map(({ val, lbl }) => (
            <div key={lbl}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '22px', fontWeight: '500', color: 'var(--green)', lineHeight: 1, marginBottom: '4px' }}>{val}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Topology diagram */}
        <div style={{ padding: '40px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            topology <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
          </div>

          <svg
            viewBox="0 0 900 480"
            style={{ width: '100%', maxWidth: '900px', height: 'auto', display: 'block', margin: '0 auto' }}
            xmlns="http://www.w3.org/2000/svg"
            fontFamily="'JetBrains Mono', monospace"
          >
            <defs>
              <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#3ddb72" opacity="0.6" />
              </marker>
              <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#9d7fea" opacity="0.6" />
              </marker>
              <style>{`
                @keyframes dash-flow {
                  to { stroke-dashoffset: -20; }
                }
                .flow-green  { animation: dash-flow 1.4s linear infinite; }
                .flow-purple { animation: dash-flow 2s   linear infinite; }
              `}</style>
            </defs>

            {/* tier labels */}
            {[
              { y: 18,  label: 'internet & edge' },
              { y: 138, label: 'cloud edge'      },
              { y: 258, label: 'mesh & routing'  },
              { y: 378, label: 'on-premise'      },
            ].map(({ y, label }) => (
              <text key={label} x="12" y={y} fontSize="9" fill="#4f6359" letterSpacing="0.12em" textTransform="uppercase">{label.toUpperCase()}</text>
            ))}

            {/* tier dividers */}
            {[30, 150, 270, 390].map(y => (
              <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* tier 1 — cloudflare + azure TM */}
            {/* Cloudflare */}
            <rect x="160" y="42" width="140" height="52" rx="4" fill="#1c201e" stroke="rgba(232,130,42,0.4)" strokeWidth="1" />
            <text x="230" y="63" fontSize="11" fontWeight="500" fill="#e8822a" textAnchor="middle">Cloudflare</text>
            <text x="230" y="79" fontSize="9" fill="#4f6359" textAnchor="middle">CDN · DNS</text>

            {/* Azure TM */}
            <rect x="600" y="42" width="140" height="52" rx="4" fill="#1c201e" stroke="rgba(91,159,212,0.4)" strokeWidth="1" />
            <text x="670" y="63" fontSize="11" fontWeight="500" fill="#5b9fd4" textAnchor="middle">Azure TM</text>
            <text x="670" y="79" fontSize="9" fill="#4f6359" textAnchor="middle">60/40 failover</text>

            {/* tier 2 — load balancers + VPS */}
            {/* LB-01 */}
            <rect x="80" y="162" width="130" height="52" rx="4" fill="#1c201e" stroke="rgba(91,159,212,0.3)" strokeWidth="1" />
            <text x="145" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">prod-lb-01</text>
            <text x="145" y="199" fontSize="9" fill="#4f6359" textAnchor="middle">Nginx · UFW</text>

            {/* LB-02 */}
            <rect x="250" y="162" width="130" height="52" rx="4" fill="#1c201e" stroke="rgba(91,159,212,0.3)" strokeWidth="1" />
            <text x="315" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">prod-lb-02</text>
            <text x="315" y="199" fontSize="9" fill="#4f6359" textAnchor="middle">Nginx · UFW</text>

            {/* Jupiter */}
            <rect x="460" y="162" width="110" height="52" rx="4" fill="#1c201e" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x="515" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">Jupiter</text>
            <text x="515" y="199" fontSize="9" fill="#4f6359" textAnchor="middle">VPS · Docker</text>

            {/* Venus */}
            <rect x="590" y="162" width="110" height="52" rx="4" fill="#1c201e" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x="645" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">Venus</text>
            <text x="645" y="199" fontSize="9" fill="#4f6359" textAnchor="middle">VPS · Docker</text>

            {/* Mars */}
            <rect x="720" y="162" width="110" height="52" rx="4" fill="#1c201e" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <text x="775" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">Mars</text>
            <text x="775" y="199" fontSize="9" fill="#4f6359" textAnchor="middle">VPS · Docker</text>

            {/* tier 3 — wireguard mesh */}
            <rect x="270" y="282" width="360" height="52" rx="4" fill="rgba(157,127,234,0.05)" stroke="rgba(157,127,234,0.3)" strokeWidth="1" strokeDasharray="4 3" />
            <text x="450" y="303" fontSize="11" fontWeight="500" fill="#9d7fea" textAnchor="middle">WireGuard mesh</text>
            <text x="450" y="319" fontSize="9" fill="#4f6359" textAnchor="middle">OSPF · full mesh · encrypted</text>

            {/* tier 4 — on-premise */}
            {/* OPNsense HA */}
            <rect x="60" y="402" width="150" height="52" rx="4" fill="#1c201e" stroke="rgba(61,219,114,0.3)" strokeWidth="1" />
            <text x="135" y="423" fontSize="11" fontWeight="500" fill="#3ddb72" textAnchor="middle">OPNsense HA</text>
            <text x="135" y="439" fontSize="9" fill="#4f6359" textAnchor="middle">OPS-01 · OPS-02 · CARP</text>

            {/* Proxmox cluster */}
            <rect x="250" y="402" width="400" height="52" rx="4" fill="#1c201e" stroke="rgba(61,219,114,0.25)" strokeWidth="1" />
            <text x="450" y="423" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">Proxmox cluster</text>
            <text x="450" y="439" fontSize="9" fill="#4f6359" textAnchor="middle">3 nodes · Ceph · Traefik · Zabbix · Uptime Kuma</text>

            {/* connections */}
            {/* Cloudflare → LBs */}
            <line x1="230" y1="94" x2="145" y2="162" stroke="#3ddb72" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.5" className="flow-green" markerEnd="url(#arrow-green)" />
            <line x1="230" y1="94" x2="315" y2="162" stroke="#3ddb72" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.5" className="flow-green" markerEnd="url(#arrow-green)" />

            {/* Azure TM → LBs */}
            <line x1="670" y1="94" x2="315" y2="162" stroke="#5b9fd4" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.4" className="flow-green" markerEnd="url(#arrow-green)" />
            <line x1="670" y1="94" x2="145" y2="162" stroke="#5b9fd4" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.4" className="flow-green" markerEnd="url(#arrow-green)" />

            {/* LBs → WG mesh */}
            <line x1="145" y1="214" x2="320" y2="282" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.5" className="flow-purple" markerEnd="url(#arrow-purple)" />
            <line x1="315" y1="214" x2="360" y2="282" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.5" className="flow-purple" markerEnd="url(#arrow-purple)" />

            {/* VPS → WG mesh */}
            <line x1="515" y1="214" x2="470" y2="282" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.4" className="flow-purple" markerEnd="url(#arrow-purple)" />
            <line x1="645" y1="214" x2="540" y2="282" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.4" className="flow-purple" markerEnd="url(#arrow-purple)" />
            <line x1="775" y1="214" x2="600" y2="282" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.4" className="flow-purple" markerEnd="url(#arrow-purple)" />

            {/* WG mesh → Proxmox */}
            <line x1="400" y1="334" x2="380" y2="402" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.5" className="flow-purple" markerEnd="url(#arrow-purple)" />
            <line x1="500" y1="334" x2="500" y2="402" stroke="#9d7fea" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.5" className="flow-purple" markerEnd="url(#arrow-purple)" />

            {/* OPNsense → Proxmox */}
            <line x1="210" y1="428" x2="250" y2="428" stroke="#3ddb72" strokeWidth="1" strokeOpacity="0.3" />

            {/* Legend */}
            <g transform="translate(12, 450)">
              <line x1="0" y1="8" x2="24" y2="8" stroke="#3ddb72" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.7" />
              <text x="30" y="12" fontSize="9" fill="#4f6359">live traffic</text>
              <line x1="90" y1="8" x2="114" y2="8" stroke="#9d7fea" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.7" />
              <text x="120" y="12" fontSize="9" fill="#4f6359">wireguard / ospf</text>
            </g>
          </svg>
        </div>

        {/* Detail cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1px', background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
          {[
            {
              colour: '#e8822a',
              title:  'Cloud edge',
              items:  ['Cloudflare CDN + DNS', 'Azure Traffic Manager 60/40', '2× Nginx load balancers', 'UFW firewalling on all LBs'],
            },
            {
              colour: '#9d7fea',
              title:  'Mesh networking',
              items:  ['WireGuard full mesh', 'OSPF via FRRouting', '3× VPS (Jupiter, Venus, Mars)', 'OpenWRT container firewalls'],
            },
            {
              colour: '#3ddb72',
              title:  'On-premise compute',
              items:  ['3-node Proxmox VE cluster', 'Ceph hyper-converged storage', 'OPNsense HA (CARP failover)', 'Traefik ingress + Let\'s Encrypt', 'Zabbix + Uptime Kuma'],
            },
          ].map(({ colour, title, items }) => (
            <div key={title} style={{ background: 'var(--bg)', padding: '32px 36px' }}>
              <h3 style={{ fontFamily: 'var(--mono)', fontSize: '14px', fontWeight: '500', color: colour, marginBottom: '16px', letterSpacing: '0.02em' }}>
                {title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ color: colour, opacity: 0.5, flexShrink: 0, marginTop: '2px' }}>›</span>
                    <span style={{ fontSize: '15px', color: 'var(--muted-hi)', fontWeight: '300', lineHeight: '1.5' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Blog teaser */}
        <div style={{ padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--muted)' }}>
            read about how it was built →
          </p>
          <Link href="/blog" style={{
            fontFamily: 'var(--mono)', fontSize: '13px', padding: '9px 20px',
            background: 'transparent', color: 'var(--muted-hi)',
            border: '1px solid var(--border-mid)', borderRadius: '5px',
            textDecoration: 'none', transition: 'color 0.15s, border-color 0.15s',
          }}>
            ./blog
          </Link>
        </div>

        <footer style={{ borderTop: '1px solid var(--border)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)' }}>© {new Date().getFullYear()} elliot singer · singer.systems</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {[{ href: '/', label: './home' }, { href: '/blog', label: './blog' }, { href: 'https://github.com/elsing', label: 'github' }].map(({ href, label }) => (
              <a key={label} href={href} className="footer-link" style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.15s' }}>{label}</a>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}
