function ClientState(keyInputs, update, render) {
	this.keyInputs = keyInputs;
	this.update = update;
	this.render = render;
}

ClientState.GAME_STATE = new ClientState(
	// update mouse controls
	function keyInputs() {
		controls.update();
		debugSphere.position.set(controls.target.x, controls.target.y, controls.target.z);
		pointer.keyInputs(scene, camera, gameBoard)

	},

	// update the simulation
	function update() {



	},

	// Render the simulation
	function render() {
		if(animationQueue.length > 0){
			animationQueue[0].onAnimate()
			animationQueue[0].execute()
			animationQueue.shift()
		}
		// Render the scene using functionality provided by the three.js library
		// https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
		renderer.render(scene, camera);
	}
);

ClientState.PAUSE = new ClientState(
	function keyInputs() {},
	function update() {},
	function render() {}
);