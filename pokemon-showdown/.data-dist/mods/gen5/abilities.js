"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } const Abilities = {
	anticipation: {
		inherit: true,
		onStart(pokemon) {
			for (const target of pokemon.side.foe.active) {
				if (!target || target.fainted) continue;
				for (const moveSlot of target.moveSlots) {
					const move = this.dex.getMove(moveSlot.move);
					if (move.category !== 'Status' && (
						this.dex.getImmunity(move.type, pokemon) && this.dex.getEffectiveness(move.type, pokemon) > 0 ||
						move.ohko
					)) {
						this.add('-ability', pokemon, 'Anticipation');
						return;
					}
				}
			}
		},
	},
	frisk: {
		inherit: true,
		onStart(pokemon) {
			const target = pokemon.side.foe.randomActive();
			if (_optionalChain([target, 'optionalAccess', _ => _.item])) {
				this.add('-item', target, target.getItem().name, '[from] ability: Frisk', '[of] ' + pokemon);
			}
		},
	},
	infiltrator: {
		inherit: true,
		rating: 1.5,
	},
	keeneye: {
		inherit: true,
		onModifyMove() {},
	},
	oblivious: {
		inherit: true,
		onUpdate(pokemon) {
			if (pokemon.volatiles['attract']) {
				pokemon.removeVolatile('attract');
				this.add('-end', pokemon, 'move: Attract', '[from] ability: Oblivious');
			}
		},
		onTryHit(pokemon, target, move) {
			if (move.id === 'captivate') {
				this.add('-immune', pokemon, '[from] Oblivious');
				return null;
			}
		},
		rating: 0.5,
	},
	overcoat: {
		inherit: true,
		onTryHit() {},
		rating: 0.5,
	},
	sapsipper: {
		inherit: true,
		onAllyTryHitSide() {},
	},
	serenegrace: {
		inherit: true,
		onModifyMove(move) {
			if (move.secondaries && move.id !== 'secretpower') {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
		},
	},
	soundproof: {
		inherit: true,
		onAllyTryHitSide() {},
	},
}; exports.Abilities = Abilities;
