import Phaser from 'phaser';
import Bg from '../assets/bgMG.png';
import smallBgEffect from '../assets/smallBgEffect.png';

export default class Background {
    constructor(scene) {
        this.scene = scene;

        this.scene.background = this.scene.add.tileSprite(
            0,
            0,
            this.scene.game.config.width,
            this.scene.game.config.height,
            'background'
        );

        this.scene.smallBgEffect = this.scene.add.group({
            key: 'star',
            frameQuantity: 1500,
        });

        // Set its pivot to the top left corner
        this.scene.background.setOrigin(0, 0);
        // fixe it so it won't move when the camera moves.
        // Instead we are moving its texture on the update
        this.scene.background.setScrollFactor(0);
    }

    static load(ref) {
        ref.load.image('background', Bg);
        // ref.load.image('star', smallBgEffect);
    }

    update(ref) {
        // scroll the texture of the tilesprites proportionally to the camera scroll
        ref.background.tilePositionY = ref.playerCam.scrollY * 0.3;
    }
}
