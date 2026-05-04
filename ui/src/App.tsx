import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

// ============================================================================
// Mycelium Cipher — AI Company OS shell
// Single-file App.tsx (React + TypeScript, no external UI libs)
// ============================================================================

const COLORS = {
  bg: "#343E40",
  bgPanel: "#3E4A4C",
  bgSidebar: "#2A3234",
  bgStatus: "#222829",
  bgCardDeep: "#2A3234",
  moss: "#E1AD01",
  teal: "#008080",
  bone: "#F0EAD6",
  ink: "#1A1C1D",
  border: "rgba(255,255,255,0.08)",
  textDim: "rgba(240,234,214,0.5)",
  textDimmer: "rgba(240,234,214,0.3)",
  textSubtitle: "rgba(240,234,214,0.6)",
} as const;

const FONT_HEAD = "'Cormorant Garamond', Georgia, serif";
const FONT_UI = "'Raleway', system-ui, -apple-system, sans-serif";

type ViewKey =
  | "dashboard"
  | "org"
  | "council"
  | "activity"
  | "missions"
  | "budget"
  | "integrations"
  | "settings";

// ----------------------------------------------------------------------------
// Icons (inline SVG)
// ----------------------------------------------------------------------------
type IconProps = { size?: number; color?: string };

const Icon = {
  Grid: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Hierarchy: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="5" rx="1" />
      <rect x="2" y="17" width="6" height="5" rx="1" />
      <rect x="9" y="17" width="6" height="5" rx="1" />
      <rect x="16" y="17" width="6" height="5" rx="1" />
      <path d="M12 7v4M5 17v-2h14v2M12 11v4" />
    </svg>
  ),
  Council: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="13" rx="8" ry="3.5" />
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="4.5" cy="11" r="1.6" />
      <circle cx="19.5" cy="11" r="1.6" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </svg>
  ),
  Pulse: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12h4l2-7 4 14 2-9 2 5h6" />
    </svg>
  ),
  Target: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Wallet: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="16.5" cy="13.5" r="1.2" fill={color} stroke="none" />
    </svg>
  ),
  Plug: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v4M15 2v4" />
      <path d="M7 6h10v5a5 5 0 0 1-10 0V6Z" />
      <path d="M12 16v6" />
    </svg>
  ),
  Gear: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  ),
};

const NAV: { key: ViewKey; label: string; icon: React.FC<IconProps> }[] = [
  { key: "dashboard", label: "Dashboard", icon: Icon.Grid },
  { key: "org", label: "Org Chart", icon: Icon.Hierarchy },
  { key: "council", label: "Council Board", icon: Icon.Council },
  { key: "activity", label: "Agent Activity", icon: Icon.Pulse },
  { key: "missions", label: "Missions", icon: Icon.Target },
  { key: "budget", label: "Budget", icon: Icon.Wallet },
  { key: "integrations", label: "Integrations", icon: Icon.Plug },
  { key: "settings", label: "Settings", icon: Icon.Gear },
];

// ----------------------------------------------------------------------------
// Mycelium network canvas (used both as sidebar header bg + dashboard bg)
// ----------------------------------------------------------------------------
type MyceliumCanvasProps = {
  density?: number;
  opacity?: number;
  speed?: number;
  linkDistance?: number;
  lineWidth?: number;
  className?: string;
  style?: React.CSSProperties;
};

const MyceliumCanvas: React.FC<MyceliumCanvasProps> = ({
  density = 0.00012,
  opacity = 0.15,
  speed = 0.6,
  linkDistance = 140,
  lineWidth = 0.7,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(8, Math.floor(width * height * density));
      nodes = new Array(target).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * 0.016,
        vy: (Math.random() - 0.5) * speed * 0.016,
        r: 0.8 + Math.random() * 1.2,
      }));
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;

      ctx.clearRect(0, 0, width, height);

      // drift nodes
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }

      // links
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const max2 = linkDistance * linkDistance;
          if (d2 < max2) {
            const t = 1 - Math.sqrt(d2) / linkDistance;
            const alpha = opacity * t;
            ctx.strokeStyle = `rgba(225,173,1,${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // nodes
      for (const n of nodes) {
        ctx.fillStyle = `rgba(225,173,1,${(opacity * 1.2).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [density, opacity, speed, linkDistance, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
};

// ----------------------------------------------------------------------------
// Sidebar
// ----------------------------------------------------------------------------
type BackendStatus = "running" | "offline" | "checking";

const StatusDot: React.FC<{ status: BackendStatus | "idle" }> = ({ status }) => {
  const color =
    status === "running"
      ? "#3DDC84"
      : status === "offline"
      ? "#E55353"
      : status === "checking"
      ? "#E1AD01"
      : "#7A8385";
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 8px ${color}`,
        transition: "background 300ms ease, box-shadow 300ms ease",
      }}
    />
  );
};

type NavItemProps = {
  label: string;
  active: boolean;
  IconCmp: React.FC<IconProps>;
  onClick: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ label, active, IconCmp, onClick }) => {
  const [hover, setHover] = useState(false);
  const textColor = active || hover ? COLORS.bone : COLORS.textDim;
  const bg = active
    ? "rgba(225,173,1,0.08)"
    : hover
    ? "rgba(255,255,255,0.04)"
    : "transparent";
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        height: 44,
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 18px",
        background: bg,
        border: "none",
        outline: "none",
        cursor: "pointer",
        color: textColor,
        fontFamily: FONT_UI,
        fontWeight: 500,
        fontSize: 14,
        textAlign: "left",
        transition: "background 150ms ease, color 150ms ease",
      }}
    >
      {active && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: COLORS.moss,
          }}
        />
      )}
      <span style={{ display: "inline-flex", color: textColor, transition: "color 150ms ease" }}>
        <IconCmp size={18} color={textColor} />
      </span>
      <span>{label}</span>
    </button>
  );
};

const SidebarHeader: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        borderBottom: `1px solid ${COLORS.border}`,
        overflow: "hidden",
      }}
    >
      <MyceliumCanvas density={0.00035} opacity={0.18} speed={0.35} linkDistance={70} lineWidth={0.6} />
      <div style={{ position: "relative", display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontFamily: FONT_HEAD,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 22,
            color: COLORS.moss,
            letterSpacing: 0.3,
          }}
        >
          Mycelium
        </span>
        <span
          style={{
            fontFamily: FONT_UI,
            fontWeight: 600,
            fontSize: 10,
            color: COLORS.teal,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Cipher
        </span>
      </div>
    </div>
  );
};

const SystemStatusCard: React.FC<{ backend: BackendStatus }> = ({ backend }) => {
  const backendLabel =
    backend === "running" ? "Running" : backend === "offline" ? "Offline" : "Checking…";
  return (
    <div
      style={{
        margin: 12,
        padding: 12,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT_UI, fontSize: 12, color: COLORS.teal, letterSpacing: 0.4 }}>
          Backend
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <StatusDot status={backend} />
          <span style={{ fontFamily: FONT_UI, fontSize: 12, color: COLORS.bone }}>{backendLabel}</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: FONT_UI, fontSize: 12, color: COLORS.teal, letterSpacing: 0.4 }}>
          Ollama
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <StatusDot status="idle" />
          <span style={{ fontFamily: FONT_UI, fontSize: 12, color: COLORS.bone }}>Not connected</span>
        </span>
      </div>
    </div>
  );
};

type SidebarProps = {
  current: ViewKey;
  onSelect: (k: ViewKey) => void;
  backend: BackendStatus;
};

const Sidebar: React.FC<SidebarProps> = ({ current, onSelect, backend }) => {
  return (
    <aside
      style={{
        width: 240,
        flex: "0 0 240px",
        background: COLORS.bgSidebar,
        borderRight: `1px solid ${COLORS.border}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 0,
      }}
    >
      <SidebarHeader />
      <nav style={{ display: "flex", flexDirection: "column", paddingTop: 8 }}>
        {NAV.map((n) => (
          <NavItem
            key={n.key}
            label={n.label}
            IconCmp={n.icon}
            active={current === n.key}
            onClick={() => onSelect(n.key)}
          />
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <SystemStatusCard backend={backend} />
    </aside>
  );
};

// ----------------------------------------------------------------------------
// Status bar
// ----------------------------------------------------------------------------
const useClock = (): string => {
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return useMemo(
    () =>
      now.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    [now]
  );
};

const StatusBar: React.FC<{ agents: number; mission: string | null }> = ({ agents, mission }) => {
  const time = useClock();
  return (
    <footer
      style={{
        height: 32,
        flex: "0 0 32px",
        background: COLORS.bgStatus,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 16,
        fontFamily: FONT_UI,
        fontSize: 12,
        color: COLORS.textDim,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: 999,
            background: agents > 0 ? COLORS.moss : "#7A8385",
            boxShadow: agents > 0 ? `0 0 8px ${COLORS.moss}` : "none",
          }}
        />
        <span>{agents} agents active</span>
      </span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>{mission ?? "No missions running"}</span>
      <div style={{ flex: 1 }} />
      <span style={{ color: COLORS.bone, fontVariantNumeric: "tabular-nums", letterSpacing: 0.5 }}>
        {time}
      </span>
    </footer>
  );
};

// ----------------------------------------------------------------------------
// Dashboard view
// ----------------------------------------------------------------------------
const LaunchButton: React.FC = () => {
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(id);
  }, []);
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        height: 52,
        border: "none",
        borderRadius: 8,
        background: COLORS.moss,
        color: COLORS.ink,
        fontFamily: FONT_UI,
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 0.3,
        cursor: "pointer",
        filter: hover ? "brightness(1.1)" : "brightness(1)",
        boxShadow: hover ? `0 0 20px rgba(225,173,1,0.4)` : "0 0 0 rgba(0,0,0,0)",
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(8px)",
        transition:
          "opacity 400ms ease-out, transform 400ms ease-out, filter 200ms ease, box-shadow 200ms ease",
      }}
    >
      Launch Company →
    </button>
  );
};

const DashboardView: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MyceliumCanvas density={0.00009} opacity={0.15} speed={0.7} linkDistance={170} />
      <div
        style={{
          position: "relative",
          width: 600,
          maxWidth: "calc(100% - 48px)",
          background: COLORS.bgCardDeep,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <span
          style={{
            fontFamily: FONT_UI,
            fontWeight: 600,
            fontSize: 11,
            color: COLORS.teal,
            textTransform: "uppercase",
            letterSpacing: 4,
          }}
        >
          Ready
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: FONT_HEAD,
            fontWeight: 500,
            fontSize: 36,
            color: COLORS.bone,
            lineHeight: 1.1,
          }}
        >
          No company running.
        </h1>
        <p
          style={{
            margin: 0,
            fontFamily: FONT_UI,
            fontSize: 16,
            color: COLORS.textSubtitle,
            lineHeight: 1.5,
          }}
        >
          Define your mission. Mycelium does the rest.
        </p>
        <div style={{ height: 8 }} />
        <LaunchButton />
        <span
          style={{
            fontFamily: FONT_UI,
            fontSize: 11,
            color: COLORS.textDimmer,
            textAlign: "center",
            letterSpacing: 0.4,
          }}
        >
          Powered by Mycelium Cipher
        </span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Placeholder view
// ----------------------------------------------------------------------------
const PlaceholderView: React.FC<{ name: string }> = ({ name }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      padding: 24,
    }}
  >
    <h2
      style={{
        margin: 0,
        fontFamily: FONT_HEAD,
        fontWeight: 500,
        fontSize: 28,
        color: COLORS.bone,
      }}
    >
      {name}
    </h2>
    <p
      style={{
        margin: 0,
        fontFamily: FONT_UI,
        fontSize: 14,
        color: COLORS.textDim,
      }}
    >
      Coming in next layer.
    </p>
  </div>
);

// ----------------------------------------------------------------------------
// Main App
// ----------------------------------------------------------------------------
const useBackendHealth = (): BackendStatus => {
  const [status, setStatus] = useState<BackendStatus>("checking");
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const ctrl = new AbortController();
        const timeout = setTimeout(() => ctrl.abort(), 2500);
        const res = await fetch("http://localhost:3100/health", {
          method: "GET",
          signal: ctrl.signal,
        });
        clearTimeout(timeout);
        if (cancelled) return;
        setStatus(res.ok ? "running" : "offline");
      } catch {
        if (cancelled) return;
        setStatus("offline");
      }
    };
    check();
    const id = setInterval(check, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);
  return status;
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewKey>("dashboard");
  const backend = useBackendHealth();

  const handleSelect = useCallback((k: ViewKey) => setView(k), []);

  const content = useMemo(() => {
    switch (view) {
      case "dashboard":
        return <DashboardView />;
      case "org":
        return <PlaceholderView name="Org Chart" />;
      case "council":
        return <PlaceholderView name="Council Board" />;
      case "activity":
        return <PlaceholderView name="Agent Activity" />;
      case "missions":
        return <PlaceholderView name="Missions" />;
      case "budget":
        return <PlaceholderView name="Budget" />;
      case "integrations":
        return <PlaceholderView name="Integrations" />;
      case "settings":
        return <PlaceholderView name="Settings" />;
      default:
        return null;
    }
  }, [view]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: COLORS.bg,
        color: COLORS.bone,
        fontFamily: FONT_UI,
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Sidebar current={view} onSelect={handleSelect} backend={backend} />
        <main
          style={{
            flex: 1,
            minWidth: 0,
            background: COLORS.bg,
            overflow: "auto",
            position: "relative",
          }}
        >
          {content}
        </main>
      </div>
      <StatusBar agents={0} mission={null} />
    </div>
  );
};

export default App;
