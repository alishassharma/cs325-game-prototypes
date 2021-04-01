import "./phaser.js";

// By: Alisha Sharma

var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 720,
    height: 480,
    backgroundColor: '#228B22',
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


var numberOnScreen = false;
var halfUsed = false;
var halfUsedText;
var doubleUsed = false;
var doubleUsedText;
var P;
var A;
var H;
var D;
var removeNumberCheck = false;
var numberOnScreen;
var stringNum1;
var stringNum2;
var stringNum3;
var number1 = 0;
var number2 = 0;
var number3 = 0;
var numberOfTries = 3;
var total = 0;
var totalText;
var numberText;
var passButton;
var gameText;
var finalTotal;
var loseText;
var tenText;
var okayText;
var music;
var directionsText;
var halfUsedDirections;
var doubleUsedDirections;

var card1;
var card2;
var card3;

var card1CutScene;
var card2CutScene;
var card3CutScene;
var mainText;
var cutSceneScreen;
var gameLogo;

var titlescreen;
var diceSound;
var talking;

function preload()
{   
    this.load.image('card2', 'assets/2card.png');
    this.load.image('card8', 'assets/8card.png');
    this.load.image('card6', 'assets/6card.png');
    this.load.audio( 'music', 'assets/music.mp3');
    this.load.audio( 'dice', 'assets/dice.mp3');
    this.load.audio( 'talking', 'assets/talking.mp3');
    this.load.image('title', 'assets/titlescreen1.png');
    this.load.image('background', 'assets/greenbackground.png');
    this.load.image('logo', 'assets/logo.png');

    // implement sprite sheet w cards 1-9 // index of sprite is number - 1
}

function create() {

    cutSceneScreen = this.add.image(360, 200, 'background').setScale(0.43).setDepth(2);
    card1CutScene = this.add.image(150, 550, 'card2').setScale(0.3).setDepth(2);
    card2CutScene = this.add.image(350, 550, 'card8').setScale(0.3).setDepth(2);
    card3CutScene = this.add.image(550, 550, 'card6').setScale(0.3).setDepth(2);
    gameLogo = this.add.image(350, 240, 'logo').setScale(1).setDepth(2);
    gameLogo.alpha = 0;

    this.tweens.add({
        targets: card1CutScene,
        y: 240,
        duration: 3000,
        repeat: 0,
        ease: 'Linear',
        yoyo: false,
        delay: 0
    });

    this.tweens.add({
        targets: card1CutScene,
        x: -100,
        duration: 3000,
        repeat: 0,
        ease: 'Linear',
        yoyo: false,
        delay: 4000
    });

    this.tweens.add({
        targets: card2CutScene,
        y: 240,
        duration: 3000,
        repeat: 0,
        ease: 'Linear',
        yoyo: false,
        delay: 0
    });

    this.tweens.add({
        targets: card2CutScene,
        y: -100,
        duration: 3000,
        repeat: 0,
        ease: 'Linear',
        yoyo: false,
        delay: 4000
    });

    this.tweens.add({
        targets: card3CutScene,
        y: 240,
        duration: 3000,
        repeat: 0,
        ease: 'Linear',
        yoyo: false,
        delay: 0
    });

    this.tweens.add({
        targets: card3CutScene,
        x: 900,
        duration: 3000,
        repeat: 0,
        ease: 'Linear',
        yoyo: false,
        delay: 4000
    });

    this.tweens.add({
        targets: gameLogo,
        alpha: 1,
        duration: 300,
        ease: 'Power2',
        delay: 7000
      }, this);

      this.tweens.add({
        targets: gameLogo,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        delay: 12000
      }, this);

      this.tweens.add({
        targets: cutSceneScreen,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        delay: 12000
      }, this);

    titlescreen = this.add.image(360, 260, 'title').setScale(0.43).setDepth(2);
    titlescreen.alpha = 0;

    this.tweens.add({
        targets: titlescreen,
        alpha: 1,
        duration: 300,
        ease: 'Power2',
        delay: 11000
      }, this);

      this.tweens.add({
        targets: titlescreen,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        delay: 23000
      }, this);    

    music = this.sound.add('music');
    diceSound = this.sound.add('dice');
    talking = this.sound.add('talking');
    talking.play({volume: 0.3});
    music.play({volume: 0.8});
    card1 = this.add.image(600, 180, 'card2').setScale(0.2);
    card1.angle += 20;
    card2 = this.add.image(540, 230, 'card8').setScale(0.2);
    card2.angle -= 20;
    card3 = this.add.image(580, 290, 'card6').setScale(0.2);
    card3.angle += 20;

    number1 = randomInteger(1, 9);
    stringNum1 = number1.toString();

    gameText = this.add.text(250, 20, 'Close to 10!', {fontSize: '30px', color: '#fff'});
    halfUsedText = this.add.text(50, 380, 'Half Used? False', {fontSize: '20px', color: '#fff'});
    halfUsedDirections = this.add.text(50, 410, 'You can only use a half ONCE', {fontSize: '12px', color: '#fff'});
    doubleUsedText = this.add.text(450, 380, 'Double Used? False', {fontSize: '20px', color: '#fff'});
    doubleUsedDirections = this.add.text(450, 410, 'You can only use a double ONCE', {fontSize: '12px', color: '#fff'});
    finalTotal = this.add.text(190, 230, 'Your final sum: ', {fontSize: '30px', color: '#fff'});
    finalTotal.visible = false;

    loseText = this.add.text(180, 280, 'You went over 10! You lose :(', {fontSize: '20px', color: '#fff'});
    loseText.visible = false;

    tenText = this.add.text(210, 280, 'You reached 10! You win!', {fontSize: '20px', color: '#fff'});
    tenText.visible = false;

    okayText = this.add.text(200, 280, 'You did not reach 10 :/', {fontSize: '20px', color: '#fff'});
    okayText.visible = false;

    directionsText = this.add.text(20, 60, 'Press P to Pass, A to Add to your Sum, H to half the card value, or D to double the card value', {fontSize: '12px', color: '#fff'});

    numberText = this.add.text(190, 250, 'Number 1:', {fontSize: '20px', color: '#fff'});
    numberOnScreen = this.add.text(340, 230, stringNum1, {fontSize: '60px', color: '#fff'});
    totalText = this.add.text(30, 130, 'Your sum: 0 -> Try to reach a sum of 10!', {fontSize: '20px', color: '#fff'});
    P = this.input.keyboard.addKey('P');
    P.on('down', function(event) {
        diceSound.play();
        if (number2 == 0) {
            numberOnScreen.visible = false;
            number2 = randomInteger(1, 9);
            stringNum2 = number2.toString();
            numberText.setText('Number 2:');
            numberOnScreen.setText(stringNum2);
            numberOnScreen.visible = true;
            numberOfTries--;
        }
        else if (number3 == 0) {
            numberOnScreen.visible = false;
            number3 = randomInteger(1, 9);
            stringNum3 = number3.toString();
            numberText.setText('Number 3:');
            numberOnScreen.setText(stringNum3);
            numberOnScreen.visible = true;
            numberOfTries--;
        }
        else if (number3 != 0) {
            endGame();
        }
    });
    
    A = this.input.keyboard.addKey('A');
    A.on('down', function(event) {
        diceSound.play();
       if (number2 == 0) {
                total += number1;
                totalText.setText('Your sum: ' + total);
                numberOnScreen.visible = false;
                number2 = randomInteger(1, 9);
                stringNum2 = number2.toString();
                numberText.setText('Number 2:');
                numberOnScreen.setText(stringNum2);
                numberOnScreen.visible = true;
                numberOfTries--;
        }
        else if (number3 == 0) {
                total += number2;
                totalText.setText('Your sum: ' + total);
                numberOnScreen.visible = false;
                number3 = randomInteger(1, 9);
                stringNum3 = number3.toString();
                numberText.setText('Number 3:');
                numberOnScreen.setText(stringNum3);
                numberOnScreen.visible = true;
                numberOfTries--;
        }
        else if (number3 != 0) {
            total += number3;
            totalText.setText('Your sum: ' + total);
            endGame();
        }
    });

    H = this.input.keyboard.addKey('H');
    H.on('down', function(event) {
        diceSound.play();
        if (halfUsed == false) {
            if (number2 == 0) {
                total += Math.floor(number1 / 2);
                totalText.setText('Your sum: ' + total);
                numberOnScreen.visible = false;
                number2 = randomInteger(1, 9);
                stringNum2 = number2.toString();
                numberText.setText('Number 2:');
                numberOnScreen.setText(stringNum2);
                numberOnScreen.visible = true;
                numberOfTries--;
            }
            else if (number3 == 0) {
                total += Math.floor(number2 / 2);
                totalText.setText('Your sum: ' + total);
                numberOnScreen.visible = false;
                number3 = randomInteger(1, 9);
                stringNum3 = number3.toString();
                numberText.setText('Number 3:');
                numberOnScreen.setText(stringNum3);
                numberOnScreen.visible = true;
                numberOfTries--;
            }
            else if (number3 != 0) {
                total += Math.floor(number3 / 2);
                totalText.setText('Your sum: ' + total);
                endGame();
            }
            halfUsed == true;
            halfUsedText.setText('Half Used? True') 
        }
    });

    D = this.input.keyboard.addKey('D');
    D.on('down', function(event) {
        diceSound.play();
        if (doubleUsed == false) {
            if (number1 != 0 && number2 == 0 && number3 == 0) {
                total += number1 * 2;
                totalText.setText('Your sum: ' + total);
                numberOnScreen.visible = false;
                number2 = randomInteger(1, 9);
                stringNum2 = number2.toString();
                numberText.setText('Number 2:');
                numberOnScreen.setText(stringNum2);
                numberOnScreen.visible = true;
                numberOfTries--;
            }
            else if (number1 != 0 && number2 != 0 && number3 == 0) {
                total += number2 * 2;
                totalText.setText('Your sum: ' + total);
                numberOnScreen.visible = false;
                number3 = randomInteger(1, 9);
                stringNum3 = number3.toString();
                numberText.setText('Number 3:');
                numberOnScreen.setText(stringNum3);
                numberOnScreen.visible = true;
                numberOfTries--;
            }
            else if (number3 != 0) {
                total += number3 * 2;
                totalText.setText('Your sum: ' + total);
                endGame();
            }
            doubleUsed == true;
            doubleUsedText.setText('Double Used? True') 
        }
    });
}

function update() {
}

function randomInteger(lowest_number, highest_number) {
    return Phaser.Math.Between(lowest_number, highest_number);
}

function endGame() {
    totalText.visible = false;
    numberText.visible = false;
    numberOnScreen.visible = false;
    halfUsedText.visible = false;
    doubleUsedText.visible = false;
    gameText.visible = false;
    finalTotal.setText('Your final sum: ' + total);
    finalTotal.visible = true;
    card1.visible = false;
    card2.visible = false;
    card3.visible = false;
    directionsText.visible = false;
    halfUsedDirections.visible = false;
    doubleUsedDirections.visible = false;

    if (total == 10) {
        tenText.visible = true;
    }
    else if (total < 10) {
        okayText.visible = true;
    }
    else {
        loseText.visible = true;
    }
}