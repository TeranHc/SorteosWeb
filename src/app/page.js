"use client";

import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════
   PRIZE DATA  (keep & extend freely)
══════════════════════════════════════ */
const PRIZES = [
  {
    id: 1,
    name: "Canasta Familiar",
    status: "active",
    description: "Canasta premium con productos de primera necesidad, frutas frescas y golosinas para toda la familia.",
    emoji: "🧺",
    color: "#C9A84C",
    colorRgb: "201,168,76",
    total: 50,
    precioBoleto: 5.00,
    fechaSorteo: "2026-04-15",
    horaSorteo: "20:00",
  },
  {
    id: 2,
    name: "Viaje Todo Incluido",
    status: "active",
    description: "Paquete para 2 personas a Galápagos: 4 noches, vuelos, hotel y tour de naturaleza.",
    emoji: "✈️",
    color: "#4ABFB8",
    colorRgb: "74,191,184",
    total: 100,
    precioBoleto: 15.00,
    fechaSorteo: "2026-05-20",
    horaSorteo: "18:00",
  },
  {
    id: 3,
    name: "Canasta Navideña",
    status: "active",
    description: "Panetón, sidra, chocolates importados, jamón serrano y mucho más para celebrar en grande.",
    emoji: "🎄",
    color: "#4BC98A",
    colorRgb: "75,201,138",
    total: 80,
    precioBoleto: 7.50,
    fechaSorteo: "2026-12-15",
    horaSorteo: "21:00",
  },
  {
    id: 4,
    name: "Spa & Bienestar",
    status: "active",
    description: "Día completo de spa para 2: masajes, facial, jacuzzi y cena romántica incluida.",
    emoji: "💆",
    color: "#E8879A",
    colorRgb: "232,135,154",
    total: 60,
    precioBoleto: 10.00,
    fechaSorteo: "2026-04-01",
    horaSorteo: "17:00",
  },
  {
    id: 5,
    name: "iPhone 15 Pro Max",
    status: "upcoming",
    description: "Próximamente: El último smartphone de Apple puede ser tuyo.",
    emoji: "📱",
    color: "#8FA8CC",
    colorRgb: "143,168,204",
    total: 200,
    precioBoleto: 10.00,
    fechaSorteo: "2026-05-01",
    horaSorteo: "21:00",
  },
  {
    id: 6,
    name: "Smart TV 65\"",
    status: "finished",
    description: "Finalizado: Ganador - Carlos R. de Guayaquil.",
    emoji: "📺",
    color: "#7E1530",
    colorRgb: "126,21,48",
    total: 100,
    precioBoleto: 8.00,
    fechaSorteo: "2026-03-15",
    horaSorteo: "19:00",
    winnerName: "Carlos Rodríguez",
    winningNumber: "42",
  }
];

/* ══════════════════════════════════════
   HELPERS (Definición de Funciones)
══════════════════════════════════════ */
const generateNumbers = (total) => {
  const taken = new Set();
  const count = Math.floor(total * 0.45);
  while (taken.size < count) {
    taken.add(Math.floor(Math.random() * total) + 1);
  }
  return taken;
};

// ESTA ES LA FUNCIÓN QUE FALTABA:
const calculateTimeLeft = (date, time) => {
  if (!date || !time) return { days: 0, hours: 0, minutes: 0 };
  const target = new Date(`${date}T${time}:00`);
  const now = new Date();
  const difference = target - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
    };
  }
  return { days: 0, hours: 0, minutes: 0 };
};

const initialTaken = PRIZES.reduce((acc, p) => {
  acc[p.id] = generateNumbers(p.total);
  return acc;
}, {});

/* ══════════════════════════════════════
   COMPONENT
══════════════════════════════════════ */
export default function SorteosPage() {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("active");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [tempReservation, setTempReservation] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [takenMap, setTakenMap] = useState(initialTaken);
  const [userPicks, setUserPicks] = useState({});
  const [modal, setModal] = useState(null);
  const [theme, setTheme] = useState("night"); // "night" | "classic"
  const selectionSectionRef = useRef(null);


  /* ── Theme persistence ── */
  useEffect(() => {
    const saved = localStorage.getItem("sorteos-theme") || "night";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sorteos-theme", theme);
  }, [theme]);

  /* ── Derived ── */
  const activePrize = PRIZES.find((p) => p.id === selected) || null;
  const toggleTheme = () => setTheme((t) => (t === "night" ? "classic" : "night"));
  const filteredPrizes = PRIZES.filter(p => p.status === activeTab);

  /* ── Number selection ── */
  const handleNumberClick = (num) => {
    if (!selected) return;
    if (takenMap[selected].has(num)) return;
    setUserPicks((prev) => {
      const current = new Set(prev[selected] || []);
      current.has(num) ? current.delete(num) : current.add(num);
      return { ...prev, [selected]: current };
    });
  };

  /* ── Efecto de Sonido Casino ── */
  const playWinSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3"); // Sonido de ganancia/monedas
    audio.volume = 0.4;
    audio.play().catch(err => console.log("Audio play blocked by browser"));
  };

  // Efecto para scroll automático al seleccionar un premio
  useEffect(() => {
    if (selected && selectionSectionRef.current) {
      selectionSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [selected]); // Se dispara cada vez que cambia el premio seleccionado

  // --- WHATSAPP URL ---
  const getWhatsAppUrl = (prizeName, nums) => {
    const phoneNumber = "593994960278"; // CAMBIA ESTO POR TU NÚMERO
    const message = `¡Hola Sorteos La Fortuna! 👋\n\nHe realizado una transferencia para: *${prizeName}*.\nMis números: *${nums.join(" · ")}*.\n\nAdjunto comprobante.`;
    return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
  };

  // --- FLUJO DE RESERVA ---
  const handleReserve = () => {
    if (!selected || !userPicks[selected]?.size) return;
    setTempReservation({
      prize: activePrize,
      nums: [...userPicks[selected]],
      total: userPicks[selected].size * activePrize.precioBoleto
    });
    setShowPayment(true);
  };

  const confirmFinalPurchase = () => {
    playWinSound();
    setTakenMap(prev => ({
      ...prev,
      [selected]: new Set([...prev[selected], ...tempReservation.nums]),
    }));
    setModal(tempReservation);
    setShowPayment(false);
    setUserPicks(prev => ({ ...prev, [selected]: new Set() }));
  };

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      color: "var(--text-primary)",
      transition: "background 0.5s, color 0.5s",
      fontFamily: "var(--font-body)",
    }}>

      {/* ══════════ NAV ══════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5%", height: "64px",
        background: "var(--nav-bg)",
        borderBottom: "1px solid var(--border-mid)",
        backdropFilter: "blur(12px)",
        transition: "background 0.5s",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1.4rem", fontWeight: 900,
          letterSpacing: "0.08em",
          color: "var(--accent-gold)",
          display: "flex", alignItems: "center", gap: "0.4rem",
        }}>
          ♦ Sorteos<span style={{ color: "var(--accent-ruby)" }}>La Fortuna</span>
        </div>

        {/* Nav right */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={theme === "night" ? "Cambiar a modo clásico" : "Cambiar a modo noche"}
            style={{
              width: "52px", height: "28px",
              background: "var(--bg-sunken)",
              border: "1px solid var(--border-mid)",
              borderRadius: "14px",
              position: "relative", cursor: "pointer",
              display: "flex", alignItems: "center", padding: "3px",
              transition: "all 0.3s",
            }}
          >
            <div style={{
              width: "20px", height: "20px",
              background: "var(--accent-gold)",
              borderRadius: "50%",
              transform: theme === "night" ? "translateX(24px)" : "translateX(0)",
              transition: "transform 0.3s var(--ease)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "10px",
            }}>
              {theme === "night" ? "🌙" : "☀️"}
            </div>
          </button>
        </div>
      </nav>

      {/* ══════════ HERO ══════════ */}
      <header style={{
        paddingTop: "64px",
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Radial background */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 30%, rgba(201,168,76,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 15% 80%, rgba(192,40,74,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 70%, rgba(43,74,124,0.06) 0%, transparent 60%),
            var(--bg-base)
          `,
        }} />
        {/* Art-deco lattice overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: `
            repeating-linear-gradient(45deg,  transparent 0px, transparent 40px, rgba(201,168,76,0.025) 40px, rgba(201,168,76,0.025) 41px),
            repeating-linear-gradient(-45deg, transparent 0px, transparent 40px, rgba(201,168,76,0.025) 40px, rgba(201,168,76,0.025) 41px)
          `,
        }} />

        <div style={{
          position: "relative",
          zIndex: 1, // Capa base del contenido del Hero
          padding: "2rem 5%",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          // Asegúrate de que NO haya overflow: hidden aquí
        }}>

          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.6rem",
            border: "1px solid var(--border-accent)",
            color: "var(--accent-gold)",
            fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase",
            padding: "0.4rem 1.4rem", borderRadius: "100px",
            marginBottom: "2rem",
            animation: "fadeUp 0.7s ease both",
          }}>
            <span style={{
              width: "5px", height: "5px",
              background: "var(--accent-gold)",
              borderRadius: "50%", display: "inline-block",
              animation: "blink 2s ease infinite",
            }} />
            Sorteos Premium · Ecuador
          </div>

          {/* H1 — Cinzel font */}
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            fontWeight: 700, lineHeight: 1.05,
            letterSpacing: "0.02em",
            margin: "0 0 0.5rem",
            animation: "fadeUp 0.7s 0.1s ease both",
          }}>
            <span style={{ color: "var(--accent-gold)" }}>Sorteos</span>{" "}
            <span style={{ color: "var(--text-primary)" }}>La</span>{" "}
            <span style={{ color: "var(--accent-ruby)" }}>Fortuna</span>
          </h1>

          {/* Subtitle — Playfair italic */}
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
            fontStyle: "italic",
            color: "var(--text-secondary)",
            marginBottom: "2.5rem",
            animation: "fadeUp 0.7s 0.15s ease both",
          }}>
            Participa en nuestros sorteos exclusivos y llévate premios extraordinarios.
          </p>

          {/* CTA row */}
          <div style={{
            display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap",
            animation: "fadeUp 0.7s 0.2s ease both",
            marginBottom: "4rem",
          }}>
            <button
              onClick={() => document.getElementById("sorteos-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "linear-gradient(135deg, var(--gold-300), var(--gold-500))",
                color: "var(--gold-900)", border: "none",
                padding: "0.75rem 1.8rem",
                fontSize: "0.8rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.1em",
                borderRadius: "var(--r-sm)", cursor: "pointer", transition: "all 0.3s",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              ✦ Ver Sorteos
            </button>
            {/* Contenedor relativo para el botón y el tooltip */}
            <div
              style={{ position: "relative", display: "inline-block" }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                style={{
                  border: "1px solid var(--border-accent)",
                  color: "var(--accent-gold)",
                  background: "transparent",
                  padding: "0.75rem 1.8rem",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  borderRadius: "var(--r-sm)",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-gold)";
                  e.currentTarget.style.color = "var(--text-inverse)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--accent-gold)";
                }}
              >
                Cómo Funciona
              </button>
              {/* --- TOOLTIP CORREGIDO --- */}
              {showTooltip && (
                <div style={{
                  position: "absolute",
                  bottom: "calc(100% + 25px)", // Un poco más de aire
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "320px",
                  background: "var(--bg-elevated)", // USA EL COLOR DEL TEMA (OPACO)
                  border: "1px solid var(--accent-gold)",
                  borderRadius: "var(--r-lg)",
                  padding: "1.5rem",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.9)", // Sombra pesada para dar profundidad
                  zIndex: 9999, // VALOR EXTREMO para garantizar visibilidad por encima del Hero
                  textAlign: "left",
                  animation: "fadeUp 0.3s ease both",
                  pointerEvents: "none",
                }}>
                  {/* Triángulo indicador apuntando hacia abajo */}
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0, height: 0,
                    borderLeft: "10px solid transparent",
                    borderRight: "10px solid transparent",
                    borderTop: "10px solid var(--accent-gold)",
                  }} />

                  <h4 style={{
                    fontFamily: "var(--font-brand)",
                    color: "var(--accent-gold)",
                    fontSize: "0.9rem",
                    marginTop: 0,
                    marginBottom: "1rem",
                    borderBottom: "1px solid var(--border-subtle)",
                    paddingBottom: "0.5rem"
                  }}>
                    Pasos para Participar
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                      { step: "1", title: "Elige tu Premio", desc: "Selecciona un sorteo 'Activo' en la cartelera." },
                      { step: "2", title: "Escoge tus Números", desc: "Usa la grilla para marcar tus números de la suerte." },
                      { step: "3", title: "Paga y Confirma", desc: "Paga por transferencia o tarjeta y sube tu comprobante." }
                    ].map(item => (
                      <div key={item.step} style={{ display: "flex", gap: "0.85rem", alignItems: "start" }}>
                        <div style={{
                          width: "22px", height: "22px",
                          background: "var(--accent-gold)",
                          color: "var(--text-inverse)",
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 900, fontSize: "0.75rem",
                          flexShrink: 0
                        }}>
                          {item.step}
                        </div>
                        <div>
                          <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "0.85rem" }}>{item.title}</div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", lineHeight: 1.4 }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{
              display: "flex",
              border: "1px solid var(--border-mid)",
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              background: "var(--bg-surface)",
              maxWidth: "560px", margin: "0 auto",
              animation: "fadeUp 0.7s 0.25s ease both",
            }}>
              {[
                { num: `${PRIZES.length}`, label: "Sorteos Activos" },
                { num: `${PRIZES.reduce((s, p) => s + p.total, 0)}`, label: "Números Totales" },
                { num: "$1", label: "Desde" },
              ].map((stat, i) => (
                <div key={i} style={{
                  flex: 1, padding: "1.2rem 1rem", textAlign: "center",
                  borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none",
                }}>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1.8rem", fontWeight: 700,
                    color: "var(--accent-gold)", display: "block",
                  }}>
                    {stat.num}
                  </span>
                  <span style={{
                    fontSize: "0.68rem", textTransform: "uppercase",
                    letterSpacing: "0.14em", color: "var(--text-muted)",
                  }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
            color: "var(--text-muted)", fontSize: "1.5rem",
            animation: "blink 2s ease infinite",
          }}>
            ⌄
          </div>
        </div>
      </header>

      {/* ══════════ MAIN ══════════ */}
      <main id="sorteos-section" style={{ maxWidth: "960px", margin: "0 auto", padding: "5rem 5% 80px" }}>

        {/* --- ENCABEZADO Y PESTAÑAS --- */}
        <section>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--accent-gold)", display: "block", marginBottom: "0.75rem" }}>
              ✦ Cartelera de Premios
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.8rem", color: "var(--text-primary)", marginBottom: "2rem" }}>
              Explora nuestros <em style={{ fontStyle: "italic", color: "var(--accent-gold)" }}>Sorteos</em>
            </h2>

            <div style={{
              display: "flex", justifyContent: "center", gap: "1rem",
              borderBottom: "1px solid var(--border-subtle)", paddingBottom: "1rem", marginBottom: "2.5rem"
            }}>
              {[
                { id: "active", label: "Activos", icon: "🔥" },
                { id: "upcoming", label: "Próximos", icon: "⏳" },
                { id: "finished", label: "Finalizados", icon: "🏆" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelected(null); }}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    padding: "0.5rem 1.5rem", position: "relative",
                    color: activeTab === tab.id ? "var(--accent-gold)" : "var(--text-muted)",
                    transition: "all 0.3s ease", fontFamily: "var(--font-body)",
                    fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.1em"
                  }}
                >
                  {tab.icon} {tab.label}
                  {activeTab === tab.id && (
                    <div style={{
                      position: "absolute", bottom: "-1rem", left: 0, right: 0,
                      height: "2px", background: "var(--accent-gold)",
                      boxShadow: "0 0 10px var(--accent-gold)"
                    }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* --- GRID DE TARJETAS REDISEÑADAS --- */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
            {filteredPrizes.length > 0 ? (
              filteredPrizes.map((prize) => {
                const isFinished = activeTab === "finished";
                const isUpcoming = activeTab === "upcoming";
                const isActive = selected === prize.id;
                const taken = takenMap[prize.id]?.size || 0;
                const free = prize.total - taken;
                const pct = (taken / prize.total) * 100;

                // Cálculo de tiempo restante (Helper)
                const timeLeft = !isFinished && !isUpcoming ? calculateTimeLeft(prize.fechaSorteo, prize.horaSorteo) : null;

                return (
                  <div
                    key={prize.id}
                    style={{
                      background: isActive ? "var(--bg-elevated)" : "var(--bg-surface)",
                      border: isActive ? "2px solid var(--accent-gold)" : "1px solid var(--border-subtle)",
                      borderRadius: "var(--r-lg)",
                      padding: "1.5rem",
                      display: "flex", flexDirection: "column", gap: "1rem",
                      position: "relative", overflow: "hidden",
                      boxShadow: isActive ? `0 12px 40px rgba(${prize.colorRgb}, 0.2)` : "var(--card-shadow)",
                      transition: "all 0.4s var(--ease)",
                      transform: isActive ? "translateY(-8px)" : "translateY(0)",
                      filter: isFinished ? "grayscale(0.5)" : "none",
                    }}
                  >
                    {/* Badge de Estado */}
                    <div style={{
                      position: "absolute", top: "0.75rem", right: "0.75rem",
                      background: isFinished ? "#555" : isUpcoming ? "var(--accent-navy)" : prize.color,
                      color: "#FFFFFF", fontSize: "0.6rem", borderRadius: "100px",
                      padding: "0.2rem 0.65rem", fontWeight: 700, textTransform: "uppercase", zIndex: 10
                    }}>
                      {isFinished ? "CERRADO" : isUpcoming ? "PRONTO" : "ACTIVO"}
                    </div>

                    {/* Header: Emoji y Precio */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ fontSize: "3rem", background: "var(--bg-sunken)", padding: "0.5rem", borderRadius: "var(--r-md)", border: "1px solid var(--border-subtle)" }}>
                        {prize.emoji}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "var(--font-brand)", fontSize: "1.6rem", color: "var(--accent-gold)", fontWeight: 700 }}>
                          ${(prize.precioBoleto || 5).toFixed(2)}
                        </div>
                        <div className="label-xs">por boleto</div>
                      </div>
                    </div>

                    {/* Info del Premio */}
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
                        {prize.name}
                      </h3>
                      {!isFinished && (
                        <div style={{ marginBottom: "1rem" }}>
                          <div style={{ height: "4px", background: "var(--border-subtle)", borderRadius: "100px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(to right, ${prize.color}, var(--accent-gold))`, borderRadius: "100px" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", marginTop: "0.3rem", color: "var(--text-muted)" }}>
                            <span>{taken} vendidos</span>
                            <span>{free} disponibles</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Detalles Técnicos */}
                    <div style={{ background: "var(--bg-sunken)", padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--border-subtle)", fontSize: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <span style={{ color: "var(--text-muted)" }}>Fecha:</span>
                        <span style={{ fontWeight: 700 }}>{prize.fechaSorteo || "Pendiente"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-muted)" }}>Hora:</span>
                        <span style={{ fontWeight: 700 }}>{prize.horaSorteo || "20:00"}</span>
                      </div>
                    </div>

                    {/* Tiempo / Ganador */}
                    <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-subtle)" }}>
                      {isFinished ? (
                        <div style={{ textAlign: "center" }}>
                          <div className="label-xs" style={{ color: "var(--accent-gold)" }}>Ganador Oficial 🏆</div>
                          <div style={{ fontWeight: 700 }}>{prize.winnerName || "Carlos R."}</div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Boleto: #{prize.winningNumber || "42"}</div>
                        </div>
                      ) : isUpcoming ? (
                        <div style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", fontStyle: "italic" }}>
                          Ventas abren pronto
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          <div className="label-xs" style={{ color: "var(--accent-ruby)", marginBottom: "0.4rem" }}>Cierra en: ⏳</div>
                          <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", fontFamily: "var(--font-numbers)", fontSize: "1.1rem" }}>
                            <span style={{ background: "var(--bg-sunken)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{timeLeft?.days || 0}D</span>
                            <span style={{ background: "var(--bg-sunken)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{timeLeft?.hours || 0}H</span>
                            <span style={{ background: "var(--bg-sunken)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>{timeLeft?.minutes || 0}M</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botón de Acción */}
                    {activeTab === 'active' && (
                      <button
                        onClick={() => setSelected(isActive ? null : prize.id)}
                        style={{
                          width: "100%", marginTop: "1rem", padding: "0.8rem",
                          background: isActive ? "var(--bg-sunken)" : prize.color,
                          color: isActive ? prize.color : "#fff",
                          border: isActive ? `1px solid ${prize.color}` : "none",
                          borderRadius: "var(--r-sm)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.75rem",
                          cursor: "pointer", transition: "0.3s",
                        }}
                      >
                        {isActive ? "✓ Seleccionado" : "Participar Ahora"}
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
                No hay sorteos en esta categoría.
              </div>
            )}
          </div>
        </section>

          {/* --- PANEL DE SELECCIÓN DE NÚMEROS CENTRADO --- */}
          {activePrize && activeTab === 'active' && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: "2rem 0"
            }}>
              <section
                ref={selectionSectionRef}
                style={{
                  width: "100%",
                  maxWidth: "800px", // Reducimos un poco el ancho máximo para que se vea más compacto y centrado
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-mid)",
                  borderRadius: "var(--r-xl)",
                  padding: "3rem 2.5rem",
                  boxShadow: "var(--card-shadow)",
                  animation: "fadeUp 0.5s ease",
                  /* Aseguramos centrado interno */
                  margin: "0 auto"
                }}>
                  
                <div style={{ marginBottom: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.8rem" }}>{activePrize.emoji}</span>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                      {activePrize.name}
                    </h2>
                  </div>
                  <div className="deco-line">
                    <div className="deco-diamond"></div>
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                    Selecciona tus números de la suerte para este sorteo
                  </p>
                </div>
  
                {/* Grid de Números */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(auto-fill, minmax(40px, 1fr))`,
                  gap: "8px",
                  marginBottom: "2rem",
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--r-lg)",
                  padding: "1.5rem",
                }}>
                  {Array.from({ length: activePrize.total }, (_, i) => i + 1).map((num) => {
                    const isTaken = takenMap[activePrize.id]?.has(num);
                    const isPicked = userPicks[activePrize.id]?.has(num);
  
                    return (
                      <button
                        key={num}
                        onClick={() => handleNumberClick(num)}
                        disabled={isTaken}
                        style={{
                          height: "44px",
                          borderRadius: "var(--r-sm)",
                          border: isTaken ? "1px solid var(--border-subtle)" : isPicked ? `2px solid ${activePrize.color}` : "1px solid var(--border-mid)",
                          background: isTaken ? "var(--bg-sunken)" : isPicked ? activePrize.color : "var(--bg-elevated)",
                          color: isTaken ? "var(--text-muted)" : isPicked ? "#fff" : "var(--text-primary)",
                          fontWeight: 700,
                          cursor: isTaken ? "not-allowed" : "pointer",
                          opacity: isTaken ? 0.4 : 1,
                          transition: "all 0.2s"
                        }}
                      >
                        {isTaken ? "X" : String(num).padStart(2, "0")}
                      </button>
                    );
                  })}
                </div>
  
                {/* Resumen de Reserva */}
                <div style={{
                  background: "var(--bg-elevated)",
                  padding: "1.5rem",
                  borderRadius: "var(--r-lg)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div>
                    <span className="label-xs">Números Seleccionados:</span>
                    <p style={{ margin: 0, fontSize: "1.2rem", color: "var(--accent-gold)", fontWeight: 700 }}>
                      {userPicks[activePrize.id]?.size > 0
                        ? [...userPicks[activePrize.id]].sort((a, b) => a - b).join(" · ")
                        : "Ninguno"}
                    </p>
                  </div>
                  <button
                    onClick={handleReserve}
                    disabled={!userPicks[activePrize.id]?.size}
                    style={{
                      background: "linear-gradient(135deg, var(--gold-300), var(--gold-500))",
                      color: "var(--gold-900)",
                      padding: "0.8rem 2.5rem",
                      border: "none",
                      borderRadius: "var(--r-sm)",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: userPicks[activePrize.id]?.size ? "0 4px 15px rgba(201,168,76,0.3)" : "none",
                      opacity: userPicks[activePrize.id]?.size ? 1 : 0.5
                    }}
                  >
                    🎟️ Reservar Ahora
                  </button>
                </div>
              </section>
            </div>
          )}
        </main>
      {/* ══════════ PANEL DE PAGO ══════════ */}
        {showPayment && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
            <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-mid)", borderRadius: "var(--r-xl)", width: "100%", maxWidth: "550px", overflow: "hidden", animation: "slideUp 0.3s var(--ease)" }}>

              <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", margin: 0 }}>Método de Pago</h2>
                <button onClick={() => setShowPayment(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}>×</button>
              </div>

              <div style={{ padding: "2rem" }}>
                <div style={{ marginBottom: "1.5rem", textAlign: "center", background: "var(--bg-sunken)", padding: "1rem", borderRadius: "var(--r-md)" }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>Total a pagar por {tempReservation.nums.length} boletos:</p>
                  <h3 style={{ color: "var(--accent-gold)", fontSize: "1.8rem", margin: 0 }}>${tempReservation.total.toFixed(2)}</h3>
                </div>

                {/* Opciones de Pago */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                  {/* PayPhone */}
                  <button onClick={() => setPaymentMethod('payphone')} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderRadius: "var(--r-md)", border: paymentMethod === 'payphone' ? "2px solid #ff6b00" : "1px solid var(--border-mid)", background: "white", cursor: "pointer" }}>
                    <img src="https://www.payphone.app/wp-content/uploads/2021/05/logo-payphone.png" alt="Payphone" style={{ height: "25px" }} />
                    <span style={{ fontWeight: 700, color: "#1a1a1a" }}>Pagar con PayPhone</span>
                  </button>

                  {/* PayPal */}
                  <button onClick={() => setPaymentMethod('paypal')} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderRadius: "var(--r-md)", border: paymentMethod === 'paypal' ? "2px solid #003087" : "1px solid var(--border-mid)", background: "white", cursor: "pointer" }}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style={{ height: "25px" }} />
                    <span style={{ fontWeight: 700, color: "#1a1a1a" }}>PayPal / Tarjeta</span>
                  </button>

                  {/* Transferencia Bancaria */}
                  <button onClick={() => setPaymentMethod('transfer')} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderRadius: "var(--r-md)", border: paymentMethod === 'transfer' ? "2px solid var(--accent-gold)" : "1px solid var(--border-mid)", background: "var(--bg-sunken)", cursor: "pointer", color: "var(--text-primary)" }}>
                    <span style={{ fontSize: "1.5rem" }}>🏦</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontWeight: 700 }}>Transferencia Bancaria</div>
                      <div style={{ fontSize: "0.7rem", opacity: 0.7 }}>Banco Pichincha / Guayaquil / Produbanco</div>
                    </div>
                  </button>
                </div>

                {/* Detalles Transferencia */}
                {paymentMethod === 'transfer' && (
                  <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px dashed var(--accent-gold)", borderRadius: "var(--r-md)", fontSize: "0.85rem", animation: "fadeIn 0.3s" }}>
                    <p style={{ fontWeight: 700, color: "var(--accent-gold)", marginBottom: "0.5rem" }}>Datos de la Cuenta:</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      <span><b>Banco:</b> Pichincha (Ahorros)</span>
                      <span><b>Titular:</b> Sorteos La Fortuna S.A.</span>
                      <span><b>Cuenta:</b> 2200000000</span>
                      <span><b>CI/RUC:</b> 0900000000001</span>
                    </div>
                    <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                      * Una vez realizada, presiona el botón inferior para enviar el comprobante por WhatsApp.
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-sunken)", display: "flex", gap: "1rem" }}>
                <button onClick={() => setShowPayment(false)} style={{ flex: 1, padding: "0.8rem", borderRadius: "var(--r-sm)", border: "1px solid var(--border-mid)", background: "none", color: "var(--text-secondary)", fontWeight: 700 }}>Cancelar</button>

                <button
                  disabled={!paymentMethod}
                  onClick={() => {
                    if (paymentMethod === 'transfer') {
                      window.open(getWhatsAppUrl(tempReservation.prize.name, tempReservation.nums), '_blank');
                    }
                    confirmFinalPurchase();
                  }}
                  style={{ flex: 2, padding: "0.8rem", borderRadius: "var(--r-sm)", border: "none", background: paymentMethod ? "var(--accent-gold)" : "#555", color: "var(--gold-900)", fontWeight: 700, cursor: "pointer" }}
                >
                  {paymentMethod === 'transfer' ? "Confirmar y enviar a WhatsApp 📱" : "Proceder al Pago"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ MODAL SUCCESS ══════════ */}
        {modal && (
          <div
            onClick={() => setModal(null)}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              zIndex: 999, padding: "1rem",
              animation: "fadeIn 0.25s ease",
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-mid)",
                borderRadius: "var(--r-xl)",
                width: "100%", maxWidth: "500px",
                overflow: "hidden",
                animation: "slideUp 0.3s var(--ease)",
              }}
            >
              {/* Modal header */}
              <div style={{
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "var(--bg-elevated)",
              }}>
                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem", fontWeight: 700,
                  color: "var(--text-primary)", margin: 0,
                }}>
                  🎉 ¡Reserva Exitosa!
                </h2>
                <button
                  onClick={() => setModal(null)}
                  style={{
                    width: "32px", height: "32px",
                    background: "var(--chip-bg)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "50%",
                    color: "var(--text-muted)", fontSize: "1.1rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-ruby)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--chip-bg)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  ×
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: "2rem", textAlign: "center" }}>
                <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎊</div>

                <p style={{
                  color: "var(--text-secondary)",
                  marginBottom: "1.5rem", fontSize: "0.9rem",
                }}>
                  Has reservado números para{" "}
                  <span style={{
                    color: "var(--accent-gold)", fontWeight: 700,
                    fontFamily: "'Cinzel', serif",
                  }}>
                    {modal.prize.name}
                  </span>
                </p>

                {/* Numbers box */}
                <div style={{
                  background: "var(--bg-sunken)",
                  border: "1px solid var(--border-mid)",
                  borderRadius: "var(--r-lg)",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}>
                  <div className="label-xs" style={{ marginBottom: "0.75rem" }}>
                    Tus Números de Suerte
                  </div>
                  {/* Art-deco divider */}
                  <div style={{
                    display: "flex", alignItems: "center",
                    gap: "0.5rem", marginBottom: "0.75rem",
                  }}>
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--border-mid), transparent)" }} />
                    <div style={{ width: "6px", height: "6px", background: "var(--accent-gold)", transform: "rotate(45deg)", flexShrink: 0 }} />
                    <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--border-mid), transparent)" }} />
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: "1.8rem",
                    fontFamily: "'Cinzel', serif", fontWeight: 700,
                    color: "var(--accent-gold)", letterSpacing: "0.1em",
                  }}>
                    {modal.nums.sort((a, b) => a - b).join(" · ")}
                  </p>
                </div>

                <p style={{
                  color: "var(--text-muted)", fontSize: "0.78rem",
                  marginBottom: "1.5rem",
                }}>
                  Guarda una captura de pantalla como comprobante 📸
                </p>
              </div>

              {/* Modal footer */}
              <div style={{
                padding: "1.25rem 2rem",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex", justifyContent: "flex-end", gap: "0.75rem",
                background: "var(--bg-elevated)",
              }}>
                <button
                  onClick={() => setModal(null)}
                  style={{
                    background: "var(--chip-bg)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--r-sm)",
                    padding: "0.6rem 1.2rem",
                    fontSize: "0.78rem", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    cursor: "pointer", transition: "all 0.3s",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-accent)";
                    e.currentTarget.style.color = "var(--accent-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => setModal(null)}
                  style={{
                    background: "linear-gradient(135deg, var(--gold-300), var(--gold-500))",
                    color: "var(--gold-900)", border: "none",
                    borderRadius: "var(--r-sm)",
                    padding: "0.6rem 1.4rem",
                    fontSize: "0.8rem", fontWeight: 700,
                    textTransform: "uppercase", letterSpacing: "0.1em",
                    cursor: "pointer", transition: "all 0.3s",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  ✦ ¡Entendido!
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ FOOTER ══════════ */}
        <footer style={{
          background: "var(--bg-sunken)",
          borderTop: "1px solid var(--border-mid)",
          padding: "3rem 5% 2rem",
          position: "relative", overflow: "hidden",
        }}>
          {/* Lattice */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 0,
            backgroundImage: `repeating-linear-gradient(45deg, transparent 0px, transparent 40px, rgba(201,168,76,0.02) 40px, rgba(201,168,76,0.02) 41px)`,
          }} />

          <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "3rem",
              marginBottom: "3rem",
            }}>
              {/* Brand */}
              <div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.3rem", fontWeight: 700,
                  letterSpacing: "0.08em", color: "var(--accent-gold)",
                  marginBottom: "1rem",
                }}>
                  ♦ Sorteos<span style={{ color: "var(--accent-ruby)" }}>VIP</span>
                </div>
                <p style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem", lineHeight: 1.7,
                }}>
                  Llevando alegría y premios increíbles a todos nuestros participantes
                  desde Guayaquil para todo el país.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                  {[["f", "Facebook"], ["ig", "Instagram"], ["wa", "WhatsApp"]].map(([abbr, label]) => (
                    <div
                      key={abbr}
                      title={label}
                      style={{
                        width: "32px", height: "32px", borderRadius: "50%",
                        background: "var(--chip-bg)",
                        border: "1px solid var(--border-subtle)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", transition: "0.3s",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.7rem", color: "var(--text-muted)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-accent)";
                        e.currentTarget.style.color = "var(--accent-gold)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border-subtle)";
                        e.currentTarget.style.color = "var(--text-muted)";
                      }}
                    >
                      {abbr}
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment methods */}
              <div>
                <h4 className="label-xs" style={{ marginBottom: "1.25rem", color: "var(--accent-gold)" }}>
                  Métodos de Pago
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {["💳 Visa", "💳 Mastercard", "🏦 Transferencia", "📱 Deuna!"].map((m) => (
                    <span key={m} style={{
                      background: "var(--chip-bg)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      padding: "0.35rem 0.75rem",
                      borderRadius: "var(--r-sm)",
                      fontSize: "0.72rem", fontWeight: 700,
                    }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Legal */}
              <div>
                <h4 className="label-xs" style={{ marginBottom: "1.25rem", color: "var(--accent-gold)" }}>
                  Información
                </h4>
                <ul style={{
                  listStyle: "none", padding: 0, margin: 0,
                  fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "2",
                }}>
                  {["Términos y Condiciones", "Preguntas Frecuentes", "Contacto directo"].map((item) => (
                    <li
                      key={item}
                      style={{ cursor: "pointer", transition: "color 0.2s" }}
                      onMouseEnter={(e) => { e.target.style.color = "var(--accent-gold)"; }}
                      onMouseLeave={(e) => { e.target.style.color = "var(--text-muted)"; }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Art-deco divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0 0 1.5rem" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--border-mid), transparent)" }} />
              <div style={{ width: "8px", height: "8px", background: "var(--accent-gold)", transform: "rotate(45deg)", flexShrink: 0 }} />
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, var(--border-mid), transparent)" }} />
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                © 2026 SorteosVIP · Todos los derechos reservados · Ecuador
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "var(--text-muted)", opacity: 0.7 }}>
                🔞 Solo para mayores de 18 años. Juega responsablemente.
              </p>
            </div>
          </div>
        </footer>

        {/* ── Keyframes (scoped) ── */}
        <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink   { 0%, 100% { opacity: 1; } 50% { opacity: 0.2; } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

