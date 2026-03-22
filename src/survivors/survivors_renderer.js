export class SurvivorsRenderer {

    render_enemies(ctx, enemies, cell_size) {
        for (const e of enemies) {
            if (!e.alive) continue;
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(e.x * cell_size, e.y * cell_size, e.radius * cell_size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    render_bullets(ctx, bullets, cell_size) {
        for (const b of bullets) {
            if (!b.alive) continue;

            const build_time = 0.08;
            const t = Math.min(1, b.age / build_time);
            const growth = 1 - (1 - t) * (1 - t);

            const base_r = b.radius * cell_size * growth;
            if (base_r < 0.3) continue;

            const px = b.x * cell_size;
            const py = b.y * cell_size;
            const angle = Math.atan2(b.dy, b.dx);

            ctx.save();

            // Short, sharp trail
            const trail_len = 0.4 * growth;
            const tx = (b.x - b.dx * trail_len) * cell_size;
            const ty = (b.y - b.dy * trail_len) * cell_size;

            const t_grad = ctx.createLinearGradient(tx, ty, px, py);
            t_grad.addColorStop(0, 'rgba(255, 255, 240, 0)');
            t_grad.addColorStop(0.5, 'rgba(255, 255, 220, 0.15)');
            t_grad.addColorStop(1, 'rgba(255, 255, 240, 0.4)');
            ctx.strokeStyle = t_grad;
            ctx.lineWidth = base_r * 1.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(px, py);
            ctx.stroke();

            // Fang glow
            ctx.shadowColor = 'rgba(255, 255, 220, 0.5)';
            ctx.shadowBlur = base_r * 3;

            ctx.translate(px, py);
            ctx.rotate(angle);

            // Fang shape — elongated triangle pointing forward
            const fang_len = base_r * 2.8;
            const fang_w = base_r * 0.9;

            ctx.fillStyle = '#fffde8';
            ctx.beginPath();
            ctx.moveTo(fang_len, 0);                 // tip
            ctx.lineTo(-fang_len * 0.3, -fang_w);    // base left
            ctx.quadraticCurveTo(-fang_len * 0.1, 0, -fang_len * 0.3, fang_w); // base right with curve
            ctx.closePath();
            ctx.fill();

            ctx.shadowBlur = 0;

            // Inner highlight along the fang
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.beginPath();
            ctx.moveTo(fang_len * 0.8, 0);
            ctx.lineTo(-fang_len * 0.15, -fang_w * 0.35);
            ctx.quadraticCurveTo(-fang_len * 0.05, 0, -fang_len * 0.15, fang_w * 0.35);
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }
    }

    render_food(ctx, food, cell_size, camera) {
        ctx.fillStyle = '#fff';
        const food_size = cell_size * 0.4;
        const half = food_size / 2;
        for (const f of food) {
            if (!camera.is_visible(f.x, f.y)) continue;
            ctx.fillRect(
                (f.x + 0.5) * cell_size - half,
                (f.y + 0.5) * cell_size - half,
                food_size, food_size
            );
        }
    }

    render_arena_border(ctx, arena_size, cell_size) {
        const total = arena_size * cell_size;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, total, total);
    }

    render_minimap(ctx, player_snake, enemies, arena_size, view_width, view_height) {
        const map_size = 110;
        const padding = 10;
        const mx = view_width - map_size - padding;
        const my = view_height - map_size - padding;
        const scale = map_size / arena_size;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(mx, my, map_size, map_size);
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.strokeRect(mx, my, map_size, map_size);

        ctx.fillStyle = 'rgba(200, 0, 0, 0.6)';
        for (const e of enemies) {
            if (!e.alive) continue;
            ctx.fillRect(mx + e.x * scale - 0.5, my + e.y * scale - 0.5, 2, 2);
        }

        ctx.fillStyle = '#fff';
        for (const seg of player_snake.segments) {
            ctx.fillRect(mx + seg.x * scale, my + seg.y * scale, 2, 2);
        }

        const head = player_snake.head;
        ctx.fillStyle = '#0ff';
        ctx.fillRect(mx + head.x * scale - 1, my + head.y * scale - 1, 3, 3);
    }
}
