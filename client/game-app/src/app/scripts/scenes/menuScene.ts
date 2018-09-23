import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {

  constructor () {
        super({ key: 'UIScene', active: true });
        this.score = 0;
  }

  create () {
        //  Our Text object to display the Score
        const player1Score = this.add.text(10, 10, 'Player1: 0', { font: '48px Arial', fill: '#000000' });
        const player2Score = this.add.text(10, 60, 'Player2: 0', { font: '48px Arial', fill: '#000000' });


        //  Grab a reference to the Game Scene
        const game = this.scene.get('GameScene');

        //  Listen for events from it
        game.events.on('addScorePlayer1', function () {
            this.score += 1;
            player1Score.setText('Player1: ' + this.score);
        }, this);

        game.events.on('addScorePlayer2', function () {
            this.score += 1;
            player2Score.setText('Player2: ' + this.score);
        }, this);
    }
}
