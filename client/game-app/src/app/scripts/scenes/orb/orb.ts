export function getOrb() {
  this.orbSpawnPoint = this.map.findObject('Objects', obj => obj.name === 'orbSpawn');
  this.orb = this.physics.add.image(this.orbSpawnPoint.x, this.orbSpawnPoint.y, 'orb');
}
