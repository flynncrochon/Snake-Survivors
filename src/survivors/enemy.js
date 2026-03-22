export class Enemy {
    constructor(x, y, speed = 1.5, hp = 1) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.hp = hp;
        this.max_hp = hp;
        this.radius = hp > 1 ? 0.45 : 0.35;
        this.alive = true;
    }

    get color() {
        if (this.max_hp >= 3) return '#a00';
        if (this.max_hp >= 2) return '#c22';
        return '#c00';
    }

    update(dt, target_x, target_y) {
        const dx = target_x - this.x;
        const dy = target_y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.01) return;
        this.x += (dx / dist) * this.speed * dt;
        this.y += (dy / dist) * this.speed * dt;
    }

    take_damage(amount = 1) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.alive = false;
            return true;
        }
        return false;
    }
}
