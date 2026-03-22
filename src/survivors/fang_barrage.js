const FANG_RANGE = 9;
const FANG_RANGE_SQ = FANG_RANGE * FANG_RANGE;
const BASE_COOLDOWN = 2500;
const FANG_SPEED = 18;
const FANG_LIFETIME = 0.6;
const FANG_TURN_SPEED = 10; // radians/sec — aggressive homing
const FANG_RADIUS = 0.18;

export class FangBarrage {
    constructor() {
        this.fangs = [];
        this.last_fire = 0;
        this.level = 0;
        this.extra_projectiles = 0;
    }

    get_cooldown() {
        return Math.max(1000, BASE_COOLDOWN - (this.level - 1) * 250);
    }

    get_fang_count() {
        return this.level + this.extra_projectiles;
    }

    get_damage() {
        return (1 + Math.floor(this.level / 3)) * 150;
    }

    update(dt, snake, enemy_manager, arena, particles, cell_size, damage_numbers) {
        if (this.level <= 0) return;

        const head = snake.head;
        const hx = head.x + 0.5;
        const hy = head.y + 0.5;
        const now = performance.now();

        // --- Fire burst at nearby enemies ---
        if (now - this.last_fire >= this.get_cooldown()) {
            // Gather enemies in range
            const candidates = [];
            for (const e of enemy_manager.enemies) {
                if (!e.alive) continue;
                const dx = e.x - hx;
                const dy = e.y - hy;
                if (dx * dx + dy * dy <= FANG_RANGE_SQ) {
                    candidates.push(e);
                }
            }

            if (candidates.length > 0) {
                const count = this.get_fang_count();
                // Sort by distance so we prioritize closest enemies
                candidates.sort((a, b) => {
                    const da = (a.x - hx) ** 2 + (a.y - hy) ** 2;
                    const db = (b.x - hx) ** 2 + (b.y - hy) ** 2;
                    return da - db;
                });

                for (let i = 0; i < count; i++) {
                    const target = candidates[i % candidates.length];
                    const dx = target.x - hx;
                    const dy = target.y - hy;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const ndx = len > 0.01 ? dx / len : 0;
                    const ndy = len > 0.01 ? dy / len : 1;
                    // Slight angular offset so multiple fangs spread out
                    const offset_angle = count > 1
                        ? (i / (count - 1) - 0.5) * 0.5
                        : 0;
                    const cos_o = Math.cos(offset_angle);
                    const sin_o = Math.sin(offset_angle);
                    const fdx = ndx * cos_o - ndy * sin_o;
                    const fdy = ndx * sin_o + ndy * cos_o;

                    this.fangs.push({
                        x: hx,
                        y: hy,
                        dx: fdx,
                        dy: fdy,
                        target: target,
                        life: FANG_LIFETIME,
                        alive: true,
                        trail: [],
                        wobble: Math.random() * Math.PI * 2,
                    });
                }
                this.last_fire = now;
            }
        }

        // --- Update fangs ---
        for (const f of this.fangs) {
            if (!f.alive) continue;

            // Home toward target
            if (f.target && f.target.alive) {
                const tx = f.target.x - f.x;
                const ty = f.target.y - f.y;
                const len = Math.sqrt(tx * tx + ty * ty);
                if (len > 0.01) {
                    const cur_angle = Math.atan2(f.dy, f.dx);
                    let target_angle = Math.atan2(ty / len, tx / len);
                    let diff = target_angle - cur_angle;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    const max_turn = FANG_TURN_SPEED * dt;
                    const turn = Math.max(-max_turn, Math.min(max_turn, diff));
                    const new_angle = cur_angle + turn;
                    f.dx = Math.cos(new_angle);
                    f.dy = Math.sin(new_angle);
                }
            }

            f.trail.push({ x: f.x, y: f.y });
            if (f.trail.length > 6) f.trail.shift();

            f.x += f.dx * FANG_SPEED * dt;
            f.y += f.dy * FANG_SPEED * dt;
            f.life -= dt;
            if (f.life <= 0) f.alive = false;

            // Out of bounds
            if (f.x < 0 || f.x > arena.size || f.y < 0 || f.y > arena.size) {
                f.alive = false;
            }
        }

        // --- Collision with enemies ---
        const dmg = this.get_damage();
        for (const f of this.fangs) {
            if (!f.alive) continue;
            for (const e of enemy_manager.enemies) {
                if (!e.alive) continue;
                const dx = f.x - e.x;
                const dy = f.y - e.y;
                if (Math.sqrt(dx * dx + dy * dy) < FANG_RADIUS + e.radius) {
                    f.alive = false;
                    const dead = e.take_damage(dmg);
                    if (damage_numbers) {
                        damage_numbers.emit(e.x, e.y - e.radius, dmg, false);
                    }
                    if (particles) {
                        const sx = e.x * cell_size;
                        const sy = e.y * cell_size;
                        particles.emit(sx, sy, 5, '#ff4466', 3);
                        particles.emit(sx, sy, 3, '#ff8888', 2);
                    }
                    if (dead) {
                        const fx = Math.floor(e.x);
                        const fy = Math.floor(e.y);
                        if (fx >= 0 && fx < arena.size && fy >= 0 && fy < arena.size) {
                            arena.food.push({ x: fx, y: fy });
                        }
                        enemy_manager.total_kills++;
                        if (particles) {
                            particles.emit(e.x * cell_size, e.y * cell_size, 8, e.color, 3);
                        }
                    } else {
                        e.x += f.dx * 0.3;
                        e.y += f.dy * 0.3;
                    }
                    break;
                }
            }
        }

        this.fangs = this.fangs.filter(f => f.alive);
    }

    render(ctx, cell_size) {
        for (const f of this.fangs) {
            if (!f.alive) continue;

            // Trail
            if (f.trail.length >= 2) {
                ctx.lineCap = 'round';
                for (let i = 1; i < f.trail.length; i++) {
                    const frac = i / (f.trail.length - 1);
                    ctx.strokeStyle = `rgba(255, 60, 80, ${frac * 0.5})`;
                    ctx.lineWidth = frac * cell_size * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(f.trail[i - 1].x * cell_size, f.trail[i - 1].y * cell_size);
                    ctx.lineTo(f.trail[i].x * cell_size, f.trail[i].y * cell_size);
                    ctx.stroke();
                }
            }

            // Fang shape — pointed triangle in direction of travel
            const px = f.x * cell_size;
            const py = f.y * cell_size;
            const angle = Math.atan2(f.dy, f.dx);
            const size = cell_size * 0.35;

            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(angle);

            // Glow
            ctx.shadowColor = 'rgba(255, 80, 100, 0.6)';
            ctx.shadowBlur = cell_size * 0.3;

            // Fang body — elongated triangle
            ctx.fillStyle = '#ffe8e8';
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(-size * 0.5, -size * 0.35);
            ctx.lineTo(-size * 0.3, 0);
            ctx.lineTo(-size * 0.5, size * 0.35);
            ctx.closePath();
            ctx.fill();

            // Tip highlight
            ctx.fillStyle = '#ff6680';
            ctx.beginPath();
            ctx.moveTo(size, 0);
            ctx.lineTo(size * 0.3, -size * 0.15);
            ctx.lineTo(size * 0.3, size * 0.15);
            ctx.closePath();
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.restore();
        }
    }

    clear() {
        this.fangs = [];
        this.last_fire = 0;
    }
}
