let test = false
function Mouse(scene, camera, gameBoard){
    
    // TODO: Fix window resize
    
    /*
    
        https://threejs.org/examples/#webgl_raycast_sprite
            https://github.com/mrdoob/three.js/blob/master/examples/webgl_raycast_sprite.html
        https://stackoverflow.com/questions/38314521/change-color-of-mesh-using-mouseover-in-three-js
            https://jsfiddle.net/wilt/52ejur45/
    
    */
    
    this.scene = scene
    this.camera = camera
    this.gameBoard = gameBoard
    this.rayCaster = new THREE.Raycaster()
    this.pos = new THREE.Vector2()
    this.possibleMoves;
    
    this.pieceSelector = new Selector(scene, camera, gameBoard, gameBoard.piecesContainer.children)
    this.moveSelector = new Selector(scene, camera, gameBoard, gameBoard.possibleMovesContainer.children)
    
    
    
//    this.rayCast = function(objects, camera, gameBoard){
//        
//        const rayCastableObjects = objects.filter(o => o.canRayCast)
//        this.rayCaster.setFromCamera( this.pos, camera ); // update the picking ray with the camera and mouse position
//        return this.rayCaster.intersectObjects( rayCastableObjects ); // calculate objects intersecting the picking ray
//    }
    
    this.keyInputs = function(scene, camera, gameBoard){
        
        this.pieceSelector.run(this.rayCaster, this.pos, highlight=!this.pieceSelector.SELECTED)
//        this.moveSelector.run(this.rayCaster, this.pos, highlight=false)
        
    }
    
    this.onClick = function(){
        
        
        // check for clicking on possible move
        this.moveSelector.run(this.rayCaster, this.pos)
        this.moveSelector.select()
        
        // if possible move is clicked...
        if(this.moveSelector.SELECTED){
            // move the piece
            const gameBoard = this.gameBoard
            const boardCoordinates = gameBoard.worldCoordinates(this.pieceSelector.SELECTED.position)
            const selectedBoardCoordinates = gameBoard.worldCoordinates(this.moveSelector.SELECTED.position)
            
            // Check to see if legal for the sake of debugging (can leave out the if statement)
            if(Piece.arrayContainsVector(this.possibleMoves, selectedBoardCoordinates)){
                
                gameBoard.move(boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w, selectedBoardCoordinates.x, selectedBoardCoordinates.y, selectedBoardCoordinates.z, selectedBoardCoordinates.w)
//                return
                
                
            } else {
                // Debug error
                console.error('Move not found in possibleMoves')
            }
            
        }
        
        
        
        
        // check for piece selection
        this.pieceSelector.run(this.rayCaster, this.pos)
        this.pieceSelector.select()
        if(this.pieceSelector.SELECTED){
//            console.log(this.pieceSelector.SELECTED.canRayCast)
            this.possibleMoves = this.getPossibleMoves(this.pieceSelector.SELECTED)
            this.showPossibleMoves(this.pieceSelector.SELECTED)
            
            
            
        } else {
            // if not clicking on anything, clear possibleMoves object and hide meshes
            this.possibleMoves = null
            this.gameBoard.hidePossibleMoves()
        }
        
    }
    
    
    this.getPossibleMoves = function(mesh){
        
        const gameBoard = this.gameBoard
        
        let boardCoords = gameBoard.worldCoordinates(mesh.position)
        let piece = gameBoard.pieces[boardCoords.x][boardCoords.y][boardCoords.z][boardCoords.w]
        
        if(piece.type === ''){
            console.error('empty piece error')
            return null
        }
            
        
        if(piece){
            
            return piece.getPossibleMoves(gameBoard.pieces, boardCoords.x, boardCoords.y, boardCoords.z, boardCoords.w)
            
        } else {
            
            return null
            
        }
        
    }
    
    this.showPossibleMoves = function(mesh){
        
        const gameBoard = this.gameBoard
        
        let boardCoords = gameBoard.worldCoordinates(mesh.position)
        let piece = gameBoard.pieces[boardCoords.x][boardCoords.y][boardCoords.z][boardCoords.w]
        
        if(piece){
            gameBoard.showPossibleMoves(this.possibleMoves, piece.type)
        } else {
            console.error('Piece not found')
        }
        
    }
    
    this.onMove = function(event){
        
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        let x = ( event.clientX / window.innerWidth ) * 2 - 1;
        let y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        this.pos.set(x, y)
//        console.log(event.clientX, event.clientY)
        
    }
    
    
    let clientClickX, clientClickY;

    renderer.domElement.addEventListener('mousedown', function(ev){
        clientClickX = ev.clientX;
        clientClickY = ev.clientY;
    }.bind(this), false);

    renderer.domElement.addEventListener('mouseup', function (ev){
        if (ev.target == renderer.domElement) {
            var x = ev.clientX;
            var y = ev.clientY;
            // If the mouse moved since the mousedown then don't consider this a selection
            EPSILON = 5
            if( Math.abs(x - clientClickX) > EPSILON || Math.abs(y - clientClickY) > EPSILON )
                return;
            
            this.onClick(ev, gameBoard);
        }
    }.bind(this), false);
    
    renderer.domElement.addEventListener('mousemove', function(e){
        
        this.onMove(e);
        
    }.bind(this), false);
    
//    document.addEventListener('mouseup', function(e){
//        
//        this.onClick(e, gameBoard);
//        
//    }.bind(this), false);
    
}

function Selector(scene, camera, gameBoard, designatedRayCastContainer){
    this.scene = scene
    this.camera = camera
    this.gameBoard = gameBoard
    
    this.designatedRayCastContainer = designatedRayCastContainer
    this.INTERSECTED;// the object in the designatedRayCastContainer currently closest to the camera and intersected by the Ray projected from the mouse position  
    this.SELECTED;
}

Selector.HOVER_COLOR = Models.materials.blue.color
Selector.SELECT_COLOR = Models.materials.blue.color

Selector.highlight = function(mesh, color){
    // mesh is this.INTERSECTED or this.SELECTED
//        if(mesh)
//            mesh.material.color.setHex(mesh.material.currentHex);

    // store color of closest object (for later restoration)
//        mesh.currentHex = this.INTERSECTED.material.color.getHex();


    if(!('currentHex' in mesh.material)){
        const color = new THREE.Color(0, 0, 0)
        Object.assign(mesh.material, {currentHex: color})
        mesh.material.currentHex.set(mesh.material.color.getHex())
    }

//    if(saveCurrentColor){
//        // store color of closest object (for later restoration)
//        mesh.material.currentHex.set(mesh.material.color.getHex())
//    }

    // set a new color for closest object
    mesh.material.color.setHex(color);

}
    
Selector.unhighlight = function(mesh){
//        console.log(mesh.material.currentHex.getHex())
    if(mesh && mesh.material.currentHex)
        mesh.material.color.setHex(mesh.material.currentHex.getHex());
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"

}

Selector.rayCast = function(rayCaster, pos, objects, camera, gameBoard){
    
    const rayCastableObjects = objects.filter(o => o.canRayCast)
    rayCaster.setFromCamera(pos, camera); // update the picking ray with the camera and mouse position
    return rayCaster.intersectObjects(rayCastableObjects); // calculate objects intersecting the picking ray
    
}

Selector.prototype = {
    setINTERSECTED: function(intersected, highlight){
        
        // reset the previous mesh's color
        if(this.INTERSECTED && highlight) // prevent reset when selected
            Selector.unhighlight(this.INTERSECTED)
        
        this.INTERSECTED = intersected // closest intersected
        
        if(this.INTERSECTED && highlight)
            Selector.highlight(this.INTERSECTED, Selector.HOVER_COLOR)
    },
    setSELECTED: function(selected){
        this.SELECTED = selected
    },
    rayCast: function(rayCaster, pos){
        const pieceMeshes = this.designatedRayCastContainer
        const intersects = Selector.rayCast(rayCaster, pos, pieceMeshes, this.camera, this.gameBoard)
        return intersects
    },
    run: function(rayCaster, pos, highlight){
//        console.log(highlight)
        const intersects = this.rayCast(rayCaster, pos)
        if(intersects.length > 0){
            const closest = intersects[0].object
            this.setINTERSECTED(closest, highlight)
        } else {
            this.setINTERSECTED(null, highlight)
        }
        
    },
    select: function(){
//        if(this.SELECTED != this.INTERSECTED)
////            Selector.highlight(this.SELECTED, this.SELECTED.material.currentHex.getHex())
//            Selector.unhighlight(this.SELECTED) // reset color of currently selected piece (if it exists, there's a safeguard)
//            
        if(this.SELECTED != this.INTERSECTED){
            Selector.unhighlight(this.SELECTED)
        }
        
        this.setSELECTED(this.INTERSECTED)
        
        if(this.SELECTED)
            Selector.highlight(this.SELECTED, Selector.SELECT_COLOR)
    }
    
    
}



function initMouse(){
    
    mouse = new Mouse(scene, camera, gameBoard)
    
}