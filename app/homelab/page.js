import Nav  from '@/components/Nav';
import Link from 'next/link';

export const metadata = {
  title:       'Homelab — Elliot Singer',
  description: 'singer.systems hybrid private cloud — architecture, topology, and write-ups.',
};

const STATS = [
  { val: '3',    lbl: 'proxmox nodes' },
  { val: '3',    lbl: 'vps'           },
  { val: '20+',  lbl: 'servers'       },
  { val: 'HA',   lbl: 'availability'  },
  { val: '99%+', lbl: 'uptime'        },
];

const DETAIL_CARDS = [
  {
    cls:   'text-[#e8822a]',
    title: 'Cloud edge',
    items: ['Cloudflare CDN + DNS', 'Azure Traffic Manager 60/40', '2× Nginx load balancers', 'UFW firewalling on all LBs'],
  },
  {
    cls:   'text-[#9d7fea]',
    title: 'Mesh networking',
    items: ['WireGuard full mesh', 'OSPF via FRRouting', '3× VPS (Jupiter, Venus, Mars)', 'OpenWRT container firewalls'],
  },
  {
    cls:   'text-site-green',
    title: 'On-premise compute',
    items: ['3-node Proxmox VE cluster', 'Ceph hyper-converged storage', 'OPNsense HA (CARP failover)', "Traefik ingress + Let's Encrypt", 'Zabbix + Uptime Kuma'],
  },
];

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-site-muted mb-6">
      {children}
      <span className="flex-1 h-px bg-white/[0.07]" />
    </div>
  );
}

export default function HomelabPage() {
  return (
    <div className="min-h-screen">
      <Nav />
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="px-10 pt-12 pb-9 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5 font-mono text-[13px] text-site-muted-hi tracking-[0.1em] mb-3">
            <span className="w-4 h-px bg-site-muted-hi inline-block" />
            hybrid private cloud
          </div>
          <h1 className="font-mono text-[38px] font-medium text-site-text tracking-[-0.02em] mb-2.5">./homelab</h1>
          <p className="text-[17px] text-site-muted-hi font-light max-w-[560px]">
            A self-hosted hybrid cloud spanning on-premise Proxmox nodes, three VPS, and a WireGuard mesh.
          </p>
        </div>

        {/* Stats */}
        <div className="px-10 py-5 border-b border-white/[0.07] flex gap-8 flex-wrap">
          {STATS.map(({ val, lbl }) => (
            <div key={lbl}>
              <div className="font-mono text-[22px] font-medium text-site-green leading-none mb-1">{val}</div>
              <div className="font-mono text-[11px] text-site-muted tracking-[0.06em] uppercase">{lbl}</div>
            </div>
          ))}
        </div>

        {/* Topology */}
        <div className="px-10 py-10 border-b border-white/[0.07] overflow-x-auto">
          <SectionLabel>topology</SectionLabel>
          <svg viewBox="0 0 900 480" className="w-full max-w-[900px] h-auto block mx-auto"
            xmlns="http://www.w3.org/2000/svg" fontFamily="'JetBrains Mono', monospace">
            <defs>
              <marker id="ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#3ddb72" opacity="0.6" />
              </marker>
              <marker id="ap" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L8,3 z" fill="#9d7fea" opacity="0.6" />
              </marker>
              <style>{`@keyframes df{to{stroke-dashoffset:-20}}.fg{animation:df 1.4s linear infinite}.fp{animation:df 2s linear infinite}`}</style>
            </defs>

            {/* Tier labels — strings already uppercase, no textTransform needed */}
            {[{y:18,t:'INTERNET & EDGE'},{y:138,t:'CLOUD EDGE'},{y:258,t:'MESH & ROUTING'},{y:378,t:'ON-PREMISE'}].map(({y,t})=>(
              <text key={t} x="12" y={y} fontSize="9" fill="#4f6359" letterSpacing="0.12em">{t}</text>
            ))}
            {[30,150,270,390].map(y=>(
              <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
            ))}

            <rect x="160" y="42" width="140" height="52" rx="4" fill="#1c201e" stroke="rgba(232,130,42,0.4)" strokeWidth="1"/>
            <text x="230" y="63" fontSize="11" fontWeight="500" fill="#e8822a" textAnchor="middle">Cloudflare</text>
            <text x="230" y="79" fontSize="9" fill="#4f6359" textAnchor="middle">CDN · DNS</text>

            <rect x="600" y="42" width="140" height="52" rx="4" fill="#1c201e" stroke="rgba(91,159,212,0.4)" strokeWidth="1"/>
            <text x="670" y="63" fontSize="11" fontWeight="500" fill="#5b9fd4" textAnchor="middle">Azure TM</text>
            <text x="670" y="79" fontSize="9" fill="#4f6359" textAnchor="middle">60/40 failover</text>

            <rect x="80"  y="162" width="130" height="52" rx="4" fill="#1c201e" stroke="rgba(91,159,212,0.3)" strokeWidth="1"/>
            <text x="145" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">prod-lb-01</text>
            <text x="145" y="199" fontSize="9"  fill="#4f6359" textAnchor="middle">Nginx · UFW</text>

            <rect x="250" y="162" width="130" height="52" rx="4" fill="#1c201e" stroke="rgba(91,159,212,0.3)" strokeWidth="1"/>
            <text x="315" y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">prod-lb-02</text>
            <text x="315" y="199" fontSize="9"  fill="#4f6359" textAnchor="middle">Nginx · UFW</text>

            {[{x:460,cx:515,n:'Jupiter'},{x:590,cx:645,n:'Venus'},{x:720,cx:775,n:'Mars'}].map(({x,cx,n})=>(
              <g key={n}>
                <rect x={x} y="162" width="110" height="52" rx="4" fill="#1c201e" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
                <text x={cx} y="183" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">{n}</text>
                <text x={cx} y="199" fontSize="9" fill="#4f6359" textAnchor="middle">VPS · Docker</text>
              </g>
            ))}

            <rect x="270" y="282" width="360" height="52" rx="4" fill="rgba(157,127,234,0.05)" stroke="rgba(157,127,234,0.3)" strokeWidth="1" strokeDasharray="4 3"/>
            <text x="450" y="303" fontSize="11" fontWeight="500" fill="#9d7fea" textAnchor="middle">WireGuard mesh</text>
            <text x="450" y="319" fontSize="9"  fill="#4f6359" textAnchor="middle">OSPF · full mesh · encrypted</text>

            <rect x="60"  y="402" width="150" height="52" rx="4" fill="#1c201e" stroke="rgba(61,219,114,0.3)" strokeWidth="1"/>
            <text x="135" y="423" fontSize="11" fontWeight="500" fill="#3ddb72" textAnchor="middle">OPNsense HA</text>
            <text x="135" y="439" fontSize="9"  fill="#4f6359" textAnchor="middle">OPS-01 · OPS-02 · CARP</text>

            <rect x="250" y="402" width="400" height="52" rx="4" fill="#1c201e" stroke="rgba(61,219,114,0.25)" strokeWidth="1"/>
            <text x="450" y="423" fontSize="11" fontWeight="500" fill="#e2ede6" textAnchor="middle">Proxmox cluster</text>
            <text x="450" y="439" fontSize="9"  fill="#4f6359" textAnchor="middle">3 nodes · Ceph · Traefik · Zabbix · Uptime Kuma</text>

            {/* Flow lines */}
            <line x1="230" y1="94"  x2="145" y2="162" stroke="#3ddb72" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.5" className="fg" markerEnd="url(#ag)"/>
            <line x1="230" y1="94"  x2="315" y2="162" stroke="#3ddb72" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.5" className="fg" markerEnd="url(#ag)"/>
            <line x1="670" y1="94"  x2="315" y2="162" stroke="#5b9fd4" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.4" className="fg" markerEnd="url(#ag)"/>
            <line x1="670" y1="94"  x2="145" y2="162" stroke="#5b9fd4" strokeWidth="1.2" strokeDasharray="6 4" strokeOpacity="0.4" className="fg" markerEnd="url(#ag)"/>
            <line x1="145" y1="214" x2="320" y2="282" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.5" className="fp" markerEnd="url(#ap)"/>
            <line x1="315" y1="214" x2="360" y2="282" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.5" className="fp" markerEnd="url(#ap)"/>
            <line x1="515" y1="214" x2="470" y2="282" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.4" className="fp" markerEnd="url(#ap)"/>
            <line x1="645" y1="214" x2="540" y2="282" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.4" className="fp" markerEnd="url(#ap)"/>
            <line x1="775" y1="214" x2="600" y2="282" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.4" className="fp" markerEnd="url(#ap)"/>
            <line x1="400" y1="334" x2="380" y2="402" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.5" className="fp" markerEnd="url(#ap)"/>
            <line x1="500" y1="334" x2="500" y2="402" stroke="#9d7fea" strokeWidth="1"   strokeDasharray="5 4" strokeOpacity="0.5" className="fp" markerEnd="url(#ap)"/>
            <line x1="210" y1="428" x2="250" y2="428" stroke="#3ddb72" strokeWidth="1"   strokeOpacity="0.3"/>

            <g transform="translate(12,450)">
              <line x1="0" y1="8" x2="24" y2="8" stroke="#3ddb72" strokeWidth="1.5" strokeDasharray="6 3" strokeOpacity="0.7"/>
              <text x="30"  y="12" fontSize="9" fill="#4f6359">live traffic</text>
              <line x1="90" y1="8" x2="114" y2="8" stroke="#9d7fea" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.7"/>
              <text x="120" y="12" fontSize="9" fill="#4f6359">wireguard / ospf</text>
            </g>
          </svg>
        </div>

        {/* Detail cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/[0.07]"
          style={{ gap: '1px', background: 'rgba(255,255,255,0.07)' }}>
          {DETAIL_CARDS.map(({ cls, title, items }) => (
            <div key={title} className="bg-bg px-9 py-8">
              <h3 className={`font-mono text-[14px] font-medium mb-4 ${cls}`}>{title}</h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {items.map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className={`shrink-0 mt-0.5 opacity-50 ${cls}`}>›</span>
                    <span className="text-[15px] text-site-muted-hi font-light leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Blog teaser */}
        <div className="px-10 py-8 flex justify-between items-center flex-wrap gap-3">
          <p className="font-mono text-[14px] text-site-muted">read about how it was built →</p>
          <Link href="/blog"
            className="font-mono text-[13px] px-5 py-2.5 border border-white/10 rounded-[5px] text-site-muted-hi no-underline transition-all hover:text-site-text hover:border-white/20">
            ./blog
          </Link>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/[0.07] px-10 py-4 flex justify-between items-center">
          <span className="font-mono text-[12px] text-site-muted">
            © {new Date().getFullYear()} elliot singer · singer.systems
          </span>
          <div className="flex gap-5">
            {[{href:'/',label:'./home'},{href:'/blog',label:'./blog'},{href:'https://github.com/elsing',label:'github'}].map(({href,label})=>(
              <a key={label} href={href} className="footer-link font-mono text-[12px] text-site-muted no-underline">{label}</a>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
}