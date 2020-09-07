import Phaser from 'phaser';
import PlagueHell from './PlagueHell.js';
import GameOver from './GameOver';
import StartGame from './StartGame.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            // debug: true,
        },
    },
    scene: [StartGame, PlagueHell, GameOver],
};

new Phaser.Game(config);
