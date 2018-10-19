export function getPhysics() {
  this.physics.add.overlap(
    this.player,
    this.orb,
    this.getTheGoldenOrb,
    null,
    this
  );
  this.physics.add.overlap(
    this.player,
    this.target,
    this.killThePlayer,
    null,
    this
  );
  this.physics.add.collider(this.player, this.worldLayer);
  this.physics.world.setBounds(
    0,
    0,
    this.map.widthInPixels,
    this.map.heightInPixels,
    true,
    true,
    true,
    true
  );
}
