import Phaser from 'phaser';
import Background from './background/Background.js';
import Player from './player/Player.js';
import Rat from './bosses/Rat.js';
import HealthBar from './health-bar/HealthBar.js';
import Bomb from './assets/bomb.png';
import Projectile from './assets/bullet.png';
import MovementsController from './control-movements/MovementsController.js';

export default class PlagueHell extends Phaser.Scene {
    constructor() {
        super();

        this.cursors = {};
        this.gameOver = false;
        this.hp;
        this.player;
        this.playerCam;
        this.score = 0;
        this.gameOver = false;
        this.scoreText;
        this.bombs;
    }

    preload() {
        Background.load(this);
        Player.load(this);
        Rat.load(this);
        this.load.image('bullet', Projectile);
        this.load.image('bomb', Bomb);
    }

    create() {
        // Groups
        this.bombs = this.physics.add.group();
        this.rats = this.physics.add.group();

        // this.playerGroup = this.physics.add.group();

        // Instances
        this.background = new Background(this);
        this.player = new Player(this, 0, 500);
        // this.rat = new Rat(this, 200, 400);
        this.hp = new HealthBar(this, 15, 555);
        this.movementController = new MovementsController();

        // creates
        this.player.create();
        Rat.create(this);

        // Colisions
        this.physics.add.collider(
            this.player.sprite,
            this.bombs,
            this.hitPlayer,
            null,
            this
        );
        this.physics.add.collider(
            this.player.sprite,
            this.rats,
            this.hitPlayer,
            null,
            this
        );
        this.physics.add.collider(
            this.player.bullets,
            this.rats,
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
        // var x =
        //     this.player.x < 400
        //         ? Phaser.Math.Between(400, 800)
        //         : Phaser.Math.Between(0, 400);

        // this.createBombsTimer(this);
        this.createRatSpawn(this);
    }

    update(time) {
        if (this.gameOver) {
            this.scene.restart();
            this.physics.resume();
            this.gameOver = false;
        }

        this.player.actions(time);

        this.background.update();
        this.movementController.move(
            this.rats,
            this.player.sprite,
            this,
            'Rat'
        );
    }

    hitPlayer(player, element) {
        this.player.sprite.setTint(0xff0000);
        element.destroy();
        this.sound.add('hitPlayer').play();

        if (this.hp.decrease(10)) {
            this.physics.pause();

            this.player.sprite.anims.play('turn');

            this.gameOver = true;
        }

        setTimeout(() => this.player.sprite.setTint(0xffffff), 200);
    }

    shootBomb(bullet, bomb) {
        bomb.destroy();
    }

    createRatSpawn(scene) {
        scene.time.addEvent({
            delay: 3000,
            callback: function () {
                // if (this.rats.getChildren().length < 2) {
                this.createRat(
                    Phaser.Math.Between(0, 640),
                    Phaser.Math.Between(0, 480)
                );
                // }
            },
            repeat: -1,
            callbackScope: this,
        });
    }

    createBombsTimer(scene) {
        scene.time.addEvent({
            delay: 5000,
            callback: function () {
                if (this.bombs.getChildren().length < 5) {
                    this.createBomb();
                }
            },
            repeat: -1,
            callbackScope: this,
        });
    }

    createRat() {
        let rat = this.rats.getFirstDead();

        if (rat == null) {
            rat = this.rats.create(
                Phaser.Math.Between(0, 640),
                Phaser.Math.Between(0, 480),
                'rat'
            );
            this.rats.add(rat);
        }

        rat.setBounce(1);
        rat.setCollideWorldBounds(true);
        rat.setVelocity(Phaser.Math.Between(-200, 200), 20);
        rat.allowGravity = false;
    }

    createBomb(x, y) {
        var bomb = this.bombs.create(x, y, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}
