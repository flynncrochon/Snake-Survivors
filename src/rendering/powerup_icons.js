// SVG icons for each power-up, pre-rendered to Image objects for canvas drawing.

const ICON_SIZE = 64;

const S = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"`;

const SVG_DEFS = {
    // Graviton — magnetic pull field
    magnet: `<svg ${S}>
        <path d="M20 16 L20 36 A12 12 0 0 0 44 36 L44 16" fill="none" stroke="#668fff" stroke-width="6" stroke-linecap="round"/>
        <rect x="15" y="10" width="10" height="12" rx="2" fill="#ff4455"/>
        <rect x="39" y="10" width="10" height="12" rx="2" fill="#4455ff"/>
        <path d="M26 48 Q32 54 38 48" fill="none" stroke="#668fff" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
        <path d="M22 52 Q32 60 42 52" fill="none" stroke="#668fff" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
    </svg>`,

    // Rapid Fire — stacked chevrons
    atk_speed: `<svg ${S}>
        <path d="M16 40 L32 28 L48 40" fill="none" stroke="#ffaa00" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M16 28 L32 16 L48 28" fill="none" stroke="#ffcc44" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M16 52 L32 40 L48 52" fill="none" stroke="#cc7700" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" opacity="0.5"/>
    </svg>`,

    // Dead Eye — crosshair with inner ring
    crit: `<svg ${S}>
        <circle cx="32" cy="32" r="18" fill="none" stroke="#ff4444" stroke-width="2.5"/>
        <circle cx="32" cy="32" r="8" fill="none" stroke="#ff4444" stroke-width="2"/>
        <circle cx="32" cy="32" r="2.5" fill="#ff6666"/>
        <line x1="32" y1="4" x2="32" y2="20" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="32" y1="44" x2="32" y2="60" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="4" y1="32" x2="20" y2="32" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="44" y1="32" x2="60" y2="32" stroke="#ff4444" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    // Gorger — ravenous gullet
    gorger: `<svg ${S}>
        <ellipse cx="32" cy="32" rx="22" ry="18" fill="#aa5500" stroke="#ffaa00" stroke-width="2.5"/>
        <ellipse cx="32" cy="32" rx="14" ry="10" fill="#220000"/>
        <polygon points="14,24 20,32 12,30" fill="#fff"/>
        <polygon points="24,22 28,32 20,30" fill="#fff"/>
        <polygon points="36,22 40,30 32,32" fill="#fff"/>
        <polygon points="50,24 52,30 44,32" fill="#fff"/>
        <polygon points="18,42 22,34 14,34" fill="#fff" opacity="0.8"/>
        <polygon points="32,43 36,34 28,34" fill="#fff" opacity="0.8"/>
        <polygon points="46,42 50,34 42,34" fill="#fff" opacity="0.8"/>
        <circle cx="22" cy="14" r="4" fill="#ff6600" opacity="0.9"/>
        <circle cx="42" cy="14" r="4" fill="#ff6600" opacity="0.9"/>
        <circle cx="22" cy="14" r="1.5" fill="#220000"/>
        <circle cx="42" cy="14" r="1.5" fill="#220000"/>
    </svg>`,

    // Plague Mortar — skull bomb
    plague: `<svg ${S}>
        <circle cx="32" cy="36" r="18" fill="#337733"/>
        <circle cx="32" cy="36" r="18" fill="none" stroke="#55aa55" stroke-width="2"/>
        <circle cx="25" cy="32" r="4.5" fill="#112211"/>
        <circle cx="39" cy="32" r="4.5" fill="#112211"/>
        <path d="M26 42 L28 40 L30 42 L32 40 L34 42 L36 40 L38 42" fill="none" stroke="#112211" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="34" y1="18" x2="38" y2="8" stroke="#55aa55" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="40" cy="6" r="3.5" fill="#ffcc00" opacity="0.9"/>
        <circle cx="42" cy="4" r="2" fill="#ffee66" opacity="0.6"/>
    </svg>`,


    // Snake Nest — three small green snakes
    snake_nest: `<svg ${S}>
        <!-- Snake 1 (left) — curving right -->
        <path d="M10 52 Q8 42 14 34 Q20 26 16 18" fill="none" stroke="#22bb44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10 52 Q8 42 14 34 Q20 26 16 18" fill="none" stroke="#44ee66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="15" cy="16" r="3.5" fill="#22bb44"/>
        <circle cx="13.5" cy="15" r="1" fill="#115533"/>
        <circle cx="16.5" cy="15" r="1" fill="#115533"/>
        <path d="M13 19 L15 21 L17 19" fill="none" stroke="#ff4444" stroke-width="1" stroke-linecap="round"/>
        <!-- Snake 2 (center) — S-curve, tallest -->
        <path d="M32 54 Q38 44 28 36 Q18 28 32 16" fill="none" stroke="#22bb44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 54 Q38 44 28 36 Q18 28 32 16" fill="none" stroke="#44ee66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="32" cy="13.5" r="4" fill="#22bb44"/>
        <circle cx="30" cy="12.5" r="1.2" fill="#115533"/>
        <circle cx="34" cy="12.5" r="1.2" fill="#115533"/>
        <path d="M30 16.5 L32 18.5 L34 16.5" fill="none" stroke="#ff4444" stroke-width="1" stroke-linecap="round"/>
        <!-- Snake 3 (right) — curving left -->
        <path d="M54 52 Q56 42 50 34 Q44 26 48 18" fill="none" stroke="#22bb44" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M54 52 Q56 42 50 34 Q44 26 48 18" fill="none" stroke="#44ee66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="49" cy="16" r="3.5" fill="#22bb44"/>
        <circle cx="47.5" cy="15" r="1" fill="#115533"/>
        <circle cx="50.5" cy="15" r="1" fill="#115533"/>
        <path d="M47 19 L49 21 L51 19" fill="none" stroke="#ff4444" stroke-width="1" stroke-linecap="round"/>
    </svg>`,

    // Hydra Fangs — triple fang/arrow burst
    multishot: `<svg ${S}>
        <path d="M22 48 L22 20 L16 28" fill="none" stroke="#cc66ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 48 L32 12 L26 22" fill="none" stroke="#dd88ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M32 12 L38 22" fill="none" stroke="#dd88ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M42 48 L42 20 L48 28" fill="none" stroke="#cc66ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,

    // Viper Fangs — pair of curved fangs with venom drops
    fangs: `<svg ${S}>
        <path d="M20 12 Q18 32 24 52" fill="none" stroke="#ffe8e8" stroke-width="5" stroke-linecap="round"/>
        <path d="M20 12 Q16 28 22 48" fill="none" stroke="#ff6680" stroke-width="3" stroke-linecap="round"/>
        <circle cx="24" cy="54" r="2.5" fill="#ff4466" opacity="0.8"/>
        <path d="M44 12 Q46 32 40 52" fill="none" stroke="#ffe8e8" stroke-width="5" stroke-linecap="round"/>
        <path d="M44 12 Q48 28 42 48" fill="none" stroke="#ff6680" stroke-width="3" stroke-linecap="round"/>
        <circle cx="40" cy="54" r="2.5" fill="#ff4466" opacity="0.8"/>
    </svg>`,

    // Chronofield — clock with tick marks
    chronofield: `<svg ${S}>
        <circle cx="32" cy="32" r="23" fill="none" stroke="#00cccc" stroke-width="3"/>
        <circle cx="32" cy="32" r="23" fill="none" stroke="#00ffff" stroke-width="1" opacity="0.3"/>
        <line x1="32" y1="12" x2="32" y2="16" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="48" x2="32" y2="52" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="32" x2="16" y2="32" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="48" y1="32" x2="52" y2="32" stroke="#00ffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="32" x2="32" y2="18" stroke="#00ffff" stroke-width="3" stroke-linecap="round"/>
        <line x1="32" y1="32" x2="43" y2="38" stroke="#00ccdd" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="3" fill="#00ffff"/>
    </svg>`,
};

// Cache loaded Image objects
const icon_cache = {};
let loading = false;
let loaded = false;

function svg_to_image(svg_string) {
    return new Promise((resolve) => {
        const img = new Image();
        const blob = new Blob([svg_string], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(null);
        };
        img.src = url;
    });
}

export async function load_powerup_icons() {
    if (loaded || loading) return;
    loading = true;
    const entries = Object.entries(SVG_DEFS);
    const results = await Promise.all(entries.map(([, svg]) => svg_to_image(svg)));
    for (let i = 0; i < entries.length; i++) {
        if (results[i]) {
            icon_cache[entries[i][0]] = results[i];
        }
    }
    loaded = true;
    loading = false;
}

export function get_powerup_icon(id) {
    return icon_cache[id] || null;
}

export { ICON_SIZE };
