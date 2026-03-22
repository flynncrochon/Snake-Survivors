import { ARENA_SIZE } from '../constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this._current_dpr = window.devicePixelRatio || 1;
        this._square_mode = true;
        this._square_arena_size = ARENA_SIZE;

        this._setup_dpr_listener();
        this.reset_to_square();
    }

    _setup_dpr_listener() {
        const check_dpr = () => {
            const new_dpr = window.devicePixelRatio || 1;
            if (new_dpr !== this._current_dpr) {
                this._current_dpr = new_dpr;
                // Re-apply current size with new DPR
                this._apply_size(this.logical_width, this.logical_height);
            }
            // Re-register since matchMedia listeners are one-shot per threshold
            this._dpr_mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
            this._dpr_mql.addEventListener('change', check_dpr, { once: true });
        };
        this._dpr_mql = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
        this._dpr_mql.addEventListener('change', check_dpr, { once: true });
    }

    _apply_size(w, h) {
        const dpr = window.devicePixelRatio || 1;
        this._current_dpr = dpr;
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.logical_width = w;
        this.logical_height = h;
    }

    _compute_square_size() {
        return Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.9);
    }

    set_cell_size(arena_size) {
        this._square_arena_size = arena_size;
        this.cell_size = this.logical_size / arena_size;
    }

    set_fullscreen(cell_size) {
        this._square_mode = false;
        const w = window.innerWidth;
        const h = window.innerHeight;
        this._apply_size(w, h);
        this.cell_size = cell_size;
    }

    reset_to_square(arena_size) {
        this._square_mode = true;
        this._square_arena_size = arena_size || ARENA_SIZE;
        const size = this._compute_square_size();
        this._apply_size(size, size);
        this.logical_size = size;
        this.cell_size = size / this._square_arena_size;
    }

    handle_resize() {
        if (this._square_mode) {
            const size = this._compute_square_size();
            this._apply_size(size, size);
            this.logical_size = size;
            this.cell_size = size / this._square_arena_size;
        }
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.logical_width, this.logical_height);
    }
}
