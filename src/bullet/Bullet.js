import Phaser from 'phaser';

const Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize: function Bullet(scene) {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.speed = Phaser.Math.GetSpeed(600, 1);
    },

    fire: function (x, y, direction) {
        this.setActive(true);
        this.setVisible(true);

        this.setPosition(x, y - 10);
    },

    update: function (time, delta) {
        this.y -= this.speed * delta;

        if (this.y < -50)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    },
});

export default Bullet;
