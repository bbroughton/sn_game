var game = new Phaser.Game(800,600, Phaser.AUTO, 'phaser-demo', {preload: preload, create: create, update: update, render: render});

var TDRS;
var background;
var cursors;
var bank;

var ACCLERATION = 600;
var DRAG = 400;
var MAXSPEED = 400;

function preload() {
    game.load.image('background', 'assets/img/gradbg.png');
    game.load.image('ship', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/TDRS.png');
}

function create() {
    //  The scrolling background background
    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    //  The hero!
    TDRS = game.add.sprite(400, 500, 'ship');
    TDRS.anchor.setTo(0.5, 0.5);
    game.physics.enable(TDRS, Phaser.Physics.ARCADE);
    TDRS.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
    TDRS.body.drag.setTo(DRAG, DRAG);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    //  Scroll the background
    //background.tilePosition.y += 2;

    //  Reset the TDRS, then check for movement keys
    TDRS.body.acceleration.x = 0;

    if (cursors.left.isDown)
    {
        TDRS.body.acceleration.x = -ACCLERATION;
    }
    else if (cursors.right.isDown)
    {
        TDRS.body.acceleration.x = ACCLERATION;
    }

    //  Stop at screen edges
    if (TDRS.x > game.width - 50) {
        TDRS.x = game.width - 50;
        TDRS.body.acceleration.x = 0;
    }
    if (TDRS.x < 50) {
        TDRS.x = 50;
        TDRS.body.acceleration.x = 0;
    }

    //  Squish and rotate ship for illusion of "banking"
    bank = TDRS.body.velocity.x / MAXSPEED;
    TDRS.scale.x = 1 - Math.abs(bank) / 2;
    TDRS.angle = bank * 10;
}

function render() {

}