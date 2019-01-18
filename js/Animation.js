function Animation(mesh, coords){
    
    this.mesh = mesh
    this.coords = coords
    this.onAnimate = function(){}
    
}

Animation.prototype = {
    execute: function(){
        this.mesh.position.set(this.coords.x, this.coords.y, this.coords.z)
    }
}

Animation.linearInterpolate = function(a, b, segments=8, inclusivity=[false, true]){
    
    let positions = []
    
    let scalar = 1/segments
    let interval = b.clone().sub(a)
    
    if(inclusivity[0])
        positions.push(a)
    
    for(let i = 1; i < segments + +inclusivity[1]; i++){
        positions.push(a.clone().add(interval.clone().multiplyScalar(scalar * i)))  
    }
    
    return positions
    
}

Animation.addToQueue = function(queue, mesh, positions){
    
    positions.forEach(pos => {
        
        queue.push(new Animation(mesh, pos))
        
    })
    
}