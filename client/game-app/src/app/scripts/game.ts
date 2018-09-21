import 'phaser';
import { GameScene } from './scenes/gameScene';
import { BootScene } from './scenes/bootScene';


const config: GameConfig = {
  version: '1.0',
  width: window.innerWidth,
  height: window.innerHeight,
  zoom: 3,
  type: Phaser.AUTO,
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 }
    }
  },
  scene: [GameScene],
  input: {
    keyboard: true,
    mouse: true,
    touch: false,
    gamepad: false
  },
  backgroundColor: '#000000',
  pixelArt: true,
  antialias: false
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

// window.onload = () => {
//   const game = new Game(config);
// };

export const loadGame = () => {
  return new Game(config);
};
