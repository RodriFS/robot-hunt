export function getPlayer2() {
  this.light = this.physics.add.image(400, 400, 'target').setScale(0.5);
  this.target = this.physics.add.image(400, 400, 'target').setScale(0.01);
  this.target.setDepth(20);
  this.light.setDepth(19);
  this.light.alpha = 0.65;
  this.target.alpha = 0;
}

export function updatePlayer2() {
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

    this.physics.moveTo(
      this.target,
      this.input.x + this.cameras.main.scrollX,
      this.input.y + this.camera.scrollY,
      null,
      20
    );
    this.physics.moveTo(
      this.light,
      this.input.x + this.cameras.main.scrollX,
      this.input.y + this.camera.scrollY,
      null,
      20
    );
  }
}
