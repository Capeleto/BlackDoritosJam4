import Phaser from 'phaser';
import Background from './background/Background.js';

export default class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.score = data.score;
    }

    preload() {
        Background.load(this);
    }

    create() {
        this.background = new Background(this);

        this.gameOverText = this.add.text(190, 100, 'Game Over', {
            fontSize: '80px',
            fill: '#000',
        });

        this.scoreText = this.add.text(
            320,
            190,
            `Score: ${Math.round(this.score * 100) / 100}`,
            {
                fontSize: '32px',
                fill: '#000',
            }
        );

        this.tryAgainText = this.add.text(
            160,
            450,
            'Press space to try again...',
            {
                fontSize: '32px',
                fill: '#000',
            }
        );

        this.restartButton = this.input.keyboard.addKey('SPACE');
        this.restartButton.on('down', () => {
            this.scene.start('PlagueHell');
        });
    }
}
