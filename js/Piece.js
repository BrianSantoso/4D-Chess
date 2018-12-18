function Piece(){
    
    this.team = 0
    
    
}

Piece.prototype = {
    
    movement: function(board, x, y, z, w){},
    attack: function(board, x, y, z, w){
        return this.movement(board, x, y, z, w)
    },
    getPossibleMoves: function(board, x, y, z, w){
        
        let possibleMovements = this.movement(board, x, y, z, w)
        let possibleAttacks = this.attack(board, x, y, z, w)
        let positions = Piece.concatWithoutDuplicates(possibleMovements, possibleAttacks) // Possible moves
        
        // TODO: CHECK IF IT WILL LEAVE KING IN CHECK.
        
        return positions
    },
    
}

function Rook(){
    this.team = 1
}

Rook.prototype = Object.create(Piece.prototype)

Rook.prototype.movement = function(board, x, y, z, w){
    
    let positions = []
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1)))
    
    return positions
}

function Bishop(){
    this.team = 1
}

Bishop.prototype = Object.create(Piece.prototype)

Bishop.prototype.movement = function(board, x, y, z, w){
    
    let positions = []
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1)))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1)))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1)))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1)))
    
    return positions
}

function Queen(){
    this.team = 1
}

Queen.prototype = Object.create(Piece.prototype)

Queen.prototype.movement = function(board, x, y, z, w){
    
    let positions = []
    
    //
    // Rook Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1)))
    
    //
    // Bishop Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1)))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1)))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1)))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1)))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1)))
    
    return positions
}

function Knight(){
    this.team = 1
}

Knight.prototype = Object.create(Piece.prototype)

Knight.prototype.movement = function(board, x, y, z, w){
    
    let positions = []
    
    // Max iterations is 1
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 2, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 2, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 2), 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -2, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -2, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -2), 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, -1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 2, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 2, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 2), 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, -1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -2, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -2, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -2, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -2), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -2), 1))
    
    
    
    return positions
}

function King(){
    this.team = 1
}

King.prototype = Object.create(Piece.prototype)

King.prototype.movement = function(board, x, y, z, w){
    
    let positions = []
    
    // Max iterations is 1
    
    //
    // Rook Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1), 1))
    
    //
    // Bishop Movements
    //
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1), 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1), 1))
    
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1), 1))
    positions = Piece.concatWithoutDuplicates(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1), 1))
    
    
    return positions
}


//King.prototype = new Piece()

Piece.rayCast = function(board, position, direction, maxIterations=Number.POSITIVE_INFINITY, getPath=true){
    
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