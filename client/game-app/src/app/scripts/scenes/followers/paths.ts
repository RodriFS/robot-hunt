import * as Phaser from "phaser";

export function getPaths(): void {
  this.lines = this.map.findObject("Objects", (obj) => {
    if (obj.name === "smallpath") {
      this.path = new Phaser.Curves.Path(
        obj.polyline[0].x + obj.x,
        obj.polyline[0].y + obj.y
      );

      obj.polyline.forEach((line) => {
        this.path.lineTo(line.x + obj.x, line.y + obj.y);
      });

      const duration = this.path.curves.reduce((total = 0, line) => {
        const x1 = line.p0.x;
        const x2 = line.p1.x;
        const y1 = line.p0.y;
        const y2 = line.p1.y;
        return (
          total + (Math.sqrt(Math.pow(x2 - x1, 2) - Math.pow(y2 - y1, 2)) || 0)
        );
      }, 0);

      let delay = 0;

      Array(10)
        .fill(0)
        .forEach((x) => {
          const spacing = 500 * delay;
          if (delay % 5 === 0) {
            delay++;
          } else {
            delay += Math.floor(Math.random() * 10);
          }

          const follower = this.add
            .follower(this.path, 100, 100, "person")
            .setOrigin(0, 0);
          follower.startFollow({
            duration: 30000 + duration,
            positionOnPath: true,
            repeat: -1,
            ease: "Linear",
            delay: spacing,
            rotateToPath: true,
          });
          this.minions.push(follower);
        });
    }
  });
}

export function updateFollowers(): void {
  this.minions.forEach((follower) => {
    if (follower.anims) {
      if (follower.angle === -180) {
        follower.anims.play("left", true);
      } else if (follower.angle === 90) {
        follower.anims.play("front", true);
      } else if (follower.angle === -90) {
        follower.anims.play("back", true);
      } else if (follower.angle === 0) {
        follower.anims.play("right", true);
      }
      follower.angle = 0;
      this.minionCoords.push(follower.pathVector);
    }
  });
}
