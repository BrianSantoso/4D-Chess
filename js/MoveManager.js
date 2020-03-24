'use strict';

function MoveManager(gameBoard, clientTeam, mode, main=false) {
	this.gameBoard = gameBoard;
	this.clientTeam = 0;
//	this.turn = 0; // team number. White: 0, Black: 1
	this.players = [new PlayerData(0, 300), new PlayerData(1, 300)];
	this.moveHistory = new DMoveList(gameBoard);
	this.main = main;
	
	this.move = function(x0, y0, z0, w0, x1, y1, z1, w1){
		const movingPiece = this.gameBoard.pieces[x0][y0][z0][w0];
		if(!this.canMove(movingPiece.team)){
			console.error('It is not that pieces turn!', movingPiece, x0, y0, z0, w0)
			return;
		}
		const capturedPiece = this.gameBoard.pieces[x1][y1][z1][w1];
		
		const metaData = this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
		
		this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData);
//		this.turn = 1 - this.turn;
		this.setMode(this.mode); // updates team abilities
		if(main) backendMoveManager.move(x0, y0, z0, w0, x1, y1, z1, w1);
		
		this.updateUI();
	}
	
	this.undo = function(){
		this.moveHistory.undo();
		if (this.mode != MoveManager.ONLINE_MULTIPLAYER) {
//			this.turn = 1 - this.turn;
		}
		this.setMode(this.mode);
		if(main) backendMoveManager.undo();
		
		this.updateUI();
	}
	
	this.redo = function(){
		this.moveHistory.redo();
		if (this.mode != MoveManager.ONLINE_MULTIPLAYER) {
//			this.turn = 1 - this.turn;
		}
		this.setMode(this.mode);
		if(main) backendMoveManager.redo();
		
		this.updateUI();
	}
	
	this.updateUI = function() {
		uiProxy.setState({
			mostRecentMove: this.currTurn() == this.size(),
			turn: this.currTurn(),
			whoseTurn: this.whoseTurn(),
			totalMoves: this.size()
		});
	}
	
	this.currTurn = function() {
		return this.moveHistory.currTurn();
	}
	
	this.whoseTurn = function() {
		return this.currTurn() % 2;
	}
	
	this.size = function() {
		return this.moveHistory.size();
	}
	
	this.canMove = function(team){
		if(this.mode === MoveManager.SANDBOX){
			return true;
		} else {
			return team == this.whoseTurn();
		}
		if(main) backendMoveManager.canMove(team);
	}
	
	this.setMode = function(mode){
		this.mode = mode;
		if (this.mode === MoveManager.SANDBOX) {
			this.gameBoard.setSelectability(0, true);
			this.gameBoard.setSelectability(1, true);
		} else if (this.mode === MoveManager.LOCAL_MULTIPLAYER) {
			this.gameBoard.setSelectability(0, this.canMove(0));
			this.gameBoard.setSelectability(1, this.canMove(1));
		} else if (this.mode === MoveManager.ONLINE_MULTIPLAYER) {
			this.gameBoard.setSelectability(this.clientTeam, this.canMove(this.clientTeam));
			this.gameBoard.setSelectability(1 - this.clientTeam, false);
		}
		if(main) backendMoveManager.setMode(mode);
	}
	
	this.setMode(mode)
	
	function PlayerData(team, clockTime){
		this.team = team;
		this.clockTime = clockTime;
	}
	
	this.update = function(){
		this.players[this.whoseTurn()].clockTime -= step;
		
		if(main) backendMoveManager.update();
	}
	
	this.package = function() {
		// function mainly for server to send state of game to clients
		const x = this.gameBoard.pieces;
		const pieces = x.map(y => 
			y.map(z => 
				z.map(w => 
					w.map(piece => piece.package())
				)
			)
		);
		
		let data = {
			moveHistory: this.moveHistory.package(),
			players: this.players,
			pieces: pieces
		}
		return data
	}
	
	
}


MoveManager.SANDBOX = 0;
MoveManager.LOCAL_MULTIPLAYER = 1;
MoveManager.ONLINE_MULTIPLAYER = 2;

function DMoveList(gameBoard, curr){
	this.root = new MoveHistoryNode()
	this.curr = curr || this.root;
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
	},
	
	size: function() {
		let size = -1;
		let curr = this.root;
		while (curr != null) {
			curr = curr.next;
			size++;
		}
		return size;
	},
	
	indexOf: function(item) {
		let index = 0;
		let curr = this.root;
		while (curr != null) {
			if (curr == item) {
				return index;
			}
			curr = curr.next;
			index++;
		}
		return -1;
	},
	
	currTurn: function() {
		return this.indexOf(this.curr);
	},
	
	package: function() {
		const current = this.root;
		const newDList = new DMoveList(null);
		while(current) {
			newDList.add(current.package());
		}
		return newDList;
	}
}

function MoveHistoryNode(move){
	this.move = move || null;
	this.next = null;
	this.prev = null;
	
	this.package = function() {
		return {move: this.move ? this.move.package() : null}
	}
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
	
	this.package = function() {
		return {
			x0: this.x0,
			y0: this.y0,
			z0: this.z0,
			w0: this.w0,
			x1: this.x1,
			y1: this.y1,
			z1: this.z1,
			w1: this.w1,
			capturedPiece: this.capturedPiece.package(),
			metaData: (function(){
				let ret = {}
				for(var key in this.metaData) {
					if(key instanceof Piece) {
						ret[key] = this.metaData[key].package();
					} else {
						ret[key] = this.metaData[key];
					}
				}
				return ret;
			})()
		}
	}
}