import Phaser from 'phaser';

export default class MovementsController {
    move(ref, target, scene, name, animate) {
        ref.children.entries.forEach(function (child) {
            child.setAcceleration(
                Math.cos(target.rotation) * child.scale,
                Math.sin(target.rotation) * child.scale
            );

            if (animate) {
                if (child.body.velocity.x > 0) {
                    child.anims.play(`${name}Right`);
                } else {
                    child.anims.play(`${name}Left`);
                }

                if (child.body.velocity.y > 0) {
                    child.anims.play(`${name}Up`);
                } else {
                    child.anims.play(`${name}Down`);
                }

                if (child.body.velocity.x > 0 && child.body.velocity.y > 0) {
                    child.anims.play(`${name}Turn`);
                }
            }
        });
    }
}
