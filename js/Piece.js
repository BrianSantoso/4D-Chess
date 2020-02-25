'use strict';
function Piece(team=-1){
    
    this.team = team
    this.type = ''
	this.mesh;
	
}

Piece.prototype = {
    
    movement: function(board, x, y, z, w, getPath=true){return null},
    attack: function(board, x, y, z, w){
        return this.movement(board, x, y, z, w, false)
    },
    getPossibleMoves: function(board, x, y, z, w){
        
        let positions = [];
        let possibleMovements = this.movement(board, x, y, z, w).map(move => Object.assign(move, {possibleCapture: false}));
        let possibleAttacks = this.attack(board, x, y, z, w).map(attack => Object.assign(attack, {possibleCapture: true}));
        let possibleMovementsAndAttacks = Piece.concatUnique(possibleMovements, possibleAttacks); // Possible moves
        positions = Piece.concatUnique(positions, possibleMovementsAndAttacks);
        
        positions = Piece.removeIllegalMoves(positions, board, x, y, z, w);
        
        return positions;
    },
    update: function(board, x0, y0, z0, w0, x1, y1, z1, w1){},
    isPinned: function(board, x, y, z, w){
        // Returns array of positions of pieces that are pinning the king
        // temporarily modify the board so that the current piece is missing
        board[x][y][z][w] = new Piece(); //empty piece
        
		const inCheck = Piece.inCheck(board, this.team);
        board[x][y][z][w] = this;
        return inCheck;
        
    },
    setMesh: function(mesh){
        this.mesh = mesh
    }
    
}

Piece.prototype.update = function(board, x0, y0, z0, w0, x1, y1, z1, w1){
    
    this.hasMoved = true
    
}

function Rook(team){
    Piece.call(this, team)
    this.type = 'rook'
}

Rook.prototype = Object.create(Piece.prototype)

Rook.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1), getPath))
    
    return positions
}

function Bishop(team){
    Piece.call(this, team)
    this.type = 'bishop'
}

Bishop.prototype = Object.create(Piece.prototype)

Bishop.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), getPath))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1), getPath))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1), getPath))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1), getPath))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1), getPath))
    
    return positions
}

function Queen(team){
    Piece.call(this, team)
    this.type = 'queen'
}

Queen.prototype = Object.create(Piece.prototype)

Queen.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    // Rook Movements
	positions = Piece.concatUnique(positions, Rook.prototype.movement(board, x, y, z, w, getPath))
    // Bishop Movements
	positions = Piece.concatUnique(positions, Bishop.prototype.movement(board, x, y, z, w, getPath))
    
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
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 2, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 2, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 2), getPath, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -2, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -2, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -2), getPath, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, -1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(2, 0, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 2, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 2, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 2, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 2), getPath, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, -1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-2, 0, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -2, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -2, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -2, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -2, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -2), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -2), getPath, 1))
    
    
    
    return positions
}

function King(team){
    Piece.call(this, team)
    this.type = 'king'
}

King.prototype = Object.create(Piece.prototype)

King.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    // Max iterations is 1
    
    //
    // Rook Movements
    //
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, -1), getPath, 1))
    
    //
    // Bishop Movements
    //
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, 1), getPath, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, 1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, 1), getPath, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, -1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 1, -1), getPath, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, -1, 0, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, -1, 0), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, -1), getPath, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, -1, -1), getPath, 1))
    
    
    return positions
}

function Pawn(team){
    Piece.call(this, team)
    this.type = 'pawn'
    
    this.justMovedTwoSpaces = false
    this.hasMoved = false
    
}

Pawn.prototype = Object.create(Piece.prototype)

Pawn.prototype.update =function(board, x0, y0, z0, w0, x1, y1, z1, w1){
    
    this.hasMoved = true
    const moveDistance = Math.abs(x1 - x0) + Math.abs(y1 - y0) + Math.abs(z1 - z0) + Math.abs(w1 - w0)
    this.justMovedTwoSpaces = moveDistance === 2
    if (this.justMovedTwoSpaces){
        console.log('unpeasantable!')
    }
    
}

Pawn.prototype.attack = function(board, x, y, z, w){
    
    let positions = []
    let d = this.team === 0 ? 1 : -1
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, d, 0), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, d, 0), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, d, 0), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, d, 0), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, d, d), false, 1))
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(1, 0, 0, d), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(-1, 0, 0, d), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 1, 0, d), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, -1, 0, d), false, 1))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, d, d), false, 1))
    
    
    return positions
    
}

Pawn.prototype.movement = function(board, x, y, z, w, getPath=true){
    
    let positions = []
    
    let maxIterations = this.hasMoved ? 1 : 2
    let d = this.team === 0 ? 1 : -1
    
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, d, 0), getPath, maxIterations))
    positions = Piece.concatUnique(positions, Piece.rayCast(board, new THREE.Vector4(x, y, z, w), new THREE.Vector4(0, 0, 0, d), getPath, maxIterations))
    
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
    let iteration = 0
    
    while(iteration < maxIterations){
        iteration++
        // Check if raycast is out of bounds
        let outOfBounds = (x >= length_x) || (y >= length_y) || (z >= length_z) || (w >= length_w) || (x < 0) || (y < 0) || (z < 0) || (w < 0)
        if(outOfBounds) break;
        
        let spot = board[x][y][z][w]
//        console.log(x, y, z, w)
        if(spot.team >= 0/*is occupied*/){
            if(spot.team === oppositeTeam && !getPath/*can be captured (AKA opposite team)*/){
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

Piece.concatUnique = function(a, b){
	// Concatenates two arays of Vectors, without duplicates.
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
    // Returns array of positions of pieces that are attacking the king
    const oppositeTeam = 1 - team
    const piecePositions = Piece.getPieces(board, oppositeTeam)
    const kingPosition = Piece.getKing(board, team)
    const attackers = []
	
    for(let i = 0; i < piecePositions.length; i++){
        
        const pos = piecePositions[i]
        const attacker = board[pos.x][pos.y][pos.z][pos.w]
        const attacked = attacker.attack(board, pos.x, pos.y, pos.z, pos.w)
        
        for(let j = 0; j < attacked.length; j++){
            const attackedPosition = attacked[j]
            if(Piece.vec4Equals(kingPosition, attackedPosition))
                attackers.push(pos)
        }
        
        
    }
    
    return attackers
    
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
	return new THREE.Vector4(-1, -1, -1, -1)
    
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

Piece.removeIllegalMoves = function(positions, board, x, y, z, w){
    const piece = board[x][y][z][w]
    const team = piece.team
    let legalPositions = []

    board[x][y][z][w] = new Piece()
    
    positions.forEach(position => {
        
        let pos_x = position.x
        let pos_y = position.y
        let pos_z = position.z
        let pos_w = position.w
        
        const savedPiece = board[pos_x][pos_y][pos_z][pos_w]
        
        board[pos_x][pos_y][pos_z][pos_w] = piece
        
        if(!Piece.inCheck(board, team).length){
            legalPositions.push(position)
        }
        
        board[pos_x][pos_y][pos_z][pos_w] = savedPiece
        
        
    })

    board[x][y][z][w] = piece

    return legalPositions
}
