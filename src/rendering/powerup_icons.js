// SVG icons for each power-up, pre-rendered to Image objects for canvas drawing.

const ICON_SIZE = 64;

const S = `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"`;

const SVG_DEFS = {
    // Graviton — magnet horseshoe
    magnet: `<svg ${S}>
        <path d="M18 14 L18 38 A14 14 0 0 0 46 38 L46 14" fill="none" stroke="#88f" stroke-width="5" stroke-linecap="round"/>
        <rect x="14" y="10" width="8" height="10" rx="1" fill="#f44"/>
        <rect x="42" y="10" width="8" height="10" rx="1" fill="#44f"/>
    </svg>`,

    // Rapid Fire — triple arrow
    atk_speed: `<svg ${S}>
        <polygon points="32,8 44,28 36,28 36,56 28,56 28,28 20,28" fill="#fa0"/>
        <line x1="14" y1="20" x2="14" y2="40" stroke="#fa0" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="20" x2="50" y2="40" stroke="#fa0" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    // Dead Eye — crosshair
    crit: `<svg ${S}>
        <circle cx="32" cy="32" r="16" fill="none" stroke="#f44" stroke-width="3"/>
        <circle cx="32" cy="32" r="3" fill="#f44"/>
        <line x1="32" y1="6" x2="32" y2="22" stroke="#f44" stroke-width="3" stroke-linecap="round"/>
        <line x1="32" y1="42" x2="32" y2="58" stroke="#f44" stroke-width="3" stroke-linecap="round"/>
        <line x1="6" y1="32" x2="22" y2="32" stroke="#f44" stroke-width="3" stroke-linecap="round"/>
        <line x1="42" y1="32" x2="58" y2="32" stroke="#f44" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    // Gorger — open jaw
    gorger: `<svg ${S}>
        <path d="M12 28 L32 10 L52 28" fill="none" stroke="#fa0" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M12 36 L32 54 L52 36" fill="none" stroke="#fa0" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="18" y1="36" x2="18" y2="28" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <line x1="32" y1="38" x2="32" y2="26" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <line x1="46" y1="36" x2="46" y2="28" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    // Plague Mortar — bomb
    plague: `<svg ${S}>
        <circle cx="32" cy="38" r="18" fill="#4a4"/>
        <line x1="32" y1="20" x2="32" y2="10" stroke="#6c6" stroke-width="3" stroke-linecap="round"/>
        <circle cx="32" cy="8" r="4" fill="#fc0"/>
    </svg>`,

    // Constrictor — loop
    constrictor: `<svg ${S}>
        <circle cx="32" cy="32" r="20" fill="none" stroke="#f44" stroke-width="5"/>
        <circle cx="32" cy="12" r="4" fill="#f44"/>
    </svg>`,

    // Snake Nest — egg with crack
    snake_nest: `<svg ${S}>
        <ellipse cx="32" cy="36" rx="16" ry="20" fill="#fa0"/>
        <polyline points="24,30 32,40 40,28" fill="none" stroke="#0c8" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`,

    // Chronofield — clock
    chronofield: `<svg ${S}>
        <circle cx="32" cy="32" r="22" fill="none" stroke="#0ff" stroke-width="3"/>
        <line x1="32" y1="32" x2="32" y2="16" stroke="#0ff" stroke-width="3" stroke-linecap="round"/>
        <line x1="32" y1="32" x2="44" y2="38" stroke="#0ff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="3" fill="#0ff"/>
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
