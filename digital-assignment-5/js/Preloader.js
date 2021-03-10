export class Preloader extends Phaser.Scene {

    constructor() {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'Preloader' );
        
        this.background = null;
        this.preloaderBar = null;
        
        this.ready = false;
    }

    preload() {
        //	These are the assets we loaded in Boot.js
        //	A nice sparkly background and a loading progress bar
        this.background = this.add.image( 0,0, 'preloaderBackground' ).setOrigin(0,0);
        this.preloaderBar = this.add.image( this.cameras.main.centerX, this.cameras.main.centerY, 'preloaderBar' ).setScale(0.5);

        //	Crop the `preloaderBar` sprite from 0 to full-width
        //	as the files below are loaded in.
        this.load.on( 'progress', function( value ) {
            this.scene.preloaderBar.setCrop( 0, 0, this.scene.preloaderBar.width*value, this.scene.preloaderBar.height );
            });
        this.load.on( 'complete', function() {
            this.scene.preloaderBar.destroy();
            });

        //	Here we load the rest of the assets our game needs.
        //	As this is just a Project Template I've not provided these assets, swap them for your own.
        this.load.image('titlePage', 'assets/MainMenuOasis2.png');
        this.load.atlas('playButton', 'assets/play_button_redone.png', 'assets/play_button.json');
        //this.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
        this.load.audio('titleMusic', ['assets/MainMenuSong.mp3']);
        //	+ lots of other required assets here
        this.load.image( 'logo', 'assets/phaser.png' );
        this.load.image( 'tumbleweed1', 'assets/tumbleweed.png');
        this.load.image( 'oasis', 'assets/oasis.png');
        this.load.image( 'ground', 'assets/ground.png');
        this.load.image( 'fireballsfire', 'assets/fireball.png');
        this.load.audio( 'music', 'assets/music.mp3');
        this.load.audio( 'win', 'assets/win.wav');
        this.load.audio( 'lose', 'assets/lose.wav');
        this.load.spritesheet( 'player', 'assets/man.png', {frameWidth: 37, frameHeight: 57});
        this.load.spritesheet( 'enemy', 'assets/scorp.png', {frameWidth: 60, frameHeight: 45});
    }

    create() {
        //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.preloaderBar.setCrop();
    }

    update() {
        //	You don't actually need to do this, but I find it gives a much smoother game experience.
        //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //	You can jump right into the menu if you want and still play the music, but you'll have a few
        //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //	it's best to wait for it to decode here first, then carry on.
        
        //	If you don't have any music in your game then put the `this.scene.start()` call in the `create` function and delete
        //	the `update()` function completely.
        
        if( /* this.cache.isSoundDecoded('titleMusic') && */ this.ready === false )
        {
            this.ready = true;
            this.scene.start('MainMenu');
        }
    }

}
