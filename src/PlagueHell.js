import Phaser from 'phaser';
import Background from './background/Background.js';
import Player from './player/Player.js';
import Rat from './bosses/Rat.js';
import HealthBar from './health-bar/HealthBar.js';
import Bomb from './assets/bomb.png';
import Projectile from './assets/bullet.png';
import MovementsController from './control-movements/MovementsController.js';
import Flea from './bosses/Flea.js';

export default class PlagueHell extends Phaser.Scene {
    constructor() {
        super('PlagueHell');

        this.cursors = {};
        this.gameOver = false;
        this.score = 0;
        this.gameOver = false;
        this.hp;
        this.player;
        this.playerCam;
        this.scoreText;
        this.bombs;
    }

    preload() {
        Background.load(this);
        Player.load(this);
        Rat.load(this);
        Flea.load(this);
        this.load.image('bullet', Projectile);
        this.load.image('bomb', Bomb);
    }

    create() {
        // Groups
        this.rats = this.physics.add.group();
        this.fleas = this.physics.add.group();

        // this.playerGroup = this.physics.add.group();

        // Instances
        this.backgroundImage = new Background(this);
        this.player = new Player(this, 0, 500);
        // this.rat = new Rat(this, 200, 400);
        this.hp = new HealthBar(this, 15, 555);
        this.movementController = new MovementsController();

        // creates
        this.player.create();
        Rat.create(this);

        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000',
        });

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
            this.killRat,
            null,
            this
        );
        this.physics.add.collider(
            this.player.bullets,
            this.fleas,
            this.killFlea,
            null,
            this
        );
        this.physics.add.collider(
            this.player.sprite,
            this.fleas,
            this.hitPlayer,
            null,
            this
        );

        // Keyboard events
        const up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        const left = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        const down = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        const right = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );
        // const space = this.input.keyboard.addKeys(
        //     Phaser.Input.Keyboard.KeyCodes.SHIFT
        // );

        // this.cursors = { up, left, down, right, space };
        this.cursors = {
            ...this.input.keyboard.createCursorKeys(),
            up,
            left,
            down,
            right,
        };

        // this.cursorPlus = this.add.image(0, 0, 'CursorPlus').setVisible(false);
        // this.input.on(
        //     'pointermove',
        //     function (pointer) {
        //         this.cursorPlus
        //             .setVisible(true)
        //             .setPosition(pointer.x, pointer.y);
        //     },
        //     this
        // );

        this.playerCam = this.cameras.main;
        // this.playerCam.startFollow(this.player.sprite);
        // this.playerCam.setBounds(
        //     0,
        //     0,
        //     this.game.config.width,
        //     this.game.config.height * 3
        // );

        // var x =
        //     this.player.x < 400
        //         ? Phaser.Math.Between(400, 800)
        //         : Phaser.Math.Between(0, 400);
        this.createRatSpawn(this);

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.
        // this.game.input.activePointer.x = this.game.config.width / 2;
        // this.game.input.activePointer.y = this.game.config.height / 2 - 100;
    }

    update(time) {
        this.player.actions(time);

        this.movementController.move(
            this.rats,
            this.player.sprite,
            this,
            'Rat',
            true
        );
        this.movementController.move(
            this.fleas,
            this.player.sprite,
            this,
            'Flea'
        );

        this.backgroundImage.update(this);
    }

    hitPlayer(player, element) {
        this.player.sprite.setTint(0xff0000);
        element.destroy();
        this.sound.add('hitPlayer').play();

        if (this.hp.decrease(20)) {
            this.physics.pause();

            this.player.sprite.anims.play('turn');

            const score = this.score;
            this.score = 0;

            this.scene.start('GameOver', { score });
        }

        setTimeout(() => this.player.sprite.setTint(0xffffff), 200);
    }

    killFlea(bullet, rat) {
        rat.destroy();
        bullet.destroy();
    }

    killRat(bullet, rat) {
        rat.destroy();
        this.score += Number.parseInt(Math.random() * 10) * (rat.scale * 10);
        this.scoreText.setText('Score: ' + this.score);
        bullet.destroy();

        let num = rat.scaleX * 10 * rat.scale;
        for (let i = 0; i < num; i++) {
            this.createFlea(rat.x, rat.y, rat.scale);
        }

        this.playerCam.flash();
    }

    createRatSpawn(scene) {
        this.ratSpawnTimer = scene.time.addEvent({
            delay: 3000,
            callback: function () {
                this.createRat();
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
        let scale = Phaser.Math.Between(0.8, 1.4);

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
        rat.setVelocity(
            Phaser.Math.Between(-75, 100),
            Phaser.Math.Between(-75, 100)
        );
        rat.allowGravity = false;
        rat.setScale(scale);
    }

    createFlea(x, y, ratScale) {
        let flea = this.fleas.getFirstDead();
        let scale = (Math.round(Math.random() * 100) / 100) * (ratScale / 2);

        if (scale < 0.5) {
            scale += 0.5;
        }

        if (flea == null) {
            flea = this.fleas.create(x, y, `flea${Phaser.Math.Between(1, 6)}`);
            this.fleas.add(flea);
        }

        flea.setBounce(1);
        flea.setCollideWorldBounds(true);
        flea.setVelocity(
            Phaser.Math.Between(-125, 75),
            Phaser.Math.Between(-125, 75)
        );
        flea.allowGravity = false;
        flea.setScale(scale);
    }
}
