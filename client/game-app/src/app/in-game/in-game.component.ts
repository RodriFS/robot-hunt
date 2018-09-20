import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
const data_json = require('../../assets/map.json');


@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {
  let config;
  config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    };


  let player;
  let orb;

  let score = 0;
  let scoreText;
  const game = new Phaser.Game(config);


  function preload () {
    this.load.setBaseURL('../assets');
    this.load.image('person', 'person_small.png');
    this.load.image('orb', 'orb.png');
    this.load.image('tiles', 'map-tileset.png');
    this.load.tilemapTiledJSON('map', data_json);
  }

  function create () {



    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('map-tileset', 'tiles');

    const belowLayer = map.createStaticLayer('Below Player', tileset, 0, 0);
    const worldLayer = map.createStaticLayer('World', tileset, 0, 0);
    const aboveLayer = map.createStaticLayer('Above Player', tileset, 0, 0);

    player = this.physics.add.image(400, 300, 'person').setScale(0.5);
    orb = this.physics.add.image(500, 500, 'orb').setScale(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.overlap(player, orb, getTheGoldenOrb, null, this);

    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    worldLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(player, worldLayer);

    // const camera = this.cameras.main;
    // camera.startFollow(player);
    // camera.setBounds(0, 0, config.width, config.heigth);

  }

  function update(time, delta) {
    const speed = 175;
    const prevVelocity = player.body.velocity.clone();

    const cursors = this.input.keyboard.createCursorKeys();
    player.body.setVelocity(0);

    if (cursors.left.isDown) {
      player.body.setVelocityX(-100);

    } else if (cursors.right.isDown) {
      player.body.setVelocityX(100);

    }

    if (cursors.up.isDown) {
      player.body.setVelocityY(-100);

    } else if (cursors.down.isDown) {
      player.body.setVelocityY(100);

    }
    player.body.velocity.normalize().scale(speed);
  }

  function getTheGoldenOrb (_player, _orb) {
    _orb.disableBody(true, true);

    score += 1;
    scoreText.setText('Score: ' + score);
  }
}
