function Animation(mesh, coords){
    this.mesh = mesh;
    this.coords = coords;
    this.onAnimate = function() {};
    this.execute = function() {
		this.mesh.position.set(this.coords.x, this.coords.y, this.coords.z);
	}
}

Animation.linearInterpolate = function(a, b, segments=8, inclusivity=[false, true]){
    let positions = []
    let scalar = 1/segments
    let interval = b.clone().sub(a)
	
    if (inclusivity[0]) {
		positions.push(a)
	}
	
    for(let i = 1; i < segments + +inclusivity[1]; i++){
        positions.push(a.clone().add(interval.clone().multiplyScalar(scalar * i)))  
    }
    
    return positions
}

Animation.addToQueue = function(queue, mesh, positions){
    positions.forEach(pos => {
        queue.push(new Animation(mesh, pos)); 
    });
}

function CameraAnimation(camera, coords) {
	this.camera = camera;
	this.coords = coords;
	this.onAnimate = function() {};
	this.execute = function() {
		this.camera.position.set(coords.x, coords.y, coords.z);
	}
}

CameraAnimation.smoothLerp = function(start, destination, smoothness, squaredEpsilon=100, inclusivity=[false, true]) {
	const a = start.clone();
	const b = destination.clone();
	let positions = [];
    let interval = b.clone().sub(a);
    
    if (inclusivity[0]) {
		positions.push(a);
    }
        
    for (let i = 0; a.distanceToSquared(destination) > squaredEpsilon; i++) {
		a.lerp(destination, smoothness * i);
        positions.push(a.clone());
	}
    
    return positions;
}

CameraAnimation.lerp = function(start, destination, frames, inclusivity=[false, true]) {
	const a = start.clone();
	const b = destination.clone();
	let positions = [];
    
    let scalar = 1 / frames;
    let interval = b.clone().sub(a);
    
    if (inclusivity[0]) {
		positions.push(a);
	}
    
    for(let i = 1; i < frames + +inclusivity[1]; i++){
		const lerpAlpha = scalar * i;
		const pos = a.clone().lerp(destination, lerpAlpha);
        positions.push(pos);
    }
	
    return positions;
}

CameraAnimation.addToQueue = function(queue, camera, positions) {
	positions.forEach(pos => {    
        queue.push(new CameraAnimation(camera, pos))
    });
}