export class UIRenderer {
    draw_overlay(ctx, text, w, h) {
        if (h === undefined) { h = w; }
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, h / 2 - 30, w, 60);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, w / 2, h / 2);
    }

    draw_menu(ctx, title, options, selected_index, logical_size) {
        const size = logical_size;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, size - 4, size - 4);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, size / 2, size * 0.2);

        ctx.font = 'bold 18px monospace';
        const start_y = size * 0.4;
        const line_height = 40;

        for (let i = 0; i < options.length; i++) {
            const y = start_y + i * line_height;
            if (i === selected_index) {
                ctx.fillStyle = '#0ff';
                ctx.fillText('> ' + options[i].label + ' <', size / 2, y);
            } else {
                ctx.fillStyle = '#888';
                ctx.fillText(options[i].label, size / 2, y);
            }

            if (options[i].description) {
                ctx.font = '12px monospace';
                ctx.fillStyle = '#666';
                ctx.fillText(options[i].description, size / 2, y + 18);
                ctx.font = 'bold 18px monospace';
            }
        }
    }

    draw_item_picker(ctx, items, selected_index, w, h) {
        if (h === undefined) { h = w; }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CHOOSE AN ITEM', w / 2, 60);

        const card_width = 160;
        const card_height = 200;
        const gap = 20;
        const total_width = items.length * card_width + (items.length - 1) * gap;
        const start_x = (w - total_width) / 2;
        const card_y = (h - card_height) / 2 - 20;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const x = start_x + i * (card_width + gap);
            const y = card_y;

            const is_ultra = item.rarity === 'ultra';
            if (is_ultra) {
                ctx.save();
                ctx.shadowColor = '#f22';
                ctx.shadowBlur = 12;
            }
            ctx.strokeStyle = i === selected_index ? '#0ff' : is_ultra ? '#f22' : '#555';
            ctx.lineWidth = i === selected_index ? 3 : is_ultra ? 2 : 1;
            ctx.strokeRect(x, y, card_width, card_height);
            if (is_ultra) ctx.restore();

            ctx.fillStyle = is_ultra ? 'rgba(80, 0, 0, 0.5)' : item.type === 'curse' ? 'rgba(80, 0, 0, 0.5)' : 'rgba(30, 30, 30, 0.8)';
            ctx.fillRect(x + 1, y + 1, card_width - 2, card_height - 2);

            ctx.fillStyle = is_ultra ? '#f44' : item.type === 'curse' ? '#f44' : '#fff';
            ctx.font = 'bold 13px monospace';
            ctx.fillText(item.name, x + card_width / 2, y + 30);

            const rarity_colors = { common: '#888', uncommon: '#4a4', rare: '#44f', legendary: '#fa0', ultra: '#f22' };
            ctx.fillStyle = rarity_colors[item.rarity] || '#888';
            ctx.font = '11px monospace';
            ctx.fillText(item.rarity, x + card_width / 2, y + 52);

            ctx.fillStyle = '#ccc';
            ctx.font = '11px monospace';
            const words = item.description.split(' ');
            let line = '';
            let line_y = y + 80;
            for (const word of words) {
                const test = line + word + ' ';
                if (test.length > 18) {
                    ctx.fillText(line.trim(), x + card_width / 2, line_y);
                    line = word + ' ';
                    line_y += 14;
                } else {
                    line = test;
                }
            }
            if (line.trim()) ctx.fillText(line.trim(), x + card_width / 2, line_y);

            ctx.fillStyle = '#555';
            ctx.font = 'bold 14px monospace';
            ctx.fillText('[' + (i + 1) + ']', x + card_width / 2, y + card_height - 15);
        }
    }
}
