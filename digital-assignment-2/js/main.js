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
var scorpions;
var timedEvent;
var firstTimer;
var startingText;
var gameStartingIn;
var startingInTime = 10;
var countdownTimer;
var gameOverText;
var gameTimeLeft = 20;
var timerText;
var gameTimer;
var startingTimer;
var music;
var winSound;
var loseSound;

function preload()
{
    // preload assets
    this.load.image( 'oasis', 'assets/oasis.png');
    this.load.image( 'ground', 'assets/ground.png');
    this.load.audio( 'music', 'assets/music.mp3');
    this.load.audio( 'win', 'assets/win.wav');
    this.load.audio( 'lose', 'assets/lose.wav');
    this.load.spritesheet( 'player', 'assets/man.png', {frameWidth: 37, frameHeight: 57});
    this.load.spritesheet( 'enemy', 'assets/scorp.png', {frameWidth: 60, frameHeight: 45});
}

function create() {

    // camera fades in
    this.cameras.main.fadeIn(6000);
    
    // creates background and music
    this.add.image(400, 300, 'oasis');
    music = this.sound.add('music');
    winSound = this.sound.add('win');
    loseSound = this.sound.add('lose');
    music.play({volume: 0.65});

    // defines the floor platform
    var platforms = this.physics.add.staticGroup();
    platforms.create(434, 554, 'ground').setScale(1).refreshBody();

    // creates different texts that will be visible throughout the game
    startingText = this.add.text(35, 530, 'Watch out above you! Avoid the falling scorpions for 20 seconds and you win!', { fontSize: '16px', fill: '#FFFFFF' });
    gameStartingIn = this.add.text(200, 550, 'Scorpions falling in 10 seconds!', { fontSize: '20px', fill: '#FF0000' });
    timerText = this.add.text(240, 550, '20 seconds left!', { fontSize: '32px', fill: '#FF0000' });
    timerText.visible = false;

    // creates the player
    player = this.physics.add.sprite(400, 300, 'player').setScale(1.7);
    player.body.gravity.y = 530;
    player.body.bounce.y = 0.1;
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();

    scorpions = this.physics.add.group();

    this.physics.add.overlap(player, scorpions, hitScorpion, null, this);

    // creates player and scorpion animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'attack',
        frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    // sets various timers for other timers and events
    // timed events code inspired by: http://examples.phaser.io/_site/view_full.html?d=time&f=basic+timed+event.js&t=basic%20timed%20event
    // timer properties: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/timer/
    // countdown timer inspiration: https://phaser.discourse.group/t/countdown-timer/2471/2
    gameOverText = this.add.text(43, 300, 'Game Over! You Died!', { fontSize: '60px', fill: '#FF0000' });
    gameOverText.visible = false;
    countdownTimer = this.time.addEvent({ delay: 1000, callback: countdown, callbackScope: this, loop: true });
    firstTimer = this.time.delayedCall(10000, startingGame, [], this);
    gameTimer = this.time.delayedCall(10000, startTimer, [], this);
}


function update() {

    // cursor code taken from https://phaser.io/tutorials/making-your-first-phaser-3-game
    if (cursors.left.isDown)
    {
        player.setVelocityX(-350);
        player.anims.play('left', true);
        // horizontal direction is flipped if character turns left
        player.flipX = true;
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(350);
        player.anims.play('right', true);
        player.flipX = false;
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-400);
    }
}
// spawns in scorpions 10 seconds after starting the game (when the 20 sec timer starts)
// Phaser.Math documentation: https://photonstorm.github.io/phaser3-docs/Phaser.Math.html
function spawnScorpions() {
        var scorpion = scorpions.create(Phaser.Math.Between(0, 750), 60, 'enemy');
        scorpion.body.gravity.y = 530;
        scorpion.body.bounce.y = 0.1;
        scorpion.anims.play('attack');
}
// if the player hits the scorpion, then it's game over
function hitScorpion() {
        player.setTint(0xff0000);
        timedEvent.destroy();
        startingTimer.destroy();
        gameOverText.visible = true;
        this.physics.pause();
        music.stop();
        loseSound.play({volume: 0.3});
}
// contains the loop for the scorpions to fall at a random location at the top of the map
function startingGame() {
    timedEvent = this.time.addEvent({ delay: 215, callback: spawnScorpions, callbackScope: this, loop: true});
}
// 10 sec countdown when loading the webpage
function countdown() {
    startingInTime -= 1;
    gameStartingIn.setText('Scorpions falling in ' + startingInTime + ' seconds!');
    if (startingInTime == 0) {
        gameStartingIn.visible = false;
        startingText.visible = false;
    }
}
// delayed timer which starts after the countdown timer is gone
function startTimer() {
    timerText.visible = true;
    startingTimer = this.time.addEvent({ delay: 1000, callback: startTwentySecs, callbackScope: this, loop: true});
}
// 20 sec timer that is for the duration of the game
// if the player survives all 20 seconds, they win!
function startTwentySecs() {
    gameTimeLeft -= 1;
    timerText.setText(gameTimeLeft + ' seconds left!');
    if (gameTimeLeft == 0) {
        startingTimer.destroy();
        timedEvent.destroy();
        var gameWinText = this.add.text(250, 300, 'You Won!', { fontSize: '60px', fill: '#0000FF' });
        player.setTint(0x0000ff);
        this.physics.pause();
        this.cameras.main.fadeOut(10000, 0, 0, 0);
        music.stop();
        winSound.play({volume: 0.3});
    }
}