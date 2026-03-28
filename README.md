# Snake Survivors

Browser-based roguelike where you're a snake fighting off endless waves of enemies.

## Running it

No dependencies or build tools needed, but you do need a local server since the game uses ES modules.

```bash
# python
python -m http.server 8000

# node
npx http-server

```

Then open `http://localhost:8000` in your browser.

## How it works

You move around a big arena, kill enemies, grab XP, and pick powerups when you level up. Enemies get harder over time and split when they die. There are 9 weapons, 9 buffs, and 9 evolutions you can unlock by combining the right ones.

## Weapons

- Venom Shot — auto-fire venom projectiles at nearby enemies
- Viper Fangs — homing fang projectiles
- Plague Mortar — toxic bombs that leave poison zones
- Snake Nest — lob eggs that hatch mini snakes
- Venom Nova — poison pulse around your head
- Sidewinder Beam — lock-on tracking beam
- Ricochet Fang — bouncing fang that chains between enemies
- Cobra Pit — spawns spitting cobras
- Tongue Lash — forked tongue whip that slows enemies

## Buffs

- Graviton — bigger fruit pickup radius
- Rapid Fire — faster attack speed
- Dead Eye — crit chance
- Ravenous Maw — more growth, XP, and damage
- Chronofield — longer duration on timed effects
- Coiled Volley — extra projectiles
- Toxic Expanse — bigger AOE
- Serpent's Reach — longer weapon range
- Serpent's Scales — shield that absorbs hits

## Evolutions

Combine two specific powerups to unlock these:

- Miasma (Venom Nova + Toxic Expanse) — permanent toxic fog
- Hydra Brood (Snake Nest + Coiled Volley) — two-headed mini snakes that split on death
- Serpent's Gatling (Viper Fangs + Rapid Fire) — rapid-fire piercing fangs
- Consumption Beam (Sidewinder + Ravenous Maw) — always-on drain beam
- Singularity Mortar (Plague Mortar + Graviton) — gravity well that pulls enemies in then detonates
- Shatter Fang (Ricochet Fang + Dead Eye) — crits shatter into chaining splinters
- Ancient Brood Pit (Cobra Pit + Chronofield) — expanding pit that spawns ancient cobras
- Serpent's Reckoning (Tongue Lash + Serpent's Reach) — grapple tongue that drags enemies back
- Ouroboros (Serpent's Scales + Venom Shot) — rotating ring of fang-scales that deals passive damage

## Controls

- **Arrow keys / WASD** — move
- **Escape** — pause
- **Space / Enter** — restart after death, confirm selections
- **1-9** — quick-select powerups during level-up
- **F2** — evolution menu
