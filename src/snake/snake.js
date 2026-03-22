import { STARTING_LENGTH } from '../constants.js';

let next_id = 0;

export class Snake {
    constructor(start_x, start_y, color = '#fff', is_player = false, dir = null) {
        this.id = next_id++;
        this.color = color;
        this.is_player = is_player;
        this.alive = true;
        this.kills = 0;
        this.grow_pending = 0;
        this.direction = dir || { dx: 1, dy: 0 };
        this.segments = [];

        const bdx = -this.direction.dx;
        const bdy = -this.direction.dy;
        for (let i = 0; i < STARTING_LENGTH; i++) {
            this.segments.push({
                x: start_x + bdx * i,
                y: start_y + bdy * i,
                prev_x: start_x + bdx * (i + 1),
                prev_y: start_y + bdy * (i + 1),
            });
        }
    }

    get head() { return this.segments[0]; }
    get length() { return this.segments.length; }

    occupies(x, y) {
        return this.segments.some(s => s.x === x && s.y === y);
    }

    body_set() {
        const set = new Set();
        for (const s of this.segments) {
            set.add(s.x + ',' + s.y);
        }
        return set;
    }
}

export function reset_snake_ids() {
    next_id = 0;
}
