import rat from '../assets/rat.png';

export default class Rat {
    load(ref) {
        ref.load.spritesheet('rat', rat, {
            frameWidth: 32,
            frameHeight: 32,
        });
    }

    create(ref) {
        ref.anims.create({
            key: 'left',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        ref.anims.create({
            key: 'turn',
            frames: [{ key: 'rat', frame: 4 }],
            frameRate: 20,
        });

        ref.anims.create({
            key: 'down',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 3,
                end: 6,
            }),
            frameRate: 20,
        });

        ref.anims.create({
            key: 'up',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 6,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        ref.anims.create({
            key: 'right',
            frames: ref.anims.generateFrameNumbers('rat', {
                start: 8,
                end: 11,
            }),
            frameRate: 10,
            repeat: -1,
        });
    }

    sprite(ref, x, y) {
        return ref.physics.add.sprite(x, y, 'rat');
    }

    getHitted() {
        this.player.setTint(0xff0000);
    }
}
