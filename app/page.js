"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./globals.css";

const QUESTIONS = [
  { num: "Nails vs. Makeup", title: "Nails or Makeup?",
    line: "A fresh, custom manicure — or a highly-rated new eyeshadow palette?",
    a: "Custom manicure 💅", b: "Eyeshadow palette 🎨", right: "a" },
  { num: "Skin vs. Hair", title: "Skin or Hair?",
    line: "A premium glowing skincare routine — or a professional salon blowout?",
    a: "Glowing skincare ✨", b: "Salon blowout 💇‍♀️", right: "a" },
  { num: "Bags vs. Shoes", title: "Bags or Shoes?",
    line: "A luxury designer handbag — or a pair of high-end designer heels?",
    a: "Designer handbag 👜", b: "Designer heels 👠", right: "a" },
  { num: "Tulips vs. Chocolate", title: "Tulips or Chocolate?",
    line: "A beautiful bouquet of fresh tulips — or a giant box of gourmet chocolates?",
    a: "Fresh tulips 🌷", b: "Gourmet chocolates 🍫", right: "a" },
  { num: "Surprise vs. Plan", title: "Surprise or Plan?",
    line: "A spontaneous romantic surprise date — or a fancy pre-planned reservation?",
    a: "Spontaneous surprise 💫", b: "Pre-planned reservation 📅", right: "a" },
  { num: "Hand vs. Music", title: "My Hand or the Music?",
    line: "Me holding your hand while I drive — or you choosing the playlist for the ride?",
    a: "Hold my hand 🤝", b: "Pick the playlist 🎶", right: "a" },
  { num: "Dashboard vs. Mirror", title: "Dashboard or Mirror?",
    line: "A cute photoshoot with the phone on my dashboard — or aesthetic mirror selfies?",
    a: "Dashboard photoshoot 📸", b: "Mirror selfies 🪞", right: "a" },
  { num: "Vanilla vs. Strawberry", title: "Vanilla or Strawberry?",
    line: "A rich bowl of vanilla bean — or a scoop of strawberry cheesecake ice cream?",
    a: "Vanilla bean 🍦", b: "Strawberry cheesecake 🍓", right: "a" },
  { num: "White vs. Red Sauce", title: "White or Red Sauce?",
    line: "A plate of creamy white sauce pasta — or classic red sauce spaghetti?",
    a: "Creamy white sauce 🍝", b: "Red sauce spaghetti 🍅", right: "a" },
  { num: "Hot Choc vs. Macchiato", title: "Hot Choc or Macchiato?",
    line: "A steaming cup of rich hot chocolate — or a hot caramel macchiato?",
    a: "Hot chocolate ☕", b: "Caramel macchiato 🥤", right: "a" },
];

const HER_NAME = "betu";

// Photo URLs come from a Vercel env var (set via the upload script).
// Shape: { "1": ["https://...png", ...], "2": ["https://...png"], ... }
// Falls back to /photos/qN.png in local dev when the env var isn't set.
const PHOTO_MAP = (() => {
  try { return JSON.parse(process.env.NEXT_PUBLIC_PHOTOS || "{}"); }
  catch { return {}; }
})();

function Sky() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hearts = useMemo(
    () => Array.from({ length: 14 }, (_, i) => ({
      left: Math.random() * 100,
      dur: 14 + Math.random() * 16,
      delay: -Math.random() * 20,
      emoji: ["💗", "🌸", "✨", "🎀", "💌"][i % 5],
      size: 0.9 + Math.random() * 1.3,
    })), []);
  if (!mounted) return null;
  return (
    <div className="sky" aria-hidden>
      {hearts.map((h, i) => (
        <span key={i} className="floaty"
          style={{ left: `${h.left}%`, animationDuration: `${h.dur}s`,
            animationDelay: `${h.delay}s`, fontSize: `${h.size}rem` }}>
          {h.emoji}
        </span>
      ))}
    </div>
  );
}

function Login({ onIn }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  function go() {
    if (val.trim().toLowerCase() === HER_NAME) onIn();
    else setErr("hmm, not quite 🥺 try again!");
  }
  return (
    <motion.div className="card"
      initial={{ scale: 0.8, opacity: 0, rotate: -4 }}
      animate={{ scale: 1, opacity: 1, rotate: -0.6 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}>
      <h1 className="hand">hi, girllllll 🎀</h1>
      <p className="sub">a tiny thing i made just for you. let&apos;s play a game?</p>
      <div className="field">
        <label className="label" htmlFor="pw">secret password</label>
        <input id="pw" className="input" value={val}
          placeholder="psst… it&apos;s what i call you 💕"
          onChange={(e) => { setVal(e.target.value); setErr(""); }}
          onKeyDown={(e) => e.key === "Enter" && go()} />
      </div>
      {err && <div className="err">{err}</div>}
      <button className="btn" onClick={go}>let me in ➜</button>
      <p className="hint">(hint: the name i always call you)</p>
    </motion.div>
  );
}

// The "wrong" option dodges the cursor; freezes once any option has been chosen.
function RunawayOption({ className, onClick, frozen, children }) {
  const ref = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (frozen) { setOff({ x: 0, y: 0 }); return; }
    function onMove(e) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const T = 420;
      if (dist < T) {
        const force = (T - dist) * 4 + 80;
        const ang = Math.atan2(dy, dx);
        setOff({ x: -Math.cos(ang) * force, y: -Math.sin(ang) * force });
      } else {
        setOff({ x: 0, y: 0 });
      }
    }
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [frozen]);

  return (
    <motion.button
      ref={ref}
      className={className}
      animate={{ x: off.x, y: off.y, rotate: off.x * 0.03 }}
      transition={{ type: "tween", duration: 0.06, ease: "linear" }}
      style={{ pointerEvents: "none" }}
      onClick={onClick}>
      {children}
    </motion.button>
  );
}

function Burst({ items }) {
  return (
    <div className="pile" aria-hidden>
      <AnimatePresence>
        {items.map((it) => (
          <motion.div
            key={it.key}
            className="pile-photo"
            drag
            dragMomentum={false}
            dragElastic={0.15}
            initial={{ scale: 0, opacity: 0, rotate: it.rot + 80 }}
            animate={{ scale: 1, opacity: 1, rotate: it.rot }}
            exit={{
              scale: 0.2, opacity: 0, rotate: it.rot + 60,
              transition: { duration: 0.45, ease: "easeIn", delay: it.k * 0.02 },
            }}
            transition={{ type: "spring", stiffness: 160, damping: 14, delay: it.delay }}
            whileDrag={{ scale: 1.08, zIndex: 9999 }}
            style={{ left: it.x, top: it.y, zIndex: 10 + it.k }}>
            <div className="pile-tape" />
            <img src={it.src} alt="" draggable={false} />
            <div className="pile-cap">{it.cap}</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Random position that avoids the central card area on wider screens
// (so the card stays usable). On mobile the card fills most of the viewport
// and pile sits behind the card, so we just scatter anywhere.
function burstPos(vw, vh) {
  const isMobile = vw < 600;
  const pw = isMobile ? 140 : 220;
  const ph = isMobile ? 170 : 260;
  const maxX = Math.max(10, vw - pw - 10);
  const maxY = Math.max(10, vh - ph - 10);
  if (isMobile) {
    return { x: Math.random() * maxX, y: Math.random() * maxY };
  }
  const cl = vw / 2 - 340, ct = vh / 2 - 360;
  const cr = vw / 2 + 340, cb = vh / 2 + 360;
  for (let n = 0; n < 30; n++) {
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    if (x + pw < cl || x > cr || y + ph < ct || y > cb) return { x, y };
  }
  return { x: Math.random() * maxX, y: 5 };
}

function ConsentCard({ onAllow, onSkip }) {
  return (
    <motion.div className="card"
      initial={{ scale: 0.85, opacity: 0, rotate: -3 }}
      animate={{ scale: 1, opacity: 1, rotate: -0.6 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", stiffness: 130, damping: 12 }}>
      <h1 className="hand">one tiny thing 💕</h1>
      <p className="sub" style={{ marginTop: "0.8rem", lineHeight: 1.5 }}>
        can i see your face while you answer?<br />
        i wanna keep the moment forever 🎀
      </p>
      <button className="btn" onClick={onAllow}>yes, look at me ➜</button>
      <button className="ghost" onClick={onSkip}
        style={{ display: "block", margin: "0.6rem auto 0" }}>
        maybe later
      </button>
      <p className="hint" style={{ marginTop: "0.8rem" }}>
        (your browser will ask once — just click allow 💗)
      </p>
    </motion.div>
  );
}

function useReactionRecorder() {
  const streamRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  async function enable() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
        audio: true,
      });
      streamRef.current = stream;
      setEnabled(true);
      return true;
    } catch {
      setEnabled(false);
      return false;
    }
  }

  function capture(label, durationMs = 6000) {
    const stream = streamRef.current;
    if (!stream || typeof MediaRecorder === "undefined") return;
    let mime = "video/webm;codecs=vp9,opus";
    if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm;codecs=vp8,opus";
    if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm";
    if (!MediaRecorder.isTypeSupported(mime)) return;
    const rec = new MediaRecorder(stream, { mimeType: mime });
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      const name = `${label}-${ts}.webm`;
      try {
        await fetch("/api/upload", {
          method: "POST",
          body: blob,
          headers: { "x-filename": name, "content-type": "video/webm" },
        });
      } catch {}
    };
    rec.start();
    setTimeout(() => { if (rec.state === "recording") rec.stop(); }, durationMs);
  }

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  return { enabled, enable, capture };
}

function Quiz({ setBurst, capture }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const q = QUESTIONS[i];
  const chosen = answers[i];

  function pick(side) {
    if (chosen) return;
    setAnswers((p) => ({ ...p, [i]: side }));
    capture?.(`q${String(i + 1).padStart(2, "0")}-${side}`);
    const cap = (side === "a" ? q.a : q.b)
      .replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim();
    const sources = (q.imgs && q.imgs.length > 0)
      ? q.imgs
      : (PHOTO_MAP[i + 1] && PHOTO_MAP[i + 1].length > 0)
        ? PHOTO_MAP[i + 1]
        : [`/photos/q${i + 1}.png`];
    const vw = window.innerWidth, vh = window.innerHeight;
    const N = vw < 600 ? 8 : 15;
    const stamp = Date.now();
    const items = Array.from({ length: N }, (_, k) => {
      const pos = burstPos(vw, vh);
      return {
        key: `q${i}-${stamp}-${k}`,
        k,
        x: pos.x,
        y: pos.y,
        rot: (Math.random() - 0.5) * 40,
        delay: k * 0.035,
        src: sources[k % sources.length],
        cap,
      };
    });
    setBurst(items);
  }

  function next() {
    setBurst([]);
    if (i < QUESTIONS.length - 1) setI(i + 1);
    else setDone(true);
  }

  function back() {
    setBurst([]);
    setAnswers((p) => { const n = { ...p }; delete n[i - 1]; return n; });
    setI(i - 1);
  }

  if (done) {
    return (
      <motion.div className="card finale"
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h1 className="hand">i knew it was you all along 💖</h1>
        <p className="summary">
          every single answer… exactly like i imagined.<br />
          you&apos;re my favourite person, always. 🎀
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div className="card"
      initial={{ scale: 0.9, opacity: 0, rotate: -3 }}
      animate={{ scale: 1, opacity: 1, rotate: -0.6 }}>
      <div className="dots">
        {QUESTIONS.map((_, d) => (
          <span key={d} className={`dot ${d < i ? "done" : ""} ${d === i ? "now" : ""}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={i}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}>
          <div className="qnum">no. {i + 1} of {QUESTIONS.length} · {q.num}</div>
          <div className="qtitle">{q.title}</div>
          <p className="qline">{q.line}</p>

          <div className="opts">
            {["a", "b"].map((side) => {
              const cls = `opt ${chosen === side ? "chosen" : ""} ${chosen && chosen !== side ? "faded" : ""}`;
              const isRight = side === q.right;
              const label = side === "a" ? q.a : q.b;
              if (isRight) {
                return (
                  <motion.button key={side} className={cls}
                    whileTap={{ scale: 0.94 }} onClick={() => pick(side)}>
                    {label}
                  </motion.button>
                );
              }
              return (
                <RunawayOption key={side} className={cls}
                  frozen={!!chosen} onClick={() => pick(side)}>
                  {label}
                </RunawayOption>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="navrow">
        <button className="ghost" disabled={i === 0} onClick={back}>← back</button>
        <button className="ghost" disabled={!chosen} onClick={next}>
          {i === QUESTIONS.length - 1 ? "see surprise 🎁" : "next →"}
        </button>
      </div>
    </motion.div>
  );
}

export default function Page() {
  const [stage, setStage] = useState("login"); // login | consent | quiz
  const [burst, setBurst] = useState([]);
  const recorder = useReactionRecorder();

  async function handleAllow() {
    await recorder.enable();
    setStage("quiz");
  }

  return (
    <>
      <Sky />
      <Burst items={burst} />
      <div className="wrap">
        <AnimatePresence mode="wait">
          {stage === "login" && (
            <Login key="login" onIn={() => setStage("consent")} />
          )}
          {stage === "consent" && (
            <ConsentCard key="consent"
              onAllow={handleAllow}
              onSkip={() => setStage("quiz")} />
          )}
          {stage === "quiz" && (
            <Quiz key="quiz" setBurst={setBurst} capture={recorder.capture} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
