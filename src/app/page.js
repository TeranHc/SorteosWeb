"use client";

import { useState, useEffect } from "react";

const PRIZES = [
  {
    id: 1,
    name: "Canasta Familiar",
    description: "Canasta premium con productos de primera necesidad, frutas frescas y golosinas para toda la familia.",
    emoji: "🧺",
    color: "#FF6B35",
    accentGlow: "rgba(255, 107, 53, 0.2)",
    total: 50,
  },
  {
    id: 2,
    name: "Viaje Todo Incluido",
    description: "Paquete para 2 personas a Galápagos: 4 noches, vuelos, hotel y tour de naturaleza.",
    emoji: "✈️",
    color: "#0EA5E9",
    accentGlow: "rgba(14, 165, 233, 0.2)",
    total: 100,
  },
  {
    id: 3,
    name: "Canasta Navideña",
    description: "Panetón, sidra, chocolates importados, jamón serrano y mucho más para celebrar en grande.",
    emoji: "🎄",
    color: "#22C55E",
    accentGlow: "rgba(34, 197, 94, 0.2)",
    total: 80,
  },
  {
    id: 4,
    name: "Spa & Bienestar",
    description: "Día completo de spa para 2: masajes, facial, jacuzzi y cena romántica incluida.",
    emoji: "💆",
    color: "#A855F7",
    accentGlow: "rgba(168, 85, 247, 0.2)",
    total: 60,
  },
];

const generateNumbers = (total) => {
  const taken = new Set();
  const count = Math.floor(total * 0.45);
  while (taken.size < count) {
    taken.add(Math.floor(Math.random() * total) + 1);
  }
  return taken;
};

const initialTaken = PRIZES.reduce((acc, p) => {
  acc[p.id] = generateNumbers(p.total);
  return acc;
}, {});

export default function SorteosPage() {
  const [selected, setSelected] = useState(null);
  const [takenMap, setTakenMap] = useState(initialTaken);
  const [userPicks, setUserPicks] = useState({});
  const [modal, setModal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const activePrize = PRIZES.find((p) => p.id === selected) || null;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleNumberClick = (num) => {
    if (!selected) return;
    const taken = takenMap[selected];
    if (taken.has(num)) return;
    setUserPicks((prev) => {
      const current = new Set(prev[selected] || []);
      if (current.has(num)) {
        current.delete(num);
      } else {
        current.add(num);
      }
      return { ...prev, [selected]: current };
    });
  };

  const handleReserve = () => {
    if (!selected) return;
    const picks = userPicks[selected];
    if (!picks || picks.size === 0) return;
    setTakenMap((prev) => {
      const newSet = new Set([...prev[selected], ...picks]);
      return { ...prev, [selected]: newSet };
    });
    setModal({ prize: activePrize, nums: [...picks] });
    setUserPicks((prev) => ({ ...prev, [selected]: new Set() }));
  };

  return (
    <div
      data-theme={darkMode ? "dark" : "light"}
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body)",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* ===== NAVBAR ===== */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: `rgba(var(--bg-main-rgb), 0.95)`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid var(--gold-border)`,
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.5)`,
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "24px" }}>💎</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "900",
              letterSpacing: "3px",
              fontFamily: "var(--font-brand)",
              background: `linear-gradient(135deg, var(--gold-accent) 0%, var(--text-secondary) 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textTransform: "uppercase",
            }}
          >
            La Fortuna
          </div>
        </div>

        {/* Nav Links */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          {[
            { name: "Inicio", link: "#inicio" },
            { name: "Sorteos", link: "#sorteos" },
            { name: "Ganadores", link: "#ganadores" },
            { name: "Contacto", link: "#contacto" },
          ].map((item) => (
            <a
              key={item.name}
              href={item.link}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "600",
                fontFamily: "var(--font-ui)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "var(--gold-accent)";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "var(--text-secondary)";
              }}
              className="hidden sm:inline-block"
            >
              {item.name}
            </a>
          ))}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: `rgba(var(--gold-accent-rgb), 0.1)`,
              border: `1px solid rgba(var(--gold-accent-rgb), 0.3)`,
              color: "var(--gold-accent)",
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.3s ease",
              fontFamily: "var(--font-ui)",
            }}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
            onMouseEnter={(e) => {
              e.target.style.background = `rgba(var(--gold-accent-rgb), 0.2)`;
              e.target.style.boxShadow = `0 0 15px rgba(var(--gold-accent-rgb), 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = `rgba(var(--gold-accent-rgb), 0.1)`;
              e.target.style.boxShadow = "none";
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* ===== HERO HEADER ===== */}
      <header
        id="inicio"
        style={{
          background: darkMode
            ? "linear-gradient(135deg, #0B0B0B 0%, #1a1a2e 50%, #16213e 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 50%, #F3F4F6 100%)",
          padding: "120px 32px 80px",
          position: "relative",
          overflow: "hidden",
          marginTop: "60px",
          borderBottom: `2px solid rgba(var(--Gold-accent-rgb), 0.15)`,
        }}
      >
        {/* Background Glows */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "400px",
            height: "400px",
            background: darkMode
              ? "radial-gradient(circle, rgba(193, 18, 31, 0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(220, 38, 38, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "500px",
            height: "500px",
            background: `radial-gradient(circle, rgba(var(--gold-accent-rgb), ${darkMode ? "0.1" : "0.08"}) 0%, transparent 70%)`,
            borderRadius: "50%",
            filter: "blur(100px)",
            zIndex: 0,
          }}
        />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: "14px",
              fontFamily: "var(--font-ui)",
              letterSpacing: "4px",
              color: "var(--gold-accent)",
              marginBottom: "16px",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            🏆 Bienvenido a la Experiencia Premium 🏆
          </div>
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 80px)",
              fontFamily: "var(--font-brand)",
              fontWeight: "900",
              color: "var(--text-primary)",
              margin: "0 0 12px",
              lineHeight: 1,
              letterSpacing: "-2px",
              textTransform: "uppercase",
              textShadow: `0 0 40px rgba(var(--gold-accent-rgb), 0.2)`,
            }}
          >
            Sorteos
            <div style={{ color: "var(--gold-accent)", display: "block" }}>La Fortuna</div>
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "18px",
              margin: "20px auto 0",
              maxWidth: "520px",
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
            }}
          >
            Participa en nuestros sorteos exclusivos. Selecciona tus números de la suerte y llévate premios
            extraordinarios.
          </p>
        </div>

        {/* Wave Divider */}
        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            left: 0,
            width: "100%",
            height: "60px",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path d="M0,30 Q300,10 600,30 T1200,30 L1200,60 L0,60 Z" fill="#0B0B0B" />
          </svg>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 20px 100px" }}>
        {/* PRIZE CARDS SECTION */}
        <section id="sorteos" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-ui)",
                letterSpacing: "3px",
                color: "#7A7A7A",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: "700",
              }}
            >
              ✨ Sorteos Disponibles ✨
            </div>
            <h2
              style={{
                fontSize: "32px",
                fontFamily: "var(--font-brand)",
                fontWeight: "900",
                color: "#FFFFFF",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              Elige Tu Suerte
            </h2>
          </div>

          {/* Prize Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "24px",
              marginBottom: "60px",
            }}
          >
            {PRIZES.map((prize) => {
              const taken = takenMap[prize.id]?.size || 0;
              const free = prize.total - taken;
              const isActive = selected === prize.id;
              const occupancyPercent = (taken / prize.total) * 100;

              return (
                <button
                  key={prize.id}
                  onClick={() => setSelected(isActive ? null : prize.id)}
                  style={{
                    border: isActive ? `2px solid ${prize.color}` : "2px solid rgba(212, 175, 55, 0.15)",
                    borderRadius: "16px",
                    padding: "28px 24px",
                    background: isActive
                      ? `linear-gradient(135deg, ${prize.color}15 0%, ${prize.color}08 100%)`
                      : "rgba(22, 22, 22, 0.8)",
                    backdropFilter: "blur(8px)",
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: isActive ? `0 0 30px ${prize.color}30, 0 8px 24px rgba(0, 0, 0, 0.3)` : "0 4px 12px rgba(0, 0, 0, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: isActive ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Background Accent */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-50%",
                        right: "-50%",
                        width: "200px",
                        height: "200px",
                        background: `radial-gradient(circle, ${prize.color}20 0%, transparent 70%)`,
                        borderRadius: "50%",
                        filter: "blur(40px)",
                        zIndex: 0,
                      }}
                    />
                  )}

                  {/* Active Badge */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: prize.color,
                        color: "#FFFFFF",
                        fontSize: "10px",
                        fontFamily: "var(--font-ui)",
                        borderRadius: "20px",
                        padding: "4px 12px",
                        fontWeight: "700",
                        letterSpacing: "1px",
                        zIndex: 10,
                      }}
                    >
                      ACTIVO
                    </div>
                  )}

                  {/* Content */}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>{prize.emoji}</div>
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "18px",
                        fontFamily: "var(--font-ui)",
                        fontWeight: "800",
                        color: "var(--text-primary)",
                      }}
                    >
                      {prize.name}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 16px",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.5,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {prize.description}
                    </p>

                    {/* Occupancy Meter */}
                    <div style={{ marginBottom: "12px" }}>
                      <div
                        style={{
                          height: "4px",
                          background: "rgba(122, 122, 122, 0.2)",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${occupancyPercent}%`,
                            background: `linear-gradient(90deg, ${prize.color}, ${prize.color}80)`,
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#7A7A7A",
                          marginTop: "4px",
                          fontFamily: "var(--font-numbers)",
                          textAlign: "center",
                        }}
                      >
                        {taken} / {prize.total} ocupados
                      </div>
                    </div>

                    {/* Chips */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          background: "rgba(250, 8, 8, 0.15)",
                          color: "#FF6B6B",
                          borderRadius: "20px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontFamily: "var(--font-ui)",
                          fontWeight: "700",
                          border: "1px solid rgba(255, 107, 107, 0.2)",
                        }}
                      >
                        {taken} ocupados
                      </span>
                      <span
                        style={{
                          background: "rgba(34, 197, 94, 0.15)",
                          color: "#22C55E",
                          borderRadius: "20px",
                          padding: "4px 10px",
                          fontSize: "11px",
                          fontFamily: "var(--font-ui)",
                          fontWeight: "700",
                          border: "1px solid rgba(34, 197, 94, 0.2)",
                        }}
                      >
                        {free} libres
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* NUMBER SELECTION GRID */}
        {activePrize && (
          <section
            style={{
              background: `linear-gradient(135deg, rgba(22, 22, 22, 0.9) 0%, rgba(30, 30, 30, 0.8) 100%)`,
              border: `1px solid ${activePrize.color}30`,
              borderRadius: "20px",
              padding: "48px 32px",
              marginBottom: "80px",
              backdropFilter: "blur(10px)",
              boxShadow: `0 0 40px ${activePrize.color}20, 0 16px 32px rgba(0, 0, 0, 0.4)`,
            }}
          >
            {/* Section Header */}
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                <div style={{ fontSize: "28px" }}>{activePrize.emoji}</div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "28px",
                    fontFamily: "var(--font-brand)",
                    fontWeight: "900",
                    color: "var(--text-primary)",
                  }}
                >
                  {activePrize.name}
                </h2>
              </div>
              <p
                style={{
                  margin: "8px 0 0",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "500",
                }}
              >
                Selecciona tus números de la suerte
              </p>
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                marginBottom: "32px",
                padding: "16px",
                background: "rgba(212, 175, 55, 0.05)",
                borderRadius: "12px",
                flexWrap: "wrap",
                border: "1px solid rgba(212, 175, 55, 0.1)",
              }}
            >
              {[
                { color: "#4A4A4A", label: "Disponible" },
                { color: "#FCA5A5", label: "Ocupado" },
                { color: activePrize.color, label: "Tu selección" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      background: l.color,
                      boxShadow: `0 0 12px ${l.color}40`,
                    }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>
                    {l.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Number Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
                gap: "10px",
                marginBottom: "32px",
              }}
            >
              {Array.from({ length: activePrize.total }, (_, i) => i + 1).map((num) => {
                const taken = takenMap[activePrize.id]?.has(num);
                const picked = userPicks[activePrize.id]?.has(num);

                let bg = "#2A2A2A";
                let color = "#B8B8B8";
                let border = "1px solid rgba(122, 122, 122, 0.2)";
                let cursor = "pointer";
                let shadow = "none";

                if (taken) {
                  bg = "#FCA5A5";
                  color = "#7F1D1D";
                  cursor = "not-allowed";
                  border = "1px solid rgba(252, 165, 165, 0.3)";
                } else if (picked) {
                  bg = activePrize.color;
                  color = "#FFFFFF";
                  border = `2px solid ${activePrize.color}`;
                  shadow = `0 0 20px ${activePrize.color}60, inset 0 0 10px ${activePrize.color}20`;
                }

                return (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={taken}
                    style={{
                      height: "56px",
                      borderRadius: "12px",
                      border,
                      background: bg,
                      color,
                      fontWeight: "800",
                      fontSize: "16px",
                      fontFamily: "var(--font-numbers)",
                      cursor,
                      transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      boxShadow: shadow,
                      transform: picked ? "scale(1.1)" : "scale(1)",
                      opacity: taken ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!taken && !picked) {
                        e.target.style.background = "#3A3A3A";
                        e.target.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!taken && !picked) {
                        e.target.style.background = "#2A2A2A";
                        e.target.style.boxShadow = "none";
                      }
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Selection Summary & Reserve Button */}
            <div
              style={{
                background: `linear-gradient(135deg, ${activePrize.color}15 0%, ${activePrize.color}08 100%)`,
                border: `1px solid ${activePrize.color}30`,
                borderRadius: "16px",
                padding: "24px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "24px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "12px",
                    color: "#7A7A7A",
                    fontFamily: "var(--font-ui)",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Números Seleccionados
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontFamily: "var(--font-numbers)",
                    fontWeight: "900",
                    color: activePrize.color,
                    letterSpacing: "2px",
                  }}
                >
                  {userPicks[activePrize.id]?.size > 0
                    ? [...(userPicks[activePrize.id])].sort((a, b) => a - b).join(" · ")
                    : "Ninguno aún"}
                </p>
              </div>
              <button
                onClick={handleReserve}
                disabled={!userPicks[activePrize.id]?.size}
                style={{
                  background: userPicks[activePrize.id]?.size
                    ? `linear-gradient(135deg, ${activePrize.color} 0%, ${activePrize.color}dd 100%)`
                    : "rgba(122, 122, 122, 0.3)",
                  color: "var(--text-primary)",
                  border: "none",
                  borderRadius: "12px",
                  padding: "14px 32px",
                  fontSize: "14px",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  cursor: userPicks[activePrize.id]?.size ? "pointer" : "not-allowed",
                  boxShadow: userPicks[activePrize.id]?.size
                    ? `0 0 25px ${activePrize.color}60, 0 8px 20px rgba(0, 0, 0, 0.3)`
                    : "none",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (userPicks[activePrize.id]?.size) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = `0 0 35px ${activePrize.color}80, 0 12px 30px rgba(0, 0, 0, 0.4)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (userPicks[activePrize.id]?.size) {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = `0 0 25px ${activePrize.color}60, 0 8px 20px rgba(0, 0, 0, 0.3)`;
                  }
                }}
              >
                🎟️ Reservar Números
              </button>
            </div>
          </section>
        )}

        {!selected && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "var(--text-muted)",
              marginBottom: "60px",
            }}
          >
            <div style={{ fontSize: "60px", marginBottom: "20px" }}>☝️</div>
            <p
              style={{
                fontSize: "18px",
                fontWeight: "500",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.5px",
              }}
            >
              Selecciona un sorteo para ver los números disponibles
            </p>
          </div>
        )}

        {/* WINNERS SECTION */}
        <section id="ganadores" style={{ scrollMarginTop: "100px", marginBottom: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-ui)",
                letterSpacing: "3px",
                color: "#7A7A7A",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: "700",
              }}
            >
              🏆 Celebrando a Nuestros Ganadores 🏆
            </div>
            <h2
              style={{
                fontSize: "32px",
                fontFamily: "var(--font-brand)",
                fontWeight: "900",
                color: "#FFFFFF",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              Últimas Fortunas
            </h2>
          </div>

          {/* Winners Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "28px",
            }}
          >
            {[
              { name: "Carlos M.", prize: "Viaje Galápagos", date: "12 Mar", ticket: "42" },
              { name: "Elena R.", prize: "Canasta Familiar", date: "10 Mar", ticket: "15" },
              { name: "Andrés B.", prize: "Spa & Bienestar", date: "05 Mar", ticket: "08" },
            ].map((winner, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(30, 30, 30, 0.7) 100%)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  textAlign: "center",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.5)";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(212, 175, 55, 0.2), 0 12px 36px rgba(0, 0, 0, 0.4)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Ticket Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "12px",
                    background: "linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)",
                    color: "#0B0B0B",
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-numbers)",
                    fontWeight: "900",
                    fontSize: "18px",
                    boxShadow: "0 0 25px rgba(212, 175, 55, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)",
                    border: "2px solid #0B0B0B",
                  }}
                >
                  #{winner.ticket}
                </div>

                {/* Trophy Icon */}
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏆</div>

                {/* Winner Info */}
                <h3
                  style={{
                    margin: "0 0 4px",
                    fontSize: "20px",
                    fontFamily: "var(--font-ui)",
                    fontWeight: "900",
                    color: "var(--text-primary)",
                  }}
                >
                  {winner.name}
                </h3>
                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: "13px",
                    color: "var(--gold-accent)",
                    fontFamily: "var(--font-ui)",
                    fontWeight: "700",
                  }}
                >
                  {winner.prize}
                </p>

                {/* Date */}
                <div
                  style={{
                    background: "rgba(212, 175, 55, 0.1)",
                    border: "1px solid rgba(212, 175, 55, 0.2)",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    display: "inline-block",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-ui)",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    📅 {winner.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section
          id="contacto"
          style={{
            background: `linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)`,
            border: "1px solid rgba(212, 175, 55, 0.2)",
            borderRadius: "20px",
            padding: "56px 40px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
            boxShadow: "0 0 40px rgba(212, 175, 55, 0.1), 0 16px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <div
              style={{
                fontSize: "12px",
                fontFamily: "var(--font-ui)",
                letterSpacing: "3px",
                color: "#7A7A7A",
                textTransform: "uppercase",
                marginBottom: "12px",
                fontWeight: "700",
              }}
            >
              💬 ¿PREGUNTAS O CONSULTAS? 💬
            </div>
            <h2
              style={{
                fontSize: "32px",
                fontFamily: "var(--font-brand)",
                fontWeight: "900",
                color: "#FFFFFF",
                margin: 0,
                letterSpacing: "-1px",
              }}
            >
              Estamos Aquí Para Ayudarte
            </h2>
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              maxWidth: "600px",
              margin: "16px auto 32px",
              lineHeight: 1.7,
              fontSize: "14px",
              fontFamily: "var(--font-body)",
            }}
          >
            Contáctanos directamente vía WhatsApp o correo. Nuestro equipo premium está listo para confirmar tus
            reservas y ayudarte con los métodos de pago.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/593999999999"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
                color: "#FFFFFF",
                padding: "14px 32px",
                borderRadius: "12px",
                textDecoration: "none",
                fontFamily: "var(--font-ui)",
                fontWeight: "800",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 0 25px rgba(34, 197, 94, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 0 35px rgba(34, 197, 94, 0.6), 0 12px 30px rgba(0, 0, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(34, 197, 94, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)";
              }}
            >
              <svg
                style={{ width: "20px", height: "20px", fill: "currentColor" }}
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              WhatsApp
            </a>
            <a
              href="mailto:info@sorteoslafortuna.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)",
                color: "#0B0B0B",
                padding: "14px 32px",
                borderRadius: "12px",
                textDecoration: "none",
                fontFamily: "var(--font-ui)",
                fontWeight: "800",
                fontSize: "14px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 0 25px rgba(212, 175, 55, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 0 35px rgba(212, 175, 55, 0.6), 0 12px 30px rgba(0, 0, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 0 25px rgba(212, 175, 55, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3)";
              }}
            >
              ✉️ CORREO
            </a>
          </div>
        </section>
      </main>

      {/* ===== MODAL SUCCESS ===== */}
      {modal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)",
              border: `2px solid ${modal.prize.color}`,
              borderRadius: "20px",
              padding: "56px 48px",
              maxWidth: "480px",
              width: "100%",
              textAlign: "center",
              boxShadow: `0 0 50px ${modal.prize.color}30, 0 24px 60px rgba(0, 0, 0, 0.4)`,
              animation: "modalPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Celebration Icon */}
            <div style={{ fontSize: "72px", marginBottom: "20px", animation: "bounce 0.6s ease-in-out" }}>
              🎉
            </div>

            {/* Title */}
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: "28px",
                fontFamily: "var(--font-brand)",
                fontWeight: "900",
                color: "var(--text-primary)",
                letterSpacing: "-0.5px",
              }}
            >
              ¡Reserva Exitosa!
            </h2>

            {/* Reservation Details */}
            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "24px",
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                lineHeight: 1.6,
              }}
            >
              Has reservado números para{" "}
              <span style={{ color: modal.prize.color, fontWeight: "700" }}>{modal.prize.name}</span>
            </p>

            {/* Numbers Display */}
            <div
              style={{
                background: `linear-gradient(135deg, ${modal.prize.color}15 0%, ${modal.prize.color}08 100%)`,
                border: `1px solid ${modal.prize.color}40`,
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "28px",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "11px",
                  color: "#7A7A7A",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Tus Números de Suerte
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "24px",
                  fontFamily: "var(--font-numbers)",
                  fontWeight: "900",
                  color: modal.prize.color,
                  letterSpacing: "3px",
                }}
              >
                {modal.nums.sort((a, b) => a - b).join(" · ")}
              </p>
            </div>

            {/* Instructions */}
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "12px",
                marginBottom: "28px",
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
              }}
            >
              Guarda una captura de pantalla como comprobante y contáctanos para procesar el pago 📸
            </p>

            {/* Close Button */}
            <button
              onClick={() => setModal(null)}
              style={{
                background: `linear-gradient(135deg, ${modal.prize.color} 0%, ${modal.prize.color}dd 100%)`,
                color: "#FFFFFF",
                border: "none",
                borderRadius: "12px",
                padding: "14px 48px",
                fontSize: "14px",
                fontFamily: "var(--font-ui)",
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                cursor: "pointer",
                boxShadow: `0 0 25px ${modal.prize.color}60, 0 8px 20px rgba(0, 0, 0, 0.3)`,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = `0 0 35px ${modal.prize.color}80, 0 12px 30px rgba(0, 0, 0, 0.4)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = `0 0 25px ${modal.prize.color}60, 0 8px 20px rgba(0, 0, 0, 0.3)`;
              }}
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer
        style={{
          background: "linear-gradient(135deg, #0B0B0B 0%, #161616 100%)",
          color: "#B8B8B8",
          padding: "80px 32px 40px",
          borderTop: "2px solid rgba(212, 175, 55, 0.15)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative Wave */}
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: 0,
            width: "100%",
            height: "60px",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            style={{ width: "100%", height: "100%", display: "block" }}
          >
            <path d="M0,30 Q300,10 600,30 T1200,30 L1200,0 L0,0 Z" fill="#161616" />
          </svg>
        </div>

        {/* Footer Content */}
        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "48px",
              marginBottom: "48px",
            }}
          >
            {/* Column 1: Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ fontSize: "24px" }}>💎</div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontFamily: "var(--font-brand)",
                    fontWeight: "900",
                    background: "linear-gradient(135deg, #D4AF37 0%, #F0E68C 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "1px",
                  }}
                >
                  LA FORTUNA
                </h3>
              </div>
              <p
                style={{
                  color: "#7A7A7A",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  margin: "0 0 24px",
                  fontFamily: "var(--font-body)",
                }}
              >
                Plataforma premium de sorteos y rifas. Llevando suerte y premios extraordinarios a toda la región
                desde Guayaquil.
              </p>

              {/* Social Icons */}
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  {
                    icon: "f",
                    href: "#",
                    color: "#1877F2",
                  },
                  {
                    icon: "📷",
                    href: "#",
                    color: "#E4405F",
                  },
                  {
                    icon: "𝕏",
                    href: "#",
                    color: "#000000",
                  },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: `rgba(212, 175, 55, 0.1)`,
                      border: "1px solid rgba(212, 175, 55, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#D4AF37",
                      textDecoration: "none",
                      fontSize: "16px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(212, 175, 55, 0.2)";
                      e.currentTarget.style.boxShadow = "0 0 15px rgba(212, 175, 55, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(212, 175, 55, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Payment Methods */}
            <div>
              <h4
                style={{
                  margin: "0 0 20px",
                  fontSize: "12px",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "800",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Métodos de Pago
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["💳 Visa", "💳 Mastercard", "🏦 Transferencia", "📱 Deuna!"].map((method) => (
                  <span
                    key={method}
                    style={{
                      background: "rgba(212, 175, 55, 0.08)",
                      border: "1px solid rgba(212, 175, 55, 0.15)",
                      color: "#B8B8B8",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontFamily: "var(--font-ui)",
                      fontWeight: "600",
                    }}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4
                style={{
                  margin: "0 0 20px",
                  fontSize: "12px",
                  fontFamily: "var(--font-ui)",
                  fontWeight: "800",
                  color: "#D4AF37",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Información
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {[
                  "Términos y Condiciones",
                  "Preguntas Frecuentes",
                  "Aviso de Privacidad",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        color: "#7A7A7A",
                        textDecoration: "none",
                        fontSize: "12px",
                        fontFamily: "var(--font-body)",
                        transition: "color 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#D4AF37";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#7A7A7A";
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              borderTop: "1px solid rgba(212, 175, 55, 0.1)",
              paddingTop: "32px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 8px",
                fontSize: "12px",
                color: "#7A7A7A",
                fontFamily: "var(--font-body)",
              }}
            >
              © 2026 Sorteos La Fortuna. Todos los derechos reservados.
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#5A5A5A",
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
              }}
            >
              🔞 Solo para mayores de 18 años. Juega responsablemente.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== GLOBAL STYLES ===== */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        * {
          box-sizing: border-box;
        }

        button:not(:disabled) {
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.5;
        }

        #sorteos,
        #ganadores,
        #contacto {
          scroll-margin-top: 100px;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #161616;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #D4AF37 0%, #C1121F 100%);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #F0E68C 0%, #E63946 100%);
        }

        /* Selection */
        ::selection {
          background: rgba(212, 175, 55, 0.3);
          color: #FFFFFF;
        }
      `}</style>
    </div>
  );
}
