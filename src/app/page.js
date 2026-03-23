"use client";

import { useState } from "react";

const PRIZES = [
  {
    id: 1,
    name: "Canasta Familiar",
    description: "Canasta premium con productos de primera necesidad, frutas frescas y golosinas para toda la familia.",
    emoji: "🧺",
    color: "#FF6B35",
    accent: "#FFF3ED",
    total: 50,
  },
  {
    id: 2,
    name: "Viaje Todo Incluido",
    description: "Paquete para 2 personas a Galápagos: 4 noches, vuelos, hotel y tour de naturaleza.",
    emoji: "✈️",
    color: "#0EA5E9",
    accent: "#F0F9FF",
    total: 100,
  },
  {
    id: 3,
    name: "Canasta Navideña",
    description: "Panetón, sidra, chocolates importados, jamón serrano y mucho más para celebrar en grande.",
    emoji: "🎄",
    color: "#22C55E",
    accent: "#F0FDF4",
    total: 80,
  },
  {
    id: 4,
    name: "Spa & Bienestar",
    description: "Día completo de spa para 2: masajes, facial, jacuzzi y cena romántica incluida.",
    emoji: "💆",
    color: "#A855F7",
    accent: "#FAF5FF",
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

  const activePrize = PRIZES.find((p) => p.id === selected) || null;

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
          <h1 style={{
            fontSize: "clamp(38px, 7vw, 72px)", fontWeight: "900", color: "#fff",
            margin: "0 0 8px", lineHeight: 1,
            textShadow: "3px 4px 0px rgba(0,0,0,0.2)",
            letterSpacing: "-1px",
          }}>
            Sorteos
            
            <span style={{ display: "block", color: "#FFF3D0" }}>La Fortuna</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "18px", margin: "16px auto 0", maxWidth: "480px", lineHeight: 1.6 }}>
            Elige tu sorteo, selecciona tus números de la suerte y llévate premios increíbles
          </p>
        </div>
        {/* Decorative wave */}
        <div style={{ position: "relative", height: "40px", overflow: "hidden" }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,40 C300,0 600,40 900,10 C1050,0 1150,20 1200,40 Z" fill="#FFFBF5" />
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
              return (
                <button
                  key={prize.id}
                  onClick={() => setSelected(isActive ? null : prize.id)}
                  style={{
                    border: isActive ? `3px solid ${prize.color}` : "3px solid transparent",
                    borderRadius: "20px",
                    padding: "24px 20px",
                    background: isActive ? prize.accent : "#fff",
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: isActive
                      ? `0 8px 32px ${prize.color}40`
                      : "0 2px 12px rgba(0,0,0,0.07)",
                    transition: "all 0.25s ease",
                    transform: isActive ? "translateY(-4px)" : "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: "absolute", top: "10px", right: "10px",
                      background: prize.color, color: "#fff", fontSize: "10px",
                      borderRadius: "20px", padding: "2px 8px", fontFamily: "monospace", letterSpacing: "1px",
                    }}>ACTIVO</div>
                  )}
                  <div style={{ fontSize: "42px", marginBottom: "10px" }}>{prize.emoji}</div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800", color: "#1a1a1a" }}>{prize.name}</h3>
                  <p style={{ margin: "0 0 14px", fontSize: "13px", color: "#666", lineHeight: 1.5 }}>{prize.description}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ background: "#FEF2F2", color: "#EF4444", borderRadius: "8px", padding: "3px 10px", fontSize: "12px", fontWeight: "700" }}>
                      🔴 {taken} ocupados
                    </span>
                    <span style={{ background: "#F0FDF4", color: "#22C55E", borderRadius: "8px", padding: "3px 10px", fontSize: "12px", fontWeight: "700" }}>
                      🟢 {free} libres
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* NUMBER GRID */}
        {activePrize && (
          <section style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "36px 28px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
            border: `2px solid ${activePrize.color}30`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#1a1a1a" }}>
                  {activePrize.emoji} {activePrize.name}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: "#888" }}>
                  Selecciona tus números de la suerte
                </p>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { color: "#E5E7EB", label: "Libre" },
                  { color: "#FCA5A5", label: "Ocupado" },
                  { color: activePrize.color, label: "Tu selección" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#555" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
              gap: "8px",
              marginBottom: "28px",
            }}>
              {Array.from({ length: activePrize.total }, (_, i) => i + 1).map((num) => {
                const taken = takenMap[activePrize.id]?.has(num);
                const picked = userPicks[activePrize.id]?.has(num);
                let bg = "#F3F4F6";
                let color = "#374151";
                let border = "2px solid transparent";
                let cursor = "pointer";
                let shadow = "none";
                if (taken) {
                  bg = "#FCA5A5"; color = "#7F1D1D"; cursor = "not-allowed";
                } else if (picked) {
                  bg = activePrize.color; color = "#fff";
                  border = `2px solid ${activePrize.color}`;
                  shadow = `0 4px 14px ${activePrize.color}60`;
                }
                return (
                  <button
                    key={num}
                    onClick={() => handleNumberClick(num)}
                    disabled={taken}
                    style={{
                      height: "52px", borderRadius: "12px", border, background: bg,
                      color, fontWeight: "800", fontSize: "15px",
                      cursor, transition: "all 0.15s ease",
                      boxShadow: shadow,
                      transform: picked ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Summary & Reserve */}
            <div style={{
              background: activePrize.accent,
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              border: `1px solid ${activePrize.color}30`,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>Números seleccionados:</p>
                <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: "800", color: "#1a1a1a" }}>
                  {userPicks[activePrize.id]?.size > 0
                    ? [...(userPicks[activePrize.id])].sort((a, b) => a - b).join(", ")
                    : "Ninguno aún"}
                </p>
              </div>
              <button
                onClick={handleReserve}
                disabled={!userPicks[activePrize.id]?.size}
                style={{
                  background: userPicks[activePrize.id]?.size ? activePrize.color : "#D1D5DB",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  padding: "14px 32px",
                  fontSize: "16px",
                  fontWeight: "800",
                  cursor: userPicks[activePrize.id]?.size ? "pointer" : "not-allowed",
                  boxShadow: userPicks[activePrize.id]?.size ? `0 6px 20px ${activePrize.color}50` : "none",
                  transition: "all 0.2s ease",
                  letterSpacing: "0.5px",
                }}
              >
                🎟️ Reservar Números
              </button>
            </div>
          </section>
        )}

        {!selected && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>☝️</div>
            <p style={{ fontSize: "18px", fontWeight: "600" }}>Selecciona un sorteo arriba para ver los números disponibles</p>
          </div>
        )}
      </main>

      {/* MODAL */}
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
              background: "#fff", borderRadius: "28px", padding: "48px 40px",
              maxWidth: "420px", width: "100%", textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
              animation: "popIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: "900", color: "#1a1a1a" }}>
              ¡Reserva Exitosa!
            </h2>
            <p style={{ color: "#666", marginBottom: "20px", fontSize: "16px", lineHeight: 1.6 }}>
              Reservaste los números para <strong>{modal.prize.name}</strong>
            </p>
            <div style={{
              background: modal.prize.accent, borderRadius: "14px", padding: "16px 20px",
              marginBottom: "28px", border: `1px solid ${modal.prize.color}30`,
            }}>
              <p style={{ margin: 0, fontSize: "13px", color: "#888", marginBottom: "6px" }}>Tus números:</p>
              <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: modal.prize.color, letterSpacing: "2px" }}>
                {modal.nums.sort((a, b) => a - b).join("  ·  ")}
              </p>
            </div>
            <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "24px" }}>
              Guarda una captura de pantalla como comprobante 📸
            </p>
            <button
              onClick={() => setModal(null)}
              style={{
                background: modal.prize.color, color: "#fff", border: "none",
                borderRadius: "14px", padding: "14px 40px",
                fontSize: "16px", fontWeight: "800", cursor: "pointer",
                boxShadow: `0 6px 20px ${modal.prize.color}50`,
              }}
            >
              ¡Listo!
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

        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "40px",
            marginBottom: "40px" 
          }}>
            {/* Columna 1: Branding */}
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

            {/* Columna 2: Pagos */}
            <div>
              <h4 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", marginBottom: "20px" }}>
                Métodos de Pago
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {['💳 Visa', '💳 Master', '🏦 Transferencia', '📱 Deuna!'].map(metodo => (
                  <span key={metodo} style={{ 
                    background: "#262626", padding: "6px 12px", borderRadius: "8px", 
                    fontSize: "12px", color: "#ccc", border: "1px solid #333" 
                  }}>
                    {metodo}
                  </span>
                ))}
              </div>
            </div>

            {/* Columna 3: Legal/Info */}
            <div>
              <h4 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", marginBottom: "20px" }}>
                Información
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: "#aaa", lineHeight: "2" }}>
                <li style={{ cursor: "pointer" }}>Términos y Condiciones</li>
                <li style={{ cursor: "pointer" }}>Preguntas Frecuentes</li>
                <li style={{ cursor: "pointer" }}>Contacto directo</li>
              </ul>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: "1px solid #333", margin: "40px 0 20px" }} />

          <div style={{ textAlign: "center", color: "#666", fontSize: "12px" }}>
            <p style={{ marginBottom: "8px" }}>© 2026 Sorteos La Fortuna. Todos los derechos reservados.</p>
            <p style={{ fontStyle: "italic" }}>🔞 El juego es solo para mayores de 18 años. Juega con responsabilidad.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}