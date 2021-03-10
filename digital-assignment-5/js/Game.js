export class Game extends Phaser.Scene {

    constructor () {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'Game' );
        
        // Create your own variables.
        //this.bouncy = null;
        this.cursors;
        this.player;
        this.scorpions;
        this.timedEvent;
        this.firstTimer;
        this.startingText;
        this.startingText2;
        this.gameStartingIn;
        this.startingInTime = 10;
        this.countdownTimer;
        this.gameOverText;
        this.gameTimeLeft = 40;
        this.timerText;
        this.gameTimer;
        this.startingTimer;
        this.music;
        this.winSound;
        this.loseSound;
        this.fireballs;
        this.fireball1;
        this.mouse;
        this.control = false;
        this.worldBounds;
        this.scorpionsCollected = 0;
        this.secondWaveTimer;
        this.timedEvent2;
        this.Wave2Reminder;
        this.tumbleweeds;
        this.tumbleweedSpawner;
        this.tumbleweed1;
        this.Akey;
        this.Wkey;
        this.Dkey;
    }

    create() {
        // camera fades in
        this.cameras.main.fadeIn(6000);
        
        // creates background and music
        this.add.image(400, 300, 'oasis');
        this.music = this.sound.add('music');
        this.winSound = this.sound.add('win');
        this.loseSound = this.sound.add('lose');
        this.music.play({volume: 0.65});

        // defines the floor platform
        var platforms = this.physics.add.staticGroup();
        platforms.create(434, 554, 'ground').setScale(1).refreshBody();

        // creates different texts that will be visible throughout the game
        this.startingText = this.add.text(35, 510, 'Watch out above you! Avoid the falling scorpions for 40 seconds and you win!', { fontSize: '16px', fill: '#FFFFFF' });
        this.startingText2 = this.add.text(160, 530, 'Jump over the tumbleweed approaching from the left!', { fontSize: '16px', fill: '#FFFFFF' });
        this.gameStartingIn = this.add.text(200, 550, 'Scorpions falling in 10 seconds!', { fontSize: '20px', fill: '#FF0000' });
        this.timerText = this.add.text(240, 550, '40 seconds left!', { fontSize: '32px', fill: '#FF0000' });
        this.timerText.visible = false;

        // creates the player
        this.player = this.physics.add.sprite(400, 300, 'player').setScale(1.7);
        this.player.body.gravity.y = 800;
        this.player.body.bounce.y = 0.1;
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scorpions = this.physics.add.group();

        this.tumbleweeds = this.physics.add.group();
        this.tumbleweeds.enableBody = true;

        this.physics.add.overlap(this.player, this.scorpions, this.hitScorpion, null, this);
        this.physics.add.overlap(this.player, this.tumbleweeds, this.hitTumbleweeds, null, this);

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

        this.fireballs = this.physics.add.group();
        this.fireballs.enableBody = true;

        this.physics.add.overlap(this.fireballs, this.scorpions, this.killScorpion, null, this);

        this.mouse = this.input.mousePointer;
        this.worldBounds = this.physics.world.bounds;

        // sets various timers for other timers and events
        // timed events code inspired by: http://examples.phaser.io/_site/view_full.html?d=time&f=basic+timed+event.js&t=basic%20timed%20event
        // timer properties: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/timer/
        // countdown timer inspiration: https://phaser.discourse.group/t/countdown-timer/2471/2
        this.gameOverText = this.add.text(43, 300, 'Game Over! You Died!', { fontSize: '60px', fill: '#FF0000' });
        this.gameOverText.visible = false;
        this.countdownTimer = this.time.addEvent({ delay: 1000, callback: this.countdown, callbackScope: this, loop: true });
        this.firstTimer = this.time.delayedCall(10000, this.startingGame, [], this);
        this.gameTimer = this.time.delayedCall(10000, this.startTimer, [], this);

        this.tumbleweedSpawner = this.time.addEvent({ delay: 12000, callback: this.spawnTumbleweeds, callbackScope: this, loop: true })

        this.Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.Wkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {

        if (this.Akey.isDown)
        {
            this.player.setVelocityX(-350);
            this.player.anims.play('left', true);
            // horizontal direction is flipped if character turns left
            this.player.flipX = true;
        }
        else if (this.Dkey.isDown)
        {
            this.player.setVelocityX(350);
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.Wkey.isDown && this.player.body.touching.down)
        {
            this.player.setVelocityY(-400);
        }

        // code and tutorial for bullets following mouse pointer: https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3
        if (this.input.activePointer.isDown && this.control == false) {
            this.fireball1 = this.fireballs.create(this.player.x, this.player.y, 'fireballsfire').setScale(0.2);
            if (this.mouse.x > this.player.x) {
                this.fireball1.flipX = true;
            }

            // fireball directions: code implemented from source above (https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3)
            if (this.mouse.x < this.player.x && this.mouse.y < this.player.y - 50) {
                this.fireball1.angle = -300;
            }

            if (this.mouse.x < this.player.x && this.mouse.y > this.player.y) {
                this.fireball1.angle = -30;
            }

            if (this.mouse.x > this.player.x && this.mouse.y < this.player.y - 50) {
                this.fireball1.angle = 320;
            }

            if (this.mouse.x > this.player.x && this.mouse.y > this.player.y) {
                this.fireball1.angle = 30;
            }
            this.physics.moveTo(this.fireball1, this.mouse.x, this.mouse.y, 500);
            this.control = true;
        }

        if (typeof this.fireball1 != "undefined") {
            if (this.fireball1.x>this.worldBounds.width || this.fireball1.y>this.worldBounds.height ||this.fireball1.x<0 || this.fireball1.y<0) {
                this.control = false;
            }
        }

        if (typeof this.tumbleweed1 != "undefined") {
            this.tumbleweed1.angle += 1;
        }
    }

    // spawning tumbleweeds
    spawnTumbleweeds() {
        this.tumbleweed1 = this.tumbleweeds.create(0, 500, 'tumbleweed1').setScale(0.15);
        this.physics.moveTo(this.tumbleweed1, 800, this.tumbleweed1.y, 200);
    }

    // if the scorpion is hit by a fireball
    killScorpion(_fireball, _scorpion) {
        _scorpion.disableBody(true, true);
        this.scorpionsCollected = this.scorpionsCollected + 1;
    }
    // spawns in scorpions 10 seconds after starting the game (when the 20 sec timer starts)
    // Phaser.Math documentation: https://photonstorm.github.io/phaser3-docs/Phaser.Math.html
    spawnScorpions() {
        var scorpion = this.scorpions.create(Phaser.Math.Between(0, 750), 60, 'enemy');
        scorpion.body.gravity.y = 530;
        scorpion.body.bounce.y = 0.1;
        scorpion.anims.play('attack');
    }

    // wave 2: added tweens
    spawnScorpionsWave2() {
        var scorpion = this.scorpions.create(Phaser.Math.Between(0, 750), 60, 'enemy');
        scorpion.body.gravity.y = 530;
        scorpion.body.bounce.y = 0.1;
        scorpion.anims.play('attack');
        this.tweens.add({
            targets: scorpion,
            x: Phaser.Math.Between(scorpion.x - 100, scorpion.x + 100),
            duration: 2000,
            repeat: -1,
            ease: 'Quadratic',
            yoyo: true,
            delay: 0
        });
    }

    // if the player hits tumbleweed, then its game over
    hitTumbleweeds() {
        this.player.setTint(0xff0000);
        this.timedEvent.destroy();
        this.startingTimer.destroy();
        this.gameOverText.visible = true;
        this.physics.pause();
        this.music.stop();
        this.loseSound.play({volume: 0.3});
        this.cameras.main.fadeOut(5000, 0, 0, 0);
        var restart = this.time.addEvent({delay: 5000, callback: this.restartGame, callbackScope: this});
    }

    // if the player hits the scorpion, then it's game over
    hitScorpion() {
        this.player.setTint(0xff0000);
        this.timedEvent.destroy();
        this.startingTimer.destroy();
        this.gameOverText.visible = true;
        this.physics.pause();
        this.music.stop();
        this.loseSound.play({volume: 0.3});
        this.cameras.main.fadeOut(5000, 0, 0, 0);
        var restart = this.time.addEvent({delay: 5000, callback: this.restartGame, callbackScope: this});
    }

    // restart the game in several cases
    restartGame() {
        this.startingTimer.destroy();
        this.timedEvent.destroy();
        this.startingInTime = 10;
        this.scene.start('MainMenu');
    }

    // contains the loop for the scorpions to fall at a random location at the top of the map
    startingGame() {
        this.timedEvent = this.time.addEvent({ delay: 215, callback: this.spawnScorpions, callbackScope: this, loop: true});
    }

    startingWave2() {
        this.Wave2Reminder.visible = false;
        this.timedEvent2 = this.time.addEvent({ delay: 160, callback: this.spawnScorpionsWave2, callbackScope: this, loop: true});
    }
    // 10 sec countdown when loading the webpage
    countdown() {
        this.startingInTime -= 1;
        this.gameStartingIn.setText('Scorpions falling in ' + this.startingInTime + ' seconds!');
        if (this.startingInTime == 0) {
            this.gameStartingIn.visible = false;
            this.startingText.visible = false;
            this.startingText2.visible = false;
        }
    }
    // delayed timer which starts after the countdown timer is gone
    startTimer() {
        this.timerText.visible = true;
        this.startingTimer = this.time.addEvent({ delay: 1000, callback: this.startTwentySecs, callbackScope: this, loop: true});
    }
    // 20 sec timer that is for the duration of the game
    // if the player survives all 20 seconds, they win!
    startTwentySecs() {
        this.gameTimeLeft -= 1;
        this.timerText.setText(this.gameTimeLeft + ' seconds left!');
        
        if (this.gameTimeLeft == 20) {
            this.timedEvent.destroy();
            this.Wave2Reminder = this.add.text(250, 200, 'Wave 2', { fontSize: '60px', fill: '#0000FF' });
            this.secondWaveTimer =  this.time.delayedCall(3000, this.startingWave2, [], this);
        }

        if (this.gameTimeLeft == 0) {
            this.secondWaveTimer.destroy();
            this.timedEvent2.destroy();
            this.startingTimer.destroy();
            this.physics.pause();
            var gameWinText = this.add.text(250, 300, 'You Won!', { fontSize: '60px', fill: '#0000FF' });
            var gameWinText2 = this.add.text(155, 360, 'You destroyed', { fontSize: '30px', fill: '#0000FF' });
            gameWinText2.setText("You destroyed " + this.scorpionsCollected + " scorpions!");
            this.player.setTint(0x0000ff);
            this.cameras.main.fadeOut(8000, 0, 0, 0);
            this.music.stop();
            this.winSound.play({volume: 0.3});
            var restart1 = this.time.addEvent({delay: 8000, callback: this.restartGame, callbackScope: this});
        }
    }
}
