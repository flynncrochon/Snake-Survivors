const TURN_SPEED = 8; // radians/sec — how fast fangs home in

export class Bullet {
    constructor(x, y, dx, dy, target) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.speed = 18;
        this.radius = 0.2;
        this.life = 0.5;
        this.max_life = 0.5;
        this.age = 0;
        this.wobble = Math.random() * Math.PI * 2;
        this.alive = true;
        this.target = target; // enemy reference for homing
        this.trail = [];      // smooth trail positions
    }

    update(dt) {
        // Home toward target if still alive
        if (this.target && this.target.alive) {
            const tx = this.target.x - this.x;
            const ty = this.target.y - this.y;
            const len = Math.sqrt(tx * tx + ty * ty);
            if (len > 0.01) {
                const desired_dx = tx / len;
                const desired_dy = ty / len;

                // Smooth turning via angular interpolation
                const cur_angle = Math.atan2(this.dy, this.dx);
                let target_angle = Math.atan2(desired_dy, desired_dx);

                let diff = target_angle - cur_angle;
                // Normalize to [-PI, PI]
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;

                const max_turn = TURN_SPEED * dt;
                const turn = Math.max(-max_turn, Math.min(max_turn, diff));
                const new_angle = cur_angle + turn;

                this.dx = Math.cos(new_angle);
                this.dy = Math.sin(new_angle);
            }
        }

        // Store trail point before moving
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 8) this.trail.shift();

        this.x += this.dx * this.speed * dt;
        this.y += this.dy * this.speed * dt;
        this.age += dt;
        this.life -= dt;
        if (this.life <= 0) {
            this.alive = false;
        }
    }
}
