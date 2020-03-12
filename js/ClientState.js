function ClientState(keyInputs, update, render) {
	this.keyInputs = keyInputs;
	this.update = update;
	this.render = render;
}

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

function fixControlsTargetToBox() {
	const BB = gameBoard.graphics.getBoundingBox();
	const T = controls.target;
	if(T.x < BB.bottomLeft.x) {
		T.x = BB.bottomLeft.x;
	}
	if(T.x > BB.topRight.x) {
		T.x = BB.topRight.x;
	}
	
	if(T.y < BB.bottomLeft.y) {
		T.y = BB.bottomLeft.y;
	}
	if(T.y > BB.topRight.y) {
		T.y = BB.topRight.y;
	}
	
	if(T.z > BB.bottomLeft.z) {
		T.z = BB.bottomLeft.z;
	}
	if(T.z < BB.topRight.z) {
		T.z = BB.topRight.z;
	}
}

ClientState.GAME_STATE = new ClientState(
	// update mouse controls
	function keyInputs() {
		pointer.clicks = true;
		controls.noPan = false;
		controls.update();
		fixControlsTargetToBox()
		
		debugSphere.position.set(controls.target.x, controls.target.y, controls.target.z);
		pointer.keyInputs(scene, camera, gameBoard)
	},

	// update the simulation
	function update() {
		
		

	},
	render
);

ClientState.PAUSE = new ClientState(
	function keyInputs() {},
	function update() {},
	function render() {}
);

ClientState.MENU = new ClientState(
	(() => {
		let idleMenuRotateVel = 0.5
		return function keyInputs() {
		
	//		controls.noPan = true;
			pointer.clicks = false;
			pointer.updateDragVector();
			const dragVector = pointer.dragVector;
			if (dragVector.x != 0) {
				const direction = dragVector.x / Math.abs(dragVector.x);
				idleMenuRotateVel = 0.5 * direction;
			}
			if (!pointer.dragging) {
				rotateCameraAbout(camera, controls.target, idleMenuRotateVel * step * -1)
			}

	//		rotateCameraAbout(camera, new THREE.Vector3(0,0,0), step)
			controls.update();
		
		
		}
	})(),
	function update() {},
	render
);