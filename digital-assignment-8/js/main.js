import "./phaser.js";
import {Boot} from "./Boot.js";
import {Game} from "./Game.js";
import {MainMenu} from "./MainMenu.js";
import {Preloader} from "./Preloader.js";
import {Game1} from "./Game1.js";
import {Game2} from "./Game2.js";
import {Game3} from "./Game3.js";
import {Game4} from "./Game4.js";
import {Game5} from "./Game5.js";
import {EndGame} from "./EndGame.js";

// An object for shared (global) variables, so that them main menu can show
// the high score if you want.
let shared = {};

// For a simpler example with multiple scenes:
// https://phaser.io/examples/v3/view/scenes/changing-scene-es6

// For a way to pass data between scenes without global variables:
// https://phaser.io/examples/v3/view/scenes/passing-data-to-a-scene

// You can have two scenes active at once, which can help separate a UI layer
// from other things on the screen:
// https://phaser.io/examples/v3/view/scenes/ui-scene-es6

const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    backgroundColor: '#add8e6',
    // The game starts the first scene in the scene array.
    scene: [ Boot, Preloader, MainMenu, Game, Game1, Game2, Game3, Game4, Game5, EndGame ],
    physics: { default: 'arcade' },
    });
