'use client';

import { useEffect, useMemo, useState } from 'react';
import factsData from '../data/facts.json';
import siteData from '../data/site.json';

const money = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0
});

const shortcuts = [
  { icon: '£', title: 'Benefits', text: 'Understand what support to check', href: '#benefits' },
  { icon: '▦', title: 'Calculators', text: 'Work through your numbers', href: '#calculators' },
  { icon: '●', title: 'Savings & ISAs', text: 'Build a stronger safety net', href: '#savings' },
  { icon: '◉', title: 'Pensions', text: 'See your long-term direction', href: '#pensions' },
  { icon: '▤', title: 'Guides', text: 'Plain-English money information', href: '#guides' },
  { icon: '◎', title: 'Evidence', text: 'See why accessible money matters', href: '#evidence' }
];

const guides = [
  {
    title: 'A beginner’s guide to disability benefits',
    text: 'Where to start with PIP, ADP, DLA and other support.',
    href: 'https://www.gov.uk/browse/benefits/disability'
  },
  {
    title: 'Saving when money is tight',
    text: 'Emergency funds, regular saving and realistic next steps.',
    href: 'https://www.moneyhelper.org.uk/en/savings/types-of-savings/emergency-savings-how-much-is-enough'
  },
  {
    title: 'Understand your State Pension',
    text: 'Check your forecast and National Insurance record.',
    href: 'https://www.gov.uk/check-state-pension'
  },
  {
    title: 'Money guidance you can trust',
    text: 'Free, impartial support from MoneyHelper.',
    href: 'https://www.moneyhelper.org.uk/'
  }
];

const searchItems = [
  ...shortcuts.map((item) => ({ label: item.title, detail: item.text, href: item.href })),
  ...guides.map((item) => ({ label: item.title, detail: item.text, href: item.href }))
];

function futureValue(start, monthly, annualRate, years) {
  const months = Math.max(0, Number(years) * 12);
  const monthlyRate = Number(annualRate) / 100 / 12;
  const principal = Number(start) || 0;
  const contribution = Number(monthly) || 0;
  if (!monthlyRate) return principal + contribution * months;
  return principal * Math.pow(1 + monthlyRate, months) + contribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}

function Brand() {
  return (
    <a className="brand" href="#top" aria-label="AccessToMoney home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
      <span><strong>AccessToMoney</strong><small>Financial confidence for a more inclusive UK</small></span>
    </a>
  );
}

function Icon({ children }) {
  return <span className="tile-icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [query, setQuery] = useState('');
  const [checks, setChecks] = useState([false, false, false, false]);
  const [pension, setPension] = useState({ start: 14000, monthly: 100, rate: 5, years: 10 });
  const [savings, setSavings] = useState({ start: 1000, monthly: 200, rate: 4, years: 5 });

  useEffect(() => {
    const saved = window.localStorage.getItem('atm-checks');
    if (saved) {
      try { setChecks(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    document.documentElement.dataset.text = largeText ? 'large' : 'normal';
  }, [largeText]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchItems.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(q)).slice(0, 5);
  }, [query]);

  const pensionResult = futureValue(pension.start, pension.monthly, pension.rate, pension.years);
  const savingsResult = futureValue(savings.start, savings.monthly, savings.rate, savings.years);
  const progress = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  function toggleCheck(index) {
    const next = checks.map((checked, i) => i === index ? !checked : checked);
    setChecks(next);
    window.localStorage.setItem('atm-checks', JSON.stringify(next));
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header" id="top">
        <div className="nav-shell">
          <Brand />
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
            <a href="#benefits" onClick={() => setMenuOpen(false)}>Benefits</a>
            <a href="#calculators" onClick={() => setMenuOpen(false)}>Calculators</a>
            <a href="#savings" onClick={() => setMenuOpen(false)}>Savings & ISAs</a>
            <a href="#pensions" onClick={() => setMenuOpen(false)}>Pensions</a>
            <a href="#guides" onClick={() => setMenuOpen(false)}>Guides</a>
            <a href="#evidence" onClick={() => setMenuOpen(false)}>Evidence</a>
          </nav>
          <div className="header-tools">
            <div className="search-box">
              <label className="sr-only" htmlFor="site-search">Search AccessToMoney</label>
              <span aria-hidden="true">⌕</span>
              <input id="site-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search money guides…" />
              {query && (
                <div className="search-results" role="listbox" aria-label="Search results">
                  {matches.length ? matches.map((item) => (
                    <a key={item.label} href={item.href} onClick={() => setQuery('')}>
                      <strong>{item.label}</strong><span>{item.detail}</span>
                    </a>
                  )) : <p>No matching guide yet.</p>}
                </div>
              )}
            </div>
            <button className="mini-btn" type="button" onClick={() => setLargeText((v) => !v)} aria-pressed={largeText}>A+</button>
            <button className="mini-btn" type="button" onClick={() => setDark((v) => !v)} aria-pressed={dark}>{dark ? '☀' : '◐'}</button>
            <a className="header-cta" href="#calculators">Get started</a>
            <button className="menu-btn" type="button" onClick={() => setMenuOpen((v) => !v)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero">
          <div className="hero-glow hero-glow-one" />
          <div className="hero-glow hero-glow-two" />
          <div className="page-shell hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Disability. Money. Opportunity.</p>
              <h1>Make your money<br /><span>work for you.</span></h1>
              <p className="hero-lede">Clear advice, helpful tools and trusted UK information designed to support Deaf and disabled people.</p>
              <ul className="hero-points">
                <li><b>✓</b> Simple and accessible guidance</li>
                <li><b>✓</b> Tools and calculators built around real decisions</li>
                <li><b>✓</b> Independent information with sources linked</li>
              </ul>
              <div className="hero-actions">
                <a className="btn primary" href="#calculators">Explore our tools <span>→</span></a>
                <a className="btn secondary" href="#evidence">Why this matters <span>→</span></a>
              </div>
              <p className="micro-copy">Plain English · UK-focused · BSL-ready direction · No product recommendation</p>
            </div>

            <div className="hero-visual" aria-label="Illustration showing accessible financial progress">
              <div className="visual-card visual-card-a"><span>▥</span><b>Knowledge</b><small>builds independence</small></div>
              <div className="visual-card visual-card-b"><span>♥</span><b>Fairer access</b><small>to money information</small></div>
              <div className="visual-card visual-card-c"><span>↗</span><b>Small steps</b><small>create progress</small></div>
              <div className="person-illustration" aria-hidden="true">
                <div className="person-head" />
                <div className="person-body"><span className="laptop">£</span></div>
                <div className="wheel wheel-one" /><div className="wheel wheel-two" />
              </div>
              <div className="visual-slogan">Financial confidence<br /><strong>for everyone.</strong></div>
            </div>
          </div>
        </section>

        <section className="shortcut-band" aria-label="Money topics">
          <div className="page-shell shortcut-grid">
            {shortcuts.map((item) => (
              <a className="shortcut" href={item.href} key={item.title}>
                <Icon>{item.icon}</Icon><strong>{item.title}</strong><span>{item.text}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="calculators">
          <div className="page-shell">
            <div className="section-heading split-heading">
              <div><p className="kicker">Popular tools</p><h2>Start with one useful number.</h2><p>Quick educational tools to help you understand your position before you make a decision.</p></div>
              <a href="#money-check">See your money checklist →</a>
            </div>
            <div className="tool-grid">
              <article className="tool-card green" id="benefits">
                <div className="tool-top"><Icon>£</Icon><span className="pill">BEST FIRST STEP</span></div>
                <h3>Benefits checker</h3>
                <p>Use the official GOV.UK route to find independent calculators for benefits you may be entitled to.</p>
                <a className="card-btn" href="https://www.gov.uk/benefits-calculators" target="_blank" rel="noreferrer">Open GOV.UK <span>↗</span></a>
              </article>

              <article className="tool-card blue" id="savings">
                <div className="tool-top"><Icon>●</Icon></div>
                <h3>Savings calculator</h3>
                <p>See how regular saving could grow over time using an illustrative interest rate.</p>
                <div className="compact-fields">
                  <label>Starting £<input type="number" min="0" value={savings.start} onChange={(e) => setSavings({ ...savings, start: e.target.value })} /></label>
                  <label>Monthly £<input type="number" min="0" value={savings.monthly} onChange={(e) => setSavings({ ...savings, monthly: e.target.value })} /></label>
                  <label>Rate %<input type="number" step="0.1" value={savings.rate} onChange={(e) => setSavings({ ...savings, rate: e.target.value })} /></label>
                  <label>Years<input type="number" min="1" max="60" value={savings.years} onChange={(e) => setSavings({ ...savings, years: e.target.value })} /></label>
                </div>
                <div className="calc-result"><span>Illustrative value</span><strong>{money.format(savingsResult)}</strong></div>
              </article>

              <article className="tool-card lilac" id="pensions">
                <div className="tool-top"><Icon>↗</Icon></div>
                <h3>Pension illustration</h3>
                <p>Explore how a current pot and monthly contributions could grow over time.</p>
                <div className="compact-fields">
                  <label>Current £<input type="number" min="0" value={pension.start} onChange={(e) => setPension({ ...pension, start: e.target.value })} /></label>
                  <label>Monthly £<input type="number" min="0" value={pension.monthly} onChange={(e) => setPension({ ...pension, monthly: e.target.value })} /></label>
                  <label>Growth %<input type="number" step="0.1" value={pension.rate} onChange={(e) => setPension({ ...pension, rate: e.target.value })} /></label>
                  <label>Years<input type="number" min="1" max="60" value={pension.years} onChange={(e) => setPension({ ...pension, years: e.target.value })} /></label>
                </div>
                <div className="calc-result"><span>Illustrative value</span><strong>{money.format(pensionResult)}</strong></div>
              </article>
            </div>
            <p className="calculator-note">Calculator results are illustrations, not regulated financial forecasts. Actual returns, charges, tax and inflation can change outcomes.</p>
          </div>
        </section>

        <section className="section soft" id="money-check">
          <div className="page-shell progress-layout">
            <div className="progress-intro">
              <p className="kicker">Your money progress</p>
              <h2>One check at a time.</h2>
              <p>Tick each area after you have reviewed it. Your checklist is saved only in this browser.</p>
              <div className="progress-score"><strong>{progress}%</strong><span>checked</span></div>
              <div className="progress-track"><i style={{ width: `${progress}%` }} /></div>
            </div>
            <div className="check-list">
              {[
                ['Disability support', 'Check PIP, DLA, Adult Disability Payment or Attendance Allowance rules relevant to where you live.'],
                ['Income and housing support', 'Check Universal Credit, Council Tax Reduction and other income-related help.'],
                ['Pension position', 'Check your State Pension forecast and workplace or personal pension contributions.'],
                ['Emergency savings and ISA', 'Set a realistic emergency-fund target and understand available savings wrappers.']
              ].map(([title, text], index) => (
                <label className="check-item" key={title}>
                  <input type="checkbox" checked={checks[index]} onChange={() => toggleCheck(index)} />
                  <span><b>{index + 1}. {title}</b><small>{text}</small></span>
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="evidence">
          <div className="page-shell">
            <div className="section-heading">
              <p className="kicker">The financial accessibility gap</p>
              <h2>Why AccessToMoney needs to exist.</h2>
              <p>Real UK evidence shows that disability can affect household costs, pay and employment. We link the source so you can check each figure yourself.</p>
            </div>
            <div className="evidence-grid">
              {factsData.facts.map((fact) => (
                <article className="evidence-card" key={fact.title}>
                  <div className="stat-line"><strong>{fact.stat}</strong><span>{fact.suffix}</span></div>
                  <h3>{fact.title}</h3>
                  <p>{fact.description}</p>
                  <div className="mini-bars" aria-hidden="true">
                    <span><i style={{ width: `${Math.min(100, fact.chartValueA)}%` }} /></span>
                    <span><i style={{ width: `${Math.min(100, fact.chartValueB)}%` }} /></span>
                  </div>
                  <a href={fact.sourceUrl} target="_blank" rel="noreferrer">Source: {fact.source} ↗</a>
                </article>
              ))}
            </div>
            <p className="updated">Evidence dataset last updated {factsData.updated}.</p>
          </div>
        </section>

        <section className="section compare-section">
          <div className="page-shell compare-layout">
            <div>
              <p className="kicker">Compare with care</p>
              <h2>Know what to look for before choosing.</h2>
              <p>AccessToMoney does not rank regulated products yet. Instead, use these checklists to compare features, costs and accessibility fairly.</p>
              <div className="compare-grid">
                {[
                  ['▣', 'Bank accounts', 'Fees, support channels, app accessibility'],
                  ['●', 'Cash ISAs', 'Rate, access rules, protection and tax'],
                  ['✈', 'Travel money', 'Exchange rate, fees and accessible support'],
                  ['◇', 'Insurance', 'Cover, exclusions and communication support']
                ].map(([icon, title, text]) => (
                  <div className="compare-card" key={title}><Icon>{icon}</Icon><b>{title}</b><span>{text}</span></div>
                ))}
              </div>
            </div>

            <aside className="guide-panel" id="guides">
              <div className="guide-title"><div><p className="kicker">Guides & resources</p><h2>Practical next steps</h2></div></div>
              {guides.map((guide) => (
                <a className="guide-row" href={guide.href} target="_blank" rel="noreferrer" key={guide.title}>
                  <span className="guide-number" aria-hidden="true">→</span>
                  <span><b>{guide.title}</b><small>{guide.text}</small></span>
                  <strong aria-hidden="true">↗</strong>
                </a>
              ))}
            </aside>
          </div>
        </section>

        <section className="mission-section">
          <div className="page-shell mission-inner">
            <div><p className="kicker light">Our mission</p><h2>A fairer financial future.</h2><p>Everyone should have the opportunity to understand money, make informed choices and build financial confidence.</p></div>
            <a className="mission-btn" href="mailto:hello@accesstomoney.co.uk">Contact AccessToMoney →</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="page-shell footer-grid">
          <div><Brand /><p>{siteData.footerText}</p></div>
          <div><b>Explore</b><a href="#benefits">Benefits</a><a href="#calculators">Calculators</a><a href="#evidence">Evidence</a><a href="#guides">Guides</a></div>
          <div><b>Legal</b><a href="/accessibility.html">Accessibility</a><a href="/privacy.html">Privacy</a><a href="/affiliate-disclosure.html">Affiliate disclosure</a><a href="/admin/">Admin</a></div>
          <div><b>Contact</b><a href={`mailto:${siteData.email}`}>{siteData.email}</a><span>© 2026 AccessToMoney</span></div>
        </div>
      </footer>
    </>
  );
}
