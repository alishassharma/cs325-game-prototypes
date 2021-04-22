export class EndGame extends Phaser.Scene {

    constructor () {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'EndGame' );
    }

    create() {
        var levelText = this.add.text(50, 300, 'Congratulations! You completed 5/5 levels!', { fontSize: '28px', fill: '#000000' });
    }

    update() {
    }
}