import Phaser from 'phaser';
const data_json = require('../../../assets/tilemaps/factory-map.json');

import { PlayerSelectComponent } from '../../player-select/player-select.component';
import { Socket } from '../../lib/socket';

export class GameScene extends Phaser.Scene {

  constructor () {
       super({ key: 'GameScene', active: true });
   }

  private socket = Socket.getInstance();

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
  orbSpawnPoint;
  minions = [];
  minionCoords = [];
  belowLayer;
  worldLayer;
  aboveLayer;
  marker;


  coordinatesKeyboardEmit(message) {
    this.socket.socket.emit('keyboardCoordinates', message);
  }

  coordinatesKeyboardReceive() {
    return new Promise((resolve, reject) => {
      this.socket.socket.on('keyboardCoordinates', (data) => {
        resolve(data);
      });
    });
  }

  coordinatesMouseEmit(message) {
    this.socket.socket.emit('mouseCoordinates', message);
  }

  coordinatesMouseReceive() {
    return new Promise((resolve, reject) => {
      this.socket.socket.on('mouseCoordinates', (data) => {
        resolve(data);
      });
    });
  }

  preload () {

    this.load.setBaseURL('../assets');
    this.load.spritesheet('person', '/sprites/robot_spritesheet.png', { frameWidth: 32 , frameHeight: 32 });
    this.load.image('target', '/sprites/target.png');
    this.load.image('orb', '/sprites/controller.png');
    this.load.spritesheet('playerPos', '/sprites/player_position.png', { frameWidth: 300 , frameHeight: 300 });
    this.load.image('castleTiles', '/tilesets/factory_tileset.png');
    this.load.tilemapTiledJSON('map', data_json);
    this.playerName = this.socket.getPlayerDataFromSelectPlayer().player;

  }

  create () {


    this.map = this.make.tilemap({key: 'map'});
    const castleTileset = this.map.addTilesetImage('factory_tileset', 'castleTiles');

    this.belowLayer = this.map.createStaticLayer('Below Layer', castleTileset, 0, 0);
    this.worldLayer = this.map.createStaticLayer('World', castleTileset, 0, 0);
    this.aboveLayer = this.map.createDynamicLayer('Above Layer', castleTileset, 0, 0);
    this.aboveLayer.setDepth(10);

    this.spawnPoint = this.map.findObject('Objects', obj => obj.name === 'Spawn Point');
    this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'person').setOffset(0, 0);

    if (this.playerName === 'player1') {
      this.playerPos = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'playerPos').setOffset(0, 0);
      this.playerPos.alpha = 0.3;
    }

    this.orbSpawnPoint = this.map.findObject('Objects', obj => obj.name === 'orbSpawn');
    this.orb = this.physics.add.image(this.orbSpawnPoint.x, this.orbSpawnPoint.y, 'orb');

    this.anims.create({
      key: 'left',
      frames: [{ key: 'person', frame: 1}, { key: 'person', frame: 19}],
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: [{ key: 'person', frame: 0}, { key: 'person', frame: 18}],
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'front',
      frames: [{ key: 'person', frame: 0}, { key: 'person', frame: 18}],
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'back',
      frames: [{ key: 'person', frame: 1}, { key: 'person', frame: 19}],
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'person', frame: 0}, { key: 'person', frame: 18}],
      frameRate: 2,
    });
    if (this.playerName === 'player1') {
      this.anims.create({
        key: 'playerPos',
        frames: this.anims.generateFrameNumbers('playerPos', { start: 0, end: 8}),
        frameRate: 20,
      });
    }

    this.lines = this.map.findObject('Objects', obj => {
      if (obj.name === 'smallpath') {
        this.path = new Phaser.Curves.Path(obj.polyline[0].x + obj.x, obj.polyline[0].y + obj.y);

        obj.polyline.forEach(line => {
          this.path.lineTo(line.x + obj.x, line.y + obj.y);
        });


        const duration = this.path.curves.reduce((total = 0 , line) => {
          const x1 = line.p0.x;
          const x2 = line.p1.x;
          const y1 = line.p0.y;
          const y2 = line.p1.y;
          return total + (Math.sqrt(Math.pow(x2 - x1, 2) - Math.pow(y2 - y1, 2)) || 0);
        }, 0);

        let delay = 0;

        Array(10).fill(0).forEach(x => {

          const spacing = (500 * delay);
          if (delay % 5 === 0) {
            delay++;
          } else {
            delay += Math.floor(Math.random() * 10);
          }
          const follower = this.add.follower(this.path, 100, 100, 'person').setOrigin(0, 0);
          follower.startFollow({
            duration: 32000 + duration,
            positionOnPath: true,
            repeat: -1,
            ease: 'Linear',
            delay: spacing,
            rotateToPath: true
          });
          this.minions.push(follower);
        });
      }
    });


    this.target = this.physics.add.image(400, 400, 'target').setScale(0.5);

    this.player.setCollideWorldBounds(true);
    this.target.setDepth(20);
    this.target.alpha = 0.65;


    this.physics.add.overlap(this.player, this.orb, this.getTheGoldenOrb, null, this);
    this.physics.add.overlap(this.player, this.target, this.killThePlayer, null, this);
    // this.killThePlayer.bind(this)
    // this.input.on('pointerdown', this.killThePlayer)

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, this.worldLayer);

    this.camera = this.cameras.main;
    if (this.playerName === 'player1') {
      this.camera.startFollow(this.player);
    } else {
      this.camera.scrollX = 800;
      this.camera.scrollY = 800;
    }

    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
    this.camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    // this.marker = this.add.graphics().setDepth(30);
    // this.marker.lineStyle(3, 0xffffff, 1);
    // this.marker.strokeRect(0, 0, this.map.tileWidth, this.map.tileHeight);
  }

  update(time, delta) {

    const speed = 100;
    const prevVelocity = this.player.body.velocity.clone();
    const cursors = this.input.keyboard.createCursorKeys();


    this.player.body.setVelocity(0);

    if (this.playerName === 'player1') {

      this.playerPos.x = this.player.x;
      this.playerPos.y = this.player.y;
      this.playerPos.anims.play('playerPos', true);

      if (cursors.left.isDown) {

        this.player.body.setVelocityX(-80);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y, keyboard: 'left'});
      } else if (cursors.right.isDown) {

        this.player.body.setVelocityX(80);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y, keyboard: 'right'});
      } else {
        this.player.x = Phaser.Math.Snap.To(this.player.x, 8);
      }
      if (cursors.up.isDown) {

        this.player.body.setVelocityY(-80);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y, keyboard: 'up'});
      } else if (cursors.down.isDown) {

        this.player.body.setVelocityY(80);
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y, keyboard: 'down'});
      } else {
        this.player.y = Phaser.Math.Snap.To(this.player.y, 8);
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
        this.coordinatesKeyboardEmit({x: this.player.x, y: this.player.y, keyboard: 'stop'});
        this.player.anims.play('front', true);
      }

      this.coordinatesMouseReceive().then(coordinates => {
        if (coordinates) {
          this.target.x = coordinates.x;
          this.target.y = coordinates.y;
        }
      });

      // const currentTile = this.map.getTileAt(
      //   this.map.worldToTileX(this.player.x),
      //   this.map.worldToTileX(this.player.y),
      //   true,
      //   this.aboveLayer
      // );
      //
      // if (currentTile.properties.protected) {
      //   this.marker.x = currentTile.x;
      //   this.marker.y = currentTile.y;
      // }

    } else {
      this.coordinatesKeyboardReceive().then(coordinates => {
        if (coordinates) {
          this.player.x = coordinates.x;
          this.player.y = coordinates.y;

          if (coordinates.keyboard === 'left') {
            this.player.anims.play('left', true);
          } else if (coordinates.keyboard === 'right') {
            this.player.anims.play('right', true);
          } else if (coordinates.keyboard === 'up') {
            this.player.anims.play('back', true);
          } else if (coordinates.keyboard === 'down') {
            this.player.anims.play('front', true);
          } else {
            this.player.anims.play('front', true);
          }
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

  getTheGoldenOrb (_player, _orb) {
    _orb.disableBody(true, true);

    // this.player1Score += 1;
    // this.player1ScoreText.setText('Player1: ' + this.player1Score);
    this.events.emit('addScorePlayer1');
  }

  killThePlayer = (_player, _target) => {
    const currentTile = this.map.getTileAt(
      this.map.worldToTileX(this.player.x),
      this.map.worldToTileX(this.player.y),
      true,
      this.aboveLayer
    );

    if (!currentTile.properties.protected) {
      this.coordinatesMouseReceive().then(coordinates => {
        if (coordinates) {
          if (coordinates.isDown && !this.protected) {
            // _player.disableBody(true, true);
            this.events.emit('addScorePlayer2');
          }
        }
      });
    }




  }
}
