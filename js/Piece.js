function Piece(team=-1){
    
    this.team = team
    this.type = ''
    this.mesh;
    
}

Piece.prototype = {
    
    movement: function(board, x, y, z, w, getPath=true){},
    attack: function(board, x, y, z, w){
        return this.movement(board, x, y, z, w, false)
    },
    getPossibleMoves: function(board, x, y, z, w){
        
        let positions = []
        // TODO: CHECK IF IT WILL LEAVE KING IN CHECK.
        if(this.isPinned(board, x, y, z, w))
            return positions
        
        let possibleMovements = this.movement(board, x, y, z, w)
        let possibleAttacks = this.attack(board, x, y, z, w)
        let possibleMovementsAndAttacks = Piece.concatWithoutDuplicates(possibleMovements, possibleAttacks) // Possible moves
        positions = Piece.concatWithoutDuplicates(positions, possibleMovementsAndAttacks)
        
        
        return positions
    },
    isPinned: function(board, x, y, z, w){
        
        // temporarily modify the board so that the current piece is missing
        const team = this.team
        this.team = -1
        const inCheck = Piece.inCheck(board, team)
//        console.log(board[x][y][z][w], inCheck, team)
        this.team = team
        return inCheck
//        let tempBoard = board
//        tempBoard[x][y][z][w] = new Piece() //empty piece
//        
//        const inCheck = !Piece.inCheck(tempBoard, this.team)
//        console.log('inCheck?', inCheck)
//        tempBoard[x][y][z][w] = this
//        return inCheck
        
    },
    setMesh: function(mesh){
        this.mesh = mesh
    }
    
}

function Rook(team){
    Piece.call(this, team)
    this.type = 'rook'
}

Rook.prototype = Object.create(Piece.prototype)

Rook.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1), getPath))
    
    return positions
}

function Bishop(team){
    Piece.call(this, team)
    this.type = 'bishop'
}

Bishop.prototype = Object.create(Piece.prototype)

Bishop.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0), getPath, getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), getPath, getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), getPath))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1), getPath))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1), getPath))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1), getPath))
    
    return positions
}

function Queen(team){
    Piece.call(this, team)
    this.type = 'queen'
}

Queen.prototype = Object.create(Piece.prototype)

Queen.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    //
    // Rook Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1), getPath))
    
    //
    // Bishop Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), getPath))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1), getPath))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1), getPath))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1), getPath))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1), getPath))
    
    return positions
}

function Knight(team){
    Piece.call(this, team)
    this.type = 'knight'
}

Knight.prototype = Object.create(Piece.prototype)

Knight.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    // Max iterations is 1
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 2, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 2, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 2), getPath, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -2, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -2, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -2), getPath, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, -1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 2, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 2, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 2), getPath, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, -1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -2, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -2, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -2, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -2), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -2), getPath, 1))
    
    
    
    return positions
}

function King(team){
    Piece.call(this, team)
    this.type = 'king'
}

King.prototype = Object.create(Piece.prototype)

King.prototype.getPossibleMoves = function(board, x, y, z, w){
    
    // King cannot be pinned but cannot move to an attacked square
    
    let positions = []

    let possibleMovements = this.movement(board, x, y, z, w)
    let possibleAttacks = this.attack(board, x, y, z, w)
    let possibleMovementsAndAttacks = Piece.concatWithoutDuplicates(possibleMovements, possibleAttacks) // Possible moves
    positions = Piece.concatWithoutDuplicates(positions, possibleMovementsAndAttacks)

    for(let i = positions.length - 1; i >= 0; i--){
//        console.log(i)
        const position = positions[i]
        const pieceToSaveType = board[position.x][position.y][position.z][position.w].type
        
        const team = this.team
        this.team = -1
        this.type = ''
        
        const pieceToSaveTeam = board[position.x][position.y][position.z][position.w].team
        
        board[position.x][position.y][position.z][position.w].team = team
        board[position.x][position.y][position.z][position.w].type = 'king'
        
        const inCheck = Piece.inCheck(board, team)
        
        board[position.x][position.y][position.z][position.w].team = pieceToSaveTeam
        board[position.x][position.y][position.z][position.w].type = pieceToSaveType
        
        this.team = team
        this.type = 'king'
        
        if(inCheck)
            positions.splice(i, 1)
        
    }
    

    return positions
}

King.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    // Max iterations is 1
    
    //
    // Rook Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1), getPath, 1))
    
    //
    // Bishop Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), getPath, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1), getPath, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1), getPath, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1), getPath, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1), getPath, 1))
    
    
    return positions
}

function Pawn(team){
    Piece.call(this, team)
    this.type = 'pawn'
    
    this.justMovedTwoSpaces = false
    this.hasMoved = false
    
}

Pawn.prototype = Object.create(Piece.prototype)

Pawn.prototype.attack = function(board, x, y, z, w){
    
    let positions = []
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), false, 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), false, 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), false, 1))
    
    
    return positions
    
}

Pawn.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    let maxIterations = this.hasMoved ? 1 : 2
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), getPath, maxIterations))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), getPath, maxIterations))
    
    return positions
    
}

Pawn.isOnPromotionSquare = function(board, x, y, z, w){
    
    const length_x = board.length
    const length_y = board[0].length
    const length_z = board[0][0].length
    const length_w = board[0][0][0].length
    
    return (z === length_z - 1) && (w === length_w - 1)
    
}

Piece.rayCast = function(board, position, direction, getPath=true, maxIterations=Number.POSITIVE_INFINITY){
    
    // Assume current team is whatver team the piece on the start position is
    
    const team = board[position.x][position.y][position.z][position.w].team
    const oppositeTeam = 1 - team
    const start = position.add(direction)
    
    
    let x = start.x
    let y = start.y
    let z = start.z
    let w = start.w
    
    const length_x = board.length
    const length_y = board[0].length
    const length_z = board[0][0].length
    const length_w = board[0][0][0].length
    
    let positions = []
    iteration = 0
    
    while(iteration < maxIterations){
        iteration++
        // Check if raycast is out of bounds
        let outOfBounds = (x >= length_x) || (y >= length_y) || (z >= length_z) || (w >= length_w) || (x < 0) || (y < 0) || (z < 0) || (w < 0)
        if(outOfBounds) break;
        
        let spot = board[x][y][z][w]
//        console.log(x, y, z, w)
        if(spot.team >= 0/*is occupied*/){
            if(spot.team === oppositeTeam/*can be captured (AKA opposite team)*/){
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
    
}

Piece.arrayContainsVector = function(arr, vector){
    
    for(let i = 0; i < arr.length; i++){
        if(Piece.vec4Equals(arr[i], vector))
            return true
    }
    
    return false
}

Piece.concatWithoutDuplicates = function(a, b){
    
    let new_a = a.slice()
    b.forEach(vector => {
        
        let contains = Piece.arrayContainsVector(new_a, vector)
        if(!contains)
            new_a.push(vector)
        
    })
    
    return new_a
}

Piece.vec4Equals = function(a, b){
    return a.x === b.x &&
            a.y === b.y &&
            a.z === b.z &&
            a.w === b.w
}

Piece.inCheck = function(board, team){
    
    const oppositeTeam = 1 - team
    const piecePositions = Piece.getPieces(board, oppositeTeam)
    const kingPosition = Piece.getKing(board, team)
    
    for(let i = 0; i < piecePositions.length; i++){
        
        const pos = piecePositions[i]
        const piece = board[pos.x][pos.y][pos.z][pos.w]
        const attacked = piece.attack(board, pos.x, pos.y, pos.z, pos.w)
        
        for(let j = 0; j < attacked.length; j++){
            const attackedPosition = attacked[j]
            if(Piece.vec4Equals(kingPosition, attackedPosition))
                return true
        }
        
        
    }
    
    return false
    
}

Piece.getPieces = function(board, team){
    
    const length_x = board.length
    const length_y = board[0].length
    const length_z = board[0][0].length
    const length_w = board[0][0][0].length
    
    let positions = []
    
    for(let x = 0; x < length_x; x++){
        for(let y = 0; y < length_y; y++){
            for(let z = 0; z < length_z; z++){
                for(let w = 0; w < length_w; w++){
                    
                    const piece = board[x][y][z][w]
                    if(piece.team === team)
                        positions.push(new THREE.Vector4(x, y, z, w))
                    
                }
            }
        }
    }
    
    return positions
    
}

Piece.getKing = function(board, team){
    
    const length_x = board.length
    const length_y = board[0].length
    const length_z = board[0][0].length
    const length_w = board[0][0][0].length
    
    for(let x = 0; x < length_x; x++){
        for(let y = 0; y < length_y; y++){
            for(let z = 0; z < length_z; z++){
                for(let w = 0; w < length_w; w++){
                    
                    const piece = board[x][y][z][w]
                    if(piece.team === team && piece.type === 'king')
                        return new THREE.Vector4(x, y, z, w)
                    
                }
            }
        }
    }
    
    console.error('No King Found', team)
    
}

Piece.hasNoMoves = function(board, team){
    
    const piecePositions = Piece.getPieces(board, team)
    
    for(let i = 0; i < piecePositions.length; i++){
        
        const pos = piecePositions[i]
        const piece = board[pos.x][pos.y][pos.z][pos.w]
        
        let possibleMoves = piece.getPossibleMoves(board, pos.x, pos.y, pos.z, pos.w)
        if(possibleMoves.length > 0)
            return false
        
        
    }
    
    return true
    
}

Piece.inStalemate = function(board, team){
    return !Piece.inCheck(board, team) && Piece.hasNoMoves(board, team)
}

Piece.inCheckmate = function(board, team){
    
    return Piece.inCheck(board, team) && Piece.hasNoMoves(board, team)
    
}
