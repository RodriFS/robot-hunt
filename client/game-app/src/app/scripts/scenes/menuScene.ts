import Phaser from 'phaser';
import { Socket } from '../../lib/socket';


export class MenuScene extends Phaser.Scene {

  constructor () {
        super({ key: 'UIScene', active: true });
        this.score = 0;
  }

  private socket = Socket.getInstance();
  private music_intro;
  private music_loop;

  preload() {

    this.load.setBaseURL('../../assets');
    this.load.image('start', '/sprites/start.png');
    this.load.image('p1_score', '/sprites/p1_score.png');
    this.load.image('p2_score', '/sprites/p1_score.png');
    this.load.bitmapFont('pixelFont', '/font/font_black.png', '../../assets/font/font.xml');
  }

  create () {


        this.physics.add.sprite(10, 10, 'p1_score').setOrigin(0, 0);
        this.physics.add.sprite(window.innerWidth - 230, 10, 'p2_score').setOrigin(0, 0);
        const startMessage = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight / 2, 'start').setScale(1.05);

        const player1Score = this.add.bitmapText(20, 25, 'pixelFont', 'Robot: 0', 38).setScale(0.5);
        const player2Score = this.add.bitmapText(window.innerWidth - 220, 25, 'pixelFont', 'Human: 0', 38).setScale(0.5);

        this.playerName = this.socket.getPlayerDataFromSelectPlayer().player;

        const startMessageText = this.add.bitmapText(
          window.innerWidth / 2,
          window.innerHeight / 2,
          'pixelFont',
          '', 38).setOrigin(1).setScale(0.5);

        const endMessage = this.add.bitmapText(
          window.innerWidth / 2,
          window.innerHeight / 2,
          'pixelFont',
          '', 38).setOrigin(1).setScale(0.5);

        if (this.playerName === 'player1') {
          startMessageText.setText(
            ['You are a sentient',
         'robot. Find the life',
         'controller  before the',
         'humans find you to',
         'obliterate the whole',
         'humanity.',
         ''
         'click to continue...'
       ]);

        } else {
          startMessageText.setText(
            ['There are rumors that a',
           'robot has become sentient.',
           'Find the sentient robot',
           'before it gets to the life',
           'controller  and obliterates',
           'the whole humanity.',
           '',
           'click to continue...'
         ]);
        }

        this.input.on('pointerdown', () => {
          startMessage.visible = false;
          startMessageText.visible = false;
          endMessage.visible = false;
        });

        const game = this.scene.get('GameScene');
        startMessage.visible = true;
        endMessage.visible = true;


        game.events.on('addScorePlayer1', function () {
          this.score += 1;
          player1Score.setText('Robot: ' + this.score);

          if (this.playerName === 'player1') {
            endMessage.setText(['You won!', 'Humanity was obliterated!', 'click to continue playing.']);
          } else {
            endMessage.setText(['You lost!', 'Humanity was obliterated!', 'click to continue playing.']);
          }
          game.scene.restart();
        }, this);


        game.events.on('addScorePlayer2', function () {
          startMessage.visible = true;
          endMessage.visible = true;
          this.score += 1;

          player2Score.setText('Human: ' + this.score);

          if (this.playerName === 'player1') {
            endMessage.setText(['You lost!', 'Humanity was saved!', 'click to continue playing.']);
          } else {
            endMessage.setText(['You won!', 'Humanity was saved!', 'click to continue playing.']);
          }
          game.scene.restart();
        }, this);
      }
    }
}
