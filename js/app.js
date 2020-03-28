/**
 * TODO BEFORE PRODUCTION BUILD:
 * --remove all CDNs
 */
window.onload = function(){
	if (Detector.webgl) {
		main();
	} else {
		var warning = Detector.getWebGLErrorMessage();
		document.getElementById('container').appendChild(warning);
	}
};

const SERVER = false;
const BOARD_SIZE = 4;
let socket;
let scene;
let camera;
let renderer;
let controls;
let backendBoard;
let backendMoveManager;
let gameBoard;
let moveManager;
let pointer;
let animationQueue = []
let debugSphere;
let stateManager = new ClientStateManager(SERVER ? ClientState.SERVER : ClientState.MENU);
let uiProxy;
let toolbarProxy;

/**
 * Load Models then call init()
 */
function main() {
	const modelLoadProm = Models.loadModels();
	modelLoadProm.then(init, function() {
		console.error("Could not load models.");
	});
}

/**
 * Initialize all
 */
function init(){
	initSocketIO();
	initTHREE();
	initControls();
	initGameBoard();
	initPointer();
	initReact();
	// begin the game loop
	requestAnimationFrame(frame);
}

/**
 * Initialize socket.io event handlers
 */
function initSocketIO() {
	try {
		socket = io();
		socket.on('serve move', (move) => {
			console.log('received move', move)
			moveManager.move(move.x0, move.y0, move.z0, move.w0,
							move.x1, move.y1, move.z1, move.w1, true, move.metaData)
		});
		socket.on('player assignment', (playerAssignment) => {
			console.log('player assignment: ', playerAssignment)
			history.pushState({}, null, playerAssignment.gameID);
			moveManager.loadFromPlayerAssignment(playerAssignment);
		})

		socket.on('player joined', (playerAssignment) => {

			if (!moveManager.ready) {
				moveManager.ready = playerAssignment.ready;
			}
			moveManager.updateUI();
			moveManager.updateSelectability();
		})

		const gameID = window.location.pathname.substring(1);
		if (gameID.match(/g[A-Za-z0-9]{7}/)) {
			socket.emit('join', gameID);
			console.log('attempting to join: ', gameID)
		}

	} catch(e) {
		console.error('socket.io failed to initialize')
		socket = {
			emit: function(){}
		}
	}

}

/**
 * Initialize UI variables and render the ReactDOM
 */
function initReact() {
	uiProxy = new EmptyUI(); // will be changed when component mounts
	toolbarProxy = new EmptyUI();
	ReactDOM.render(
	  <App />,
	  document.getElementById('gui')
	);
}

/**
 * Initialize GameBoard and MoveManager
 */
function initGameBoard() {

	gameBoard = new GameBoard(4, SERVER ? EmptyBoardGraphics : BoardGraphics);
	moveManager = new MoveManager(gameBoard, 0, Mode.ONLINE_MULTIPLAYER, true);

	if (SERVER) {
		return;
	}

	camera.position.set(600, 510, gameBoard.graphics.getCenter().z)
	const target = gameBoard.graphics.getCenter();
	controls.target.set(target.x, target.y, target.z);

	let coolPos = {x: 555.8170713338144, y: 506.7444028015284 + 110, z: -420}
	let coolTar = {x: 0, y: 262.5 + 110, z: -420}
	camera.position.set(coolPos.x, coolPos.y, coolPos.z);
	controls.target.set(coolTar.x, coolTar.y, coolTar.z);
}

/**
 * Initialize three.js scene and camera
 */
function initTHREE(){

	if (SERVER) {
		return;
	}

	// Code from three.js scene creation example.
	// https://threejs.org/docs/index.html#manual/introduction/Creating-a-scene
	scene = new THREE.Scene(); // Create new scene
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 9000); 
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.id = "myCanvas"
	document.body.appendChild(renderer.domElement);

	renderer.setClearColor(0xf7f7f7);
	// Code from three.js ambient light example:
	// https://threejs.org/docs/index.html#api/lights/AmbientLight
	let ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
	scene.add(ambientLight);

	let lightPosition1 = new THREE.Vector3(70, 300, -50);
	let lightPosition2 = new THREE.Vector3(-70, 300, -50);
	let directionalLightIntensity = 0.4;
	let directionalLightColour = 0xFFFFFF;
	let shadowFrustum = 50;
	let shadowMapWidth = 1024;
	let shadowMapHeight = 1024;
	let directionalLight1 = new THREE.DirectionalLight(directionalLightColour, directionalLightIntensity);
	let directionalLight2 = new THREE.DirectionalLight(directionalLightColour, directionalLightIntensity);
	directionalLight1.position.set(lightPosition1);

	directionalLight1.position.copy(lightPosition1);
	directionalLight1.castShadow = true;
	directionalLight1.shadow.camera.right = shadowFrustum;
	directionalLight1.shadow.camera.left = -shadowFrustum;
	directionalLight1.shadow.camera.top = shadowFrustum;
	directionalLight1.shadow.camera.bottom = -shadowFrustum;
	directionalLight1.shadow.mapSize.width = shadowMapWidth;
	directionalLight1.shadow.mapSize.height = shadowMapHeight;
	scene.add(directionalLight1);

	window.addEventListener('resize', onWindowResize, false);
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
		controls.handleResize();
	}
}

/**
 * Utility function to rotate mesh about the x, y, and z axes.
 */
function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
	object.rotateX(THREE.Math.degToRad(degreeX));
	object.rotateY(THREE.Math.degToRad(degreeY));
	object.rotateZ(THREE.Math.degToRad(degreeZ));
}

/*
 * Initialize TrackballControls
 */
function initControls(){

	if (SERVER) {
		return;
	}

	controls = new THREE.TrackballControls( camera, renderer.domElement );

	controls.rotateSpeed = 1.8; // set rotation/zoom/pan speeds
	controls.zoomSpeed = 1.5;
	controls.panSpeed = 0.45;

	controls.noZoom = false; // enable zooming, panning, and smooth panning
	controls.noPan = false;
	controls.staticMoving = false;

	controls.dynamicDampingFactor = 0.2; // set dampening factor
	controls.minDistance = 100
	controls.maxDistance = 1400
}

/**
 * Define the game loop
 */
let last = 0;
let now = window.performance.now();
let dt;
let accumulation = 0;
const step = 1/60; // update simulation every 1/60 of a second (60 fps)

/*
 * Game Loop
 */
function frame() {

	now = window.performance.now(); // store the time when the new frame starts
	dt = now - last; // calculate the amount of time the last frame took
	accumulation += Math.min(1, dt/1000);	// increase accumulation by the amount of time the last frame took and limit accumulation time to 1 second.

	stateManager.keyInputs(); // update mouse input

	// if the accumulated time is larger than the fixed time-step, continue to
	// update the simulation until it is caught up to real time
	while(accumulation >= step){
		stateManager.update(); // update the simulation
		accumulation -= step;
	}
	// render the scene
	stateManager.render(scene, camera);

	last = now;
	requestAnimationFrame(frame); // repeat the loop
}


/*
 * Return a random integer in [lowerBound, upperBound]
 */
function getRandomInteger(lowerBound, upperBound){
	//          [0, 1)                range                     
	return Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
}

/*
 * Utility function to rotate camera about a point by theta radians
 */
function rotateCameraAbout(camera, center, theta) {
	camera.position.sub(center);
	let x = camera.position.x,
		y = camera.position.y,
		z = camera.position.z;
	camera.position.x = x * Math.cos(theta) + z * Math.sin(theta);
	camera.position.z = z * Math.cos(theta) - x * Math.sin(theta);
	camera.position.add(center);
}

/*
 * Create a debug sphere and add it to the scene
 */
function DEBUG(pos, color=0xff0000, opacity=0.5) {
	const geometry = new THREE.SphereGeometry( 5, 32, 32 );
	const material = new THREE.MeshBasicMaterial({color: color, transparent:true, opacity: opacity});
	const DEBUG_SPHERE = new THREE.Mesh(geometry, material);
	DEBUG_SPHERE.position.set(pos.x, pos.y, pos.z);
	scene.add(DEBUG_SPHERE);
	return DEBUG_SPHERE;
}

function removeEntity(objectName, scene=scene) {
	var selectedObject = scene.getObjectByName(objectName.name);
	scene.remove(selectedObject);
}

function eq(a, b) {
	return _.reduce(a, function(result, value, key) {
		return _.isEqual(value, b[key]) ?
			result : result.concat(key);
	}, []);
}

/*
 * Compare two objects by reducing an array of keys in obj1, having the
 * keys in obj2 as the intial value of the result. Key points:
 *
 * - All keys of obj2 are initially in the result.
 *
 * - If the loop finds a key (from obj1, remember) not in obj2, it adds
 *   it to the result.
 *
 * - If the loop finds a key that are both in obj1 and obj2, it compares
 *   the value. If it's the same value, the key is removed from the result.
 */
function getObjectDiff(obj1, obj2) {
	const diff = Object.keys(obj1).reduce((result, key) => {
		if (!obj2.hasOwnProperty(key)) {
			result.push(key);
		} else if (_.isEqual(obj1[key], obj2[key])) {
			const resultKeyIndex = result.indexOf(key);
			result.splice(resultKeyIndex, 1);
		}
		return result;
	}, Object.keys(obj2));

	return diff;
}

var compare = function (a, b) {

  var result = {
	different: [],
	missing_from_first: [],
	missing_from_second: []
  };

  _.reduce(a, function (result, value, key) {
	if (b.hasOwnProperty(key)) {
	  if (_.isEqual(value, b[key])) {
		return result;
	  } else {
		if (typeof (a[key]) != typeof ({}) || typeof (b[key]) != typeof ({})) {
		  //dead end.
		  result.different.push(key);
		  return result;
		} else {
		  var deeper = compare(a[key], b[key]);
		  result.different = result.different.concat(_.map(deeper.different, (sub_path) => {
			return key + "." + sub_path;
		  }));

		  result.missing_from_second = result.missing_from_second.concat(_.map(deeper.missing_from_second, (sub_path) => {
			return key + "." + sub_path;
		  }));

		  result.missing_from_first = result.missing_from_first.concat(_.map(deeper.missing_from_first, (sub_path) => {
			return key + "." + sub_path;
		  }));
		  return result;
		}
	  }
	} else {
	  result.missing_from_second.push(key);
	  return result;
	}
  }, result);

  _.reduce(b, function (result, value, key) {
	if (a.hasOwnProperty(key)) {
	  return result;
	} else {
	  result.missing_from_first.push(key);
	  return result;
	}
  }, result);

  return result;
}

function genGameId() {
	return 'gxxxxxxx'.replace(/[x]/g, function(character) {
		const r = Math.random() * 16 | 0
		const v = character == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}