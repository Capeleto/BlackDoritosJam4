import Phaser from 'phaser';

export default class MovementsController {
    move(ref, target, scene, name, animate) {
        ref.children.entries.forEach(function (child) {
            // child.setAcceleration(
            //     Math.cos(target.rotation) * 600,
            //     Math.sin(target.rotation) * 600
            // );

            // scene.physics.moveToObject(child, target, 100);
            // scene.physics.moveTo(
            //     child,
            //     target.x,
            //     target.y,
            //     Phaser.Math.Between(100, 200)
            // );

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
