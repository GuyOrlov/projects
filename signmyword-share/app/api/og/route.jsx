import { ImageResponse } from 'next/og';
import { cleanLang, cleanWord, languageConfig } from '../../../lib/share';

export const runtime = 'edge';

function letterChips(word) {
  return [...word]
    .filter((char) => /[A-Z]/.test(char))
    .slice(0, 14);
}

export async function GET(request) {
  const url = new URL(request.url);
  const lang = cleanLang(url.searchParams.get('lang') || 'bsl');
  const word = cleanWord(url.searchParams.get('word') || 'HELLO');
  const config = languageConfig(lang);
  const letters = letterChips(word);
  const hiddenCount = Math.max(0, [...word].filter((char) => /[A-Z]/.test(char)).length - letters.length);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 52,
          color: '#ffffff',
          background:
            'linear-gradient(135deg, #7047eb 0%, #1479f8 52%, #10b9a9 100%)',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 800 }}>
            SignMyWord
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 18px',
              borderRadius: 999,
              color: '#102a56',
              background: 'rgba(255,255,255,.96)',
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            <span>{config.flag}</span>
            <span>{config.label}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 42,
          }}
        >
          <div
            style={{
              display: 'flex',
              maxWidth: 1080,
              fontSize: 52,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-1.5px',
            }}
          >
            How to fingerspell “{word}”
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 10,
              fontSize: 27,
              opacity: 0.95,
            }}
          >
            {config.name} ({config.label})
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: 32,
          }}
        >
          {letters.map((letter, index) => (
            <div
              key={`${letter}-${index}`}
              style={{
                width: 66,
                height: 66,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                color: '#102a56',
                background: 'rgba(255,255,255,.94)',
                fontSize: 29,
                fontWeight: 800,
                boxShadow: '0 4px 14px rgba(16,42,86,.12)',
              }}
            >
              {letter}
            </div>
          ))}

          {hiddenCount > 0 ? (
            <div
              style={{
                height: 66,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 18px',
                borderRadius: 14,
                background: 'rgba(255,255,255,.18)',
                border: '1px solid rgba(255,255,255,.35)',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              +{hiddenCount}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            <div style={{ display: 'flex', fontSize: 27, fontWeight: 800 }}>
              SignMyWord.com
            </div>
            <div style={{ display: 'flex', fontSize: 20, opacity: 0.92 }}>
              Type a word. See the signs. Share your own.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '14px 18px',
              borderRadius: 16,
              background: 'rgba(255,255,255,.95)',
              color: '#1479f8',
              fontSize: 21,
              fontWeight: 800,
            }}
          >
            Tap to see the signs →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'cache-control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    }
  );
}
