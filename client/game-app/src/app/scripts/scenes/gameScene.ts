import Phaser from 'phaser';
const data_json = require('../../../assets/map.json');
const path_json = require('../../../assets/paths.json');

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
  lines;
  protected = false;
  tunnelTiles;
  camera;
  path;
  spawnPoint;
  minions = [];
  minionCoords = [];


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
    });
  }

  coordinatesMouseEmit(message) {
    this.socket.emit('mouseCoordinates', message);
  }

  coordinatesMouseReceive() {
    return new Promise((resolve, reject) => {
      this.socket.on('mouseCoordinates', (data) => {
        resolve(data);
      });
    });
  }

  // coordinatesMinionEmit(message) {
  //   this.socket.emit('minionCoordinates', message);
  // }
  //
  // coordinatesMinionReceive(message) {
  //   return new Promise((resolve, reject) => {
  //     this.socket.on('minionCoordinates', (data) => {
  //       resolve(data);
  //     });
  //   });
  // }

  preload () {

    this.load.setBaseURL('../assets');
    this.load.spritesheet('person', 'person.png', { frameWidth: 32 , frameHeight: 32});
    // this.load.image('minion', 'person_small.png');
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

    this.spawnPoint = this.map.findObject('Objects', obj => obj.name === 'Spawn Point');
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'person').setOffset(0, 16);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('person', { start: 4, end: 7}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('person', { start: 8, end: 11}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'front',
      frames: this.anims.generateFrameNumbers('person', { start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'back',
      frames: this.anims.generateFrameNumbers('person', { start: 12, end: 15}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: this.anims.generateFrameNumbers('person', { frame: [0, 1, 2]}),
      frameRate: 20,
    });

    this.lines = data_json.layers[3].objects[0].polyline;
    this.path = new Phaser.Curves.Path(this.lines[0].x, this.lines[0].y);

    lines.forEach(line => {
      this.path.lineTo(line.x, line.y);
    });

    let delay = 0;

    Array(100).fill(0).forEach(x => {

      const spacing = (200 * delay);
      if (delay % 5 === 0) {
        delay++;
      } else {
        delay += Math.floor(Math.random() * 10);
      }
      const follower = this.add.follower(this.path, -100, -100, 'person').setOrigin(0, 0);
      follower.startFollow({
        duration: 160000,
        positionOnPath: true,
        repeat: -1,
        ease: 'Linear',
        delay: spacing,
        rotateToPath: true
      });
      this.minions.push(follower);
    });



    // if (this.playerName === 'player1') {
    //   Array(100).fill(0).forEach(minion => {
    //     minion = this.physics.add.image(Math.random() * 3200, Math.random() * 3200, 'minion').setScale(0.5);
    //     this.minions.push(minion);
    //     this.minionCoords.push({x: minion.x, y: minion.y});
    //   });
    //   this.coordinatesMinionEmit(this.minionCoords);
    // } else {
    //   this.coordinatesMinionReceive().then(coordinates => {
    //     if (coordinates) {
    //       this.minionCoords = coordinates;
    //       coordinates.forEach(coord => {
    //         const minion = this.physics.add.image(coord.x, coord.y, 'minion').setScale(0.5);
    //         this.minions.push(minion);
    //       });
    //     }
    //   });
    // }

    this.target = this.physics.add.image(400, 400, 'target').setScale(0.1);
    this.orb = this.physics.add.image(500, 500, 'orb').setScale(0.2);
    this.player.setCollideWorldBounds(true);
    this.target.setDepth(20);
    this.target.alpha = 0.5;


    this.physics.add.overlap(this.player, this.orb, getTheGoldenOrb, null, this);
    this.physics.add.overlap(this.player, this.target, killThePlayer, null, this);


    this.player1ScoreText = this.add.text(0, 0, 'Player1: 0', {fontSize: '32px', fill: '#000'});
    this.player2ScoreText = this.add.text(0, 0, 'Player2: 0', {fontSize: '32px', fill: '#000'});
    // this.player1ScoreText.fixedToCamera = true;
    // this.player2ScoreText.fixedToCamera = true;
    // this.player1ScoreText.cameraOffset.setTo(16, 16);
    // this.player2ScoreText.cameraOffset.setTo(500, 16);


    worldLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, worldLayer);

    this.tunnelTiles = this.physics.add.staticGroup();
    aboveLayer.forEachTile(tile => {
      if (tile.index === 8) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const tunnelTile = this.tunnelTiles.create(x, y, 'tunnelTile');

        aboveLayer.removeTileAt(tile.x, tile.y);
      }
    });

    this.airTiles = this.physics.add.staticGroup();
    aboveLayer.forEachTile(tile => {
      if (tile.index === 10) {
        const x = tile.getCenterX();
        const y = tile.getCenterY();
        const airTile = this.airTiles.create(x, y, 'airTile');
        aboveLayer.removeTileAt(tile.x, tile.y);
      }
    });

    this.physics.add.overlap(this.player, this.tunnelTiles, protectThePlayer, null, this);
    this.physics.add.overlap(this.player, this.airTiles, unprotectThePlayer, null, this);


    this.camera = this.cameras.main;
    if (this.playerName === 'player1') {
      this.camera.startFollow(this.player);
    }

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
    this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

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


      if (cursors.left.isDown) {
        this.player.anims.play('left', true);
      } else if (cursors.right.isDown) {
        this.player.anims.play('right', true);
      } else if (cursors.up.isDown) {
        this.player.anims.play('back', true);
      } else if (cursors.down.isDown) {
        this.player.anims.play('front', true);
      } else {
        this.player.anims.stop();
      }


      this.coordinatesMouseReceive().then(coordinates => {
        if (coordinates) {
          this.target.x = coordinates.x;
          this.target.y = coordinates.y;
        }
      });

      // this.minionCoords = [];
      // this.minions.forEach(minion => {
      //   minion.body.setVelocityX(-100);
      //   minion.body.setVelocityY(-100);
      //   this.minionCoords.push({x: minion.x, y: minion.y});
      // });
      // this.coordinatesMinionEmit(this.minionCoords);


    } else {
      this.coordinatesKeyboardReceive().then(coordinates => {
        if (coordinates) {
          this.player.x = coordinates.x;
          this.player.y = coordinates.y;
        }
      });

      this.input.mouse.capture = true;

      this.coordinatesMouseEmit({
        x: this.target.x,
        y: this.target.y,
        isDown: this.input.activePointer.isDown
      });

      if (this.input.activePointer.event) {
        this.camera.scrollX += this.input.activePointer.event.movementX;
        this.camera.scrollY += this.input.activePointer.event.movementY;

        this.physics.moveTo(this.target, this.input.x + this.cameras.main.scrollX, this.input.y + this.camera.scrollY, null, 20);
      }

      // this.coordinatesMinionReceive().then(coordinates => {
      //   if (coordinates) {
      //     this.minions.forEach(minion => {
      //       minion.x = coordinates[this.minions.indexOf(minion)].x;
      //       minion.y = coordinates[this.minions.indexOf(minion)].y;
      //     });
      //   }
      // });
    }
    this.minions.forEach(follower => {

      if (follower.angle === -180) {
        follower.anims.play('left', true);
      } else if (follower.angle === 90) {
        follower.anims.play('front', true);
      } else if (follower.angle === -90) {
        follower.anims.play('back', true);
      } else if (follower.angle === 0) {
        follower.anims.play('right', true);
      }
      follower.angle = 0;
      this.minionCoords.push(follower.pathVector);
    });






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
