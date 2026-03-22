import { Enemy } from './enemy.js';

const MAX_ENEMIES = 400;

export class EnemyManager {
    constructor(arena_size) {
        this.arena_size = arena_size;
        this.enemies = [];
        this.spawn_accum = 0;
        this.total_kills = 0;
        this.game_start_time = performance.now();
        this.player_hp = 3;
        this.player_i_frames = 0;
    }

    get_difficulty() {
        const elapsed = (performance.now() - this.game_start_time) / 1000;
        const mins = elapsed / 60;

        return {
            spawn_interval: Math.max(300, 1200 - mins * 250),
            spawn_count: Math.floor(3 + mins * 1.5),
            speed: 1.5 + mins * 0.3,
            hp: (3 + Math.floor(mins / 3)) * 100,
        };
    }

    update(dt, player_snake, arena, particles, cell_size, damage_numbers) {
        const head = player_snake.head;
        const diff = this.get_difficulty();

        this.spawn_accum += dt * 1000;
        if (this.spawn_accum >= diff.spawn_interval && this.enemies.length < MAX_ENEMIES) {
            this.spawn_accum = 0;
            this.spawn_wave(head.x + 0.5, head.y + 0.5, diff.spawn_count, diff.speed, diff.hp);
        }

        const tx = head.x + 0.5;
        const ty = head.y + 0.5;
        for (const e of this.enemies) {
            e.update(dt, tx, ty);
        }

        const seg_half = 0.35;
        for (const e of this.enemies) {
            if (!e.alive) continue;
            let hit = false;
            for (let si = 0; si < player_snake.segments.length; si++) {
                const seg = player_snake.segments[si];
                const sx = seg.x + 0.5;
                const sy = seg.y + 0.5;
                const dx = e.x - sx;
                const dy = e.y - sy;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < e.radius + seg_half) {
                    if (si === 0) {
                        if (!this.player_i_frames) {
                            this.player_hp--;
                            this.player_i_frames = 30;
                            const k_dist = Math.max(0.01, dist);
                            e.x += (dx / k_dist) * 4;
                            e.y += (dy / k_dist) * 4;
                            if (particles) {
                                particles.emit(sx * cell_size, sy * cell_size, 6, '#f00', 3);
                            }
                        }
                    } else {
                        const dead = e.take_damage();
                        if (damage_numbers) {
                            damage_numbers.emit(e.x, e.y - e.radius, 100, false);
                        }
                        if (dead) {
                            const fx = Math.floor(e.x);
                            const fy = Math.floor(e.y);
                            if (fx >= 0 && fx < this.arena_size && fy >= 0 && fy < this.arena_size) {
                                arena.food.push({ x: fx, y: fy });
                            }
                            this.total_kills++;
                            if (particles) {
                                particles.emit(e.x * cell_size, e.y * cell_size, 8, e.color, 3);
                            }
                        } else {
                            const k_dist = Math.max(0.01, dist);
                            e.x += (dx / k_dist) * 2;
                            e.y += (dy / k_dist) * 2;
                        }
                    }
                    hit = true;
                    break;
                }
            }
        }

        if (this.player_i_frames > 0) this.player_i_frames--;

        this.enemies = this.enemies.filter(e => {
            if (!e.alive) return false;
            const dx = e.x - tx;
            const dy = e.y - ty;
            return dx * dx + dy * dy < 900;
        });
    }

    spawn_wave(px, py, count, speed, hp) {
        for (let i = 0; i < count; i++) {
            if (this.enemies.length >= MAX_ENEMIES) break;
            const angle = Math.random() * Math.PI * 2;
            const dist = 15 + Math.random() * 4;
            let x = px + Math.cos(angle) * dist;
            let y = py + Math.sin(angle) * dist;

            x = Math.max(1, Math.min(this.arena_size - 2, x));
            y = Math.max(1, Math.min(this.arena_size - 2, y));

            this.enemies.push(new Enemy(x, y, speed, hp));
        }
    }
}
