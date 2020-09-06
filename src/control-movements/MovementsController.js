import Phaser from 'phaser';

export default class MovementsController {
    move(ref, target, scene, name) {
        ref.children.entries.forEach(function (child) {
            // rotate child to face towards target
            child.rotation = Phaser.Math.Angle.Between(
                child.x,
                child.y,
                target.x,
                target.y
            );
            child.setAcceleration(
                Math.cos(target.rotation) * 600,
                Math.sin(target.rotation) * 600
            );

            scene.physics.moveToObject(child, target, 100);

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
        });

        // setTimeout(() => {
        //     ref.setVelocityX(0);
        //     ref.setVelocityY(0);
        // }, 500);
    }
}
