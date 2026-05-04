import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import "./index.css";

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

type IconProps = { size?: number; color?: string };

// Simple inline icons so nothing is empty / broken
const Icon = {
  Grid: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  Hierarchy: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="18" cy="19" r="2.2" />
      <path d="M12 7.5v3.5M10 11h4M9 13.5l-2 3M15 13.5l2 3" />
    </svg>
  ),
  Council: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 5v2M12 17v2M5 12h2M17 12h2M8.5 8.5l1.4 1.4M14.1 14.1l1.4 1.4M15.5 8.5l-1.4 1.4M9.9 14.1l-1.4 1.4" />
    </svg>
  ),
  Pulse: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h4l2-6 4 12 2-6h4" />
    </svg>
  ),
  Target: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5V3M5 12H3M12 21v-2M21 12h-2" />
    </svg>
  ),
  Wallet: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M16 12h4M7 9h7" />
    </svg>
  ),
  Plug: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3v4M15 3v4M8 13h8" />
      <path d="M9 13v3a3 3 0 0 0 6 0v-3" />
    </svg>
  ),
  Gear: ({ size = 18, color = "currentColor" }: IconProps) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.78 1.78 0 0 0 .35 1.95l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.78 1.78 0 0 0 15 19.4a1.78 1.78 0 0 0-1 .33 1.78 1.78 0 0 0-.67 1.44V22a2 2 0 0 1-4 0v-.83A1.78 1.78 0 0 0 8 19.4a1.78 1.78 0 0 0-1.95-.35l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.78 1.78 0 0 0 4.6 15a1.78 1.78 0 0 0-.33-1 1.78 1.78 0 0 0-1.44-.67H2a2 2 0 0 1 0-4h.83A1.78 1.78 0 0 0 4.6 8a1.78 1.78 0 0 0-.33-1 1.78 1.78 0 0 0-1.44-.67L2 6.17a2 2 0 0 1 4 0V7a1.78 1.78 0 0 0 1 .33A1.78 1.78 0 0 0 9 4.6V4.6A1.78 1.78 0 0 0 10 4.27a1.78 1.78 0 0 0 .67-1.44V2a2 2 0 0 1 4 0v.83A1.78 1.78 0 0 0 16 4.6a1.78 1.78 0 0 0 1 .33 1.78 1.78 0 0 0 1.95-.35l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.78 1.78 0 0 0 19.4 9a1.78 1.78 0 0 0 .33 1A1.78 1.78 0 0 0 21.17 11H22a2 2 0 0 1 0 4h-.83A1.78 1.78 0 0 0 19.4 15Z" />
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

type BackendStatus = "running" | "offline" | "checking";

const MyceliumCanvas: React.FC<{
  density?: number;
  opacity?: number;
  speed?: number;
  linkDistance?: number;
  lineWidth?: number;
  style?: React.CSSProperties;
}> = ({
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

        // move
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
        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < linkDistance) {
              const t = 1 - dist / linkDistance;
              ctx.strokeStyle = `rgba(225,173,1,${(opacity * t).toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        // nodes
        ctx.fillStyle = `rgba(225,173,1,${(opacity * 1.2).toFixed(3)})`;
        for (const n of nodes) {
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
          pointerEvents: "none",
          ...style,
        }}
      />
    );
  };

const StatusDot: React.FC<{ status: BackendStatus | "idle" }> = ({ status }) => {
  const color =
    status === "running"
      ? "#3DDC84"
      : status === "offline"
        ? "#E55353"
        : status === "checking"
          ? COLORS.moss
          : "#7A8385";
  return (
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        display: "inline-block",
        backgroundColor: color,
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
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: COLORS.moss,
          }}
        />
      )}
      <span
        style={{
          width: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconCmp size={18} color={textColor} />
      </span>
      <span>{label}</span>
    </button>
  );
};

const SidebarHeader: React.FC = () => (
  <div
    style={{
      position: "relative",
      height: 56,
      padding: "0 18px",
      display: "flex",
      alignItems: "center",
      overflow: "hidden",
      borderBottom: `1px solid ${COLORS.border}`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.12,
      }}
    >
      <MyceliumCanvas
        density={0.0004}
        opacity={0.3}
        linkDistance={100}
        lineWidth={0.5}
      />
    </div>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          fontFamily: FONT_HEAD,
          fontStyle: "italic",
          fontSize: 22,
          color: COLORS.moss,
        }}
      >
        Mycelium
      </div>
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.teal,
        }}
      >
        Cipher
      </div>
    </div>
  </div>
);

const SystemStatusCard: React.FC<{ backend: BackendStatus }> = ({ backend }) => {
  const backendLabel =
    backend === "running"
      ? "Running"
      : backend === "offline"
        ? "Offline"
        : "Checking…";

  return (
    <div
      style={{
        padding: 14,
        borderTop: `1px solid ${COLORS.border}`,
        fontFamily: FONT_UI,
        fontSize: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <span style={{ color: COLORS.teal, fontWeight: 500 }}>Backend</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: COLORS.bone,
          }}
        >
          <StatusDot status={backend} />
          {backendLabel}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: COLORS.teal, fontWeight: 500 }}>Ollama</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: COLORS.textDim,
          }}
        >
          <StatusDot status="idle" />
          Not connected
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

const Sidebar: React.FC<SidebarProps> = ({ current, onSelect, backend }) => (
  <aside
    style={{
      width: 240,
      backgroundColor: COLORS.bgSidebar,
      color: COLORS.bone,
      display: "flex",
      flexDirection: "column",
      borderRight: `1px solid ${COLORS.border}`,
    }}
  >
    <SidebarHeader />
    <nav
      style={{
        flex: 1,
        paddingTop: 6,
      }}
    >
      {NAV.map((item) => (
        <NavItem
          key={item.key}
          label={item.label}
          active={current === item.key}
          IconCmp={item.icon}
          onClick={() => onSelect(item.key)}
        />
      ))}
    </nav>
    <SystemStatusCard backend={backend} />
  </aside>
);

const DashboardView: React.FC = () => (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    <MyceliumCanvas />
    <div
      style={{
        position: "relative",
        zIndex: 1,
        width: 600,
        maxWidth: "90%",
        backgroundColor: COLORS.bgCardDeep,
        borderRadius: 8,
        border: `1px solid ${COLORS.border}`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        padding: 40,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 11,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: COLORS.teal,
          marginBottom: 16,
        }}
      >
        READY
      </div>
      <div
        style={{
          fontFamily: FONT_HEAD,
          fontSize: 36,
          color: COLORS.bone,
          marginBottom: 12,
        }}
      >
        No company running.
      </div>
      <div
        style={{
          fontFamily: FONT_UI,
          fontSize: 16,
          color: COLORS.textSubtitle,
          marginBottom: 32,
        }}
      >
        Define your mission. Mycelium does the rest.
      </div>
      <button
        type="button"
        style={{
          width: "100%",
          height: 52,
          borderRadius: 8,
          border: "none",
          backgroundColor: COLORS.moss,
          color: COLORS.ink,
          fontFamily: FONT_UI,
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
          transition: "box-shadow 200ms ease, filter 200ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 20px rgba(225,173,1,0.4)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter = "none";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 0 0 rgba(0,0,0,0)";
        }}
      >
        Launch Company →
      </button>
      <div
        style={{
          marginTop: 14,
          fontFamily: FONT_UI,
          fontSize: 11,
          color: COLORS.textDimmer,
        }}
      >
        Powered by Mycelium Cipher
      </div>
    </div>
  </div>
);

const PlaceholderView: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        fontFamily: FONT_HEAD,
        fontSize: 28,
        color: COLORS.bone,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontFamily: FONT_UI,
        fontSize: 14,
        color: COLORS.textDim,
      }}
    >
      Coming in next layer.
    </div>
  </div>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [clock, setClock] = useState<string>(new Date().toLocaleTimeString());

  // backend health
  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://localhost:3100/health");
        setBackendStatus(res.ok ? "running" : "offline");
      } catch {
        setBackendStatus("offline");
      }
    };
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);

  // clock
  useEffect(() => {
    const id = setInterval(
      () => setClock(new Date().toLocaleTimeString()),
      1000
    );
    return () => clearInterval(id);
  }, []);

  const currentLabel = useMemo(
    () => NAV.find((n) => n.key === view)?.label ?? "",
    [view]
  );

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        backgroundColor: COLORS.bg,
        color: COLORS.bone,
        overflow: "hidden",
      }}
    >
      <Sidebar current={view} onSelect={setView} backend={backendStatus} />
      <div
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {view === "dashboard" ? (
            <DashboardView />
          ) : (
            <PlaceholderView label={currentLabel} />
          )}
        </div>
        <div
          style={{
            height: 32,
            backgroundColor: COLORS.bgStatus,
            borderTop: `1px solid ${COLORS.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            fontFamily: FONT_UI,
            fontSize: 12,
            color: COLORS.textDim,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#6b7280", fontSize: 8 }}>●</span>
            <span>0 agents active</span>
            <span style={{ color: COLORS.textDimmer }}>|</span>
            <span>No missions running</span>
          </div>
          <div
            style={{
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {clock}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;