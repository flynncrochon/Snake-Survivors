export class GameLoop {
    constructor(update_fn, render_fn) {
        this.update_fn = update_fn;
        this.render_fn = render_fn;
        this.running = false;
        this.raf_id = null;
    }

    start() {
        this.running = true;
        const loop = () => {
            if (!this.running) return;
            this.update_fn();
            this.render_fn();
            this.raf_id = requestAnimationFrame(loop);
        };
        this.raf_id = requestAnimationFrame(loop);
    }

    stop() {
        this.running = false;
        if (this.raf_id) cancelAnimationFrame(this.raf_id);
    }
}
