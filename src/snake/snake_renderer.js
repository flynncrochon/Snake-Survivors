export class SnakeRenderer {
    render(ctx, snake, cell_size, t, color = '#fff', size_multiplier = 1.0, cam_offset_x = null, cam_offset_y = null) {
        const seg_size = Math.ceil(cell_size * 0.7 * size_multiplier);
        const half = seg_size / 2;
        const use_snap = cam_offset_x !== null;
        ctx.fillStyle = color;

        const positions = [];
        for (const seg of snake) {
            let px = (seg.prev_x + (seg.x - seg.prev_x) * t + 0.5) * cell_size;
            let py = (seg.prev_y + (seg.y - seg.prev_y) * t + 0.5) * cell_size;
            if (use_snap) {
                px = Math.round(px + cam_offset_x) - cam_offset_x;
                py = Math.round(py + cam_offset_y) - cam_offset_y;
            }
            positions.push({ x: px, y: py });
        }

        const p = 2;
        for (let i = 0; i < snake.length - 1; i++) {
            const a = positions[i];
            const b = positions[i + 1];
            let cx = (snake[i].prev_x + 0.5) * cell_size;
            let cy = (snake[i].prev_y + 0.5) * cell_size;
            if (use_snap) {
                cx = Math.round(cx + cam_offset_x) - cam_offset_x;
                cy = Math.round(cy + cam_offset_y) - cam_offset_y;
            }

            const x1 = Math.min(a.x, cx) - half - p;
            const y1 = Math.min(a.y, cy) - half - p;
            const w1 = Math.max(a.x, cx) - Math.min(a.x, cx) + seg_size + p * 2;
            const h1 = Math.max(a.y, cy) - Math.min(a.y, cy) + seg_size + p * 2;
            ctx.fillRect(x1, y1, w1, h1);

            const x2 = Math.min(b.x, cx) - half - p;
            const y2 = Math.min(b.y, cy) - half - p;
            const w2 = Math.max(b.x, cx) - Math.min(b.x, cx) + seg_size + p * 2;
            const h2 = Math.max(b.y, cy) - Math.min(b.y, cy) + seg_size + p * 2;
            ctx.fillRect(x2, y2, w2, h2);
        }

        for (const pos of positions) {
            ctx.fillRect(pos.x - half, pos.y - half, seg_size, seg_size);
        }
    }
}
