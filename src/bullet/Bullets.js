import Phaser from 'phaser';
import Bullet from './Bullet.js';

export default class Bullets extends Phaser.Scene.Arcade.Group {
    constructor(scene) {
        super();
        this.scene = scene;

        this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 20,
            runChildUpdate: true,
        });

        this.createMultiple({ quantity: 20, active: false });
    }
}
