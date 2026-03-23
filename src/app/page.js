"use client";

import { useState, useEffect } from "react";

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
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", minHeight: "100vh", backgroundColor: darkMode ? "#1a1a1a" : "var(--brand-cream)", color: darkMode ? "#fff" : "#1a1a1a", transition: "all 0.3s ease" }}>
      
      {/* NAVBAR FLOTANTE */}
      <nav style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: darkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(20, 55, 104, 0.95)", 
        backdropFilter: "blur(8px)",
        zIndex: 1000,
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "all 0.3s ease"
      }}>
        <div style={{ color: "#fff", fontWeight: "900", fontSize: "18px", letterSpacing: "1px" }}>
          LA FORTUNA
        </div>
        
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {[
            { name: "Inicio", link: "#inicio" },
            { name: "Sorteos", link: "#sorteos" },
            { name: "Ganadores", link: "#ganadores" },
            { name: "Contacto", link: "#contacto" }
          ].map((item) => (
            <a 
              key={item.name} 
              href={item.link}
              className="hover:text-orange-400 transition-colors duration-300 hidden sm:block"
              style={{ 
                color: "rgba(255,255,255,0.85)", 
                textDecoration: "none", 
                fontSize: "14px", 
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}
            >
              {item.name}
            </a>
          ))}
          
          {/* Botón Toggle Modo Nocturno */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              transition: "all 0.3s ease"
            }}
            title={darkMode ? "Modo claro" : "Modo oscuro"}
            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* HEADER */}
      <header id="inicio" style={{
        background: darkMode 
          ? "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)"
          : "linear-gradient(135deg, #143768 0%, #000000 50%, #143768 100%)",
        padding: "100px 0 0", 
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: darkMode 
            ? "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.02) 0%, transparent 40%)"
            : "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)",
        }} />
        <div style={{ position: "relative", textAlign: "center", padding: "20px 24px 44px" }}>
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
        <section id="sorteos" style={{ scrollMarginTop: "100px" }}>
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
                    background: isActive ? prize.accent : (darkMode ? "#2a2a2a" : "#fff"),
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: isActive
                      ? `0 8px 32px ${prize.color}40`
                      : (darkMode ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.07)"),
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
                  <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800", color: darkMode ? "#ffffff" : "#1a1a1a" }}>{prize.name}</h3>
                  <p style={{ margin: "0 0 14px", fontSize: "13px", color: darkMode ? "#aaa" : "#666", lineHeight: 1.5 }}>{prize.description}</p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ background: darkMode ? "#3d2a2a" : "#FEF2F2", color: "#EF4444", borderRadius: "8px", padding: "3px 10px", fontSize: "12px", fontWeight: "700" }}>
                      🔴 {taken} ocupados
                    </span>
                    <span style={{ background: darkMode ? "#2a3d2a" : "#F0FDF4", color: "#22C55E", borderRadius: "8px", padding: "3px 10px", fontSize: "12px", fontWeight: "700" }}>
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
            background: darkMode ? "#2a2a2a" : "#fff",
            borderRadius: "24px",
            padding: "36px 28px",
            boxShadow: darkMode ? "0 4px 32px rgba(0,0,0,0.3)" : "0 4px 32px rgba(0,0,0,0.08)",
            border: `2px solid ${activePrize.color}30`,
            transition: "all 0.3s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: darkMode ? "#ffffff" : "#1a1a1a" }}>
                  {activePrize.emoji} {activePrize.name}
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "14px", color: darkMode ? "#888" : "#888" }}>
                  Selecciona tus números de la suerte
                </p>
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[
                  { color: "#E5E7EB", label: "Libre" },
                  { color: "#FCA5A5", label: "Ocupado" },
                  { color: activePrize.color, label: "Tu selección" },
                ].map((l) => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: darkMode ? "#bbb" : "#555" }}>
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
                let bg = darkMode ? "#3a3a3a" : "#F3F4F6";
                let color = darkMode ? "#ddd" : "#374151";
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
              background: darkMode ? "#3a3a3a" : activePrize.accent,
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              border: `1px solid ${activePrize.color}30`,
              transition: "all 0.3s ease",
            }}>
              <div>
                <p style={{ margin: 0, fontSize: "14px", color: darkMode ? "#aaa" : "#666" }}>Números seleccionados:</p>
                <p style={{ margin: "4px 0 0", fontSize: "16px", fontWeight: "800", color: darkMode ? "#ffffff" : "#1a1a1a" }}>
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
          <div style={{ textAlign: "center", padding: "60px 0", color: darkMode ? "#666" : "#bbb" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>☝️</div>
            <p style={{ fontSize: "18px", fontWeight: "600" }}>Selecciona un sorteo arriba para ver los números disponibles</p>
          </div>
        )}

        {/* GANADORES SECTION CON NÚMERO DE BOLETO */}
        <section id="ganadores" style={{ marginTop: "80px", textAlign: "center", scrollMarginTop: "100px" }}>
          <h2 style={{ fontSize: "13px", letterSpacing: "5px", color: darkMode ? "#666" : "#999", textTransform: "uppercase", marginBottom: "40px", fontFamily: "monospace" }}>
            — Últimos Ganadores —
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", fontFamily: "system-ui, -apple-system, sans-serif" }}>
            {[
              { name: "Carlos M.", prize: "Viaje Galápagos", date: "12 Mar", ticket: "42" },
              { name: "Elena R.", prize: "Canasta Familiar", date: "10 Mar", ticket: "15" },
              { name: "Andrés B.", prize: "Spa & Bienestar", date: "05 Mar", ticket: "08" }
            ].map((g, i) => (
              <div key={i} style={{ 
                background: darkMode ? "#2a2a2a" : "#fff", 
                padding: "24px 20px", 
                borderRadius: "20px", 
                boxShadow: darkMode ? "0 10px 30px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.05)", 
                minWidth: "220px",
                position: "relative",
                border: darkMode ? "1px solid #3a3a3a" : "1px solid #f0f0f0",
                transition: "all 0.3s ease"
              }}>
                {/* Insignia del número ganador */}
                <div style={{
                  position: "absolute",
                  top: "-15px",
                  right: "-15px",
                  background: "#143768",
                  color: "#fff",
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(20, 55, 104, 0.4)",
                  border: "3px solid #FFFBF5"
                }}>
                  #{g.ticket}
                </div>

                <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
                <p style={{ fontWeight: "900", margin: "0 0 4px", color: darkMode ? "#ffffff" : "#1a1a1a", fontSize: "18px" }}>{g.name}</p>
                <p style={{ color: "#FF6B35", fontSize: "14px", fontWeight: "700", margin: "0 0 12px" }}>{g.prize}</p>
                
                <div style={{ background: darkMode ? "#3a3a3a" : "#F3F4F6", borderRadius: "8px", padding: "6px 12px", display: "inline-block", transition: "all 0.3s ease" }}>
                  <p style={{ color: darkMode ? "#bbb" : "#6b7280", fontSize: "12px", margin: "0", fontWeight: "600" }}>📅 {g.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACTO SECTION NUEVA */}
        <section id="contacto" style={{ 
          marginTop: "80px", 
          textAlign: "center", 
          scrollMarginTop: "100px",
          background: darkMode ? "#2a2a2a" : "#fff",
          padding: "50px 20px",
          borderRadius: "24px",
          boxShadow: darkMode ? "0 10px 40px rgba(0,0,0,0.3)" : "0 10px 40px rgba(0,0,0,0.04)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          transition: "all 0.3s ease"
        }}>
          <h2 style={{ fontSize: "13px", letterSpacing: "5px", color: darkMode ? "#666" : "#999", textTransform: "uppercase", marginBottom: "16px", fontFamily: "monospace" }}>
            — Contáctanos —
          </h2>
          <h3 style={{ fontSize: "32px", fontWeight: "900", color: darkMode ? "#ffffff" : "#1a1a1a", margin: "0 0 16px", letterSpacing: "-0.5px" }}>
            ¿Tienes alguna duda o quieres confirmar tu reserva?
          </h3>
          <p style={{ color: darkMode ? "#bbb" : "#666", maxWidth: "600px", margin: "0 auto 32px", lineHeight: "1.6", fontSize: "16px" }}>
            Escríbenos directamente a nuestro WhatsApp o envíanos un correo. Nuestro equipo está listo para ayudarte con tus números y explicarte los métodos de pago.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <a href="https://wa.me/593999999999" target="_blank" rel="noopener noreferrer" 
               className="hover:scale-105 transition-transform duration-300"
               style={{ 
                 display: "flex", alignItems: "center", gap: "10px", 
                 background: "#22C55E", color: "#fff", 
                 padding: "14px 28px", borderRadius: "14px", 
                 textDecoration: "none", fontWeight: "800", fontSize: "16px",
                 boxShadow: "0 8px 20px rgba(34,197,94,0.3)"
               }}>
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              Escribir al WhatsApp
            </a>
            <a href="mailto:info@sorteoslafortuna.com" 
               className="hover:scale-105 transition-transform duration-300"
               style={{ 
                 display: "flex", alignItems: "center", gap: "10px", 
                 background: "#143768", color: "#fff", 
                 padding: "14px 28px", borderRadius: "14px", 
                 textDecoration: "none", fontWeight: "800", fontSize: "16px",
                 boxShadow: "0 8px 20px rgba(20, 55, 104, 0.3)"
               }}>
              <span style={{ fontSize: "20px" }}>✉️</span>
              Enviar Correo
            </a>
          </div>
        </section>

      </main>

      {/* MODAL */}
      {modal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999, padding: "20px", 
          }}
          onClick={() => setModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: darkMode ? "#2a2a2a" : "#fff", 
              borderRadius: "28px", 
              padding: "48px 40px",
              maxWidth: "420px", 
              width: "100%", 
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
              animation: "popIn 0.35s cubic-bezier(0.175,0.885,0.32,1.275)",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎉</div>
            <h2 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: "900", color: darkMode ? "#ffffff" : "#1a1a1a" }}>
              ¡Reserva Exitosa!
            </h2>
            <p style={{ color: darkMode ? "#bbb" : "#666", marginBottom: "20px", fontSize: "16px", lineHeight: 1.6 }}>
              Reservaste los números para <strong>{modal.prize.name}</strong>
            </p>
            <div style={{
              background: darkMode ? "#3a3a3a" : modal.prize.accent, borderRadius: "14px", padding: "16px 20px",
              marginBottom: "28px", border: `1px solid ${modal.prize.color}30`,
              transition: "all 0.3s ease"
            }}>
              <p style={{ margin: 0, fontSize: "13px", color: darkMode ? "#999" : "#888", marginBottom: "6px" }}>Tus números:</p>
              <p style={{ margin: 0, fontSize: "22px", fontWeight: "900", color: modal.prize.color, letterSpacing: "2px" }}>
                {modal.nums.sort((a, b) => a - b).join("  ·  ")}
              </p>
            </div>
            <p style={{ color: darkMode ? "#888" : "#aaa", fontSize: "13px", marginBottom: "24px" }}>
              Guarda una captura de pantalla como comprobante y contáctanos para el pago 📸
            </p>
            <button
              onClick={() => setModal(null)}
              style={{
                background: modal.prize.color, color: "#fff", border: "none",
                borderRadius: "14px", padding: "14px 40px",
                fontSize: "16px", fontWeight: "800", cursor: "pointer",
                boxShadow: `0 6px 20px ${modal.prize.color}50`,
                transition: "transform 0.2s",
              }}
              className="hover:scale-105"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ 
        background: darkMode ? "#0f0f0f" : "#1a1a1a", 
        color: "#fff", 
        padding: "60px 20px 30px", 
        marginTop: "40px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "all 0.3s ease"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "40px", overflow: "hidden", transform: "rotate(180deg)" }}>
          <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d="M0,40 C300,0 600,40 900,10 C1050,0 1150,20 1200,40 Z" fill={darkMode ? "#1a1a1a" : "#FFFBF5"} />
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
              <p style={{ color: darkMode ? "#888" : "#aaa", fontSize: "14px", lineHeight: "1.6" }}>
                Llevando alegría y premios increíbles a todos nuestros participantes desde Guayaquil para todo el país.
              </p>
              
              {/* Iconos de Redes Sociales */}
              <div className="flex gap-4 mt-6">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 group">
                  <svg className="w-5 h-5 fill-current text-gray-400 group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-colors duration-300 group">
                  <svg className="w-5 h-5 fill-current text-gray-400 group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 transition-colors duration-300 group">
                  <svg className="w-5 h-5 fill-current text-gray-400 group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Pagos */}
            <div>
              <h4 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: darkMode ? "#555" : "#666", marginBottom: "20px" }}>
                Métodos de Pago
              </h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {['💳 Visa', '💳 Master', '🏦 Transferencia', '📱 Deuna!'].map(metodo => (
                  <span key={metodo} style={{ 
                    background: darkMode ? "#3a3a3a" : "#262626", padding: "6px 12px", borderRadius: "8px", 
                    fontSize: "12px", color: darkMode ? "#bbb" : "#ccc", border: darkMode ? "1px solid #4a4a4a" : "1px solid #333",
                    transition: "all 0.3s ease"
                  }}>
                    {metodo}
                  </span>
                ))}
              </div>
            </div>

            {/* Columna 3: Legal/Info */}
            <div>
              <h4 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: darkMode ? "#555" : "#666", marginBottom: "20px" }}>
                Información
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px", color: darkMode ? "#888" : "#aaa", lineHeight: "2" }}>
                <li style={{ cursor: "pointer" }} className="hover:text-white transition-colors">Términos y Condiciones</li>
                <li style={{ cursor: "pointer" }} className="hover:text-white transition-colors">Preguntas Frecuentes</li>
                <li style={{ cursor: "pointer" }} className="hover:text-white transition-colors">Aviso de Privacidad</li>
              </ul>
            </div>
          </div>

          <hr style={{ border: "0", borderTop: `1px solid ${darkMode ? "#3a3a3a" : "#333"}`, margin: "40px 0 20px", transition: "all 0.3s ease" }} />

          <div style={{ textAlign: "center", color: darkMode ? "#555" : "#666", fontSize: "12px" }}>
            <p style={{ marginBottom: "8px" }}>© 2026 Sorteos La Fortuna. Todos los derechos reservados.</p>
            <p style={{ fontStyle: "italic" }}>🔞 El juego es solo para mayores de 18 años. Juega con responsabilidad.</p>
          </div>
        </div>
      </footer>

      <style>{`
        html { 
          scroll-behavior: smooth; 
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
        button:hover:not(:disabled) { filter: brightness(0.95); }
      `}</style>
    </div>
  );
}