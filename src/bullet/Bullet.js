import Phaser from 'phaser';

const Bullet = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

        this.incX = 0;
        this.incY = 0;
        this.lifespan = 0;

        this.speed = Phaser.Math.GetSpeed(600, 1);
    },

    fire: function (x, y, direction)
    {
        this.setActive(true);
        this.setVisible(true);

        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(x, y);

        var xAxys = this.getXAxis(x, direction);
        var yAxis = this.getYAxis(y, direction);

        var angle = Phaser.Math.Angle.Between(x, y, xAxys, yAxis);

        this.setRotation(angle);

        this.incX = Math.cos(angle);
        this.incY = Math.sin(angle);

        this.lifespan = 1000;
    },

    update: function (time, delta)
    {
        this.lifespan -= delta;

        this.x -= this.incX * (this.speed * delta);
        this.y -= this.incY * (this.speed * delta);

        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    },

    getXAxis: function (x, direction) {
        if (direction.right) {
            return x - 50;
        } else if (direction.left) {
            return x + 50;
        }
    
        return x;
    },

    getYAxis: function (y, direction) {
        if (direction.up) {
            return y + 50;
        } else if (direction.down) {
            return y - 50;
        }
    
        return y;
    }

});

export default Bullet;