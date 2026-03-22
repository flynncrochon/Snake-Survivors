import { ARENA_SIZE, FOOD_COUNT } from '../constants.js';

export class Arena {
    constructor(size = ARENA_SIZE) {
        this.size = size;
        this.food = [];
        this.remains = [];
        this.safe_zone = { x1: 0, y1: 0, x2: this.size - 1, y2: this.size - 1 };
        this.kill_feed = [];
    }

    is_in_bounds(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    is_in_safe_zone(x, y) {
        return x >= this.safe_zone.x1 && x <= this.safe_zone.x2 &&
               y >= this.safe_zone.y1 && y <= this.safe_zone.y2;
    }

    is_in_danger_zone(x, y) {
        return this.is_in_bounds(x, y) && !this.is_in_safe_zone(x, y);
    }

    spawn_food(snakes) {
        this.spawn_food_count(snakes, FOOD_COUNT);
    }

    spawn_food_count(snakes, target_count) {
        const occupied = new Set();
        for (const snake of snakes) {
            if (!snake.alive) continue;
            for (const s of snake.segments) {
                occupied.add(s.x + ',' + s.y);
            }
        }
        for (const f of this.food) occupied.add(f.x + ',' + f.y);
        for (const r of this.remains) occupied.add(r.x + ',' + r.y);

        const target = target_count - this.food.length;
        for (let i = 0; i < target; i++) {
            let attempts = 0;
            while (attempts < 100) {
                const x = this.safe_zone.x1 + Math.floor(Math.random() * (this.safe_zone.x2 - this.safe_zone.x1 + 1));
                const y = this.safe_zone.y1 + Math.floor(Math.random() * (this.safe_zone.y2 - this.safe_zone.y1 + 1));
                const key = x + ',' + y;
                if (!occupied.has(key)) {
                    this.food.push({ x, y });
                    occupied.add(key);
                    break;
                }
                attempts++;
            }
        }
    }

    add_remains(segments) {
        for (const s of segments) {
            if (this.is_in_safe_zone(s.x, s.y)) {
                this.remains.push({ x: s.x, y: s.y });
            }
        }
    }

    add_kill_feed_entry(text) {
        this.kill_feed.push({ text, time: performance.now() });
        if (this.kill_feed.length > 5) this.kill_feed.shift();
    }

    clean_out_of_zone() {
        this.food = this.food.filter(f => this.is_in_safe_zone(f.x, f.y));
        this.remains = this.remains.filter(r => this.is_in_safe_zone(r.x, r.y));
    }
}
