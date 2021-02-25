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
var enemies;
var ocean;
var playerAlive = true;
var cannonballs;
var shootLeft;
var shootRight;
var timer;
var spawnEnemyBoats;
var treasure;
var spawnTreasures;
var rocks;
var spawnRocks;
var score;
var scoreCount = 0;
var music;
var cannonshoot;
var explosion;
var shipexplosion;
var pirateSound;
var gameOverText;
var directions;
var timeLasted;
var timer;
var gameMadeDifficult = false;
var gameBecomingIntense;
var removeText;
var collectEffect;
var shipIntegrity = 10;
var shipIntegrityText;
var gameEnded = false;
var integrityLost;

function preload()
{
    // preload assets
    this.load.image( 'water' , 'assets/water.png');
    this.load.image( 'treasure', 'assets/treasuree.png');
    this.load.image( 'player', 'assets/pirateship1.png');
    this.load.image('cannonball', 'assets/cannonball.png');
    this.load.image( 'enemies', 'assets/enemyship.png')
    this.load.image( 'rocks', 'assets/rocks.png');
    this.load.audio( 'music', 'assets/music.mp3');
    this.load.audio( 'shipExplosion', 'assets/shipexplosion.mp3');
    this.load.audio( 'cannonshoot', 'assets/cannonshoot.mp3');
    this.load.audio( 'pirateSound', 'assets/11.mp3')
    this.load.audio( 'collectEffect', 'assets/collecttreasure.mp3');
    this.load.spritesheet('explosion', 'assets/explosionfinal.png', {frameWidth: 149, frameHeight: 150});
}

function create() {


    // camera fades in
    this.cameras.main.fadeIn(6000);
    
    // creates background, music, and text - taken from DA2
    ocean = this.add.tileSprite(0, 0, 800, 600, 'water').setOrigin(0, 0).setScrollFactor(2);
    score = this.add.text(35, 35, 'Score: 0', { fontSize: '28px', fill: '#FFFFFF' });
    shipIntegrityText = this.add.text(35, 100, 'Ship Integrity: 10', { fontSize: '20px', fill: '#FFFFFF' });
    gameOverText = this.add.text(43, 300, 'Game Over! You Died!', { fontSize: '60px', fill: '#FF0000' });
    gameOverText.visible = false;
    integrityLost = this.add.text(90, 390, 'Your ship was destroyed by hitting too many rocks!', { fontSize: '20px', fill: '#FF0000' });
    integrityLost.visible = false;
    gameBecomingIntense = this.add.text(120, 300, 'Wave 2! Ships Incoming!', { fontSize: '40px', fill: '#FF0000' });
    gameBecomingIntense.visible = false;
    timeLasted = this.add.text(35, 70, 'Time Lasted: ', { fontSize: '20px', fill: '#FFFFFF' });
    directions = this.add.text(560, 570, 'X - Shoot Left, C - Shoot Right', { fontSize: '12px', fill: '#FFFFFF' });
    music = this.sound.add('music');
    music.play({volume: 0.65});

    cannonshoot = this.sound.add('cannonshoot');
    shipexplosion = this.sound.add('shipExplosion');
    pirateSound = this.sound.add('pirateSound');
    collectEffect = this.sound.add('collectEffect');

    // creates player
    player = this.physics.add.sprite(400, 500, 'player').setScale(0.15);
    player.setCollideWorldBounds(true);

    explosion = this.physics.add.group();
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 12 }),
        frameRate: 20,
    });

    // create enemies
    enemies = this.physics.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;

    // creates treasure and rocks
    treasure = this.physics.add.group();
    treasure.enableBody = true;
    treasure.physicsBodyType = Phaser.Physics.ARCADE;

    rocks = this.physics.add.group();
    rocks.enableBody = true;
    rocks.physicsBodyType = Phaser.Physics.ARCADE;

    // Shooting similar to code from: https://phaser.io/examples/v2/games/invaders
    cannonballs = this.physics.add.group();
    cannonballs.enableBody = true;

    // shoot left or right - own implementation - shooting sideways instead of forward
    shootLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    shootRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);


    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.overlap(player, treasure, collectTreasure, null, this);
    this.physics.add.collider(player, rocks, hitRocks, null, this);
    this.physics.add.collider(player, enemies, playerHit, null, this);

    this.physics.add.collider(enemies, cannonballs, shootShip, null, this);

    // timers - similar to DA2
    spawnEnemyBoats = this.time.addEvent({ delay: 1500, callback: createEnemies, callbackScope: this, loop: true});
    spawnTreasures = this.time.addEvent({ delay: 5000, callback: createTreasures, callbackScope: this, loop: true});
    spawnRocks = this.time.addEvent({ delay: Phaser.Math.Between(2000, 2500), callback: createRocks, callbackScope: this, loop: true});
    timer = this.time.addEvent({delay: 100000000});
    removeText = this.time.addEvent({delay: 100000000});
}

function update() {

    timeLasted.setText('Time Lasted: ' + parseInt(timer.getElapsedSeconds()) + ' seconds');

    if (parseInt(timer.getElapsedSeconds()) > 30 && gameMadeDifficult == false && playerAlive == true) {
        gameMadeDifficult = true;
        spawnEnemyBoats = this.time.addEvent({ delay: 800, callback: createEnemies, callbackScope: this, loop: true});
        gameBecomingIntense.visible = true;
        gameBecomingIntense.setDepth(2);
        removeText = this.time.delayedCall(4000, removingText, [], this);
    }

    if (shipIntegrity == 0 && gameEnded == false) {
        gameEnded = true;
        this.physics.pause();
        music.stop();
        spawnEnemyBoats.destroy();
        spawnRocks.destroy();
        spawnTreasures.destroy();
        timer.destroy();
        player.setTint(0xff0000);
        var playerexploded = explosion.create(player.x, player.y, 'explosion').setScale(1);
        playerexploded.play('explode');
        pirateSound.play({volume: 0.65});
        gameOverText.visible = true;
        gameOverText.setDepth(2);
        playerAlive = false;
        integrityLost.visible = true;
        integrityLost.setDepth(2);
        this.cameras.main.fadeOut(15000, 0, 0, 0)
    }

    // Scrolling background code taken from: https://phaser.io/examples/v2/games/invaders
    ocean.tilePositionY -= 1.5;

    // restricting gravity movement - code taken from: https://phaser.io/examples/v2/games/invaders
    if (playerAlive == true) {
        player.body.velocity.setTo(0.0);
        player.setVelocityY(50);
    }
    // cursor code taken from https://phaser.io/tutorials/making-your-first-phaser-3-game
    if (cursors.left.isDown)
    {
        player.setVelocityX(-150);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(150);
    }
    else if (cursors.up.isDown) {
        player.setVelocityY(-150);
    }
    else if (cursors.down.isDown) {
        player.setVelocityY(150);
    }

    if (Phaser.Input.Keyboard.JustDown(shootLeft)) {
        shootingLeft();
    }

    if (Phaser.Input.Keyboard.JustDown(shootRight)) {
        shootingRight();
    }
}

    function createEnemies() {

        // tween code inspired from Phaser 3 Tween example: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/tweens/tween%20sampler.js
        var enemy = enemies.create(Phaser.Math.Between(0, 750), 0, 'enemies');
        enemy.setVelocityY(100);
        this.tweens.add({
            targets: enemy,
            x: Phaser.Math.Between(0, 750),
            duration: 7000,
            repeat: -1,
            ease: 'Quadratic',
            yoyo: true,
            delay: 0
        });
        
    }

    function createTreasures() {
        var pieceOfTreasure = treasure.create(Phaser.Math.Between(0, 750), 0, 'treasure').setScale(0.1);
        pieceOfTreasure.setVelocityY(75);
        // tween code inspired from Phaser 3 Tween example: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/tweens/tween%20sampler.js
        this.tweens.add({
            targets: pieceOfTreasure,
            x: Phaser.Math.Between(0, 750),
            duration: 7000,
            repeat: -1,
            ease: 'Quadratic',
            yoyo: true,
            delay: 0
        });
    }
    
    function collectTreasure(player, treasure) {
        treasure.disableBody(true, true);
        scoreCount = scoreCount + 50;
        score.setText('Score: ' + scoreCount);
        collectEffect.play({volume: 1.3});
    }

    function createRocks() {
        var rock = rocks.create(Phaser.Math.Between(0, 750), 0, 'rocks').setScale(0.1);
        rock.setVelocityY(75);
        // tween code inspired from Phaser 3 Tween example: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/tweens/tween%20sampler.js
        this.tweens.add({
            targets: rock,
            x: Phaser.Math.Between(0, 750),
            duration: 7000,
            repeat: -1,
            ease: 'Quadratic',
            yoyo: true,
            delay: 0
        });
    }

    function hitRocks(player, rock) {
        rock.disableBody(true, true);
        scoreCount = scoreCount - 20;
        score.setText('Score: ' + scoreCount);
        player.setTintFill(0xffffff);
        var colorTime = this.time.delayedCall(80, clearPlayer, [], this);
        shipIntegrity = shipIntegrity - 1;
        shipIntegrityText.setText('Ship Integrity: ' + shipIntegrity);
    }

    function clearPlayer() {
        player.clearTint();
    }

    function shootingLeft() {
        var cannonball = cannonballs.create(player.x, player.y, 'cannonball').setScale(0.07);
        cannonball.body.velocity.x = -200;
        cannonshoot.play({volume: 1.8});
    }
    function shootingRight() {
        var cannonball = cannonballs.create(player.x, player.y, 'cannonball').setScale(0.07);
        cannonball.body.velocity.x = 200;
        cannonshoot.play({volume: 1.8});

    }

    function playerHit(player) {
        this.physics.pause();
        spawnEnemyBoats.destroy();
        spawnRocks.destroy();
        spawnTreasures.destroy();
        timer.destroy();
        player.setTint(0xff0000);
        var playerexploded = explosion.create(player.x, player.y, 'explosion').setScale(1);
        playerexploded.play('explode');
        music.stop();
        pirateSound.play({volume: 0.65});
        gameOverText.visible = true;
        gameOverText.setDepth(2);
        playerAlive = false;
        this.cameras.main.fadeOut(15000, 0, 0, 0)

    }

    function shootShip(enemies, cannonball) {
        enemies.setTint(0xff0000);
        enemies.disableBody(true, true);
        var exploded = explosion.create(enemies.x, enemies.y, 'explosion').setScale(1);
        exploded.play('explode');
        shipexplosion.play({volume: 0.65});

        cannonball.disableBody(true, true);
        scoreCount = scoreCount + 20;
        score.setText('Score: ' + scoreCount);
    }

    function removingText() {
        gameBecomingIntense.visible = false;
    }
