import { MAIN_SITE } from '../lib/share';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: '#f7faff',
        color: '#102a56',
      }}
    >
      <div style={{ width: 'min(560px, 100%)', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 12px', fontSize: 42 }}>SignMyWord</h1>
        <p style={{ margin: '0 0 24px', fontSize: 18, lineHeight: 1.5 }}>
          This service creates rich social previews for SignMyWord fingerspelling links.
        </p>
        <a
          href={MAIN_SITE}
          style={{
            display: 'inline-block',
            padding: '14px 22px',
            borderRadius: 14,
            background: '#1479f8',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Open SignMyWord
        </a>
      </div>
    </main>
  );
}
