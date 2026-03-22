import { BattleRoyaleApp } from './core/battle_royale_app.js';
import { load_powerup_icons } from './rendering/powerup_icons.js';

load_powerup_icons();

const canvas = document.getElementById('game');
const app = new BattleRoyaleApp(canvas);
