import Phaser from 'phaser';
const data_json = require('../../../assets/map.json');

export class GameScene extends Phaser.Scene {

  player;
  orb;

  score = 0;
  scoreText;


  preload () {
    this.load.setBaseURL('../assets');
    this.load.image('person', 'person_small.png');
    this.load.image('orb', 'orb.png');
    this.load.image('tiles', 'map-tileset.png');
    this.load.tilemapTiledJSON('map', data_json);
  }

  create () {



    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('map-tileset', 'tiles');

    const belowLayer = map.createStaticLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    const aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0);
    aboveLayer.setDepth(10);

    this.player = this.physics.add.image(400, 300, 'person').setScale(0.5);
    this.orb = this.physics.add.image(500, 500, 'orb').setScale(0.2);
    this.player.setCollideWorldBounds(true);

    this.physics.add.overlap(this.player, this.orb, getTheGoldenOrb, null, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});

    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setCollisionFromCollisionGroup(true);
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.player, aboveLayer);

    // const camera = this.cameras.main;
    // camera.startFollow(player);
    // camera.setBounds(0, 0, config.width, config.heigth);

  }

  update(time, delta) {
    const speed = 175;
    const prevVelocity = this.player.body.velocity.clone();

    const cursors = this.input.keyboard.createCursorKeys();
    this.player.body.setVelocity(0);

    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-100);

    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(100);

    }

    if (cursors.up.isDown) {
      this.player.body.setVelocityY(-100);

    } else if (cursors.down.isDown) {
      this.player.body.setVelocityY(100);

    }
    this.player.body.velocity.normalize().scale(speed);
  }

  function getTheGoldenOrb (_player, _orb) {
    _orb.disableBody(true, true);

    this.score += 1;
    this.scoreText.setText('Score: ' + this.score);
  }

}
