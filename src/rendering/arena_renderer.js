export class ArenaRenderer {
    render(ctx, arena, cell_size, logical_size, warning_active) {
        const zone = arena.safe_zone;

        for (let x = 0; x < arena.size; x++) {
            for (let y = 0; y < arena.size; y++) {
                if (!arena.is_in_safe_zone(x, y)) {
                    ctx.fillStyle = warning_active
                        ? `rgba(180, 0, 0, ${0.3 + 0.15 * Math.sin(performance.now() / 150)})`
                        : 'rgba(80, 0, 0, 0.4)';
                    ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);
                }
            }
        }

        ctx.strokeStyle = warning_active ? '#f44' : '#444';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            zone.x1 * cell_size,
            zone.y1 * cell_size,
            (zone.x2 - zone.x1 + 1) * cell_size,
            (zone.y2 - zone.y1 + 1) * cell_size
        );

        ctx.fillStyle = '#fff';
        const food_size = cell_size * 0.4;
        for (const f of arena.food) {
            ctx.fillRect(
                (f.x + 0.5) * cell_size - food_size / 2,
                (f.y + 0.5) * cell_size - food_size / 2,
                food_size, food_size
            );
        }

        ctx.fillStyle = '#555';
        const rem_size = cell_size * 0.35;
        for (const r of arena.remains) {
            ctx.fillRect(
                (r.x + 0.5) * cell_size - rem_size / 2,
                (r.y + 0.5) * cell_size - rem_size / 2,
                rem_size, rem_size
            );
        }
    }
}
