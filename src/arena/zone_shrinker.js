import { ZONE_SHRINK_INTERVAL, ZONE_WARNING_TIME } from '../constants.js';

export class ZoneShrinker {
    constructor(arena) {
        this.arena = arena;
        this.last_shrink_time = 0;
        this.warning = false;
        this.min_size = 8;
    }

    start() {
        this.last_shrink_time = performance.now();
        this.warning = false;
    }

    update(snakes) {
        const now = performance.now();
        const elapsed = now - this.last_shrink_time;
        const zone = this.arena.safe_zone;
        const current_size = zone.x2 - zone.x1 + 1;

        if (current_size <= this.min_size) return;

        if (elapsed >= ZONE_SHRINK_INTERVAL - ZONE_WARNING_TIME) {
            this.warning = true;
        }

        if (elapsed >= ZONE_SHRINK_INTERVAL) {
            zone.x1++;
            zone.y1++;
            zone.x2--;
            zone.y2--;
            this.arena.clean_out_of_zone();
            this.last_shrink_time = now;
            this.warning = false;

            for (const snake of snakes) {
                if (!snake.alive) continue;
                const head = snake.head;
                if (!this.arena.is_in_safe_zone(head.x, head.y)) {
                    snake.alive = false;
                    this.arena.add_remains(snake.segments);
                    this.arena.add_kill_feed_entry(`Snake #${snake.id} caught in the zone`);
                }
            }
        }
    }

    get_time_until_shrink() {
        const elapsed = performance.now() - this.last_shrink_time;
        return Math.max(0, ZONE_SHRINK_INTERVAL - elapsed);
    }
}
