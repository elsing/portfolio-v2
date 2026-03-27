'use client';

const EXPERIENCE_ITEMS = [
  { role: 'Junior DevOps & Infra Engineer', org: 'upcoming role',          date: null,             upcoming: true  },
  { role: '2nd Line Support Engineer',      org: 'current position',       date: 'present',        upcoming: false },
  { role: 'Homelab Architect',              org: 'singer.systems — self',  date: 'ongoing · 3+ years', upcoming: false },
];

function ExpItem({ role, org, date, upcoming }) {
  return (
    <div
      className="exp-item"
      style={{ borderLeftColor: 'var(--border)' }}
      onMouseEnter={e => { e.currentTarget.style.borderLeftColor = 'var(--green)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderLeftColor = 'var(--border)'; }}
    >
      <p style={{ fontSize: '15px', color: 'var(--text)', fontWeight: '500', marginBottom: '4px', lineHeight: '1.3' }}>
        {role}
      </p>
      <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--muted-hi)', marginBottom: '3px' }}>
        {org}
      </p>
      {upcoming
        ? <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--amber)' }}>↗ starting soon</p>
        : <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--muted)' }}>{date}</p>
      }
    </div>
  );
}

export default function Experience() {
  return (
    <div style={{ padding: '40px 40px 48px' }}>
      <div className="flex items-center gap-2" style={{
        fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '28px',
      }}>
        experience
        <span style={{ flex: 1, height: '1px', background: 'var(--border)', display: 'block' }} />
      </div>
      <div className="flex flex-col">
        {EXPERIENCE_ITEMS.map(item => <ExpItem key={item.role} {...item} />)}
      </div>
    </div>
  );
}
