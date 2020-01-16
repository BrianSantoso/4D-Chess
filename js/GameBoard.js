/*

    Board Scale: 3 --> 300 x 300
    Piece Scale: 9
    Vertical Increment: 600 / (n=6) = 100
    Horizontal Increment: 450, but Space between boards: 150

*/


function GameBoard(n=4){

    this.n = n;
    this.position = new THREE.Vector3(0, 0, 0);
    this.boardContainer = new THREE.Object3D();
    this.piecesContainer = new THREE.Object3D();
    this.possibleMovesContainer = new THREE.Object3D();
    
    this.squareSize = 50
    this.verticalIncrement = 100
    this.horizontalGap = this.squareSize * 3
    this.horizontalIncrement = this.n * this.squareSize + this.horizontalGap
    this.globalLength = this.horizontalIncrement * (this.n - 1)
    this.globalHeight = this.verticalIncrement * this.n
    this.EPSILON = 1
    
    this.pieces;
    
    this.initBoard();
    
    let halfN = Math.floor((this.n - 1) / 2)
    this.test(halfN, halfN, halfN+2, halfN)
    
    
}

GameBoard.prototype = {
    
    initBoard: function(){
        //
        // Logic
        //
        
        // Instantiate pieces
        const range = n => [...Array(n)].map((_, i) => i);
        const rangeIn = dims => {
          if (!dims.length) return new Piece();
          return range(dims[0]).map(_ => rangeIn(dims.slice(1)));
        };
        
        this.pieces = rangeIn([this.n, this.n, this.n, this.n])
        
        
        
        
        
        //
        // Graphics
        //
        
        let bottom = 0;
        let left = 0;
        for (let w = 0; w < this.n; w++){
            for(let i = 0; i < this.n; i++){
                
                let checker = GameBoard.checkerboard(this.n, this.n * this.squareSize, z=i, w) // Construct 2D checkerboard planes
                checker.position.set(0, bottom + i*this.verticalIncrement, left - w*this.horizontalIncrement)
                rotateObject(checker, -90, 0, 0)
                this.boardContainer.add(checker)
            }
        }
        
        scene.add(this.boardContainer)
        scene.add(this.piecesContainer)
        this.possibleMovesContainer = new THREE.Object3D()
        scene.add(this.possibleMovesContainer)
        
    },
    
    boardCoordinates: function(x, y, z, w){
        
        // Get world coordinates from board coordinates
        
        const zero = new THREE.Vector3((0.5 * this.squareSize) - (0.5 * this.squareSize * this.n), 0, (0.5 * this.squareSize * this.n) - (0.5 * this.squareSize))
        
        const xShift = x * this.squareSize
        const yShift = y * this.verticalIncrement + this.EPSILON
        const zShift = -(z * this.squareSize + w * this.horizontalIncrement)
        const translation = new THREE.Vector3(xShift, yShift, zShift)
        
        return zero.add(translation).add(this.boardContainer.position)
        
    },
    
    worldCoordinates: function(pos){
        
        // Get board coordinates from world coordinates
        const zero = new THREE.Vector3((0.5 * this.squareSize) - (0.5 * this.squareSize * this.n), 0, (0.5 * this.squareSize * this.n) - (0.5 * this.squareSize))
        pos = pos.clone().sub(zero).sub(this.boardContainer.position)
        
        let x = Math.floor(pos.x / this.squareSize)
        let y = Math.floor(pos.y / this.verticalIncrement)
        let numGaps = Math.floor(-pos.z / this.horizontalIncrement)
        let z = Math.floor((-pos.z - (numGaps * this.horizontalIncrement)) / this.squareSize)
        let w = numGaps
        
//        pos.sub(this.boardContainer.position)
        
        return new THREE.Vector4(x, y, z, w)
    },
    
    showPossibleMoves: function(locations, pieceType, material=Models.materials.green){
        
        this.hidePossibleMoves()
//        this.possibleMovesContainer.name = 'possibleMoves'
        
        locations.forEach(pos => {
            
            coordinates = this.boardCoordinates(pos.x, pos.y, pos.z, pos.w)
            
            if(pos.possibleCapture)
                material = Models.materials.red
            let shadowPiece = Models.createMesh(pieceType, material, coordinates.x, coordinates.y, coordinates.z)
//            scene.add(shadowPiece)
            this.possibleMovesContainer.add(shadowPiece)
            
        })
        
        
    },
    
    showPossibleMoves2: function(x, y, z, w){
      
        const locations = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
//        console.log(locations)
        const pieceType = this.pieces[x][y][z][w].type
        
        this.showPossibleMoves(locations, pieceType)
        
    },
    
    hidePossibleMoves: function(objectName='possibleMoves'){
//        let selectedObject = scene.getObjectByName(objectName);
//        console.log(selectedObject)
//        scene.remove(selectedObject);
        
        
        
//        scene.remove(this.possibleMovesContainer)
//        this.possibleMovesContainer.removeAll()
        while(this.possibleMovesContainer.children.length){
            this.possibleMovesContainer.remove(this.possibleMovesContainer.children[0]);
        }
    },
    
    move: function(x0, y0, z0, w0, x1, y1, z1, w1){
		
		const targetPiece = this.pieces[x1][y1][z1][w1]
		
        const piece = this.pieces[x0][y0][z0][w0]
        const currentMeshCoords = piece.mesh.position
        const newMeshCoords = this.boardCoordinates(x1, y1, z1, w1)
        
        const frames = 12
        const interpolatedCoords = Animation.linearInterpolate(currentMeshCoords, newMeshCoords, frames)
        Animation.addToQueue(animationQueue, piece.mesh, interpolatedCoords)
        piece.mesh.canRayCast = false // temporarily disable piece's ability to be found in rayCast
        
        animationQueue[animationQueue.length - 1].onAnimate = function(){
            piece.mesh.canRayCast = true // re-enable piece's ability to be found in rayCast
            if(piece.type === 'pawn' && this.isOnPromotionSquare(x1, y1, z1, w1)){
				// Normal capture logic and animation is still executed,
				// but here we remove the pawn's sprite and spawn in a queen
				// Notice that we do not use GameObject.removePiece() method because
				// it will also remove its game object, which is logic that should 
				// be separate from graphics
				this.piecesContainer.remove(piece.mesh)
				const queenMesh = this.createMesh('queen', piece.team, x1, y1, z1, w1)
				queen.setMesh(queenMesh)
            }
        }.bind(this)
        
		this.pieces[x0][y0][z0][w0] = new Piece() // Remove game object from board
		this.removePiece(x1, y1, z1, w1) // Immediately remove target game object and sprite (do nothing if square is empty)
        this.pieces[x1][y1][z1][w1] = piece // Replace object in target square with moved piece
        piece.update(this.pieces, x0, y0, z0, w0, x1, y1, z1, w1)
		
		if(piece.type === 'pawn' && this.isOnPromotionSquare(x1, y1, z1, w1)){
			// Normal capture logic and animation is still executed,
			// but here we replace the pawn's game object with a Queen game object
			// Notice that we do not use GameObject.removePiece() method because
			// it will also remove its mesh, which we only want once the animation
			// finishes
			queen = new Queen(piece.team)
			this.pieces[x1][y1][z1][w1] = queen
		}
        
    },
    
    isOnPromotionSquare: function(x, y, z, w){
		const piece = this.pieces[x][y][z][w]
		const promotionLoc = piece.team > 0 ? 0 : this.n - 1
		return z === promotionLoc && w === promotionLoc
    },
    
    spawnPiece: function(pieceTypeConstructor, team, x, y, z, w){
      
        const piece = new pieceTypeConstructor(team)
        this.pieces[x][y][z][w] = piece
        
        const mesh = this.createMesh(piece.type, team, x, y, z, w)
        
        piece.setMesh(mesh)
        
    },
		
	createMesh: function(typeString, team, x, y, z, w){ 
		
		// Create mesh (without game object), add it to the scene, and return the mesh
		
		const worldPos = this.boardCoordinates(x, y, z, w)
		const material = team === 0 ? Models.materials.white : Models.materials.black
		const mesh = Models.createMesh(typeString, material, worldPos.x, worldPos.y, worldPos.z)
		if(team === 0) rotateObject(mesh, 0, 180, 0)
		this.piecesContainer.add(mesh)
		
		return mesh
		
	},
	
	removePiece: function(x, y, z, w){
		const piece = this.pieces[x][y][z][w]
		this.piecesContainer.remove(piece.mesh)
		this.pieces[x][y][z][w] = new Piece();
	},
    
    inBounds: function(x, y, z, w){
        return x >= 0 && x < this.n && y >= 0 && y < this.n && z >=0 && z < this.n && w >=0 && w < this.n;
    },
    
    test: function(x, y, z, w){
        
        if(x == null) x = getRandomInteger(0, this.n)
        if(y == null) y = getRandomInteger(0, this.n)
        if(z == null) z = getRandomInteger(0, this.n)
        if(w == null) w = getRandomInteger(0, this.n)
        
        console.log(x, y, z, w)
//        this.spawnPiece(King, 1, x-1, y, z, w)
//        this.spawnPiece(Queen, 1, x, y, z, w)
//        this.spawnPiece(Rook, 0, x+1, y, z, w)
        
//        this.spawnPiece(King, 1, x, y, z, w)
//        this.spawnPiece(Queen, 1, x+1, y, z, w)
//        this.spawnPiece(Knight, 1, x+1, y, z, w)
//        this.spawnPiece(King, 0, x+2, y, z, w)
        
        this.spawnPiece(Rook, 0, 0, 0, 0, 0)
        this.spawnPiece(Knight, 0, 1, 0, 0, 0)
        this.spawnPiece(Knight, 0, 2, 0, 0, 0)
        this.spawnPiece(Rook, 0, 3, 0, 0, 0)
        this.spawnPiece(Bishop, 0, 0, 1, 0, 0)
        this.spawnPiece(Queen, 0, 1, 1, 0, 0)
        this.spawnPiece(Pawn, 0, 2, 1, 0, 0)
        this.spawnPiece(Bishop, 0, 3, 1, 0, 0)
        this.spawnPiece(Bishop, 0, 0, 2, 0, 0)
        this.spawnPiece(Queen, 0, 1, 2, 0, 0)
        this.spawnPiece(King, 0, 2, 2, 0, 0)
        this.spawnPiece(Bishop, 0, 3, 2, 0, 0)
        this.spawnPiece(Rook, 0, 0, 3, 0, 0)
        this.spawnPiece(Knight, 0, 1, 3, 0, 0)
        this.spawnPiece(Knight, 0, 2, 3, 0, 0)
        this.spawnPiece(Rook, 0, 3, 3, 0, 0)
        
        this.spawnPiece(Pawn, 0, 0, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 0, 1, 0)
        this.spawnPiece(Pawn, 0, 0, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 1, 1, 0)
        this.spawnPiece(Pawn, 0, 0, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 2, 1, 0)
        this.spawnPiece(Pawn, 0, 0, 3, 1, 0)
        this.spawnPiece(Pawn, 0, 1, 3, 1, 0)
        this.spawnPiece(Pawn, 0, 2, 3, 1, 0)
        this.spawnPiece(Pawn, 0, 3, 3, 1, 0)
        
        this.spawnPiece(Pawn, 0, 0, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 0, 0, 1)
        this.spawnPiece(Pawn, 0, 0, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 1, 0, 1)
        this.spawnPiece(Pawn, 0, 0, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 2, 0, 1)
        this.spawnPiece(Pawn, 0, 0, 3, 0, 1)
        this.spawnPiece(Pawn, 0, 1, 3, 0, 1)
        this.spawnPiece(Pawn, 0, 2, 3, 0, 1)
        this.spawnPiece(Pawn, 0, 3, 3, 0, 1)
        
        this.spawnPiece(Pawn, 0, 0, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 0, 1, 1)
        this.spawnPiece(Pawn, 0, 0, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 1, 1, 1)
        this.spawnPiece(Pawn, 0, 0, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 2, 1, 1)
        this.spawnPiece(Pawn, 0, 0, 3, 1, 1)
        this.spawnPiece(Pawn, 0, 1, 3, 1, 1)
        this.spawnPiece(Pawn, 0, 2, 3, 1, 1)
        this.spawnPiece(Pawn, 0, 3, 3, 1, 1)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        const l = this.n- 1
        const m = l - 1
        
        this.spawnPiece(Rook, 1, 0, 0, l, l)
        this.spawnPiece(Knight, 1, 1, 0, l, l)
        this.spawnPiece(Knight, 1, 2, 0, l, l)
        this.spawnPiece(Rook, 1, 3, 0, l, l)
        this.spawnPiece(Bishop, 1, 0, 1, l, l)
        this.spawnPiece(Queen, 1, 1, 1, l, l)
        this.spawnPiece(Pawn, 1, 2, 1, l, l)
        this.spawnPiece(Bishop, 1, 3, 1, l, l)
        this.spawnPiece(Bishop, 1, 0, 2, l, l)
        this.spawnPiece(Queen, 1, 1, 2, l, l)
        this.spawnPiece(King, 1, 2, 2, l, l)
        this.spawnPiece(Bishop, 1, 3, 2, l, l)
        this.spawnPiece(Rook, 1, 0, 3, l, l)
        this.spawnPiece(Knight, 1, 1, 3, l, l)
        this.spawnPiece(Knight, 1, 2, 3, l, l)
        this.spawnPiece(Rook, 1, 3, 3, l, l)
        
        this.spawnPiece(Pawn, 1, 0, 0, m, l)
        this.spawnPiece(Pawn, 1, 1, 0, m, l)
        this.spawnPiece(Pawn, 1, 2, 0, m, l)
        this.spawnPiece(Pawn, 1, 3, 0, m, l)
        this.spawnPiece(Pawn, 1, 0, 1, m, l)
        this.spawnPiece(Pawn, 1, 1, 1, m, l)
        this.spawnPiece(Pawn, 1, 2, 1, m, l)
        this.spawnPiece(Pawn, 1, 3, 1, m, l)
        this.spawnPiece(Pawn, 1, 0, 2, m, l)
        this.spawnPiece(Pawn, 1, 1, 2, m, l)
        this.spawnPiece(Pawn, 1, 2, 2, m, l)
        this.spawnPiece(Pawn, 1, 3, 2, m, l)
        this.spawnPiece(Pawn, 1, 0, 3, m, l)
        this.spawnPiece(Pawn, 1, 1, 3, m, l)
        this.spawnPiece(Pawn, 1, 2, 3, m, l)
        this.spawnPiece(Pawn, 1, 3, 3, m, l)
        
        this.spawnPiece(Pawn, 1, 0, 0, l, m)
        this.spawnPiece(Pawn, 1, 1, 0, l, m)
        this.spawnPiece(Pawn, 1, 2, 0, l, m)
        this.spawnPiece(Pawn, 1, 3, 0, l, m)
        this.spawnPiece(Pawn, 1, 0, 1, l, m)
        this.spawnPiece(Pawn, 1, 1, 1, l, m)
        this.spawnPiece(Pawn, 1, 2, 1, l, m)
        this.spawnPiece(Pawn, 1, 3, 1, l, m)
        this.spawnPiece(Pawn, 1, 0, 2, l, m)
        this.spawnPiece(Pawn, 1, 1, 2, l, m)
        this.spawnPiece(Pawn, 1, 2, 2, l, m)
        this.spawnPiece(Pawn, 1, 3, 2, l, m)
        this.spawnPiece(Pawn, 1, 0, 3, l, m)
        this.spawnPiece(Pawn, 1, 1, 3, l, m)
        this.spawnPiece(Pawn, 1, 2, 3, l, m)
        this.spawnPiece(Pawn, 1, 3, 3, l, m)
        
        this.spawnPiece(Pawn, 1, 0, 0, m, m)
        this.spawnPiece(Pawn, 1, 1, 0, m, m)
        this.spawnPiece(Pawn, 1, 2, 0, m, m)
        this.spawnPiece(Pawn, 1, 3, 0, m, m)
        this.spawnPiece(Pawn, 1, 0, 1, m, m)
        this.spawnPiece(Pawn, 1, 1, 1, m, m)
        this.spawnPiece(Pawn, 1, 2, 1, m, m)
        this.spawnPiece(Pawn, 1, 3, 1, m, m)
        this.spawnPiece(Pawn, 1, 0, 2, m, m)
        this.spawnPiece(Pawn, 1, 1, 2, m, m)
        this.spawnPiece(Pawn, 1, 2, 2, m, m)
        this.spawnPiece(Pawn, 1, 3, 2, m, m)
        this.spawnPiece(Pawn, 1, 0, 3, m, m)
        this.spawnPiece(Pawn, 1, 1, 3, m, m)
        this.spawnPiece(Pawn, 1, 2, 3, m, m)
        this.spawnPiece(Pawn, 1, 3, 3, m, m)
        
        
        
        
//        this.spawnPiece(Queen, 0, x+2, y, z, w)
//        this.spawnPiece(Queen, 0, x-2, y, z, w)
//        this.spawnPiece(Queen, 0, x, y+2, z, w)
//        this.spawnPiece(Queen, 0, x, y-2, z, w)
//        this.spawnPiece(Queen, 0, x, y, z+2, w)
//        this.spawnPiece(Queen, 0, x, y, z-2, w)
//        this.spawnPiece(Queen, 0, x, y, z, w+2)
//        this.spawnPiece(Queen, 0, x, y, z, w-2)
        
//        this.spawnPiece(Bishop, 0, x+1, y, z-1, w)
//        this.pieces[x][y][z][w] = new King()
//        
//        const p = this.boardCoordinates(x, y, z, w)
//        let mesh = Models.createMesh('king', Models.materials.black, p.x, p.y, p.z)
//        scene.add(mesh)
        
        
        
        
//        let pm = this.rayCast(new THREE.Vector4(2, 0, 2, 0), new THREE.Vector4(0, 1, 0, 0))
//        let pm = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
        
//        let pm = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
//        this.showPossibleMoves(pm, this.pieces[x][y][z][w].type)
    },
    
//    rayCast: function(position, direction, maxIterations=Number.POSITIVE_INFINITY, getPath=true){
//
//        const start = position.add(direction)
//
//        let x = start.x
//        let y = start.y
//        let z = start.z
//        let w = start.w
//
//        let positions = []
//        let iteration = 0
//        
//        while(iteration < maxIterations){
//            
//            iteration++
//            // Check if raycast is out of bounds
//            let outOfBounds = (x >= this.n) || (y >= this.n) || (z >= this.n) || (w >= this.n) || (x < 0) || (y < 0) || (z < 0) || (w < 0)
//            if(outOfBounds) break;
//
//            let spot = this.pieces[x][y][z][w]
//            console.log(x, y, z, w)
//            if(spot.team > 0/*is occupied*/){
//                if(spot /*can be captured (AKA opposite team)*/){
//                    positions.push(new THREE.Vector4(x, y, z, w))
//                } else {
//                    // do nothing
//                }
//                break;
//            }
//
//            if(getPath){
//                positions.push(new THREE.Vector4(x, y, z, w))
//            }
//
//            x += direction.x;
//            y += direction.y;
//            z += direction.z;
//            w += direction.w;
//
//        }
//
//        return positions
//
//    },
    
    
    
}

GameBoard.checkerboard = function(segments=8, boardSize=100, z=0, w=0, opacity=0.5){
    
    let geometry = new THREE.PlaneGeometry(boardSize, boardSize, segments, segments)
    let materialEven = new THREE.MeshBasicMaterial({color: 0xccccfc})
    let materialOdd = new THREE.MeshBasicMaterial({color: 0x444464})
    let materials = [materialEven, materialOdd]

    materials.forEach(m => {
        m.transparent = true
        m.opacity = opacity
        m.side = THREE.DoubleSide;
    })

    let i = j = 0;

    for(let x = 0; x < segments; x++){
      for(let y = 0; y < segments; y++){
          i = x * segments + y
          j = i * 2
          geometry.faces[j].materialIndex = geometry.faces[j + 1].materialIndex = (x + y + z + w) % 2
      }
    }

    //
    // THREE.MeshFaceMaterial has been renamed to THREE.MultiMaterial
    //
//    return new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials))
    return new THREE.Mesh(geometry, new THREE.MultiMaterial(materials))
}

function removeEntity(objectName, scene=scene) {
    var selectedObject = scene.getObjectByName(objectName.name);
    scene.remove(selectedObject);
}