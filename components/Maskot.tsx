export default function Maskot({ boy = 180, tip = "normal" }: { boy?: number; tip?: "normal" | "ev" | "bavul" }) {
  return (
    <svg className={"maskot maskot-" + tip} width={boy} height={boy} viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {tip === "ev" && (
        <g className="ev">
          <rect x="140" y="120" width="62" height="52" rx="6" fill="#eef6f8" stroke="#16294a" strokeWidth="4"/>
          <path d="M134 124 L171 92 L208 124" stroke="#16294a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="#0ea5b1"/>
          <rect x="156" y="142" width="20" height="30" rx="3" fill="#0b8791"/>
          <circle cx="172" cy="157" r="2.5" fill="#eafcfd"/>
        </g>
      )}

      <g className="karinca">
        <ellipse className="golge" cx="92" cy="198" rx="56" ry="9" fill="#16294a" opacity="0.08"/>

        <g className="anten-sol">
          <path d="M74 44 Q60 22 42 20" stroke="#16294a" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <circle cx="40" cy="18" r="8" fill="#0ea5b1" stroke="#16294a" strokeWidth="3"/>
        </g>
        <g className="anten-sag">
          <path d="M110 44 Q124 22 142 20" stroke="#16294a" strokeWidth="5" strokeLinecap="round" fill="none"/>
          <circle cx="144" cy="18" r="8" fill="#0ea5b1" stroke="#16294a" strokeWidth="3"/>
        </g>

        <circle cx="92" cy="92" r="50" fill="#0ea5b1"/>
        <ellipse cx="92" cy="110" rx="28" ry="21" fill="#eafcfd"/>
        <circle cx="74" cy="86" r="7.5" fill="#16294a"/>
        <circle cx="110" cy="86" r="7.5" fill="#16294a"/>
        <circle cx="76.5" cy="83.5" r="2.4" fill="#ffffff"/>
        <circle cx="112.5" cy="83.5" r="2.4" fill="#ffffff"/>
        <ellipse cx="64" cy="102" rx="6" ry="4" fill="#a9e8ec"/>
        <ellipse cx="120" cy="102" rx="6" ry="4" fill="#a9e8ec"/>
        <path d="M82 106 Q92 116 102 106" stroke="#16294a" strokeWidth="4" strokeLinecap="round" fill="none"/>

        <ellipse cx="92" cy="160" rx="32" ry="25" fill="#0b8791"/>
        <ellipse cx="92" cy="164" rx="20" ry="15" fill="#0ea5b1"/>

        <path className="bacak b1" d="M62 150 Q46 156 40 170" stroke="#16294a" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path className="bacak b2" d="M122 150 Q138 156 144 170" stroke="#16294a" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path className="bacak b3" d="M70 178 Q62 188 58 196" stroke="#16294a" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path className="bacak b4" d="M114 178 Q122 188 126 196" stroke="#16294a" strokeWidth="5" strokeLinecap="round" fill="none"/>

        <g transform="translate(80,146)">
          <path d="M12 4 L20 8 L20 16 Q20 24 12 27 Q4 24 4 16 L4 8 Z" fill="#ffffff" stroke="#16294a" strokeWidth="2.5"/>
          <path d="M8.5 15 L11.5 18 L16.5 11.5" stroke="#0ea5b1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>

        {tip === "bavul" && (
          <g className="bavul">
            <rect x="128" y="120" width="48" height="56" rx="9" fill="#0ea5b1" stroke="#16294a" strokeWidth="4"/>
            <rect x="142" y="108" width="20" height="14" rx="6" stroke="#16294a" strokeWidth="4" fill="none"/>
            <line x1="128" y1="141" x2="176" y2="141" stroke="#16294a" strokeWidth="4"/>
            <circle className="teker" cx="138" cy="180" r="5" fill="#16294a"/>
            <circle className="teker" cx="166" cy="180" r="5" fill="#16294a"/>
          </g>
        )}
      </g>
    </svg>
  );
}
