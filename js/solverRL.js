
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
		// Calculates value of cells exponentiated by the number away from 20048
		const cellValue = value => Math.exp(value ? Math.log(value) / Math.log(2) : 0);
		// Sums value of all cells in board
		const gridValue = state.grid.flat().reduce((a, b) => a + cellValue(b.value), 0);
		// Value of empty cells is just the count of empty cells exponentiated
		const emptyValue = Math.exp(board.grid.flat().reduce((a, b) => a + Number(b.value == 0), 0));
		return gridValue + emptyValue;
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
		const stateValue = this.calcStateValue(state);
		const copy = state.copy();
		this.performAction(copy, action);
		const newValue = this.calcStateValue(copy);
		return newValue - stateValue;
	}

	/**
	 * Chooses the best action based on the current state
	 */
	chooseAction() {
		// Epsilon-greedy implementation
		const EPSILON = 0.95;

		// Explore with probability 1 - EPSILON
		if (Math.random() > EPSILON) return Object.values(actions)[randomNumber(0, 3)];

		// Exploit with probability EPISLON
		let bestAction = null;
		let largest = Number.NEGATIVE_INFINITY;
		for (let action of Object.values(actions)) {
			const value = this.calcActionValue(this.board, action);
			if (value <= largest) continue;
			largest = value;
			bestAction = action;
		}

		return bestAction;
	}

	/**
	 * Begins solving the 2048 game.
	 */
	solve() {
		this.update = window.setInterval(() => {
			// Perform best action
			const bestAction = this.chooseAction();
			this.performAction(this.board, bestAction);
		}, this.updateInterval);
	}

	/**
	 * Stops the solver from running
	 */
	cancel() {
		window.clearInterval(this.update);
	}

}
