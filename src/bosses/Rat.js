import Phaser from 'phaser';
import rat from '../assets/rat.png';

export default class Rat {
    constructor(scene) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(
            Phaser.Math.Between(0, 600),
            Phaser.Math.Between(0, 800),
            'rat'
        );
        this.sprite.setSize(32, 48, false);
        this.sprite.body.setMaxVelocity(Phaser.Math.Between(0, 1000));
        this.sprite.setCollideWorldBounds(true);
    }

    static load(ref) {
        ref.load.spritesheet('rat', rat, {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    static create(ref) {
        ref.anims.create({
            key: 'RatLeft',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
        });

        ref.anims.create({
            key: 'RatTurn',
            frames: [{ key: 'rat', frame: 4 }],
        });

        ref.anims.create({
            key: 'RatDown',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 3,
                end: 6,
            }),
            frameRate: 10,
        });

        ref.anims.create({
            key: 'RatUp',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 6,
                end: 8,
            }),
            frameRate: 10,
        });

        ref.anims.create({
            key: 'RatRight',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 8,
                end: 11,
            }),
            frameRate: 10,
        });
    }

    getHitted() {
        this.player.setTint(0xff0000);
    }
}
