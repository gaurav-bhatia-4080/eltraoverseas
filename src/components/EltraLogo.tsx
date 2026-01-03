import { cn } from "@/lib/utils";

const EltraLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("text-accent", className)}
    aria-hidden="true"
    focusable="false"
    role="img"
  >
    <defs>
      <path id="bottomCurve" d="M 100, 320 A 180, 180 0 0, 0 412, 320" />
    </defs>
    <circle cx="256" cy="256" r="200" fill="#1C2E4A" stroke="#D4AF37" strokeWidth="10" />
    <circle cx="256" cy="256" r="185" fill="none" stroke="#D4AF37" strokeWidth="2" />
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      fill="#D4AF37"
      fontFamily="'Brush Script MT', 'Lucida Calligraphy', cursive"
      fontSize="140"
      dy=".2em"
    >
      Eltra
    </text>
    <text fill="#D4AF37" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="28" letterSpacing="2">
      <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
        HARDWARE AND LOCKS
      </textPath>
    </text>
  </svg>
);

export default EltraLogo;
