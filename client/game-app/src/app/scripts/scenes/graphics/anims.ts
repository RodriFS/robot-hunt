export function getAnims() {
  this.anims.create({
    key: 'left',
    frames: [{ key: 'person', frame: 1 }, { key: 'person', frame: 19 }],
    frameRate: 2,
    repeat: -1
  });
  this.anims.create({
    key: 'right',
    frames: [{ key: 'person', frame: 0 }, { key: 'person', frame: 18 }],
    frameRate: 2,
    repeat: -1
  });
  this.anims.create({
    key: 'front',
    frames: [{ key: 'person', frame: 0 }, { key: 'person', frame: 18 }],
    frameRate: 2,
    repeat: -1
  });
  this.anims.create({
    key: 'back',
    frames: [{ key: 'person', frame: 1 }, { key: 'person', frame: 19 }],
    frameRate: 2,
    repeat: -1
  });

  if (this.playerName === 'player1') {
    this.anims.create({
      key: 'playerPos',
      frames: this.anims.generateFrameNumbers('playerPos', {
        start: 0,
        end: 8
      }),
      frameRate: 20
    });
  }
}
