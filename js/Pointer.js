let test = false
function Pointer(scene, camera, gameBoard, moveManager){
    
    // TODO: Fix window resize
    
    /*
    
        https://threejs.org/examples/#webgl_raycast_sprite
            https://github.com/mrdoob/three.js/blob/master/examples/webgl_raycast_sprite.html
        https://stackoverflow.com/questions/38314521/change-color-of-mesh-using-mouseover-in-three-js
            https://jsfiddle.net/wilt/52ejur45/
    
    */
    this.x = 0;
	this.y = 0;
    this.scene = scene
    this.camera = camera
    this.gameBoard = gameBoard
	this.moveManager = moveManager;
    this.rayCaster = new THREE.Raycaster()
    this.pos = new THREE.Vector2()
    this.possibleMoves;
	this.dragging = false;
    
    this.pieceSelector = new PieceSelector(this, scene, camera, gameBoard, gameBoard.graphics.piecesContainer.children)
    this.moveSelector = new MoveSelector(this, scene, camera, gameBoard, gameBoard.graphics.possibleMovesContainer.children)
    this.keyInputs = function(scene, camera, gameBoard){
        
		this.updateDragVector();
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
            const boardCoordinates = gameBoard.graphics.worldCoordinates(this.pieceSelector.SELECTED.position)
            const selectedBoardCoordinates = gameBoard.graphics.worldCoordinates(this.moveSelector.SELECTED.position)
			
            // Check to see if legal for the sake of debugging (can leave out the if statement)
            if(Piece.arrayContainsVector(this.possibleMoves, selectedBoardCoordinates)){
                
				this.moveManager.move(boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w, selectedBoardCoordinates.x, selectedBoardCoordinates.y, selectedBoardCoordinates.z, selectedBoardCoordinates.w);
                
            } else {
                // Debug error
                console.error('Move not found in possibleMoves')
            }
            
        }
        
        // check for piece selection
        this.pieceSelector.run(this.rayCaster, this.pos)
        this.pieceSelector.select()
        if(this.pieceSelector.SELECTED){
            this.possibleMoves = this.getPossibleMoves(this.pieceSelector.SELECTED)
            this.showPossibleMoves(this.pieceSelector.SELECTED)
            
            
            
        } else {
            // if not clicking on anything, clear possibleMoves object and hide meshes
            this.possibleMoves = null
            this.gameBoard.graphics.hidePossibleMoves()
        }
        
    }
    
    
    this.getPossibleMoves = function(mesh){
        
        const gameBoard = this.gameBoard
        
        let boardCoords = gameBoard.graphics.worldCoordinates(mesh.position)
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
    
    this.showPossibleMoves = function(mesh, materialScheme, canRayCast){
        
        const gameBoard = this.gameBoard
        
        let boardCoords = gameBoard.graphics.worldCoordinates(mesh.position)
        let piece = gameBoard.pieces[boardCoords.x][boardCoords.y][boardCoords.z][boardCoords.w]
		
        if(piece){
            gameBoard.graphics.showPossibleMoves(this.possibleMoves, piece, materialScheme, canRayCast)
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
	
//	this.dragDirection = function() {
//		return dragDirection({clientX: this.x, clientY: this.y});
//	}
//	
	this.updateDragVector = function() {
		this.dragVector = this.dragDirection({clientX: this.x, clientY: this.y});
	}
    
    
    let clientClickX, clientClickY;
	const DRAG_ZERO = new THREE.Vector2(0, 0);
	this.dragVector = DRAG_ZERO;
	
	function intentionalClick(ev, EPSILON=5, euclidean=false) {
		const x = ev.clientX;
        const y = ev.clientY;
		if (euclidean) {
			return dragDistance(ev) <= EPSILON;
		} else {
			return Math.abs(clientClickX - x) <= EPSILON && Math.abs(clientClickY - y) <= EPSILON;
		}
	}
	
	function dragDistance(ev) {
		if (this.dragging) {
			const dx = ev.clientX - clientClickX;
			const dy = ev.clientY - clientClickY;
			return Math.sqrt(dx*dx + dy*dy);
		} else {
			return -1;
		}
	}
	
	this.dragDirection = function dragDirection(ev) {
		if (this.dragging) {
			const dx = ev.clientX - clientClickX;
			const dy = ev.clientY - clientClickY;
			return new THREE.Vector2(dx, dy);
		} else {
			return DRAG_ZERO;
		}
	}
	
    renderer.domElement.addEventListener('mousedown', function(ev){
		this.dragging = true;
        clientClickX = ev.clientX;
        clientClickY = ev.clientY;
    }.bind(this), false);

    renderer.domElement.addEventListener('mouseup', function (ev){
		this.dragging = false;
		if (!this.clicks) {
			return;
		}
        if (ev.target == renderer.domElement) {
            // If the mouse moved since the mousedown then don't consider this a selection
            if (intentionalClick(ev, 5)) {
				this.onClick(ev, gameBoard);
			}
        }
    }.bind(this), false);
    
    renderer.domElement.addEventListener('mousemove', function(ev){
        
		this.x = ev.clientX;
		this.y = ev.clientY;
        this.onMove(ev);
        
    }.bind(this), false);
	
	document.addEventListener('keydown', function(e){
		const keyCode = e.keyCode;
		console.log(keyCode)
		if(keyCode === Pointer.UNDO){
			this.moveManager.moveHistory.undo();
		}
		if(keyCode === Pointer.REDO){
			this.moveManager.moveHistory.redo();
		}
	}.bind(this), false);
    
//    document.addEventListener('mouseup', function(e){
//        
//        this.onClick(e, gameBoard);
//        
//    }.bind(this), false);
    
}

Pointer.UNDO = 65;
Pointer.REDO = 68;

function Selector(pointer, scene, camera, gameBoard, designatedRayCastContainer){
	this.pointer = pointer
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
//            mesh.material.color.setHex(mesh.material.originalHex);

    // store color of closest object (for later restoration)
//        mesh.originalHex = this.INTERSECTED.material.color.getHex();


    if(!('originalHex' in mesh.material)){
        const color = new THREE.Color(0, 0, 0)
        Object.assign(mesh.material, {originalHex: color})
        mesh.material.originalHex.set(mesh.material.color.getHex())
    }

//    if(saveCurrentColor){
//        // store color of closest object (for later restoration)
//        mesh.material.originalHex.set(mesh.material.color.getHex())
//    }

    // set a new color for closest object
    mesh.material.color.setHex(color);

}
    
Selector.unhighlight = function(mesh){
//        console.log(mesh.material.originalHex.getHex())
    if(mesh && mesh.material.originalHex)
        mesh.material.color.setHex(mesh.material.originalHex.getHex());
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
////            Selector.highlight(this.SELECTED, this.SELECTED.material.originalHex.getHex())
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

function PieceSelector(pointer, scene, camera, gameBoard, designatedRayCastContainer){
    Selector.call(this, pointer, scene, camera, gameBoard, designatedRayCastContainer);
}

PieceSelector.prototype = Object.create(Selector.prototype)

PieceSelector.prototype.select = function() {
	
	// <NewCode>
	if(this.INTERSECTED && !this.INTERSECTED.selectable){
		return;
	}
	// </NewCode>
	
	if(this.SELECTED != this.INTERSECTED){
		Selector.unhighlight(this.SELECTED)
	}

	this.setSELECTED(this.INTERSECTED)

	if(this.SELECTED)
		Selector.highlight(this.SELECTED, Selector.SELECT_COLOR)
}

PieceSelector.prototype.run = function(rayCaster, pos, highlight){
	const intersects = this.rayCast(rayCaster, pos)
	if(intersects.length > 0){
		const closest = intersects[0].object
		// <NewCode>
		if(!this.SELECTED && closest.selectable){
			this.pointer.possibleMoves = this.pointer.getPossibleMoves(closest);
			this.pointer.showPossibleMoves(closest, {
				0: {
					attackMaterial: Object.assign(Object.assign({}, Models.materials.white), {
						transparent: true,
						opacity: 0.5
					}),
					moveMaterial: Object.assign(Object.assign({}, Models.materials.white), {
						transparent: true,
						opacity: 0.5
					}) 
				},
				1: {
					attackMaterial: Object.assign(Object.assign({}, Models.materials.black), {
						transparent: true,
						opacity: 0.5
					}),
					moveMaterial: Object.assign(Object.assign({}, Models.materials.black), {
						transparent: true,
						opacity: 0.5
					}) 
				}
			}, false);
		}
		if(closest.selectable){
			this.setINTERSECTED(closest, highlight)
		}
		// </NewCode>
	} else {
		this.setINTERSECTED(null, highlight)
		if(!this.SELECTED){
			this.gameBoard.graphics.hidePossibleMoves();
		}
		
	}

}




function MoveSelector(pointer, scene, camera, gameBoard, designatedRayCastContainer){
	Selector.call(this, pointer, scene, camera, gameBoard, designatedRayCastContainer)
}
MoveSelector.prototype = Object.create(Selector.prototype)

//MoveSelector.prototype.select = function() {
//	
//	if(this.SELECTED != this.INTERSECTED){
//		Selector.unhighlight(this.SELECTED)
//	}
//
//	this.setSELECTED(this.INTERSECTED)
//
//	if(this.SELECTED)
//		Selector.highlight(this.SELECTED, Selector.SELECT_COLOR)
//}


function initPointer(){
    
    pointer = new Pointer(scene, camera, gameBoard, moveManager)
    
}