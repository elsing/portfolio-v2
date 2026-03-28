'use client';

const EXPERIENCE_ITEMS = [
  { role: 'Junior DevOps & Infra Engineer', org: 'upcoming role',         date: null,                upcoming: true  },
  { role: '2nd Line Support Engineer',      org: 'current position',      date: 'present',           upcoming: false },
  { role: 'Homelab Architect',              org: 'singer.systems — self', date: 'ongoing · 3+ years', upcoming: false },
];

function ExpItem({ role, org, date, upcoming }) {
  return (
    <div
      className="pl-4 pb-4 pt-4 mb-1.5 border-l-2 transition-colors duration-200 cursor-default"
      style={{ borderLeftColor: 'rgba(255,255,255,0.07)' }}
      onMouseEnter={e => { e.currentTarget.style.borderLeftColor = '#3ddb72'; }}
      onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.07)'; }}
    >
      <p className="text-[15px] text-site-text font-medium mb-1 leading-snug">{role}</p>
      <p className="font-mono text-[12px] text-site-muted-hi mb-0.5">{org}</p>
      {upcoming
        ? <p className="font-mono text-[11px] text-site-amber">↗ starting soon</p>
        : <p className="font-mono text-[11px] text-site-muted">{date}</p>
      }
    </div>
  );
}

export default function Experience() {
  return (
    <div className="p-10 pb-12">
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] uppercase text-site-muted mb-7">
        experience
        <span className="flex-1 h-px bg-white/[0.07]" />
      </div>
      <div className="flex flex-col">
        {EXPERIENCE_ITEMS.map(item => <ExpItem key={item.role} {...item} />)}
      </div>
    </div>
  );
}
