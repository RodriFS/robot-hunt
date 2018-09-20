import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';
const data_json = require('../../assets/map.json');
import { loadGame } from '../scripts/game';


@Component({
  selector: 'app-in-game',
  templateUrl: './in-game.component.html',
  styleUrls: ['./in-game.component.css']
})
export class InGameComponent implements OnInit {

  // constructor() {}
  //
  ngOnInit() {
    this.game = loadGame();
  }
}
