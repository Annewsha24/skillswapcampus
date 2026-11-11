import { useEffect, useRef, useState } from "react";
import { clean, makeLimiter } from "./security";
import { SKILLS } from "./data";

function useStore(key, seed) {
  const [v, setV] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key));
      return Array.isArray(raw) ? raw : seed; // ignore tampered storage
    } catch {
      return seed;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage unavailable */ }
  }, [key, v]);
  return [v, setV];
}
const uid = () => crypto.randomUUID();
const has = (a, b) => a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase());

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}
const Msg = ({ text }) => (text ? <p className="msg" role="alert">{text}</p> : null);

function Skills() {
  const [items, setItems] = useStore("cl-skills", SKILLS);
  const [q, setQ] = useState("");
  const [f, setF] = useState({ name: "", offer: "", want: "" });
  const [err, setErr] = useState("");
  const limit = useRef(makeLimiter(3, 60000)).current;

  const add = (e) => {
    e.preventDefault();
    const d = { name: clean(f.name, 30), offer: clean(f.offer, 40), want: clean(f.want, 40) };
    if (!d.name || !d.offer || !d.want) return setErr("Fill in your name, what you offer and what you want.");
    if (!limit()) return setErr("Too many posts. Wait a minute and try again.");
    setItems([{ id: uid(), ...d, requested: false }, ...items].slice(0, 100));
    setF({ name: "", offer: "", want: "" });
    setErr("");
  };
  const shown = items.filter((s) => !q || `${s.offer} ${s.want} ${s.name}`.toLowerCase().includes(clean(q, 40).toLowerCase()));

  return (
    <section aria-labelledby="t-skills">
      <h2 id="t-skills">Skill Swap</h2>
      <p className="lead">Teach one thing, learn another. No money involved.</p>
      <form className="post" onSubmit={add}>
        <Field label="Your name"><input value={f.name} maxLength={30} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
        <Field label="I can teach"><input value={f.offer} maxLength={40} onChange={(e) => setF({ ...f, offer: e.target.value })} /></Field>
        <Field label="I want to learn"><input value={f.want} maxLength={40} onChange={(e) => setF({ ...f, want: e.target.value })} /></Field>
        <button className="btn">Post swap</button>
        <Msg text={err} />
      </form>
      <input className="search" aria-label="Search skills" placeholder="Search skills or names" value={q} maxLength={40} onChange={(e) => setQ(e.target.value)} />
      <div className="grid">
        {shown.length === 0 && <p className="empty">No swaps match. Post the first one.</p>}
        {shown.map((s) => {
          const match = items.find((b) => b.id !== s.id && has(b.offer, s.want) && has(s.offer, b.want));
          return (
            <article key={s.id} className={"card swap" + (match ? " match" : "")}>
              <h3>{s.name}</h3>
              <div className="split">
                <div><small>Teaches</small><strong>{s.offer}</strong></div>
                <div><small>Wants</small><strong>{s.want}</strong></div>
              </div>
              {match && <p className="badge">Mutual match with {match.name}</p>}
              <button className="btn ghost" disabled={s.requested}
                onClick={() => setItems(items.map((x) => (x.id === s.id ? { ...x, requested: true } : x)))}>
                {s.requested ? "Request sent" : "Request swap"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <header className="top">
        <h1>SkillSwap</h1>
        <p>Teach one thing, learn another. Trade skills with students on your campus.</p>
      </header>
      <main><Skills /></main>
      <footer>Demo data is stored in your browser only. Never share passwords or personal IDs here.</footer>
    </>
  );
}
