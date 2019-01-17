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
    this.intersects;
    this.INTERSECTED; // the object in the scene currently closest to the camera and intersected by the Ray projected from the mouse position  
    this.SELECTED;
    
    this.pieceSelector = new Selector(scene, camera, gameBoard, gameBoard.piecesContainer.children)
    this.moveSelector = new Selector(scene, camera, gameBoard, gameBoard.possibleMovesContainer.children)
    
    this.possibleMoves;
    
    this.rayCast = function(objects, camera, gameBoard){
        
        const rayCastableObjects = objects.filter(o => o.canRayCast)
        this.rayCaster.setFromCamera( this.pos, camera ); // update the picking ray with the camera and mouse position
        return this.rayCaster.intersectObjects( objects ); // calculate objects intersecting the picking ray
//        console.log(intersects)
    }
    
    this.keyInputs = function(scene, camera, gameBoard){
        
        this.pieceSelector.run(this.rayCaster, this.pos)
        this.moveSelector.run(this.rayCaster, this.pos)
        
//        const intersects = this.pieceSelector.rayCast(this.rayCaster, this.pos)
//        if(intersects.length > 0){
//            const closest = intersects[0].object
//            this.pieceSelector.setINTERSECTED(closest)
//        } else {
//            this.pieceSelector.setINTERSECTED(null)
//        }
        
    }
    
    this.onClick = function(){
        
        this.pieceSelector.select()
        if(this.pieceSelector.SELECTED){
            this.possibleMoves = this.getPossibleMoves(this.pieceSelector.SELECTED)
            this.showPossibleMoves(this.pieceSelector.SELECTED)
        } else {
            this.gameBoard.hidePossibleMoves()
        }
        
    }
    
    this.rayCastPossibleMoves = function(scene, camera, gameBoard){
        
        const pieceMeshes = gameBoard.possibleMovesContainer.children
        const intersects = this.rayCast(pieceMeshes, camera, gameBoard)
        return intersects

        
    }
    
    this.rayCastPieces = function(scene, caemra, gameBoard){
        const pieceMeshes = gameBoard.piecesContainer.children
        const intersects = this.rayCast(pieceMeshes, camera, gameBoard)
        return intersects
    }
    
    this.keyInputsss = function(scene, camera, gameBoard){
        
        
        
        if(this.SELECTED){
            
            const intersects = this.rayCastPossibleMoves(scene, camera, gameBoard)
            if (intersects.length > 0){

                const closest = intersects[0].object

            } else {

            }
            
        } else {
            const intersects = this.rayCastPieces(scene, camera, gameBoard)
        
        
            if (intersects.length > 0){

                const closest = intersects[0].object

                if(this.INTERSECTED != closest){

                    // reset the previous mesh's color
                    if(this.INTERSECTED)
                        this.highlight(this.INTERSECTED, this.INTERSECTED.material.currentHex.getHex())
    //                    this.INTERSECTED.material.color.setHex(this.INTERSECTED.material.currentHex.getHex())

                    this.INTERSECTED = closest
                    // 'closest' is guaranteed to be a mesh, meaning this.INTERSECTED will never be null, so the following line is safe:
    //                this.highlight(this.INTERSECTED, 0xffb347) 
                    this.highlight(this.INTERSECTED, Models.materials.orange.color) 
                }
            } else {

                if(this.INTERSECTED){
                    this.unhighlight(this.INTERSECTED)
                }
                this.INTERSECTED = null;

            }
        }
        
        
        
        
        
        
        
    }
    
    /* if(this.INTERSECTED){
        // store reference to closest object as current intersection object
        this.INTERSECTED = this.intersects[0].object;
        this.highlight(this.INTERSECTED)
        
    }*/
    this.highlight = function(mesh, color=0x90ee90, saveCurrentColor=true){
        // mesh is this.INTERSECTED or this.SELECTED
//        if(mesh)
//            mesh.material.color.setHex(mesh.material.currentHex);
        
        // store color of closest object (for later restoration)
//        mesh.currentHex = this.INTERSECTED.material.color.getHex();
        
        
        if(!('currentHex' in mesh.material) && saveCurrentColor){
//            const color = new THREE.Color(0, 0, 0)
            const color = mesh.material.color.getHex()
            Object.assign(mesh.material, {currentHex: color})
        }
        
//        if(saveCurrentColor){
//            mesh.material.currentHex.set(mesh.material.color.getHex())
//        }
        
        // set a new color for closest object
        mesh.material.color.setHex(color);
        
    }
    
    this.unhighlight = function(mesh){
//        console.log(mesh.material.currentHex.getHex())
        mesh.material.color.setHex(mesh.material.currentHex.getHex());
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        
    }
    
    this.getPossibleMoves = function(mesh){
        
        const gameBoard = this.gameBoard
        
        let boardCoords = gameBoard.worldCoordinates(mesh.position)
        let piece = gameBoard.pieces[boardCoords.x][boardCoords.y][boardCoords.z][boardCoords.w]
        
        
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
    
    this.onClicksss = function(event, gameBoard){
        
        this.SELECTED = this.INTERSECTED
        
        
        if(this.SELECTED){
            
            this.highlight(this.SELECTED, Models.materials.green.color, false)
            this.possibleMoves = this.getPossibleMoves(this.SELECTED, gameBoard)
            this.showPossibleMoves(this.SELECTED, gameBoard)
            
            if(this.INTERSECTED){
                
                
                
            } else {
                
            }
        } else {
            
            if(false /* clicked on shadow piece*/){
               
            } else {
               gameBoard.hidePossibleMoves()
            }
            
            
        }
        
        
        
            
        console.log(this.SELECTED)
        
    }
    
    
    
    this.keyInputss = function(camera){
        
        if(!this.SELECTED){
            this.intersects = this.rayCast( gameBoard.piecesContainer.children, camera, gameBoard );
    //        this.intersects = this.rayCast( gameBoard.piecesContainer.children.concat(gameBoard.boardContainer.children), camera, gameBoard );


    //        for ( var i = 0; i < this.intersects.length; i++ ) {
    //
    //            if(test) this.intersects[ i ].object.material.color.set( 0x00ff00 );
    ////            console.log(intersects[i].object.position)
    //            
    //        }

            if ( this.intersects.length > 0 ){
    //            console.log(this.intersects[0])
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
                    let piece = gameBoard.pieces[boardCoordinates.x][boardCoordinates.y][boardCoordinates.z][boardCoordinates.w]
                    if(piece){
                        this.possibleMoves = piece.getPossibleMoves(gameBoard.pieces, boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
                        gameBoard.showPossibleMoves(this.possibleMoves, piece.type)
                    }
                    
    //                gameBoard.showPossibleMoves2(boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)

                }
            } else // there are no intersections 
            {
                this.intersects = this.rayCast( gameBoard.boardContainer.children, camera, gameBoard );

                if ( this.intersects.length > 0 ){

                    const point = this.intersects[0].point
                    let n = gameBoard.squareSize/2
    //                point.x = Math.ceil(point.x / n) * n;
    //                point.y = Math.ceil(point.y / n) * n;
    //                point.z = Math.ceil(point.z / n) * n;
                    point.x += n
                    point.y += n
                    point.z -= n // What in the world?

                    const square = gameBoard.worldCoordinates(point)
    //                console.log(square, point, this.intersects[0])
                    let object;
                    if(gameBoard.inBounds(square.x, square.y, square.z, square.w)){
                        object = gameBoard.pieces[square.x][square.y][square.z][square.w].mesh
                    }


                    if(object){

                        // if the closest object intersected is not the currently stored intersection object
                        if (object != this.INTERSECTED ){
                            // restore previous intersection object (if it exists) to its original color
                            if ( this.INTERSECTED )
                                this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                            // store reference to closest object as current intersection object
                            this.INTERSECTED = object;
                            // store color of closest object (for later restoration)
                            this.INTERSECTED.currentHex = this.INTERSECTED.material.color.getHex();
                            // set a new color for closest object
                            this.INTERSECTED.material.color.setHex( 0x90ee90  );

            //                console.log(this.INTERSECTED.position, gameBoard.worldCoordinates(this.INTERSECTED.position))

    //                        let boardCoordinates = gameBoard.worldCoordinates(this.INTERSECTED.position)
    //                        gameBoard.showPossibleMoves2(boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)

                            let boardCoordinates = gameBoard.worldCoordinates(this.INTERSECTED.position)
                            let piece = gameBoard.pieces[boardCoordinates.x][boardCoordinates.y][boardCoordinates.z][boardCoordinates.w]
                            if(piece){
                                console.log(boardCoordinates, piece)
                                this.possibleMoves = piece.getPossibleMoves(gameBoard.pieces, boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
                                gameBoard.showPossibleMoves(this.possibleMoves, piece.type)
                            }
                            

                        }

                    } else {
                        if ( this.INTERSECTED )
                            this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                        // remove previous intersection object reference
                        //     by setting current intersection object to "nothing"
                        this.INTERSECTED = null;

                        if(!this.SELECTED)
                            gameBoard.hidePossibleMoves()
                    }


                } else {
                    // restore previous intersection object (if it exists) to its original color
                    if ( this.INTERSECTED )
                        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                    // remove previous intersection object reference
                    //     by setting current intersection object to "nothing"
                    this.INTERSECTED = null;

                    if(!this.SELECTED)
                        gameBoard.hidePossibleMoves()
                }


            }
        } else {
            let bc = gameBoard.worldCoordinates(this.SELECTED.position)
            let p = gameBoard.pieces[bc.x][bc.y][bc.z][bc.w]
            gameBoard.showPossibleMoves(this.possibleMoves, p.type, Models.materials.blue)
            this.INTERSECTED.material.color.setHex( Models.materials.blue.color );
            
        }
    }
    
    
    
    this.onClickk = function(event){
        
        if(this.SELECTED){
//            console.log(this.SELECTED)
            
            
            this.intersects = this.rayCast( gameBoard.possibleMovesContainer.children, camera, gameBoard );
//            this.intersects = this.rayCast( [], camera, gameBoard );

            if ( this.intersects.length > 0 ){
                // if the closest object intersected is not the currently stored intersection object
                if ( this.intersects[ 0 ].object != this.INTERSECTED ){

                    this.INTERSECTED = this.intersects[ 0 ].object;
  


                    let boardCoordinates = gameBoard.worldCoordinates(this.INTERSECTED.position)
                    if(Piece.arrayContainsVector(this.possibleMoves, boardCoordinates)){
                        let selectedBoardCoordinates = gameBoard.worldCoordinates(this.SELECTED.position)
                        gameBoard.move(selectedBoardCoordinates.x, selectedBoardCoordinates.y, selectedBoardCoordinates.z, selectedBoardCoordinates.w, boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
                        
                        this.SELECTED.material.color.setHex( this.SELECTED.currentHex );
                        this.INTERSECTED = null
                        gameBoard.hidePossibleMoves()
                    }

                }
            } else // there are no intersections 
            {
                this.intersects = this.rayCast( gameBoard.boardContainer.children, camera, gameBoard );

                if ( this.intersects.length > 0 ){

                    const point = this.intersects[0].point
                    let n = gameBoard.squareSize/2
    //                point.x = Math.ceil(point.x / n) * n;
    //                point.y = Math.ceil(point.y / n) * n;
    //                point.z = Math.ceil(point.z / n) * n;
                    point.x += n
                    point.y += n
                    point.z -= n // What in the world?

                    const square = gameBoard.worldCoordinates(point)
    //                console.log(square, point, this.intersects[0])
                    let object;
                    if(gameBoard.inBounds(square.x, square.y, square.z, square.w)){
                        if(Piece.arrayContainsVector(this.possibleMoves, square)){
                            object = gameBoard.pieces[square.x][square.y][square.z][square.w].mesh
                        }
                    }


                    if(object){

                        // if the closest object intersected is not the currently stored intersection object
                        if (object != this.INTERSECTED ){
                            // restore previous intersection object (if it exists) to its original color
                            this.INTERSECTED = this.intersects[ 0 ].object;
  


                            let boardCoordinates = gameBoard.worldCoordinates(this.INTERSECTED.position)
                            if(Piece.arrayContainsVector(this.possibleMoves, boardCoordinates)){
                                let selectedBoardCoordinates = gameBoard.worldCoordinates(this.SELECTED.position)
                                gameBoard.move(selectedBoardCoordinates.x, selectedBoardCoordinates.y, selectedBoardCoordinates.z, selectedBoardCoordinates.w, boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
//                                console.log(this.INTERSECTED)
//                                if ( this.INTERSECTED )
//                                    this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
//                                // remove previous intersection object reference
//                                //     by setting current intersection object to "nothing"
//                                this.INTERSECTED = null;
                                
                                
                                this.SELECTED.material.color.setHex( this.SELECTED.currentHex );
                                this.INTERSECTED = null
                                gameBoard.hidePossibleMoves()
                                
                                
                            }

                        }

                    } else {
                        if ( this.INTERSECTED )
                            this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                        // remove previous intersection object reference
                        //     by setting current intersection object to "nothing"
                        this.INTERSECTED = null;

                        gameBoard.hidePossibleMoves()
                    }


                } else {
                    // restore previous intersection object (if it exists) to its original color
                    if ( this.INTERSECTED )
                        this.INTERSECTED.material.color.setHex( this.INTERSECTED.currentHex );
                    // remove previous intersection object reference
                    //     by setting current intersection object to "nothing"
                    this.INTERSECTED = null;

                    gameBoard.hidePossibleMoves()
                }


            }
            
            
            
            
        } else {
            
        }
        this.SELECTED = this.INTERSECTED
        
        
        
        
    }
    
    this.onMove = function(event){
        
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components

        let x = ( event.clientX / window.innerWidth ) * 2 - 1;
        let y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        
        this.pos.set(x, y)
//        console.log(event.clientX, event.clientY)
        
    }
    
    
    
    document.addEventListener('mousemove', function(e){
        
        this.onMove(e);
        
    }.bind(this), false);
    
    document.addEventListener('click', function(e){
        
        this.onClick(e, gameBoard);
        
    }.bind(this), false);
    
}

function Selector(scene, camera, gameBoard, designatedRayCastContainer){
    this.scene = scene
    this.camera = camera
    this.gameBoard = gameBoard
    
    this.designatedRayCastContainer = designatedRayCastContainer
    this.INTERSECTED;
    this.SELECTED;
}

Selector.highlight = function(mesh, color=0x90ee90, saveCurrentColor=true){
    // mesh is this.INTERSECTED or this.SELECTED
//        if(mesh)
//            mesh.material.color.setHex(mesh.material.currentHex);

    // store color of closest object (for later restoration)
//        mesh.currentHex = this.INTERSECTED.material.color.getHex();


    if(!('currentHex' in mesh.material)){
        const color = new THREE.Color(0, 0, 0)
        Object.assign(mesh.material, {currentHex: color})
    }

    if(saveCurrentColor){
        // store color of closest object (for later restoration)
        mesh.material.currentHex.set(mesh.material.color.getHex())
    }

    // set a new color for closest object
    mesh.material.color.setHex(color);

}
    
Selector.unhighlight = function(mesh){
//        console.log(mesh.material.currentHex.getHex())
    mesh.material.color.setHex(mesh.material.currentHex.getHex());
    // remove previous intersection object reference
    //     by setting current intersection object to "nothing"

}

Selector.rayCast = function(rayCaster, pos, objects, camera, gameBoard){
    
    const rayCastableObjects = objects.filter(o => o.canRayCast)
    rayCaster.setFromCamera(pos, camera); // update the picking ray with the camera and mouse position
    return rayCaster.intersectObjects(objects); // calculate objects intersecting the picking ray
    
}

Selector.prototype = {
    setINTERSECTED: function(intersected){
        
        // reset the previous mesh's color
        if(this.INTERSECTED)
            Selector.highlight(this.INTERSECTED, this.INTERSECTED.material.currentHex.getHex())

        this.INTERSECTED = intersected // closest intersected
        
        if(this.INTERSECTED)
            Selector.highlight(this.INTERSECTED, Models.materials.orange.color)
    },
    setSELECTED: function(selected){
        this.SELECTED = selected
    },
    rayCast: function(rayCaster, pos){
        const pieceMeshes = this.designatedRayCastContainer
        const intersects = Selector.rayCast(rayCaster, pos, pieceMeshes, this.camera, this.gameBoard)
        return intersects
    },
    run: function(rayCaster, pos){
        
        const intersects = this.rayCast(rayCaster, pos)
        if(intersects.length > 0){
            const closest = intersects[0].object
            this.setINTERSECTED(closest)
        } else {
            this.setINTERSECTED(null)
        }
        
    },
    select: function(){
        this.setSELECTED(this.INTERSECTED)
    }
    
    
}



function initMouse(){
    
    mouse = new Mouse(scene, camera, gameBoard)
    
}