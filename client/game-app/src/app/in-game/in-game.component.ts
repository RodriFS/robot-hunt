import { Component, OnInit } from '@angular/core';
window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');


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
      name: 'find-me-game'
      }
  var scene = {
        preload: preload,
        create: create,
        update: update,
        render: render
      }



  var player;
  var cursors;
  var game = new Phaser.Game(config.width, config.height, config.type, config.name, scene);


  function preload () {
    game.load.image('person', '../../assets/person_small.png');
  }

  function create () {
    game.world.setBounds(0,0,config.width, config.height);
    player = game.add.sprite(0, 0, 'person');
    game.camera.follow(player);
    cursors = game.input.keyboard.createCursorKeys();
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

  function render() {
    game.debug.cameraInfo(game.camera, 500, 32);
    game.debug.spriteCoords(player, 32, 32);

}
}
