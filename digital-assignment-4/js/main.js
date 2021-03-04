import "./phaser.js";

// By: Alisha Sharma

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 720,
    height: 480,
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
var platforms;
var bg;
var furniture;
var cam;
var moveableObjs;
var flames;
var dogs;
var ghosts;
var cookies;
var buttons;
var button1;
var button2;
var button3;
var button1On = false;
var button2On = false;
var button3On = false;
var A;
var W;
var D;
var stoveFire;
var stovelight;
var dogCounter;
var dogNumbers = 0;
var cookieCounter;
var cookieNumbers = 0;
var barrier;
var barrier1;
var music;
var dogSound;
var loseSound;


function preload()
{
    // preload assets
    this.load.image( 'kitchen' , 'assets/kitchen.png');
    this.load.spritesheet('grandma', 'assets/granny2.png', {frameWidth: 62, frameHeight: 81});
    this.load.spritesheet('flame', 'assets/flame.png', {frameWidth: 192, frameHeight: 247});
    this.load.image( 'ground', 'assets/floor.png');
    this.load.image( 'startingChair', 'assets/startingChair.png');
    this.load.image( 'tabletop', 'assets/tabletop.png');
    this.load.image( 'tabletopvert', 'assets/tabletopvert.png');
    this.load.image( 'orangeitem', 'assets/orangeitem.png');
    this.load.image( 'kitchentop', 'assets/kitchentop.png');
    this.load.image( 'coke', 'assets/coke.png');
    this.load.image( 'shelf', 'assets/shelf.png');
    this.load.image( 'ceilingfan', 'assets/ceilingfan.png');
    this.load.image( 'cabinet', 'assets/cabinet.png');
    this.load.image('puppy1', 'assets/puppy1.png');
    this.load.image('puppy2', 'assets/puppy2.png');
    this.load.image('puppy3', 'assets/puppy3.png');
    this.load.image('cookie', 'assets/cookie2.png');
    this.load.image('redbutton', 'assets/redbutton.png');
    this.load.image('greenbutton', 'assets/greenbutton.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.audio( 'music', 'assets/music.mp3');
    this.load.audio('woof', 'assets/woof.mp3');
    this.load.audio('lose', 'assets/lose.mp3');
    this.load.spritesheet('ghosts', 'assets/ghost.png', {frameWidth: 32, frameHeight: 32});
}

function create() {

    this.lights.enable().setAmbientColor(0x333333);
    music = this.sound.add('music');
    music.play({volume: 2});

    dogSound = this.sound.add('woof');
    loseSound = this.sound.add('lose');

    bg = this.add.image(0, 0, 'kitchen').setOrigin(0,0).setScale(1);
    bg.setTint(0x004c99);

    this.cameras.main.setBounds(0, 0, 720, 480);

    //this.cameras.main.setBounds(0, 0, bg.displayWidth, bg.displayHeight);
    platforms = this.physics.add.staticGroup();
    var ground = platforms.create(400, 465, 'ground').setScale(1.1).refreshBody();
    platforms.create(24, 392, 'startingChair').setScale(0.9);
    platforms.create(165, 330, 'tabletop').setScale(1);
    var orangeItem = platforms.create(233, 305, 'orangeitem').setScale(1);
    platforms.create(20, 200, 'shelf');
    var ceilingfan = platforms.create(180, 138, 'ceilingfan').setScale(1);
    platforms.create(550, 341, 'kitchentop').setScale(1);
    platforms.create(550, 163, 'cabinet').setScale(1);
    platforms.setTint(0x004c80);
    orangeItem.setPipeline('Light2D');
    ground.setPipeline('Light2D');

    barrier = this.physics.add.staticGroup();
    barrier1 = barrier.create(340, 265, 'tabletopvert').setScale(0.5);
    barrier1.setPipeline('Light2D');

    player = this.physics.add.sprite(25, 400, 'grandma').setScale(0.3);
    player.setPipeline('Light2D');

    var beginningText = this.add.text(player.x + 38, 350, "Navigate through the kitchen and", {fontSize: '10px', color: '#fff'});
    var beginningText2 = this.add.text(player.x + 38, 370, "collect ALL of your dogs and cookies!", {fontSize: '10px', color: '#fff'});
    var beginningText3 = this.add.text(player.x + 38, 430, 'Use the flashlight to help guide you!', {fontSize: '8px', color: '#fff'});

    dogCounter = this.add.text(player.x + 38, 390, "Dogs: 0/3 ", {fontSize: '12px', color: '#fff'});
    cookieCounter = this.add.text(player.x + 38, 410, "Cookies: 0/10 ", {fontSize: '12px', color: '#fff'});
    var helpText = this.add.text(460, 250, 'Hmm...maybe I should turn the stove off.', {fontSize: '8px', color: '#fff'});
    
    player.body.gravity.y = 630;
    player.body.bounce.y = 0.1;
    player.setCollideWorldBounds(true);
    this.cameras.main.zoomTo(2, 2000);
    this.cameras.main.startFollow(player);
    dogCounter.fixedToCamera = true;
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('grandma', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'grandma', frame: 0 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('grandma', { start: 1, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'flaming',
        frames: this.anims.generateFrameNumbers('flame', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'ghostin',
        frames: this.anims.generateFrameNumbers('ghosts', { start: 0, end: 3 }),
        frameRate: 7,
        repeat: -1
    });

    bg.setPipeline('Light2D');
    var light = this.lights.addLight(180, 80, 200).setColor(0xffffff).setIntensity(2);
    this.input.on('pointermove', function (pointer) {
        light.x = pointer.x;
        light.y = pointer.y;

    });

    dogs = this.physics.add.group();
    var dog1 = dogs.create(230, 80, 'puppy1').setScale(0.05);
    dog1.body.gravity.y = 530;
    dog1.body.bounce.y = 0.1;
    dog1.setCollideWorldBounds(true);

    var dog2 = dogs.create(700, 50, 'puppy2').setScale(0.05);
    dog2.flipX = true;
    dog2.body.gravity.y = 530;
    dog2.body.bounce.y = 0.1;
    dog2.setCollideWorldBounds(true);

    var dog3 = dogs.create(680, 200, 'puppy3').setScale(0.05);
    dog3.flipX = true;
    dog3.body.gravity.y = 530;
    dog3.body.bounce.y = 0.1;
    dog3.setCollideWorldBounds(true);

    dog1.setPipeline('Light2D');
    dog2.setPipeline('Light2D');
    dog3.setPipeline('Light2D');



    moveableObjs = this.physics.add.group();
    moveableObjs.enablebody = true;
    moveableObjs.physicsBodyType = Phaser.Physics.ARCADE;

    flames = this.physics.add.group();
    stoveFire = flames.create(589, 295, 'flame').setScale(0.3);
    stoveFire.play('flaming');
    stovelight = this.lights.addLight(589, 295, 200).setColor(0xFF6347).setIntensity(1);
    var ceilinglight = this.lights.addLight(180, 138, 200).setColor(0xffffff).setIntensity(0.2);



    var coke = moveableObjs.create(233, 200, 'coke').setScale(0.1);
    coke.body.gravity.y = 200;
    coke.body.bounce.y = 0.3;
    coke.body.bounce.x = 0.6;
    coke.setCollideWorldBounds(true);
    coke.setDragX(800);
    coke.setTint(0x004c80);

    ghosts = this.physics.add.group();

    var ghost1 = ghosts.create(40, 280, 'ghosts').setScale(0.6);
    ghost1.setCollideWorldBounds(true);
    ghost1.play('ghostin');
    ghost1.setTint(0x004c80);
    ghost1.setPipeline('Light2D');


    var ghost2 = ghosts.create(305, 180, 'ghosts').setScale(0.6);
    ghost2.setCollideWorldBounds(true);
    ghost2.play('ghostin');
    ghost2.setTint(0x004c80);
    ghost2.setPipeline('Light2D');


    var ghost3 = ghosts.create(415, 120, 'ghosts').setScale(0.6);
    ghost3.setCollideWorldBounds(true);
    ghost3.play('ghostin');
    ghost3.setTint(0x004c80);
    ghost3.setPipeline('Light2D');


    var ghost4 = ghosts.create(505, 120, 'ghosts').setScale(0.6);
    ghost4.setCollideWorldBounds(true);
    ghost4.play('ghostin');
    ghost4.setTint(0x004c80);
    ghost4.setPipeline('Light2D');


    var ghost5 = ghosts.create(600, 120, 'ghosts').setScale(0.6);
    ghost5.setCollideWorldBounds(true);
    ghost5.play('ghostin');
    ghost5.setTint(0x004c80);
    ghost5.setPipeline('Light2D');


    cookies = this.physics.add.group();
    cookies.enableBody = true;
    coke.body.gravity.y = 200;

    var cookie1 = cookies.create(25, 190, 'cookie').setScale(0.05);
    var cookie2 = cookies.create(140, 125, 'cookie').setScale(0.05);
    var cookie3 = cookies.create(370, 80, 'cookie').setScale(0.05);
    var cookie4 = cookies.create(460, 80, 'cookie').setScale(0.05);
    var cookie5 = cookies.create(550, 80, 'cookie').setScale(0.05);
    var cookie6 = cookies.create(650, 80, 'cookie').setScale(0.05);
    var cookie7 = cookies.create(385, 280, 'cookie').setScale(0.05);
    var cookie8 = cookies.create(430, 280, 'cookie').setScale(0.05);
    var cookie9 = cookies.create(100, 300, 'cookie').setScale(0.05);
    var cookie10 = cookies.create(157, 300, 'cookie').setScale(0.05);

    cookie1.setPipeline('Light2D');
    cookie2.setPipeline('Light2D');
    cookie3.setPipeline('Light2D');
    cookie4.setPipeline('Light2D');
    cookie5.setPipeline('Light2D');
    cookie6.setPipeline('Light2D');
    cookie7.setPipeline('Light2D');
    cookie8.setPipeline('Light2D');
    cookie9.setPipeline('Light2D');
    cookie10.setPipeline('Light2D');

    this.tweens.add({
        targets: cookie1,
        y: cookie1.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie2,
        y: cookie2.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie3,
        y: cookie3.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie4,
        y: cookie4.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie5,
        y: cookie5.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie6,
        y: cookie6.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie7,
        y: cookie7.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie8,
        y: cookie8.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie9,
        y: cookie9.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: cookie10,
        y: cookie10.y - 10,
        duration: 1000,
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });




    this.tweens.add({
        targets: ghost1,
        x: 200,
        duration: Phaser.Math.Between(2500, 3000),
        repeat: -1,
        ease: 'Linear',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: ghost1,
        y: 320,
        duration: 1000,
        repeat: -1,
        ease: 'Sine',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: ghost2,
        y: 80,
        duration: 2000,
        repeat: -1,
        ease: 'Sine',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: ghost3,
        y: ghost3.y - 55,
        duration: 3000,
        repeat: -1,
        ease: 'Sine',
        yoyo: true,
        delay: 0
    });

    this.tweens.add({
        targets: ghost4,
        y: ghost4.y - 55,
        duration: 2000,
        repeat: -1,
        ease: 'Sine',
        yoyo: true,
        delay: 3000
    });

    this.tweens.add({
        targets: ghost5,
        y: ghost5.y - 55,
        duration: 1600,
        repeat: -1,
        ease: 'Sine',
        yoyo: true,
        delay: 5000
    });

    buttons = this.physics.add.group();
    button1 = buttons.create(470, 280, 'redbutton').setScale(0.05);

    button2 = buttons.create(500, 280, 'redbutton').setScale(0.05);

    button3 = buttons.create(530, 280, 'redbutton').setScale(0.05);

    A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    

    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(moveableObjs, platforms);
    this.physics.add.collider(player, moveableObjs);
    this.physics.add.collider(dogs, platforms);
    this.physics.add.collider(ghosts, platforms);
    this.physics.add.collider(cookies, platforms);
    this.physics.add.collider(player, barrier);


    this.physics.add.overlap(player, button1, switchButton1, null, this);
    this.physics.add.overlap(player, button2, switchButton2, null, this);
    this.physics.add.overlap(player, button3, switchButton3, null, this);

    this.physics.add.overlap(player, cookies, collectCookies, null, this);
    this.physics.add.overlap(player, dogs, collectDogs, null, this);
    this.physics.add.overlap(player, ghosts, hitGhost, null, this);
    this.physics.add.overlap(player, flames, hitFlame, null, this);

}

function update() {

    if (dogNumbers == 2) {
        barrier1.disableBody(true, true);
    }
    
    if (dogNumbers == 3 && cookieNumbers == 10) {
        music.stop();
        this.physics.pause();
        var gameOverText = this.add.text(player.x - 45, player.y - 30, "You Win!", {fontSize: '16px', color: '#00ff00'});
    }

    if (A.isDown)
    {
        player.setVelocityX(-100);
        player.anims.play('left', true);
        // horizontal direction is flipped if character turns left
        player.flipX = false;
    }
    else if (D.isDown)
    {
        player.setVelocityX(100);
        player.anims.play('right', true);
        player.flipX = true;
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (W.isDown && player.body.touching.down)
    {
        player.setVelocityY(-320);
    }

    if (button1On == false && button2On == true && button3On == true) {
        stoveFire.disableBody(true, true);
    }
}

function switchButton1() {
    if (button1On == false) {
        button1 = buttons.create(470, 280, 'greenbutton').setScale(0.05);
        button1On = true;
    }
    else if (button1On == true) {
        button1 = buttons.create(470, 280, 'redbutton').setScale(0.05);
        button1On = false;
    }
}

function switchButton2() {
    if (button2On == false) {
        button2 = buttons.create(500, 280, 'greenbutton').setScale(0.05);
        button2On = true;
    }
    else if (button2On == true) {
        button2 = buttons.create(500, 280, 'redbutton').setScale(0.05);
        button2On = false;
    }
}

function switchButton3() {
    if (button3On == false) {
        button3 = buttons.create(530, 280, 'greenbutton').setScale(0.05);
        button3On = true;
    }
    else if (button3On == true) {
        button3 = buttons.create(530, 280, 'redbutton').setScale(0.05);
        button3On = false;
    }
}

function collectCookies(player, cookie) {
    cookie.disableBody(true, true);
    cookieNumbers = cookieNumbers + 1;
    cookieCounter.setText('Cookies: ' + cookieNumbers + '/10');
}

function collectDogs(player, dog) {
    dogSound.play();
    dog.disableBody(true, true);
    dogNumbers = dogNumbers + 1;
    dogCounter.setText('Dogs: ' + dogNumbers + '/3');
}

var flashed = false;
function hitGhost(player, ghost) {
    music.stop();
    this.physics.pause();
    if (flashed == false) {
        this.cameras.main.flash(500);
    }
    player.setTint(0xff0000);   
    flashed = true;
    var gameOverText = this.add.text(player.x - 45, player.y - 30, "Game Over!", {fontSize: '16px', color: '#ff0000'});
    loseSound.play();
}

function hitFlame(player, flame) {
    music.stop();
    this.physics.pause();
    if (flashed == false) {
        this.cameras.main.flash(500);
    }
    player.setTint(0xff0000);   
    flashed = true;
    var gameOverText = this.add.text(player.x - 45, player.y - 30, "Game Over!", {fontSize: '16px', color: '#ff0000'});
    loseSound.play();
}