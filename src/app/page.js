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
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", backgroundColor: "#FFFBF5" }}>
      {/* HEADER */}
      <header style={{
        background: "linear-gradient(135deg, #143768 0%, #000000 50%, #143768 100%)",
        padding: "0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        }} />
        <div style={{ position: "relative", textAlign: "center", padding: "52px 24px 44px" }}>
          <div style={{ fontSize: "14px", fontFamily: "monospace", letterSpacing: "6px", color: "rgba(255,255,255,0.85)", marginBottom: "12px", textTransform: "uppercase" }}>
            🏆 Bienvenido a 🏆
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
            
            <span style={{ display: "block", color: "#FFF3D0" }}>La Fortuna</span>
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

      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* PRIZE CARDS */}
        <section>
          <h2 style={{ textAlign: "center", fontSize: "13px", letterSpacing: "5px", color: "#999", textTransform: "uppercase", marginBottom: "28px", fontFamily: "monospace" }}>
            — Sorteos Disponibles —
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "16px", marginBottom: "48px" }}>
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
      </main>

      {/* ===== MODAL SUCCESS ===== */}
      {modal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 999, padding: "20px",
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
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>
              Guarda una captura de pantalla como comprobante 📸
            </p>

            {/* Close Button */}
            <button
              onClick={() => setModal(null)}
              style={{
                background: modal.prize.color, color: "#fff", border: "none",
                borderRadius: "14px", padding: "14px 40px",
                fontSize: "16px", fontWeight: "800", cursor: "pointer",
                boxShadow: `0 6px 20px ${modal.prize.color}50`,
              }}
              className="hover:scale-105"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { filter: brightness(0.95); }
      `}</style>
      {/* FOOTER */}
      <footer style={{ 
        background: "#1a1a1a", 
        color: "#fff", 
        padding: "60px 20px 30px", 
        marginTop: "40px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Adorno superior (onda invertida) */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "40px", overflow: "hidden", transform: "rotate(180deg)" }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,40 C300,0 600,40 900,10 C1050,0 1150,20 1200,40 Z" fill="#FFFBF5" />
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
              <h3 style={{ fontSize: "24px", fontWeight: "900", color: "#FF6B35", margin: "0 0 16px" }}>
                Sorteos La Fortuna
              </h3>
              <p style={{ color: "#aaa", fontSize: "14px", lineHeight: "1.6" }}>
                Llevando alegría y premios increíbles a todos nuestros participantes desde Guayaquil para todo el país.
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                {['Facebook', 'Instagram', 'WhatsApp'].map(social => (
                  <div key={social} style={{ 
                    width: "36px", height: "36px", borderRadius: "50%", 
                    background: "#333", display: "flex", alignItems: "center", 
                    justifyContent: "center", cursor: "pointer", transition: "0.3s" 
                  }}>
                    <span style={{ fontSize: "14px" }}>{social[0]}</span>
                  </div>
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
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#aaa", lineHeight: "2" }}>
                <li style={{ cursor: "pointer" }}>Términos y Condiciones</li>
                <li style={{ cursor: "pointer" }}>Preguntas Frecuentes</li>
                <li style={{ cursor: "pointer" }}>Contacto directo</li>
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
    </div>
  );
}
