import Phaser from 'phaser';
import flea1 from '../assets/flea1.png';
import flea2 from '../assets/flea2.png';
import flea3 from '../assets/flea3.png';
import flea4 from '../assets/flea4.png';
import flea5 from '../assets/flea5.png';
import flea6 from '../assets/flea6.png';

export default class Flea {
    constructor(scene, value) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(
            Phaser.Math.Between(0, 600),
            Phaser.Math.Between(0, 800),
            `flea${value}`
        );
        this.sprite.setSize(32, 48, false);
        this.sprite.body.setMaxVelocity(Phaser.Math.Between(0, 1000));
        this.sprite.setCollideWorldBounds(true);
    }

    static load(ref, index) {
        ref.load.spritesheet('flea1', flea1, {
            frameWidth: 26,
            frameHeight: 25,
        });
        ref.load.spritesheet('flea2', flea2, {
            frameWidth: 26,
            frameHeight: 25,
        });
        ref.load.spritesheet('flea3', flea3, {
            frameWidth: 26,
            frameHeight: 25,
        });
        ref.load.spritesheet('flea4', flea4, {
            frameWidth: 26,
            frameHeight: 25,
        });
        ref.load.spritesheet('flea5', flea5, {
            frameWidth: 26,
            frameHeight: 25,
        });
        ref.load.spritesheet('flea6', flea6, {
            frameWidth: 26,
            frameHeight: 25,
        });
    }
}
