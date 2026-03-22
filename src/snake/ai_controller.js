const CYCLE_VARIANTS = 4;
const claimed_food = new Set();

export class AIController {
    static reset_claims() { claimed_food.clear(); }

    constructor(snake) {
        this.snake = snake;
        this.variant = snake.id % CYCLE_VARIANTS;
        this.cycle = null;
        this.cycle_index = null;
        this.cycle_zone_key = null;
    }

    build_cycle(arena) {
        const zone = arena.safe_zone;
        const key = `${zone.x1},${zone.y1},${zone.x2},${zone.y2},${this.variant}`;
        if (this.cycle_zone_key === key && this.cycle) return;
        this.cycle_zone_key = key;

        const W = zone.x2 - zone.x1 + 1;
        const H = zone.y2 - zone.y1 + 1;

        let cycle;
        if (this.variant < 2) {
            cycle = this.build_h_cycle(zone, W, H, this.variant === 1);
        } else {
            cycle = this.build_v_cycle(zone, W, H, this.variant === 3);
        }
        if (!cycle) { this.cycle = null; this.cycle_index = null; return; }

        this.cycle_index = new Map();
        for (let i = 0; i < cycle.length; i++) {
            this.cycle_index.set(cycle[i].x + ',' + cycle[i].y, i);
        }
        this.cycle = cycle;
    }

    build_h_cycle(zone, W, H, mirrored) {
        const use_w = W % 2 === 0 ? W : W - 1;
        if (use_w < 2 || H < 2) return null;
        const ox = zone.x1, oy = zone.y1;
        const c = [];
        for (let x = 0; x < use_w; x++) c.push({ x: ox + x, y: oy });
        for (let row = 1; row <= H - 2; row++) {
            const y = oy + row;
            if (row % 2 === 1) { for (let x = use_w - 1; x >= 1; x--) c.push({ x: ox + x, y }); }
            else { for (let x = 1; x < use_w; x++) c.push({ x: ox + x, y }); }
        }
        for (let x = use_w - 1; x >= 0; x--) c.push({ x: ox + x, y: oy + H - 1 });
        for (let row = H - 2; row >= 1; row--) c.push({ x: ox, y: oy + row });
        if (mirrored) { const m = zone.x1 + zone.x2; for (const p of c) p.x = m - p.x; }
        return c;
    }

    build_v_cycle(zone, W, H, mirrored) {
        const use_h = H % 2 === 0 ? H : H - 1;
        if (W < 2 || use_h < 2) return null;
        const ox = zone.x1, oy = zone.y1;
        const c = [];
        for (let y = 0; y < use_h; y++) c.push({ x: ox, y: oy + y });
        for (let col = 1; col <= W - 2; col++) {
            const x = ox + col;
            if (col % 2 === 1) { for (let y = use_h - 1; y >= 1; y--) c.push({ x, y: oy + y }); }
            else { for (let y = 1; y < use_h; y++) c.push({ x, y: oy + y }); }
        }
        for (let y = use_h - 1; y >= 0; y--) c.push({ x: ox + W - 1, y: oy + y });
        for (let col = W - 2; col >= 1; col--) c.push({ x: ox + col, y: oy });
        if (mirrored) { const m = zone.y1 + zone.y2; for (const p of c) p.y = m - p.y; }
        return c;
    }

    get_cycle_dir(head) {
        if (!this.cycle || !this.cycle_index) return null;
        const idx = this.cycle_index.get(head.x + ',' + head.y);
        if (idx === undefined) return null;
        const next = this.cycle[(idx + 1) % this.cycle.length];
        const dx = next.x - head.x, dy = next.y - head.y;
        if (Math.abs(dx) + Math.abs(dy) !== 1) return null;
        return { dx, dy };
    }

    can_shortcut(next_idx) {
        if (!this.cycle || !this.cycle_index) return false;
        const len = this.cycle.length;
        const head_idx = this.cycle_index.get(
            this.snake.head.x + ',' + this.snake.head.y
        );
        if (head_idx === undefined) return false;

        let min_gap = len;
        for (let i = 1; i < this.snake.segments.length; i++) {
            const seg = this.snake.segments[i];
            const seg_idx = this.cycle_index.get(seg.x + ',' + seg.y);
            if (seg_idx === undefined) continue;
            const gap = (seg_idx - head_idx + len) % len;
            if (gap > 0 && gap < min_gap) min_gap = gap;
        }

        const skip_dist = (next_idx - head_idx + len) % len;
        return skip_dist > 0 && skip_dist < min_gap;
    }

    get_direction(arena, all_snakes) {
        this.build_cycle(arena);

        const head = this.snake.head;
        const zone = arena.safe_zone;

        const occupied = new Set();
        for (const s of all_snakes) {
            if (!s.alive) continue;
            const skip_tail = (s === this.snake && s.grow_pending === 0);
            const end = skip_tail ? s.segments.length - 1 : s.segments.length;
            for (let i = 0; i < end; i++) {
                occupied.add(s.segments[i].x + ',' + s.segments[i].y);
            }
        }
        occupied.delete(head.x + ',' + head.y);

        const predicted_heads = new Set();
        for (const s of all_snakes) {
            if (!s.alive || s === this.snake) continue;
            predicted_heads.add((s.head.x + s.direction.dx) + ',' + (s.head.y + s.direction.dy));
            predicted_heads.add(s.head.x + ',' + s.head.y);
        }

        const all_dirs = [
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
        ];

        const valid = [];
        for (const d of all_dirs) {
            const nx = head.x + d.dx, ny = head.y + d.dy;
            if (!arena.is_in_bounds(nx, ny)) continue;
            if (!arena.is_in_safe_zone(nx, ny)) continue;
            if (occupied.has(nx + ',' + ny)) continue;
            valid.push(d);
        }
        if (valid.length === 0) return this.snake.direction;
        if (valid.length === 1) return valid[0];

        const no_head_on = valid.filter(d => {
            const key = (head.x + d.dx) + ',' + (head.y + d.dy);
            if (predicted_heads.has(key)) return false;
            for (const s of all_snakes) {
                if (!s.alive || s === this.snake) continue;
                if (head.x + d.dx === s.head.x && head.y + d.dy === s.head.y &&
                    s.head.x + s.direction.dx === head.x &&
                    s.head.y + s.direction.dy === head.y) return false;
            }
            return true;
        });
        const safe = no_head_on.length > 0 ? no_head_on : valid;

        if (this.cycle && this.cycle_index) {
            let target = null;
            let best_dist = Infinity;
            for (const t of [...arena.food, ...arena.remains]) {
                const key = t.x + ',' + t.y;
                if (claimed_food.has(key)) continue;
                const dist = Math.abs(t.x - head.x) + Math.abs(t.y - head.y);
                if (dist < best_dist) { best_dist = dist; target = t; }
            }
            if (target) claimed_food.add(target.x + ',' + target.y);

            if (target) {
                const cycle_dir = this.get_cycle_dir(head);
                let best_dir = null;
                let best_food_dist = Infinity;

                for (const d of safe) {
                    if (cycle_dir && d.dx === cycle_dir.dx && d.dy === cycle_dir.dy) continue;

                    const nx = head.x + d.dx, ny = head.y + d.dy;
                    const next_idx = this.cycle_index.get(nx + ',' + ny);
                    if (next_idx === undefined) continue;

                    if (!this.can_shortcut(next_idx)) continue;

                    const food_dist = Math.abs(target.x - nx) + Math.abs(target.y - ny);
                    if (food_dist < best_food_dist) {
                        best_food_dist = food_dist;
                        best_dir = d;
                    }
                }

                if (best_dir && cycle_dir) {
                    const cycle_next = this.cycle[
                        (this.cycle_index.get(head.x + ',' + head.y) + 1) % this.cycle.length
                    ];
                    const cycle_food_dist = Math.abs(target.x - cycle_next.x) + Math.abs(target.y - cycle_next.y);
                    if (best_food_dist < cycle_food_dist) {
                        return best_dir;
                    }
                } else if (best_dir) {
                    return best_dir;
                }
            }
        }

        const cycle_dir = this.get_cycle_dir(head);
        if (cycle_dir && safe.some(d => d.dx === cycle_dir.dx && d.dy === cycle_dir.dy)) {
            return cycle_dir;
        }

        const cx = (zone.x1 + zone.x2) / 2;
        const cy = (zone.y1 + zone.y2) / 2;

        let best_dir = safe[0];
        let best_score = -Infinity;
        for (const d of safe) {
            const nx = head.x + d.dx, ny = head.y + d.dy;
            const space = this.flood_count(nx, ny, occupied, arena, 300);
            const center_dist = Math.abs(nx - cx) + Math.abs(ny - cy);
            const max_dist = Math.max(1, (zone.x2 - zone.x1 + zone.y2 - zone.y1) / 2);
            const score = space * 3 + 20 * (1 - center_dist / max_dist);
            if (score > best_score) { best_score = score; best_dir = d; }
        }
        return best_dir;
    }

    flood_count(sx, sy, occupied, arena, max) {
        const visited = new Set();
        visited.add(sx + ',' + sy);
        const queue = [{ x: sx, y: sy }];
        let count = 0;
        while (queue.length > 0 && count < max) {
            const { x, y } = queue.shift();
            count++;
            for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                const nx = x + dx, ny = y + dy;
                const key = nx + ',' + ny;
                if (!arena.is_in_bounds(nx, ny) || !arena.is_in_safe_zone(nx, ny)) continue;
                if (visited.has(key) || occupied.has(key)) continue;
                visited.add(key);
                queue.push({ x: nx, y: ny });
            }
        }
        return count;
    }
}
