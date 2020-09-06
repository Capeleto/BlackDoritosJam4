import PlagueDoctor from '../assets/PlagueDoctor16.png';
import Bullet from '../bullet/Bullet.js';
import Hit from '../assets/hit.mp3';

const DIRECTIONS = {
    UP: 'up',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
};

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.direction = {};
        this.lastFired = 0;
        this.fireRate = 100;
        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 20,
            runChildUpdate: true,
        });

        this.bullets.createMultiple({ quantity: 20, active: false });

        // Add sprite
        this.sprite = scene.physics.add.sprite(x, y, 'playerBody');
        // .setScale(0.3, 0.3)
        // .setOrigin(0.5, 0.5)
        // .setImmovable();

        this.sprite.setSize(32, 48, false);
        this.sprite.body.setMaxVelocity(300);

        // player lives
        this.sprite.lives = 3;

        // Add sprite weapon
        this.sprite.bulletMax = 30;

        //  Player physics properties. Give the little guy a slight bounce.
        this.sprite.setBounce(0.2);
        this.sprite.setCollideWorldBounds(true);
    }

    static load(ref) {
        ref.load.spritesheet('playerBody', PlagueDoctor, {
            frameWidth: 32,
            frameHeight: 48,
        });
        ref.load.audio('hitPlayer', Hit);
    }

    create() {
        const scene = this.scene;

        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('playerBody', {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
        });

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('playerBody', {
                start: 4,
                end: 6,
            }),
            frameRate: 10,
        });

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('playerBody', {
                start: 7,
                end: 9,
            }),
            frameRate: 10,
        });

        scene.anims.create({
            key: 'turn',
            frames: [{ key: 'playerBody', frame: 2 }],
            frameRate: 10,
        });

        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('playerBody', {
                start: 10,
                end: 13,
            }),
            frameRate: 10,
        });
    }

    hit() {
        this.player.setTint(0xff0000);
    }

    actions(time) {
        const sprite = this.sprite;
        const cursors = this.scene.cursors;

        if (cursors.up.isDown) {
            sprite.setVelocityY(-200);
            sprite.anims.play('up', true);
        }
        if (cursors.down.isDown) {
            sprite.setVelocityY(200);
            sprite.anims.play('down', true);
        }

        if (cursors.left.isDown) {
            sprite.setVelocityX(-200);
            sprite.anims.play('left', true);
        }
        if (cursors.right.isDown) {
            sprite.setVelocityX(200);
            sprite.anims.play('right', true);
        }

        if (this.checkCursorDown(cursors)) {
            sprite.setVelocityX(0);
            sprite.setVelocityY(0);

            sprite.anims.play('turn');
        }

        if (cursors.space.isDown) {
            if (time > this.lastFired) {
                let bullet = this.bullets.get(
                    this.scene.player.sprite.x,
                    this.scene.player.sprite.y
                );

                if (bullet) {
                    bullet.fire(
                        this.scene.player.sprite.x,
                        this.scene.player.sprite.y,
                        this.direction
                    );

                    this.lastFired = time + this.fireRate;
                }
            }
        }
    }

    checkCursorDown(cursors) {
        return (
            !cursors.up.isDown &&
            !cursors.right.isDown &&
            !cursors.left.isDown &&
            !cursors.down.isDown
        );
    }
}
