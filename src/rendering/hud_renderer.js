export class HUDRenderer {
    render(ctx, arena, snakes, player_snake, zone_timer, logical_size) {
        const alive_count = snakes.filter(s => s.alive).length;
        const total_count = snakes.length;

        // Dark backdrop behind top-left stats
        const left_lines = player_snake && player_snake.alive ? 3 : 1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, 0, 180, 8 + left_lines * 18 + 4);

        // Dark backdrop behind top-center zone timer
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(logical_size / 2 - 60, 0, 120, 30);

        ctx.font = 'bold 14px monospace';
        ctx.textBaseline = 'top';

        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText(`Alive: ${alive_count} / ${total_count}`, 10, 10);

        if (player_snake && player_snake.alive) {
            ctx.fillText(`Kills: ${player_snake.kills}`, 10, 28);
            ctx.fillText(`Length: ${player_snake.length}`, 10, 46);
        }

        const seconds = Math.ceil(zone_timer / 1000);
        ctx.textAlign = 'center';
        if (seconds <= 3) {
            ctx.fillStyle = '#f44';
            ctx.font = 'bold 16px monospace';
        } else {
            ctx.fillStyle = '#fff';
        }
        ctx.fillText(`Zone: ${seconds}s`, logical_size / 2, 10);

        ctx.textAlign = 'right';
        ctx.font = '11px monospace';
        const now = performance.now();
        let feed_y = logical_size - 15;
        for (let i = arena.kill_feed.length - 1; i >= 0; i--) {
            const entry = arena.kill_feed[i];
            const age = now - entry.time;
            if (age > 5000) continue;
            const alpha = Math.max(0, 1 - age / 5000);
            ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
            ctx.fillText(entry.text, logical_size - 10, feed_y);
            feed_y -= 14;
        }
    }
}
