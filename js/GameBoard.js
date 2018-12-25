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
    this.EPSILON = 1
    
    this.pieces;
    
    this.initBoard();
    
    let halfN = Math.floor((this.n - 1) / 2)
    this.test(halfN, halfN, halfN+2, halfN)
    
    
}

GameBoard.prototype = {
    
    initBoard: function(){
        
//        let bottom = -30;
//        let left = -575;
        
//        let bottom = 0;
//        let left = 0;
//        
////                let increment = 96 / this.n;
//        let verticalIncrement = 200 / this.n;
//        let horizontalIncrement = 150
//        
//        for (let w = 0; w < this.n; w++){
//            for(let i = 0; i < this.n; i++){
//                let checker = GameBoard.checkerboard(this.n, z=i, w) // Construct 2D checkerboard planes
//                checker.position.set(0, bottom + i*verticalIncrement, left - w*horizontalIncrement)
//                rotateObject(checker, -90, 0, 0)
//                this.boardContainer.add(checker)
//            }
//        }
//        
//        this.boardContainer.scale.set(3, 3, 3)
//        
//        scene.add(this.boardContainer)

        //
        // Logic
        //
        
        // Instantiate pieces
//        this.pieces = new Array(this.n)
//        for(let x = 0; x < this.n; x++){
//            this.pieces[x] = new Array(this.n)
//        }
//        
//        for(let x = 0; x < this.n; x++){
//            for(let y = 0; y < this.n; y++){
//                this.pieces[x][y] = new Array(this.n)
//            }
//        }
//        
//        for(let x = 0; x < this.n; x++){
//            for(let y = 0; y < this.n; y++){
//                for(let z = 0; y < this.n; z++){
//                    this.pieces[x][y][z] = new Array(this.n)
//                }
//            }
//        }
        
//         this does not work. slice creates shallow copy... copies the array but keeps the same references
//        let dimension1 = new Array(this.n).fill(0).map(e => new Piece())
//        let dimension2 = new Array(this.n).fill(0).map(e => dimension1.slice())
//        let dimension3 = new Array(this.n).fill(0).map(e => dimension2.slice())
//        let dimension4 = new Array(this.n).fill(0).map(e => dimension3.slice())
//        
//        this.pieces = dimension4
        
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
    
    showPossibleMoves: function(locations, pieceType){
        
        this.hidePossibleMoves()
        this.possibleMovesContainer = new THREE.Object3D()
        this.possibleMovesContainer.name = 'possibleMoves'
        
        locations.forEach(pos => {
            
            coordinates = this.boardCoordinates(pos.x, pos.y, pos.z, pos.w)
            let shadowPiece = Models.createMesh(pieceType, Models.materials.green, coordinates.x, coordinates.y, coordinates.z)
//            scene.add(shadowPiece)
            this.possibleMovesContainer.add(shadowPiece)
            
        })
        
        scene.add(this.possibleMovesContainer)
        
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
        scene.remove(this.possibleMovesContainer)
    },
    
    move: function(x0, y0, z0, w0, x1, y1, z1, w1){
        
        const newMeshCoords = this.boardCoordinates(x1, y1, z1, w1)
        this.pieces[x0][y0][z0][w0].mesh.position.set(newMeshCoords.x, newMeshCoords.y, newMeshCoords.z)
        
        this.piecesContainer.remove(this.pieces[x1][y1][z1][w1].mesh)
        this.pieces[x1][y1][z1][w1] = this.pieces[x0][y0][z0][w0]
        this.pieces[x0][y0][z0][w0] = new Piece()
        
    },
    
    spawnPiece: function(pieceTypeConstructor, team, x, y, z, w){
      
        const piece = new pieceTypeConstructor(team)
        this.pieces[x][y][z][w] = piece
        
        const worldPosition = this.boardCoordinates(x, y, z, w)
        const material = team === 0 ? Models.materials.white : Models.materials.black
        let mesh = Models.createMesh(piece.type, material, worldPosition.x, worldPosition.y, worldPosition.z)
        if(team === 0) rotateObject(mesh, 0, 180, 0)
        
        piece.setMesh(mesh)
        
        this.piecesContainer.add(mesh)
        
        
//        this.boardContainer.add(mesh)
        
//        let pm = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
//        this.showPossibleMoves(pm, 'king')
        
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
        
        this.spawnPiece(King, 1, x, y, z, w)
        this.spawnPiece(Queen, 1, x+1, y, z, w)
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