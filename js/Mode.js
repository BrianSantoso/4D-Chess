function Mode(move, canMove, updateSelectability, moveStatus, config) {
	this.move = move;
	
	this.undo = function undo() {
		this.moveHistory.undo();
		this.updateSelectability();
		this.updateUI();
	}
	
	this.redo = function redo() {
		this.moveHistory.redo();
		this.updateSelectability();
		this.updateUI();
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
		
		this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData);
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
		
		this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData);
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
	function move(x0, y0, z0, w0, x1, y1, z1, w1) {
		const movingPiece = this.gameBoard.pieces[x0][y0][z0][w0];
		const capturedPiece = this.gameBoard.pieces[x1][y1][z1][w1];
		const metaData = this.gameBoard.move(x0, y0, z0, w0, x1, y1, z1, w1);
		
		const moveHistoryNode = this.moveHistory.add(x0, y0, z0, w0, x1, y1, z1, w1, capturedPiece, metaData);
		this.updateSelectability();
		
		this.updateUI();
		
		const move = moveHistoryNode.move.package();
		console.log('sending move to server: packaged:', move)
		console.log('unpackaged: ', moveHistoryNode.move)
		socket.emit('make move', move);
		
	},
	
	function canMove(team) {
		return this.whoseTurn() == this.clientTeam;
	},
	
	function updateSelectability() {
		this.setSelectability(0, this.viewingMostRecentMove() && this.canMove(this.clientTeam));
		this.setSelectability(1, false);
	},
	
	function moveStatus() {
		if (this.viewingMostRecentMove()) {
			return this.whoseTurn() === 0 ? "White to Move" : "Black to Move";
		} else {
			return this.turnString();
		}
	},
	
	{}
)