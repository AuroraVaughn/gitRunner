
function createGame() {
	console.log('createGame has been called')
	if (screen.width > 1500) {
		game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'ph_game');
	}
	else {
		game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'ph_game');
	}
	game.state.add('StateMain', StateMain);
	game.state.start('StateMain');
}
