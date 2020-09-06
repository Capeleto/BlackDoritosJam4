import Phaser from 'phaser';
import Background from './background/Background.js';
import Player from './player/Player.js';
import HealthBar from './health-bar/HealthBar.js';
import Bomb from './assets/bomb.png';
import Projectile from './assets/projectile.png';

export default class PlagueHell extends Phaser.Scene {
    constructor() {
        super();

        this.cursors = {};
        this.gameOver = false;
        this.hp;
        this.player;
        this.playerCam;
        this.bombs;
        this.score = 0;
        this.gameOver = false;
        this.scoreText;
        this.bombs;
    }

    preload() {
        Background.load(this);
        Player.load(this);
        this.load.image('bomb', Bomb);
        this.load.image('bullet', Projectile);
    }

    create() {
        // Groups
        this.bombs = this.physics.add.group();

        // this.playerGroup = this.physics.add.group();

        // Instances
        this.background = new Background(this);
        this.player = new Player(this, 0, 0);
        this.hp = new HealthBar(this, 15, 555);

        // creates
        this.player.create();

        // Colisions
        this.physics.add.collider(
            this.player,
            this.bombs,
            this.hitPlayer,
            null,
            this
        );
        this.physics.add.collider(
            this.player.bullets,
            this.bombs,
            this.shootBomb,
            null,
            this
        );

        // Keyboard events
        // const up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        // const left = this.input.keyboard.addKey(
        //     Phaser.Input.Keyboard.KeyCodes.A
        // );
        // const down = this.input.keyboard.addKey(
        //     Phaser.Input.Keyboard.KeyCodes.S
        // );
        // const right = this.input.keyboard.addKey(
        //     Phaser.Input.Keyboard.KeyCodes.D
        // );
        // const space = this.input.keyboard.addKeys(
        //     Phaser.Input.Keyboard.KeyCodes.SHIFT
        // );

        // this.cursors = { up, left, down, right, space };
        this.cursors = this.input.keyboard.createCursorKeys();

        // this.myCam = this.cameras.main;
        // this.myCam.startFollow(this.player.sprite);
        var x =
            this.player.x < 400
                ? Phaser.Math.Between(400, 800)
                : Phaser.Math.Between(0, 400);

        this.bomb = this.bombs.create(x, 16, 'bomb');
        this.bomb.setBounce(1);
        this.bomb.setCollideWorldBounds(true);
        this.bomb.setVelocity(Phaser.Math.Between(-300, 300), 20);
        this.bomb.allowGravity = false;
    }

    update(time) {
        if (this.gameOver) {
            this.scene.restart();
            this.physics.resume();
            this.gameOver = false;
        }

        this.player.actions(time);

        this.background.update();
    }

    hitPlayer(player, bomb) {
        this.player.setTint(0xff0000);
        this.sound.add('hitPlayer').play();

        if (this.hp.decrease(10)) {
            this.physics.pause();

            this.player.sprite.anims.play('turn');

            this.gameOver = true;
        }

        setTimeout(() => this.player.setTint(0xffffff), 200);
    }

    shootBomb(bullet, bomb) {
        bomb.disableBody(true, true);
    }
}
