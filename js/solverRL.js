
const actions = { up: "UP", left: "LEFT", right: "RIGHT", down: "DOWN" };

/**
 * Reinforcement Learning based 2048 Solver.
 * 
 * State - 4x4 grid of numbers multiples of 2
 * Actions - up, left, right, down
 * Reward - Average value of board - previous average value of board
 * Terminal State - 2048 Present
 */
class Solver {

	/**
	 * Constructs a new reinforcement learning based solver
	 * @param {Board} board 
	 * @param {Number} updateInterval 
	 */
	constructor(board, updateInterval) {
		this.board = board;
		this.updateInterval = updateInterval;
	}

	/**
	 * Calculates the value of a given state
	 * @param {Board} state The given state to calculate the value of (range 0 - 16)
	 */
	calcStateValue(state) {
		// Sums value of all cells in board & Calculates value of cells exponentiated by the number away from 20048
		const gridValue = _.chain(state.grid).flatten().sumBy(value => Math.exp(value ? Math.log(value) / Math.log(2) : 0)).value();
		// Value of empty cells is just the count of empty cells exponentiated
		const emptyValue = Math.exp(_.chain(board.grid).flatten().filter(value => value === 0).size().value());
		return Math.log(gridValue) + emptyValue;
	}

	/**
	 * Performs an action on a state (board)
	 * @param {Board} state 
	 * @param {String} action 
	 */
	performAction(state, action) {
		switch (action) {
			case actions.up: state.up(); break;
			case actions.left: state.left(); break;
			case actions.right: state.right(); break;
			case actions.down: state.down(); break;
		}
		return state;
	}

	/**
	 * Calculates an action value
	 * @param {Board} state The current state the action is taken from
	 * @param {String} action The action to take
	 */
	calcActionValue(state, action) {
		const DISCOUNTING = 0.8;
		const MAX_STEPS = 5;
		const CONVERGENCE_CRITERIA = 0.01;

		const copy = state.copy();
		this.performAction(copy, action);
		// Check for invalid movement (when movement equals existing state)
		if (_.isEqual(copy.grid, state.grid)) return Number.NEGATIVE_INFINITY;

		// Apply discounting algorithm where we determine the value of the action by accounting for all future actions
		// multiplied by a "discounting" value.
		let discounting = DISCOUNTING;
		let prevValue = 0;
		let value = discounting * this.calcStateValue(copy);
		let states = [copy]
		let count = 0;
		while (Math.abs(Math.log(value) - Math.log(prevValue)) > CONVERGENCE_CRITERIA && count < MAX_STEPS) {
			count++;
			discounting *= DISCOUNTING;
			prevValue = value;
			let newStates = [];
			for (state of states) {
				for (action of Object.values(actions)) {
					const newState = this.performAction(state.copy(), action);
					newStates.push(newState);
					value += discounting * this.calcStateValue(newState);
				}
			}
			states = newStates;
		}

		return value;
	}

	/**
	 * Chooses the best action based on the current state
	 */
	chooseAction() {
		return _.chain(actions).values().maxBy(action => this.calcActionValue(this.board, action)).value();
	}

	/**
	 * Begins solving the 2048 game.
	 */
	solve() {
		this.update = window.setInterval(() => {
			// Perform best action
			const bestAction = this.chooseAction();
			this.performAction(this.board, bestAction);
			if (this.board.isGameover() || _.flatten(this.board.grid).indexOf(2048) !== -1) this.cancel();
		}, this.updateInterval);
	}

	/**
	 * Stops the solver from running
	 */
	cancel() {
		window.clearInterval(this.update);
	}

}
