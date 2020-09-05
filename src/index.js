import Phaser from 'phaser';
import sky from './assets/sky.png';
import platform from './assets/platform.png';
import star from './assets/star.png';
import bomb from './assets/bomb.png';
import projectile from './assets/bullet.png';
import Rat from './bosses/rat.js';
import HealthBar from './health-bar/HealthBar';
import Bullet from './bullet/Bullet';

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

let player;
let hp;
let stars;
let bombs;
let platforms;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;
let direction = {};
let bullets;

let lastFired = 0;
let fireRate = 200;

const DIRECTIONS = {
    Up: 'up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right',
};

let game = new Phaser.Game(config);
const rat = new Rat();

function preload() {
    this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.image('bullet', projectile);
    rat.load(this);
}

function create() {
    //  A simple background for our game
    this.add.image(400, 300, 'sky');
    rat.create(this);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 570, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = rat.sprite(this, 100, 300);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    bullets = this.physics.add.group({
        classType: Bullet,
        maxSize: 20,
        runChildUpdate: true
    });

    bullets.createMultiple({ quantity: 20, active: false });

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000',
    });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bullets, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    this.physics.add.collider(bullets, bombs, shootBomb, null, this);

    hp = new HealthBar(this, 15, 555);

    var x =
        player.x < 400
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
}

function update(time) {
    if (gameOver) {
        this.scene.restart();
        this.physics.resume();
        score = 0;
        gameOver = false;
    }

    player.setVelocity(0);

    if (cursors.up.isDown) {
        player.setVelocityY(-300);
        player.anims.play('up', true);
        updateDirection(DIRECTIONS.Up);
    } else if (cursors.down.isDown) {
        player.setVelocityY(300);
        player.anims.play('down', true);
        updateDirection(DIRECTIONS.Down);
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-300);
        player.anims.play('left', true);
        updateDirection(DIRECTIONS.Left);
    } else if (cursors.right.isDown) {
        player.setVelocityX(300);
        player.anims.play('right', true);
        updateDirection(DIRECTIONS.Right);
    }

    if (checkCursorDown()) {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.space.isDown) {
        if (time > lastFired) {
            var bullet = bullets.get(player.x, player.y);
        
            if (bullet)
            {
                bullet.fire(player.x, player.y, direction);
        
                lastFired = time + fireRate;
            }
        }
    } 
}

function checkCursorDown() {
    return (
        !cursors.up.isDown &&
        !cursors.right.isDown &&
        !cursors.left.isDown &&
        !cursors.down.isDown
    );
}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0) {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
}

function hitBomb(player, bomb) {
    player.setTint(0xff0000);
    
    if (hp.decrease(10)) {
        this.physics.pause();
        
        player.anims.play('turn');
    
        gameOver = true;
    }

    player.setTint(0xffffff);
}

function shootBomb(bullet, bomb) {
    bomb.disableBody(true, true);
 }

function updateDirection(newDirection) {
    switch (newDirection) {
        case DIRECTIONS.Up:
            direction.up = true;
            direction.down = false;
            direction.left = false;
            direction.right = false;
            break;
        case DIRECTIONS.Down:
            direction.up = false;
            direction.down = true;
            direction.left = false;
            direction.right = false;
            break;
        case DIRECTIONS.Left:
            direction.up = false;
            direction.down = false;
            direction.left = true;
            direction.right = false;
            break;
        case DIRECTIONS.Right:
            direction.up = false;
            direction.down = false;
            direction.left = false;
            direction.right = true;
            break;
        default:
            break;
    }

}
