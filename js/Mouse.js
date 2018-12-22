let test = false
function Mouse(){
    
    /*
    
        https://threejs.org/examples/#webgl_raycast_sprite
            https://github.com/mrdoob/three.js/blob/master/examples/webgl_raycast_sprite.html
        https://stackoverflow.com/questions/38314521/change-color-of-mesh-using-mouseover-in-three-js
            https://jsfiddle.net/wilt/52ejur45/
    
    */
    
    this.rayCaster = new THREE.Raycaster()
    this.pos = new THREE.Vector2()
    this.intersects;
    this.INTERSECTED; // the object in the scene currently closest to the camera and intersected by the Ray projected from the mouse position    
    
    this.keyInputs = function(camera){
        
        // update the picking ray with the camera and mouse position
        this.rayCaster.setFromCamera( this.pos, camera );

        // calculate objects intersecting the picking ray
        this.intersects = this.rayCaster.intersectObjects( scene.children );

//        for ( var i = 0; i < this.intersects.length; i++ ) {
//
//            if(test) this.intersects[ i ].object.material.color.set( 0x00ff00 );
////            console.log(intersects[i].object.position)
//            
//        }
        
        if ( this.intersects.length > 0 ){
            // if the closest object intersected is not the currently stored intersection object
            if ( this.intersects[ 0 ].object != this.INTERSECTED ){
                // restore previous intersection object (if it exists) to its original color
                if ( this.INTERSECTED )
                    this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                // store reference to closest object as current intersection object
                this.INTERSECTED = this.intersects[ 0 ].object;
                // store color of closest object (for later restoration)
                this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
                // set a new color for closest object
                this.INTERSECTED.material.color.setHex( 0x90ee90  );
                
//                console.log(this.INTERSECTED.position, gameBoard.worldCoordinates(this.INTERSECTED.position))
                
                let boardCoordinates = gameBoard.worldCoordinates(this.INTERSECTED.position)
                gameBoard.showPossibleMoves2(boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
                
            }
        } else // there are no intersections 
        {
            // restore previous intersection object (if it exists) to its original color
            if ( this.INTERSECTED )
                this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
            // remove previous intersection object reference
            //     by setting current intersection object to "nothing"
            this.INTERSECTED = null;
            
            gameBoard.hidePossibleMoves()
        }
        
    }
    
    this.onMove = function(event){
        
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        let x = ( event.clientX / window.innerWidth ) * 2 - 1;
        let y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        this.pos.set(x, y)
        
    }
    
    
    
    document.addEventListener('mousemove', function(e){
        
        this.onMove(e);
        
    }.bind(this), false);
    
}

function initMouse(){
    
    mouse = new Mouse()
    
}

//var raycaster = new THREE.Raycaster();
//var mouse = new THREE.Vector2();
//
//function onMouseMove( event ) {
//
//	// calculate mouse position in normalized device coordinates
//	// (-1 to +1) for both components
//
//	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//
//}
//
//function render() {
//
//	// update the picking ray with the camera and mouse position
//	raycaster.setFromCamera( mouse, camera );
//
//	// calculate objects intersecting the picking ray
//	var intersects = raycaster.intersectObjects( scene.children );
//
//	for ( var i = 0; i < intersects.length; i++ ) {
//
//		intersects[ i ].object.material.color.set( 0xff00ff );
//
//	}
//
////	renderer.render( scene, camera );
//
//}
//
//window.addEventListener( 'mousemove', onMouseMove, false );
//
////window.requestAnimationFrame(render);
//
