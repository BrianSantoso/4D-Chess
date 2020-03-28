function Mode(move, canMove, updateSelectability, moveStatus, config) {
	this.move = move;
	
	this.undo = function undo() {
		if (this.moveHistory.undo()) {
			this.updateSelectability();
			this.updateUI();
		}
	}
	
	this.redo = function redo() {
		if (this.moveHistory.redo()) {
			this.updateSelectability();
			this.updateUI();
		}
	}
	
	this.canMove = canMove;
	this.updateSelectability = updateSelectability;
	this.config = config;
	this.moveStatus = moveStatus;
	
}

Mode.SANDBOX = new Mode(
	function move(x0, y0, z0, w0, x1, y1, z1, w1) {
		const movingPiece = this.gameBoard.pieces[x0][y0][z0][w0];
		const capturedPiece = this.gameBoard.pieces[x1][y1][z1][w1];
		const metaData = this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
		
		this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, metaData);
		this.updateSelectability();
		
		this.updateUI();
	},
	
	function canMove(team) {
		return true;
	},
	
	function updateSelectability() {
		this.setSelectability(0, true);
		this.setSelectability(1, true);
	},
	
	function moveStatus() {
		return this.turnString();
	},
	
	{}
);

Mode.LOCAL_MULTIPLAYER = new Mode(
	function move(x0, y0, z0, w0, x1, y1, z1, w1) {
		const movingPiece = this.gameBoard.pieces[x0][y0][z0][w0];
		const capturedPiece = this.gameBoard.pieces[x1][y1][z1][w1];
		const metaData = this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
		
		this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, metaData);
		this.updateSelectability();
		
		this.updateUI();
	},
	
	function canMove(team) {
		return this.whoseTurn() == team;
	},
	
	function updateSelectability() {
		this.setSelectability(0, this.whoseTurnViewed() === 0);
		this.setSelectability(1, this.whoseTurnViewed() === 1);
	},
	
	function moveStatus() {
		if (this.viewingMostRecentMove()) {
			return this.whoseTurn() === 0 ? "White to Move" : "Black to Move";
		} else {
			return this.turnString();
		}
	},
	
	{}
);

Mode.ONLINE_MULTIPLAYER = new Mode(
	function move(x0, y0, z0, w0, x1, y1, z1, w1, receiving=false, metaData={}) {
		if (this.viewingMostRecentMove()) {
			const movingPiece = this.gameBoard.pieces[x0][y0][z0][w0];
			const capturedPiece = this.gameBoard.pieces[x1][y1][z1][w1];
			metaData = this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
		}
		
		const moveHistoryNode = this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, metaData, !this.viewingMostRecentMove());
		this.updateSelectability();
		
		this.updateUI();
		
		if (!receiving) {
			const move = moveHistoryNode.move.package();
			console.log('sending move to server: packaged:', move)
			console.log('unpackaged: ', moveHistoryNode.move)
			socket.emit('submit move', move);
		}
		console.log(receiving)
	},
	
	function canMove(team) {
		if (!this.ready) {
			return false;
		}
		return this.whoseTurn() == this.clientTeam;
	},
	
	function updateSelectability() {
		if (this.ready) {
			this.setSelectability(this.clientTeam, this.viewingMostRecentMove() && this.canMove(this.clientTeam));
			this.setSelectability(1 - this.clientTeam, false);
		} else {
			this.setSelectability(0, false);
			this.setSelectability(1, false);
		}
		
	},
	
	function moveStatus() {
		
		if (!this.ready) {
			return "Waiting for opponent..."
		}
		
		if (this.viewingMostRecentMove()) {
			return this.whoseTurn() === 0 ? "White to Move" : "Black to Move";
		} else {
			return this.turnString();
		}
	},
	
	{}
)