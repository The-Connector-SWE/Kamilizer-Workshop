// ui.jsx — presentational components for the workshop site.
// Exports to window: AuroraBg, TopBar, HomeView, ModuleView, QuizView.
const { useState, useEffect, useRef } = React;

/* ---------------- Animated aurora background ---------------- */
function AuroraBg() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="blob b1"></span>
      <span className="blob b2"></span>
      <span className="blob b3"></span>
      <span className="blob b4"></span>
      <div className="grain"></div>
    </div>
  );
}

/* ---------------- Top bar with progress + score ---------------- */
function TopBar({ modules, completed, scoreEarned, scorePossible, onHome, view, onJump }) {
  const pct = Math.round((completed.length / modules.length) * 100);
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome}>
        <span className="brand-mark">
          <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M16 3 C16 10 22 16 29 16 C22 16 16 22 16 29 C16 22 10 16 3 16 C10 16 16 10 16 3 Z" />
          </svg>
        </span>
        <span className="brand-name">Director's Lab</span>
      </button>

      <nav className="pagelinks">
        <button className="plink active" onClick={onHome}>Platforms</button>
        <a className="plink" href="agenda.html">Agenda</a>
        <a className="plink" href="labs.html">Labs</a>
        <a className="plink" href="real-or-ai.html">Real or AI</a>
        <a className="plink" href="resources.html">Resources</a>
      </nav>

      <nav className="topnav" aria-hidden="true" style={{ display: "none" }}>
        {modules.map((m) => {
          const done = completed.includes(m.id);
          const active = view.type !== "home" && view.id === m.id;
          return (
            <button key={m.id} className={"navdot" + (active ? " active" : "") + (done ? " done" : "")}
              onClick={() => onJump(m.id)} title={m.title}>
              <i></i><span>{String(m.id).padStart(2, "0")}</span>
            </button>
          );
        })}
      </nav>

      <div className="topmeta">
        <div className="topprog">
          <div className="topprog-track"><i style={{ width: pct + "%" }}></i></div>
          <span>{completed.length}/{modules.length}</span>
        </div>
        <div className="topscore">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.7 1.4 6.8L12 17.8 5.9 20.5l1.4-6.8L2.2 9l6.9-.7z"/></svg>
          {scoreEarned}<small>/{scorePossible}</small>
        </div>
      </div>
    </header>
  );
}

/* ---------------- Home / hub ---------------- */
function HomeView({ modules, platforms, completed, scores, onEnter, allDone, onReset }) {
  const totalPlatforms = Object.keys(platforms).length;
  return (
    <main className="screen home" key="home">
      <section className="hero">
        <div className="pill anim a1"><span className="dot"></span> A 2-day generative journey</div>
        <h1 className="anim a2">The AI Video<br /><span className="iri">Director's Lab</span></h1>
        <p className="hero-sub anim a3">
          You are the director — AI is your crew. Glide through every platform in the modern
          production stack, one module at a time, and test yourself as you go.
        </p>
        <div className="hero-stats anim a4">
          <div className="hstat"><b>{modules.length}</b><span>Modules</span></div>
          <div className="hstat"><b>{totalPlatforms}</b><span>Platforms</span></div>
          <div className="hstat"><b>{modules.reduce((n, m) => n + m.quiz.length, 0)}</b><span>Quiz cards</span></div>
        </div>
      </section>

      {allDone && (
        <div className="complete-banner anim a4">
          <div className="cb-glow"></div>
          <strong>Workshop complete.</strong> You've cleared every module. Replay any quiz to beat your score.
        </div>
      )}

      <section className="timeline">
        {modules.map((m, i) => {
          const done = completed.includes(m.id);
          const sc = scores[m.id];
          return (
            <button key={m.id} className={"mcard anim a" + (i + 4) + (done ? " done" : "")}
              style={{ animationDelay: 0.15 + i * 0.08 + "s" }} onClick={() => onEnter(m.id)}>
              <div className="mcard-top">
                <span className="mcard-kicker">{m.kicker}</span>
                {done
                  ? <span className="mcard-badge done">✓ {sc.score}/{sc.total}</span>
                  : <span className="mcard-badge">{m.platforms.length} platform{m.platforms.length > 1 ? "s" : ""}</span>}
              </div>
              <h3 className="mcard-title">{m.title}</h3>
              <p className="mcard-sum">{m.summary}</p>
              <div className="mcard-foot">
                <div className="mcard-logos">
                  {m.platforms.slice(0, 5).map((pid) => (
                    <span className="mini-logo" key={pid} style={{ color: platforms[pid].hue }}>
                      <PlatformLogo id={pid} size={18} />
                    </span>
                  ))}
                  {m.platforms.length > 5 && <span className="mini-more">+{m.platforms.length - 5}</span>}
                </div>
                <span className="mcard-go">{done ? "Review" : "Enter"} <i>→</i></span>
              </div>
            </button>
          );
        })}
      </section>

      <button className="reset" onClick={onReset}>Reset progress</button>
    </main>
  );
}

/* ---------------- Platform flip card ---------------- */
function PlatformCard({ p, index }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef(null);
  function onMove(e) {
    const el = ref.current; if (!el || flipped) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg");
    el.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
  }
  function onLeave() {
    const el = ref.current; if (!el) return;
    el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
  }
  return (
    <div className="pcard-wrap anim" style={{ animationDelay: 0.05 + index * 0.06 + "s", "--hue": p.hue }}>
      <div ref={ref} className={"pcard3d" + (flipped ? " flipped" : "")}
        onMouseMove={onMove} onMouseLeave={onLeave}>
        {/* front */}
        <div className="pface pfront">
          <div className="pglow"></div>
          <div className="pcard-head">
            <span className="plogo" style={{ color: p.hue }}><PlatformLogo id={p.id} size={30} /></span>
            <div className="pcard-id">
              <h4>{p.name}</h4>
              <span className="pvendor">{p.vendor}</span>
            </div>
          </div>
          <div className="ptag" style={{ color: p.hue }}>{p.tagline}</div>
          <p className="pabout">{p.about}</p>
          <div className="pcard-actions">
            <button className="pflip-btn" onClick={() => setFlipped(true)}>
              How we use it <i>→</i>
            </button>
            {p.url && (
              <a className="pflip-btn psite" href={p.url} target="_blank" rel="noopener noreferrer">
                Open {p.name} <i>↗</i>
              </a>
            )}
          </div>
        </div>
        {/* back */}
        <div className="pface pback">
          <div className="pglow"></div>
          <div className="pback-head">
            <span className="plogo sm" style={{ color: p.hue }}><PlatformLogo id={p.id} size={22} /></span>
            <h4>How we use {p.name}</h4>
          </div>
          <ul className="usage">
            {p.usage.map((u, i) => (
              <li key={i} style={{ "--hue": p.hue }}><span className="u-dot"></span>{u}</li>
            ))}
          </ul>
          <button className="pflip-btn back" onClick={() => setFlipped(false)}>
            <i>←</i> Back
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Module view ---------------- */
function ModuleView({ module, platforms, onStartQuiz, onBack, done, score }) {
  const cards = module.platforms.map((pid) => platforms[pid]);
  // Module 2: split image vs video models
  let body;
  if (module.id === 2) {
    const image = cards.slice(0, 3);
    const video = cards.slice(3);
    body = (
      <>
        <div className="group-label">Image models <span>Build your frames</span></div>
        <div className="pgrid">{image.map((p, i) => <PlatformCard key={p.id} p={p} index={i} />)}</div>
        <div className="group-label vid">Video models <span>Bring them to life</span></div>
        <div className="pgrid">{video.map((p, i) => <PlatformCard key={p.id} p={p} index={i} />)}</div>
      </>
    );
  } else {
    body = <div className="pgrid">{cards.map((p, i) => <PlatformCard key={p.id} p={p} index={i} />)}</div>;
  }

  return (
    <main className="screen module" key={"m" + module.id}>
      <button className="back-link anim a1" onClick={onBack}><i>←</i> All modules</button>
      <header className="mod-head anim a2">
        <span className="mod-kicker">{module.kicker}</span>
        <h2 className="mod-title">{module.title}</h2>
        <p className="mod-sum">{module.summary}</p>
      </header>

      <div className="anim a3">{body}</div>

      <section className="quiz-cta anim a3">
        <div className="qcta-inner">
          <div>
            <span className="qcta-kicker">Stay active</span>
            <h3>{done ? "Replay the module quiz" : "Quick check"}</h3>
            <p>{module.quiz.length} multiple-choice cards with instant feedback.
              {done && score ? ` Your best: ${score.score}/${score.total}.` : ""}</p>
          </div>
          <button className="qcta-btn" onClick={onStartQuiz}>
            {done ? "Replay quiz" : "Start quiz"} <i>→</i>
          </button>
        </div>
      </section>
    </main>
  );
}

/* ---------------- Quiz view ---------------- */
function QuizView({ module, onComplete, onExit }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const q = module.quiz[idx];
  const total = module.quiz.length;

  function pick(i) {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 < total) { setIdx(idx + 1); setPicked(null); }
    else { setFinished(true); onComplete(score + 0); }
  }
  function restart() { setIdx(0); setPicked(null); setScore(0); setFinished(false); }

  if (finished) {
    const pct = Math.round((score / total) * 100);
    const great = pct >= 80, ok = pct >= 50;
    return (
      <main className="screen quiz" key={"qr" + module.id}>
        <div className="quiz-result anim a2">
          <div className={"qr-ring " + (great ? "great" : ok ? "ok" : "low")}>
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="ring-bg" />
              <circle cx="60" cy="60" r="52" className="ring-fg"
                style={{ strokeDasharray: 2 * Math.PI * 52, strokeDashoffset: 2 * Math.PI * 52 * (1 - score / total) }} />
            </svg>
            <div className="qr-num"><b>{score}</b><span>/ {total}</span></div>
          </div>
          <h2>{great ? "Sharp work, director." : ok ? "Solid run." : "Worth another take."}</h2>
          <p>{great ? "You've got this module's stack dialed in."
            : ok ? "You're getting the hang of the toolset." : "Flip back through the cards and try again."}</p>
          <div className="qr-actions">
            <button className="btn-ghost" onClick={restart}>Try again</button>
            <button className="btn-primary" onClick={onExit}>Continue <i>→</i></button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="screen quiz" key={"q" + module.id}>
      <div className="quiz-top anim a1">
        <button className="back-link" onClick={onExit}><i>←</i> Exit quiz</button>
        <div className="quiz-dots">
          {module.quiz.map((_, i) => (
            <span key={i} className={"qdot" + (i < idx ? " past" : "") + (i === idx ? " cur" : "")}></span>
          ))}
        </div>
        <span className="quiz-count">{idx + 1} / {total}</span>
      </div>

      <div className="quiz-card anim a2" key={idx}>
        <span className="quiz-kicker">{module.kicker} · Quick Check</span>
        <h2 className="quiz-q">{q.q}</h2>
        <div className="quiz-opts">
          {q.options.map((opt, i) => {
            let cls = "qopt";
            if (picked !== null) {
              if (i === q.answer) cls += " correct";
              else if (i === picked) cls += " wrong";
              else cls += " dim";
            }
            return (
              <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
                <span className="qk">{String.fromCharCode(65 + i)}</span>
                <span className="qopt-text">{opt}</span>
                {picked !== null && i === q.answer && <span className="qmark ok">✓</span>}
                {picked !== null && i === picked && i !== q.answer && <span className="qmark no">✕</span>}
              </button>
            );
          })}
        </div>
        <div className={"quiz-why" + (picked !== null ? " show" : "")}>
          {picked !== null && (
            <>
              <strong className={picked === q.answer ? "good" : "bad"}>
                {picked === q.answer ? "Correct" : "Not quite"}
              </strong>
              <span>{q.why}</span>
            </>
          )}
        </div>
        <div className="quiz-foot">
          <button className={"btn-primary" + (picked === null ? " disabled" : "")}
            onClick={next} disabled={picked === null}>
            {idx + 1 < total ? "Next card" : "See results"} <i>→</i>
          </button>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { AuroraBg, TopBar, HomeView, ModuleView, QuizView, PlatformCard });
