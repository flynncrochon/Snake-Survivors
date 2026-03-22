export class StateMachine {
    constructor() {
        this.states = new Map();
        this.current = null;
        this.previous = null;
    }

    register(name, state_obj) {
        this.states.set(name, state_obj);
    }

    transition(name, data = {}) {
        if (this.current) {
            const cur = this.states.get(this.current);
            if (cur && cur.exit) cur.exit(data);
        }
        this.previous = this.current;
        this.current = name;
        const next = this.states.get(name);
        if (next && next.enter) next.enter(data);
    }

    update(dt) {
        const state = this.states.get(this.current);
        if (state && state.update) state.update(dt);
    }

    render(ctx) {
        const state = this.states.get(this.current);
        if (state && state.render) state.render(ctx);
    }
}
