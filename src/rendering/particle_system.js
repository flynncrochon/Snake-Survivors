export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    emit(x, y, count, color = '#fff', spread = 3) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * spread,
                vy: (Math.random() - 0.5) * spread,
                life: 30 + Math.random() * 20,
                max_life: 50,
                color,
                size: 2 + Math.random() * 3,
            });
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.95;
            p.vy *= 0.95;
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        for (const p of this.particles) {
            const alpha = p.life / p.max_life;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    clear() {
        this.particles = [];
    }
}
