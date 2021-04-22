export class Game3 extends Phaser.Scene {

    constructor () {
        // The parameter to super() is the name used when switching states,
        // as in `this.scene.start(...)`.
        super( 'Game3' );

        this.player;
        this.cursors;
        this.portal;
        this.jumps;
        this.jumpsLeftText;
        this.spacebar;
        this.Rkey;
    }

    create() {
        var levelText = this.add.text(20, 20, 'Level 3', { fontSize: '32px', fill: '#000000' });

        this.jumps = 1;
        var platforms = this.physics.add.staticGroup();
        var movingplatforms = this.physics.add.group();

        platforms.create(-50, 554, 'rectangle').refreshBody();
        platforms.create(850, 554, 'rectangle').refreshBody();


        var movingplat = movingplatforms.create(200, 350, 'platform1').setScale();
        this.tweens.add({
            targets: movingplat,
            x: 600,
            duration: 1000,
            repeat: -1,
            ease: 'Linear',
            yoyo: true,
        });
        movingplat.setTint('#FF0000');
        platforms.create(400, 450, 'platform1').refreshBody().setScale();

        this.player = this.physics.add.sprite(100, 100, 'player').setScale(1);
        this.player.body.gravity.y = 600;
        this.player.body.bounce.y = 0.1;
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

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

        this.portal = this.physics.add.sprite(720, 290, 'portal').setScale(0.2);

        this.anims.create({
            key: 'movingPortal',
            frames: this.anims.generateFrameNumbers('portal', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        this.portal.anims.play('movingPortal', true);
        this.jumpsLeftText = this.add.text(370, 100, '', { fontSize: '86px', fill: '#000000' });
        this.jumpsLeftText.setText(this.jumps);

        this.physics.add.overlap(this.player, movingplatforms, this.restartGame, null, this);

        var tutorialText7 = this.add.text(20, 60, 'Press R to restart the level!', { fontSize: '12px', fill: '#000000' });

        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.physics.add.overlap(this.player, this.portal, this.portalEndGame, null, this);
        this.Rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    portalEndGame(player, portal) {
        this.scene.start('Game4');
    }

    restartGame() {
        this.scene.restart();
    }

    update() {
        
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-350);
            this.player.anims.play('left', true);
            // horizontal direction is flipped if character turns left
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
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

        if (Phaser.Input.Keyboard.JustDown(this.spacebar) && this.player.body.touching.down && this.jumps > 0)
        {
            this.jumpsLeftText.setText(this.jumps);
            this.player.setVelocityY(-400);
            this.jumps = this.jumps - 1;
            this.jumpsLeftText.setText(this.jumps);
        }

        if (this.Rkey.isDown || this.player.y > 560) {
            this.scene.start('Game3');
        }
    }
}