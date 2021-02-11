import "./phaser.js";

// By: Alisha Sharma

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var cursors;
var player;


function preload()
{
    // preloads all of the assets
    this.load.image( 'ground', 'assets/grayplatform.png');
    this.load.image( 'lab', 'assets/labbackground.png');
    this.load.image( 'platform1', 'assets/platform1.png');
    this.load.image( 'platform2', 'assets/platform2.png');
    this.load.image( 'platform3', 'assets/platform3.png');
    this.load.image( 'door', 'assets/door.png');
    this.load.image( 'controlPanel', 'assets/controlpanel.png');
    this.load.audio( 'music', 'assets/music.mp3');
    this.load.audio( 'collectBeaker', 'assets/collectBeaker.wav');
    this.load.audio( 'portalSound', 'assets/portalSound.wav');
    this.load.audio( 'hitAlien', 'assets/hitAlien.wav');
    this.load.image( 'beaker', 'assets/blueBeaker.png');
    this.load.image( 'greatBeaker', 'assets/greenBeaker.png');
    this.load.image ('redBeaker', 'assets/redBeaker.png');
    this.load.image( 'crate', 'assets/crate.png');
    this.load.spritesheet( 'chemist', 'assets/chemist.png', {frameWidth: 34, frameHeight: 52});
    this.load.image( 'alien', 'assets/alien.png');
    this.load.spritesheet( 'portal', 'assets/portal.png', {frameWidth: 250, frameHeight: 592});

}

// defines some variables
var platforms;
var beakers;
var portal;
var checkpointBeaker;
var crates;
var score = 0;
var scoreText;
var gameOverText;
var gameWinText;
var alien;
var beakerSound;
var portalSound;
var alienHitSound;
var music;

function create() {

    // starts by fading in
    this.cameras.main.fadeIn(6000);

    // adds the background, music, and platforms
    // platform code inspired by: https://phaser.io/tutorials/making-your-first-phaser-3-game
    music = this.sound.add('music');
    beakerSound = this.sound.add('collectBeaker');
    portalSound = this.sound.add('portalSound');
    alienHitSound = this.sound.add('hitAlien');
    music.play();
    this.add.image(400, 300, 'lab');
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(200, 160, 'platform1');
    platforms.create(600, 350, 'platform2');
    platforms.create(150, 400, 'platform3');
    this.add.image(650, 488, 'door').setScale(.5);
    this.add.image(570, 470, 'controlPanel').setScale(0.3);

    // adds crates
    crates = this.physics.add.group();
    crates.enablebody = true;
    crates.physicsBodyType = Phaser.Physics.ARCADE;

    var crate = crates.create(400, 485, 'crate').setScale(0.17);
    crate.body.gravity.y = 200;
    crate.body.bounce.y = 0.3;
    crate.body.bounce.x = 0.6;
    crate.setCollideWorldBounds(true);
    crate.setDragX(300);

    var crate2 = crates.create(200, 300, 'crate').setScale(0.17);
    crate2.body.gravity.y = 200;
    crate2.body.bounce.y = 0.3;
    crate2.body.bounce.x = 0.6;
    crate2.setCollideWorldBounds(true);
    crate2.setDragX(300);

    // adds beakers
    // beaker code inspired by: https://phaser.io/tutorials/making-your-first-phaser-3-game
    beakers = this.physics.add.group();
    beakers.enableBody = true;
    beakers.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 6; i++) {
        if (i % 5 == 0) {
            continue;
        }
        var beaker = beakers.create(80 * i, 0, 'beaker').setScale(0.1);
        beaker.body.gravity.y = 200;

        beaker.body.bounce.y = 0.3;
    }

    for (var i = 7; i < 8; i++) {
        if (i % 5 == 0) {
            continue;
        }
        var beaker = beakers.create(73 * i, 0, 'beaker').setScale(0.1);
        beaker.body.gravity.y = 200;

        beaker.body.bounce.y = 0.3;
    }

    // adds special beaker and checkpoint beaker
    var specialBeaker = beakers.create(80, 300, 'greatBeaker').setScale(0.1);
    specialBeaker.body.gravity.y = 200;
    beaker.body.bounce.y = 0.3;

    checkpointBeaker = this.physics.add.group();

    var aCheckPointBeaker = checkpointBeaker.create(690, 300, 'redBeaker').setScale(0.1);
    aCheckPointBeaker.body.gravity.y = 200;
    aCheckPointBeaker.body.bounce.y = 0.3;

    // adds player
    player = this.physics.add.sprite(650, 488, 'chemist');
    player.body.gravity.y = 530;
    player.body.bounce.y = 0.1;
    player.setCollideWorldBounds(true);

    // animations defined - code inspired by sprite animation creation from https://phaser.io/tutorials/making-your-first-phaser-3-game
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('chemist', { start: 4, end: 7 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'chemist', frame: 0 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('chemist', { start: 8, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    // defines enemies (aliens)
    alien = this.physics.add.group();
    var alien1 = alien.create(605, 250, 'alien').setScale(0.2);
    alien1.body.gravity.y = 1000;
    alien1.body.bounce.y = 0;
    alien1.setBounce(1);
    alien1.setCollideWorldBounds(true);

    // adds in game text
    scoreText = this.add.text(550, 100, 'Score: 0', { fontSize: '32px', fill: '#FFFFFF' });
    gameOverText = this.add.text(50, 300, 'Game Over! You Died!', { fontSize: '60px', fill: '#FF0000' });
    gameOverText.visible = false;
    var introText = this.add.text(195, 18, 'Hurry up! Help this chemist escape his alien infested lab!', { fontSize: '12px', fill: '#FFFFFF' });
    var introText2 = this.add.text(295, 35, 'Collect all beakers to escape!', { fontSize: '12px', fill: '#FFFFFF' });
    cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({
        key: 'movingPortal',
        frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
    });

    // adds portal in game
    portal = this.physics.add.sprite(150, 335, 'portal').setScale(0.2);
    portal.anims.play('movingPortal', true);
    portal.visible = false;

    // adds colliders and overlaps for different elements
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(beakers, platforms);
    this.physics.add.collider(crates, platforms);
    this.physics.add.collider(crates, player);
    this.physics.add.collider(crates, crates);
    this.physics.add.collider(alien, platforms);
    this.physics.add.collider(checkpointBeaker, platforms);
    this.physics.add.overlap(player, checkpointBeaker, playerCheckpoint, null, this);
    this.physics.add.collider(alien, player, hitAlien, null, this);
    this.physics.add.overlap(player, beakers, collectBeaker, null, this);

}


function update() {

    // if the score reaches 110, this means the player can now escape
    if (score == 110) {
        var controlPanelMssg = this.add.text(370, 150, 'Escape through the portal!', { fontSize: '13px', fill: '#00FF00' });
        portal.visible = true;

    }

    // cursor code taken from https://phaser.io/tutorials/making-your-first-phaser-3-game
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

// function for when a player collects a beaker
function collectBeaker (player, beaker) {
    beaker.disableBody(true, true);
    beakerSound.play();
    score += 10;
    scoreText.setText('Score: ' + score);
}

// function for when a player touches an alien
function hitAlien (player, alien) {
    this.physics.pause();
    music.stop();
    alienHitSound.play();
    player.setTint(0xff0000);
    gameOverText.visible = true;
}

// function for when a checkpoint is reached
function playerCheckpoint (player, checkpointBeaker) {
    this.physics.add.overlap(player, portal, portalEndGame, null, this);
    checkpointBeaker.disableBody(true, true);
    score += 50;
    scoreText.setText('Score: ' + score);
    platforms.create(370, 250, 'platform2');
    gameWinText = this.add.text(50, 300, 'You Won!', { fontSize: '60px', fill: '#0000FF' });
    gameWinText.visible = false;
    var alien2 = alien.create(220, 330, 'alien').setScale(0.2);
    alien2.body.gravity.y = 1000;
    alien2.body.bounce.y = 0;
    alien2.setBounce(1);
    alien2.setCollideWorldBounds(true);

    var alien3 = alien.create(80, 330, 'alien').setScale(0.2);
    alien3.body.gravity.y = 1000;
    alien3.body.bounce.y = 0;
    alien3.setBounce(1);
    alien3.setCollideWorldBounds(true);
}

// function for the portal to end the game when touched
function portalEndGame (player, portal) {
    this.physics.pause();
    music.stop();
    portalSound.play();
    player.setTint(0x0000ff);
    gameWinText.setDepth(2);
    gameWinText.visible = true;
    this.cameras.main.fadeOut(7000, 0, 0, 0)
}