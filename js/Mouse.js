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
    this.SELECTED;
    
    this.possibleMoves;
    
    this.rayCast = function(objects, camera, gameBoard){
        this.rayCaster.setFromCamera( this.pos, camera ); // update the picking ray with the camera and mouse position
        return this.rayCaster.intersectObjects( objects ); // calculate objects intersecting the picking ray
    }
    
    this.keyInputs = function(camera){
        
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
                    this.possibleMoves = piece.getPossibleMoves(gameBoard.pieces, boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
                    gameBoard.showPossibleMoves(this.possibleMoves, piece.type)
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
                            this.possibleMoves = piece.getPossibleMoves(gameBoard.pieces, boardCoordinates.x, boardCoordinates.y, boardCoordinates.z, boardCoordinates.w)
                            gameBoard.showPossibleMoves(this.possibleMoves, piece.type)

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
        }
    }
    
    this.onClick = function(event){
        
        if(this.SELECTED){
            console.log(this.SELECTED)
            
            this.intersects = this.rayCast( gameBoard.possibleMovesContainer.children, camera, gameBoard );

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
        
        this.onClick(e);
        
    }.bind(this), false);
    
}

function initMouse(){
    
    mouse = new Mouse()
    
}
