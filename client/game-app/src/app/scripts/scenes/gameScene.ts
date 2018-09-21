import Phaser from 'phaser';
const data_json = require('../../../assets/map.json');
import { PlayerSelectComponent } from '../../player-select/player-select.component';
import * as io from 'socket.io-client';
// console.log(PlayerSelectComponent.selectedPlayer)
import { LocalSocket } from '../../lib/socket';

export class GameScene extends Phaser.Scene {

  private localSocket = LocalSocket.getInstance();
  private url = 'http://localhost:5000';
  private socket = io(this.url);
  player;
  playerName;
  orb;
  map;
  protected = false;
  tunnelTiles;

  player1Score = 0;
  player2Score = 0;
  player1ScoreText;
  player2ScoreText;

  coordinatesKeyboardEmit(message) {
    this.socket.emit('keyboardCoordinates', message);
  }

  coordinatesKeyboardReceive() {
    return new Promise((resolve, reject) => {
      this.socket.on('keyboardCoordinates', (data) => {
        resolve(data);
      });
    }) ;
  }

  coordinatesMouseEmit(message) {
    this.socket.emit('mouseCoordinates', message);
  }

  coordinatesMouseReceive() {
    return new Promise((resolve, reject) => {
      this.socket.on('mouseCoordinates', (data) => {
        resolve(data);
      });
    }) ;
  }

  preload () {

    this.load.setBaseURL('../assets');
    this.load.image('person', 'person_small.png');
    this.load.image('target', 'target.png');
    this.load.image('orb', 'orb.png');
    this.load.image('tiles', 'map-tileset.png');
    this.load.image('tunnelTile', 'tunnelTile.png');
    this.load.image('airTile', 'airTile.png');
    this.load.tilemapTiledJSON('map', data_json);
    this.playerName = this.localSocket.getPlayerDataFromSelectPlayer().player;

  }

  create () {

    this.map = this.make.tilemap({key: 'map'});
    const tileset = this.map.addTilesetImage('map-tileset', 'tiles');

    const belowLayer = this.map.createStaticLayer('Below Player', tileset, 0, 0);
    const worldLayer = this.map.createStaticLayer('World', tileset, 0, 0);
    const aboveLayer = this.map.createDynamicLayer('Above Player', tileset, 0, 0);
    aboveLayer.setDepth(10);

    this.player = this.physics.add.image(400, 100, 'person').setScale(0.5);
    this.target = this.physics.add.image(0, 0, 'target').setScale(0.1);
    this.orb = this.physics.add.image(500, 500, 'orb').setScale(0.2);
    this.player.setCollideWorldBounds(true);
    this.target.setDepth(20);
    this.target.alpha = 0.5;


    this.physics.add.overlap(this.player, this.orb, getTheGoldenOrb, null, this);
    this.physics.add.overlap(this.player, this.target, killThePlayer, null, this);


    this.player1ScoreText = this.add.text(16, 16, 'Player1: 0', {fontSize: '32px', fill: '#000'});
    this.player2ScoreText = this.add.text(500, 16, 'Player2: 0', {fontSize: '32px', fill: '#000'});

    worldLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, worldLayer);

    // aboveLayer.setCollisionByProperty({ protect: true });
    // this.physics.add.overlap(this.player, aboveLayer, protectThePlayer, null, this);
    this.tunnelTiles = this.physics.add.staticGroup();
    aboveLayer.forEachTile(tile => {
      if (tile.index === 8) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const tunnelTile = this.tunnelTiles.create(x, y, "tunnelTile");

        aboveLayer.removeTileAt(tile.x, tile.y);
      }
    })

    this.airTiles = this.physics.add.staticGroup();
    aboveLayer.forEachTile(tile => {
      if (tile.index === 10) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const airTile = this.airTiles.create(x, y, "airTile");
        aboveLayer.removeTileAt(tile.x, tile.y);
      }
    })
    // this.airTiles.setDepth(0);

    this.physics.add.overlap(this.player, this.tunnelTiles, protectThePlayer, null, this);
    this.physics.add.overlap(this.player, this.airTiles, unprotectThePlayer, null, this);


    const camera = this.cameras.main;
    if (this.playerName === 'player1') {
      camera.startFollow(this.player);
    } else {
      camera.startFollow(this.target);
    }
    // console.log(this.config)
    camera.setBounds(0, 0, 100, 100);

  }

  update(time, delta) {

    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();
    const cursors = this.input.keyboard.createCursorKeys();

    this.player.body.setVelocity(0);
    if (this.playerName === 'player1') {
      if (cursors.left.isDown) {
        this.player.body.setVelocityX(-100);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y});
      } else if (cursors.right.isDown) {
        this.player.body.setVelocityX(100);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y});
      }
      if (cursors.up.isDown) {
        this.player.body.setVelocityY(-100);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y});
      } else if (cursors.down.isDown) {
        this.player.body.setVelocityY(100);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y});
      }
      this.player.body.velocity.normalize().scale(speed);


      this.coordinatesMouseReceive().then(coordinates => {
        if (coordinates) {
          this.target.x = coordinates.x;
          this.target.y = coordinates.y;
        }
      });

    } else {
      this.coordinatesKeyboardReceive().then(coordinates => {
        if (coordinates) {
          this.player.x = coordinates.x;
          this.player.y = coordinates.y;
        }
      });

      this.input.mouse.capture = true;
      // console.log(this.input.activePointer)
      this.target.x = this.input.activePointer.position.x;
      this.target.y = this.input.activePointer.position.y;
      this.coordinatesMouseEmit({
        x: this.target.x,
        y: this.target.y,
        isDown: this.input.activePointer.isDown
      });

    }

  }

  function getTheGoldenOrb (_player, _orb) {
    _orb.disableBody(true, true);

    this.player1Score += 1;
    this.player1ScoreText.setText('Player1: ' + this.player1Score);
  }

  function protectThePlayer() {
    this.protected = true;
  }

  function unprotectThePlayer() {
    this.protected = false;
  }


  function killThePlayer (_player, _target) {
    // console.log(this.input.activePointer)
    this.coordinatesMouseReceive().then(coordinates => {
      if (coordinates) {
        if (coordinates.isDown && !this.protected) {
          _player.disableBody(true, true);
          this.player2Score += 1;
          this.player2ScoreText.setText('Player2: ' + this.player2Score);
        }
    });
  }


}
