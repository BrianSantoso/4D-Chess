function Piece(){
    
    this.team = 0
    
    
}

function King(){
    this.team = 1
}

//King.prototype = new Piece()

Piece.rayCast = function(board, position, direction, getPath=true){
    
    const start = position.add(direction)
    
    let x = start.x
    let y = start.y
    let z = start.z
    let w = start.w
    
    const length_x = board.length
    const length_y = board[0].length
    const length_z = board[0][0].length
    const length_w = board[0][0][0].length
    
    console.log('lengths', length_x, length_y, length_z, length_w)
    
    let positions = []
    
    while(true){
        
        // Check if raycast is out of bounds
        let outOfBounds = (x >= length_x) || (y >= length_y) || (z >= length_z) || (w >= length_w) || (x < 0) || (y < 0) || (z < 0) || (w < 0)
        if(outOfBounds) break;
        
        let spot = board[x][y][z][w]
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
    
}