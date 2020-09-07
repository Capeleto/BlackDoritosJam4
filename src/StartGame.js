import Phaser from 'phaser';
import Background from './background/Background.js';

export default class StartGame extends Phaser.Scene {
    constructor() {
        super('StartGame');
    }

    init(data) {
        this.score = data.score;
    }

    preload() {
        Background.load(this);
    }

    create() {
        this.background = new Background(this);

        this.gameOverText = this.add.text(150, 100, 'PLAGUE HELL', {
            fontSize: '80px',
            fill: '#000',
        });

        this.scoreText = this.add.text(270, 200, 'How to play', {
            fontSize: '40px',
            fill: '#000',
        });
        this.scoreText = this.add.text(260, 250, 'WASD to move', {
            fontSize: '40px',
            fill: '#000',
        });
        this.scoreText = this.add.text(215, 300, 'Spacebar to shoot', {
            fontSize: '40px',
            fill: '#000',
        });

        this.tryAgainText = this.add.text(
            160,
            450,
            'Press space to start ...',
            {
                fontSize: '32px',
                fill: '#000',
                bold: true,
            }
        );

        this.restartButton = this.input.keyboard.addKey('SPACE');
        this.restartButton.on('down', () => {
            this.scene.start('PlagueHell');
        });
    }
}
