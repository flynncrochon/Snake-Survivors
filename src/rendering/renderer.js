import { LOGICAL_SIZE, ARENA_SIZE } from '../constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.logical_size = LOGICAL_SIZE;
        this.logical_width = LOGICAL_SIZE;
        this.logical_height = LOGICAL_SIZE;
        this.cell_size = LOGICAL_SIZE / ARENA_SIZE;

        this._apply_size(LOGICAL_SIZE, LOGICAL_SIZE);
    }

    _apply_size(w, h) {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.logical_width = w;
        this.logical_height = h;
    }

    set_cell_size(arena_size) {
        this.cell_size = LOGICAL_SIZE / arena_size;
    }

    set_fullscreen(cell_size) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this._apply_size(w, h);
        this.cell_size = cell_size;
    }

    reset_to_square() {
        this._apply_size(LOGICAL_SIZE, LOGICAL_SIZE);
        this.logical_size = LOGICAL_SIZE;
        this.cell_size = LOGICAL_SIZE / ARENA_SIZE;
    }

    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.logical_width, this.logical_height);
    }
}
