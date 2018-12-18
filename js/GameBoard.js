/*

    Board Scale: 3 --> 300 x 300
    Piece Scale: 9
    Vertical Increment: 600 / (n=6) = 100
    Horizontal Increment: 450, but Space between boards: 150

*/


function GameBoard(n=6){

    this.n = n;
    this.position = new THREE.Vector3(0, 0, 0);
    this.boardContainer = new THREE.Object3D();
    
    this.squareSize = 50
    this.verticalIncrement = 100
    this.horizontalGap = this.squareSize * 3
    this.horizontalIncrement = this.n * this.squareSize + this.horizontalGap
    
    this.pieces;
    
    this.initBoard();
    this.test(2, this.n-2, 2, 0)
    
    
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
        
    },
    
    boardCoordinates: function(x, y, z, w){
        
        const zero = new THREE.Vector3((0.5 * this.squareSize) - (0.5 * this.squareSize * this.n), 0, (0.5 * this.squareSize * this.n) - (0.5 * this.squareSize))
        
        const EPSILON = 1e-4
        
        const xShift = x * this.squareSize
        const yShift = y * this.verticalIncrement + EPSILON
        const zShift = -(z * this.squareSize + w * this.horizontalIncrement)
        const translation = new THREE.Vector3(xShift, yShift, zShift)
        
        return zero.add(translation).add(this.boardContainer.position)
        
    },
    
    showPossibleMoves: function(locations, pieceType){
        
        let possibleMovesContainer = new THREE.Object3D()
        possibleMovesContainer.name = 'possibleMoves'
        
        locations.forEach(pos => {
            
            coordinates = this.boardCoordinates(pos.x, pos.y, pos.z, pos.w)
            let shadowPiece = Models.createMesh(pieceType, Models.materials.red, coordinates.x, coordinates.y, coordinates.z)
            
            possibleMovesContainer.add(shadowPiece)
            
        })
        
        scene.add(possibleMovesContainer)
        
    },
    
    hidePossibleMoves: function(objectName='possibleMoves'){
        let selectedObject = scene.getObjectByName(objectName);
        console.log(selectedObject)
        scene.remove(selectedObject);
    },
    
    test: function(x, y, z, w){
        
        if(x == null) x = getRandomInteger(0, this.n)
        if(y == null) y = getRandomInteger(0, this.n)
        if(z == null) z = getRandomInteger(0, this.n)
        if(w == null) w = getRandomInteger(0, this.n)
        
        console.log(x, y, z, w)
        
        this.pieces[x][y][z][w] = new Queen()
        
        const p = this.boardCoordinates(x, y, z, w)
        let mesh = Models.createMesh('queen', Models.materials.black, p.x, p.y, p.z)
        scene.add(mesh)
        
        
        
        
//        let pm = this.rayCast(new THREE.Vector4(2, 0, 2, 0), new THREE.Vector4(0, 1, 0, 0))
//        let pm = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
        let pm = this.pieces[x][y][z][w].getPossibleMoves(this.pieces, x, y, z, w)
        this.showPossibleMoves(pm, 'queen')
    },
    
    rayCast: function(position, direction, maxIterations=Number.POSITIVE_INFINITY, getPath=true){

        const start = position.add(direction)

        let x = start.x
        let y = start.y
        let z = start.z
        let w = start.w

        let positions = []
        let iteration = 0
        
        while(iteration < maxIterations){
            
            iteration++
            // Check if raycast is out of bounds
            let outOfBounds = (x >= this.n) || (y >= this.n) || (z >= this.n) || (w >= this.n) || (x < 0) || (y < 0) || (z < 0) || (w < 0)
            if(outOfBounds) break;

            let spot = this.pieces[x][y][z][w]
            console.log(x, y, z, w)
            if(spot.team > 0/*is occupied*/){
                if(spot /*can be captured (AKA opposite team)*/){
                    positions.push(new THREE.Vector4(x, y, z, w))
                } else {
                    // do nothing
                }
                break;
            }

            if(getPath){
                positions.push(new THREE.Vector4(x, y, z, w))
            }

            x += direction.x;
            y += direction.y;
            z += direction.z;
            w += direction.w;

        }

        return positions

    },
    
    
    
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