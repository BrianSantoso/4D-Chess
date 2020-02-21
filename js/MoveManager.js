function MoveManager(gameBoard, clientTeam, sandbox=false, clockTime=300){
	this.SANDBOX = sandbox;
	this.gameBoard = gameBoard;
	this.clientTeam = 0;
	this.turn = 0; // team number. White: 0, Black: 1
	this.players = [new PlayerData(0, clockTime), new PlayerData(1, clockTime)];
	this.moveHistory = new DMoveList(gameBoard);
	
	this.move = function(x0, y0, z0, w0, x1, y1, z1, w1){
		const capturedPiece = this.gameBoard.pieces[x1][y1][z1][w1];
		
		const metaData = this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
		
		this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData);
		this.turn = 1 - this.turn;
	}
	
	this.canMove = function(team){
		if(sandbox){
			return true;
		} else {
			return team == this.turn;
		}
	}
	
	function PlayerData(team, clockTime){
		this.team = team;
		this.clockTime = clockTime;
	}
	
	this.update = function(){
		this.players[this.turn].clockTime -= step;
	}
	
	
}

function DMoveList(gameBoard, curr){
	this.curr = curr || new MoveHistoryNode();
	this.gameBoard = gameBoard;
}

DMoveList.prototype = {
	add: function(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData){
		const newMoveHistoryNode = new MoveHistoryNode(new Move(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData));
		newMoveHistoryNode.prev = this.curr;
		this.curr.next = newMoveHistoryNode;
		this.curr = newMoveHistoryNode;
		
	},
	
	undo: function(){
		if(this.curr.prev){
			this.gameBoard.undo(this.curr.move);
			this.curr = this.curr.prev;
			return true;
		}
		return false;
	},
	
	redo: function(){
		if(this.curr.next){
			this.curr = this.curr.next;
			const x0 = this.curr.move.x0;
			const y0 = this.curr.move.y0;
			const z0 = this.curr.move.z0;
			const w0 = this.curr.move.w0;
			const x1 = this.curr.move.x1;
			const y1 = this.curr.move.y1;
			const z1 = this.curr.move.z1;
			const w1 = this.curr.move.w1;
			this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
			return true;
		}
		return false;
	}
}

function MoveHistoryNode(move){
	this.move = move || null;
	this.next = null;
	this.prev = null;
}

function Move(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData){
	this.x0 = x0;
	this.y0 = y0;
	this.z0 = z0;
	this.w0 = w0;
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.w1 = w1;
	this.capturedPiece = capturedPiece;
	this.metaData = metaData || {promotion: false};
	
}