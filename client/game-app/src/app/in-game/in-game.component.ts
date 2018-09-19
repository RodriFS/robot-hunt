import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
import data_json from '../../assets/map.json';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  var config = {
      type: Phaser.CANVAS,
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
        update: update,
        render: render
      }



  var player;
  var orb;
  var walls;

  var score = 0;
  var scoreText;
  var game = new Phaser.Game(config);


  function preload () {
    this.load.setBaseURL('../assets');
    this.load.image('person', 'person_small.png');
    this.load.image('path', 'path.png');
    this.load.image('walls', 'walls.png');
    this.load.image('orb', 'orb.png');
  }

  function create () {
    this.add.image(0, 0, 'path').setOrigin(0, 0).setScale(100);


    walls = this.physics.add.staticGroup();

    walls.create(400, 568, 'walls').setScale(2).refreshBody();
    walls.create(600, 400, 'walls');
    walls.create(50, 250, 'walls');
    walls.create(750, 220, 'walls');

    player = this.physics.add.image(400, 300, 'person');
    orb = this.physics.add.image(500, 500, 'orb').setScale(0.2);
    player.setCollideWorldBounds(true);

    this.physics.add.collider(player, walls);
    this.physics.add.overlap(player, orb, getTheGoldenOrb, null, this);

    scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill: '#000'});
  }

  function update() {

    if (cursors.left.isDown) {
      player.x -= 10;

    } else if (cursors.right.isDown) {
      player.x += 10;

    } else if (cursors.up.isDown) {
      player.y -= 10;

    } else if (cursors.down.isDown) {
      player.y += 10

    }

    game.world.wrap(player, 0, true);
  }

  function getTheGoldenOrb (player, orb) {
    orb.disableBody(true, true);

    score += 1;
    scoreText.setText('Score: ' + score);
  }
}
