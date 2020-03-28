function EmptyUI() {
	this.setState = function(state) {
		console.warn('proxy setState called before react component mounted')
	}
	this.exitMenu = function() {
		console.warn('proxy exitMenu called before react component mounted')
	}
 }

 function UI(reactComponent) {
	this._ui = reactComponent;
	this.setState = function(state) {
		this._ui.setState(state);
	}
	this.exitMenu = function() {
		this._ui.exitMenu();
	}
 }