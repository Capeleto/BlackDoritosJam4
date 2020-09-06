import Phaser from 'phaser';
import PlagueHell from './PlagueHell.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: PlagueHell,
};

new Phaser.Game(config);
