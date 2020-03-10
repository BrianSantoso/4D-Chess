function ClientStateManager(state) {
	this.state = state;
	this.swapState = function(newState) {
		this.state = newState;
	}
	this.keyInputs = function() {
		this.state.keyInputs();
	}
	this.update = function() {
		this.state.update();
	}
	this.render = function() {
		this.state.render();
	}
}