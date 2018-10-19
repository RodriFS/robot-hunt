export function getPlayer1() {
  this.spawnPoint = this.map.findObject(
    'Objects',
    obj => obj.name === 'Spawn Point'
  );
  this.player = this.physics.add
    .sprite(this.spawnPoint.x, this.spawnPoint.y, 'person')
    .setOffset(0, 0);
  this.player.setCollideWorldBounds(true);
  if (this.playerName === 'player1') {
    this.playerPos = this.physics.add
      .sprite(this.spawnPoint.x, this.spawnPoint.y, 'playerPos')
      .setOffset(0, 0);
    this.playerPos.alpha = 0.3;
  }
}

export function updatePlayer1() {
  const speed = 100;
  const prevVelocity = this.player.body.velocity.clone();
  const cursors = this.input.keyboard.createCursorKeys();

  this.playerPos.x = this.player.x;
  this.playerPos.y = this.player.y;
  this.playerPos.anims.play('playerPos', true);
  this.player.body.setVelocity(0);

  if (cursors.left.isDown) {
    this.player.body.setVelocityX(-80);
    this.coordinatesKeyboardEmit({
      x: this.player.x,
      y: this.player.y,
      keyboard: 'left'
    });
  } else if (cursors.right.isDown) {
    this.player.body.setVelocityX(80);
    this.coordinatesKeyboardEmit({
      x: this.player.x,
      y: this.player.y,
      keyboard: 'right'
    });
  } else {
    this.player.x = Phaser.Math.Snap.To(this.player.x, 8);
  }
  if (cursors.up.isDown) {
    this.player.body.setVelocityY(-80);
    this.coordinatesKeyboardEmit({
      x: this.player.x,
      y: this.player.y,
      keyboard: 'up'
    });
  } else if (cursors.down.isDown) {
    this.player.body.setVelocityY(80);
    this.coordinatesKeyboardEmit({
      x: this.player.x,
      y: this.player.y,
      keyboard: 'down'
    });
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
    this.coordinatesKeyboardEmit({
      x: this.player.x,
      y: this.player.y,
      keyboard: 'stop'
    });
    this.player.anims.play('front', true);
  }

  this.coordinatesMouseReceive().then(coordinates => {
    if (coordinates) {
      this.target.x = coordinates.x;
      this.target.y = coordinates.y;
      this.light.x = coordinates.x;
      this.light.y = coordinates.y;
    }
  });

  const currentTile = this.map.getTileAt(
    this.map.worldToTileX(this.player.x),
    this.map.worldToTileX(this.player.y),
    true,
    this.aboveLayer
  );

  if (currentTile && currentTile.properties.protected) {
    this.marker.visible = true;
    this.marker.x = currentTile.x * 32;
    this.marker.y = currentTile.y * 32;
  } else {
    this.marker.visible = false;
  }
}
