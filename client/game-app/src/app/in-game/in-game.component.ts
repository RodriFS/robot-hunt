import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
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


  var player;
  var game = new Phaser.Game(config);


  function preload () {
    this.load.setBaseURL('../assets');
    this.load.image('person', 'person_small.png');
  }

  function create () {
    player = this.physics.add.image(400, 300, 'person');

    player.setCollideWorldBounds(true);
  }

  function update() {

    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      player.setVelocityX(-160);

    } else if (cursors.right.isDown) {
      player.setVelocityX(160);

    } else if (cursors.up.isDown) {
      player.setVelocityY(-160);

    } else if (cursors.down.isDown) {
      player.setVelocityY(160);

    } else {
      player.setVelocityY(0);
      player.setVelocityX(0);
    }
  }
}
