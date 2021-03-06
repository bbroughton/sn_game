//add key and mouse

var canvasWidth  = document.documentElement.clientWidth;
var canvasHeight = document.documentElement.clientHeight;


var game = new Phaser.Game(canvasWidth,canvasHeight, Phaser.AUTO, 'phaser-demo', {preload: preload, create: create, update: update, render: render});

var lvl = 0;
var score = 0;
var fireRate = 600;
var nextFire = 800;

var min_sat_space = 400;
var max_sat_space = 4000;

var first_hit = true;
var first_hit_iss = false;;
var first_hit_hubble = false;
var intro = false;
var quiz = true;
var questionDiv;

var signals;
var sat_speed;
var tutorialmessage;
var tdrs_img;
var title;
var score;
var hubble;
var iss;
var gen_modal;

var satellites;
var channel_1 = (game.height * 7/20);
var channel_2 = (game.height * 10/20 ) ;
var channel_3 = (game.height *13/20);
var channel_4 = (game.height *16/20)  ;



function preload() {

    var levelparams = LevelData[lvl];
    tutorialmessage = levelparams.tutorialmessage;
    tdrs_img = levelparams.tdrs_img;
    title = levelparams.title;
    score = levelparams.score;
    hubble = levelparams.hubble;
    iss = levelparams.iss;
    sat_speed = levelparams.sat_speed;
    gen_modal = levelparams.gen_modal;
    

    game.load.image('background', 'assets/img/background.png');
    game.load.image('TDRS', tdrs_img);
    game.load.image('signal', 'assets/img/waves.png');
    game.load.image('iss', 'assets/img/ISS.svg');
    game.load.image('sattelite', 'assets/img/sat.svg');
    game.load.image('hubble', 'assets/img/hubble.svg');
    game.load.image('purple', 'assets/img/pglow.png');
    game.load.image('green', 'assets/img/green_glow.png');

    modal('welcome-modal','continue' , 'instructions-modal','go-to-instructions');
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //background

    var background = game.add.sprite(0, 0, 'background');
    background.x = 0;
    background.y = 0;
    background.height = canvasHeight;
    background.width = canvasWidth;
    console.log(canvasWidth + ' ' + canvasHeight);

    //altitude indications

    tdrs_y = (game.height *4/20) *0.5;
    graphics = game.add.graphics(0, 0);
    graphics.lineStyle(2, 0xffffff, 1);
    
    graphics.moveTo(0, tdrs_y + 20);
    graphics.lineTo(game.width * 0.6 , tdrs_y +20); 
    graphics.moveTo(game.width * 0.82, tdrs_y + 20);
    graphics.lineTo(game.width , tdrs_y +20);
    
    
    var geosynchronous = 'geosynchronous orbit';
    var style = { font: 'italic 25px Arial', fill: '#ffffff', align: 'center' };
     

    game.add.text(game.width *0.62 , tdrs_y, geosynchronous, style);
    
    // TDRS
    
    tdrs = game.add.sprite(game.width/2, 0 , 'TDRS');
    tdrs.anchor.set(0.5);
    tdrs.x = game.width/2;
    tdrs.y = tdrs_y;
    tdrs.height = (game.height *4/20) *0.9;
    tdrs.width = (game.height *4/20) *0.9;
    tdrs.anchor.setTo(0.5, 0.5);
    game.physics.enable(tdrs, Phaser.Physics.ARCADE);
    tdrs.body.allowRotation = false;

    //signals

    signals = game.add.group();
    signals.enableBody = true;
    signals.physicsBodyType = Phaser.Physics.ARCADE;
    signals.createMultiple(5, 'signal');
    signals.setAll('checkWorldBounds', true);
    signals.setAll('outOfBoundsKill', true);
    signals.forEach(function(enemy){
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
     });

    //add a puple glow to satellites that have not been hit

     glow = game.add.group();
     glow.enableBody = true;
     glow.physicsBodyType = Phaser.Physics.ARCADE;
     glow.createMultiple(50,'purple');
     glow.setAll('anchor.x', 0.5);
     glow.setAll('anchor.y', 0.5);
     glow.setAll('width', game.width/8);
     glow.setAll('height', game.width/8);
     glow.setAll('angle', 180);
     glow.setAll('checkWorldBounds', true);
     glow.setAll('outOfBoundsKill', true);
     glow.forEach(function(enemy){
        enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
     });
     glow.setAll('damageAmount', 3);
     glow.setAll('name', 'open');
    
    //satellites
    
     satellites = game.add.group();
     satellites.enableBody = true;
     satellites.physicsBodyType = Phaser.Physics.ARCADE;
     satellites.createMultiple(50,'sattelite');
     satellites.setAll('anchor.x', 0.5);
     satellites.setAll('anchor.y', 0.5);
     satellites.setAll('width', game.width/12);
     satellites.setAll('height', game.width/12);
     satellites.setAll('angle', 180);
     satellites.setAll('outOfBoundsKill', true);
     satellites.setAll('checkWorldBounds', true);

    //seperated into four functions to keep timing consistent
     

     launchsat1();
     launchsat2();
     launchsat3();
     launchsat4();
 
     //progress bar

    graphics.lineStyle(1, 0xFFFFFF, 1);
    graphics.drawRect(20, 20, 300, 30, 9);

    var bmd = game.add.bitmapData(20,30);
    bmd.context.beginPath();
    bmd.context.rect(0,0,300,30);
     
     var grd = bmd.context.createLinearGradient(0,0,40,0);
     grd.addColorStop(0, '#ccff66');
     grd.addColorStop(1, '#00ffcc');
     bmd.context.fillStyle = grd;
     bmd.context.fillRect(0,0,300,30);
    
     healthBar = game.add.sprite(20,35,bmd);
     healthBar.anchor.y = 0.5;

        
    }


function launchsat1() {

    var newGlow = glow.getFirstExists(false);
    newGlow.reset(-15, channel_1);
    var newSat = satellites.getFirstExists(false);
    newSat.reset(-15, channel_1);
    
    //reset satellite to regular
    if(newSat.loadTexture != 'sattelite'){
        newSat.loadTexture('sattelite');
        newSat.width = game.width / 12;
        newSat.height = game.width / 12;
        newSat.anchor.x=0.5;
        newSat.anchor.y=0.5;
        newSat.angle = 180;
        newSat.outOfBoundsKill = true;
        newSat.checkWorldBounds = true;
    }
    //move satellites across screes
    if (newSat) { 
        newGlow.body.velocity.x = sat_speed;
        newGlow.body.velocity.y = 0;
        newGlow.body.drag.x = 0;
        newSat.body.velocity.x = sat_speed;
        newSat.body.velocity.y = 0;
        newSat.body.drag.x = 0;
    }
     //  Send another newSat soon
     game.time.events.add(game.rnd.integerInRange(min_sat_space, max_sat_space), launchsat1);

 }
function launchsat2() {

    var newGlow = glow.getFirstExists(false);
    newGlow.reset(0, channel_2);
    var newSat = satellites.getFirstExists(false);
    //reset satellite to regular
    if(newSat.loadTexture != 'sattelite'){
        newSat.loadTexture('sattelite');
        newSat.width = game.width / 12;
        newSat.height = game.width / 12;
        newSat.anchor.x=0.5;
        newSat.anchor.y=0.5;
    }
    //randomly add ISS if past lvl 2
    if(iss){
        var chooser = Math.random();
        if(chooser > 0.85){
            newSat.loadTexture('iss'); // = satellites.create(0, channel_2, 'iss');
            newSat.width = game.width / 11;
            newSat.height = game.width / 11;
            newGlow.damageAmount = 10;
            newSat.anchor.x=0.5;
            newSat.anchor.y=0.3;
            newSat.angle = 180;
            newSat.outOfBoundsKill = true;
            newSat.checkWorldBounds = true;
        }
    }
    
    newSat.reset(0, channel_2);
    //move satellites across screes
    if (newSat) { 
        newGlow.body.velocity.x = sat_speed;
        newGlow.body.velocity.y = 0;
        newGlow.body.drag.x = 0;
        newSat.body.velocity.x = sat_speed;
        newSat.body.velocity.y = 0;
        newSat.body.drag.x = 0;
    }
     //  Send another newSat soon
     game.time.events.add(game.rnd.integerInRange(min_sat_space, max_sat_space), launchsat2);

 }
function launchsat3() {

    var newGlow = glow.getFirstExists(false);
    newGlow.reset(0, channel_3);
    var newSat = satellites.getFirstExists(false);
    
    //reset satellite to regular
    if(newSat.loadTexture != 'sattelite'){
        newSat.loadTexture('sattelite');
        newSat.width = game.width / 12;
        newSat.height = game.width / 12;
        newSat.anchor.x=0.5;
        newSat.anchor.y=0.5;
        newSat.angle = 180;
        newSat.outOfBoundsKill = true;
        newSat.checkWorldBounds = true;
        }
    //randomly add hubble if lvl > 2
    if(hubble){
        var chooser = Math.random();
    
        if(chooser > 0.85){
            newSat.loadTexture('hubble'); // = satellites.create(0, channel_2, 'iss');
            newSat.width = game.width / 12;
            newSat.height = game.width / 12;
            newSat.angle = 180;
            newSat.outOfBoundsKill = true;
            newSat.checkWorldBounds = true;
            newGlow.damageAmount = 5;

        }
    }
 

    newSat.reset(0, channel_3);
    //move satellites across screes
    if (newSat) { 
        newGlow.body.velocity.x = sat_speed;
        newGlow.body.velocity.y = 0;
        newGlow.body.drag.x = 0;
        newSat.body.velocity.x = sat_speed;
        newSat.body.velocity.y = 0;
        newSat.body.drag.x = 0;
    }
     //  Send another newSat soon
     game.time.events.add(game.rnd.integerInRange(min_sat_space, max_sat_space), launchsat3);

 }
function launchsat4() {

    var newGlow = glow.getFirstExists(false);
    newGlow.reset(0, channel_4);
     var newSat = satellites.getFirstExists(false);
     newSat.reset(0, channel_4);

    //reset satellite to regular
    if(newSat.loadTexture != 'sattelite'){
        newSat.loadTexture('sattelite');
        newSat.width = game.width / 12;
        newSat.height = game.width / 12;
        newSat.anchor.x=0.5;
        newSat.anchor.y=0.5;
        newSat.angle = 180;
        newSat.outOfBoundsKill = true;
        newSat.checkWorldBounds = true;
    }
    

    //move satellites across screes
    if (newSat) {
        newGlow.body.velocity.x = sat_speed;
        newGlow.body.velocity.y = 0;
        newGlow.body.drag.x = 0; 
        newSat.body.velocity.x = sat_speed;
        newSat.body.velocity.y = 0;
        newSat.body.drag.x = 0;
    }
     //  Send another newSat soon
     game.time.events.add(game.rnd.integerInRange(min_sat_space, max_sat_space), launchsat4);

 }


function update() {


    if(intro == false){
        var div =document.getElementById('insert-txt');
        div.innerHTML +=  '<p> ' + title + '<br>' + tutorialmessage + ' </p>' + '<img class = \'tdrs-img\' src =\'' + tdrs_img + '\'\\>';
        modal(gen_modal, 'play', 'about-TDRS-modal', 'next-to-info');
        intro = true;
    }
   
   //progress bar
    barWidth = healthBar.width;
    healthBar.width =  score * 3;

    if(score <= 0){
        modal('game_over_modal','restart', null, null);

        lvl = 0;
        levelUp(lvl);        
    }
    if(score >= 100){
        if(lvl == 11){

        }
        else{
            lvl++;
            modal('level_modal', 'next-to-level', null, null);
            levelUp(lvl);
        }
    }
    if(score == 50 && quiz == true){
        popQuiz();
        quiz = false;
    }
    //control tdrs with mouse
    tdrs.rotation = game.physics.arcade.angleToPointer(tdrs);
    if (game.input.activePointer.isDown)
    {
        fire();
    }
    //control tdrs with keys
    //touch controls?

    //'collision' between signals and satellites
    game.physics.arcade.overlap(signals, glow, signalSuccess, 0, this);
    //make sure glow goes back to purple after going offscreen
    glow.forEach(function(enemy){
        enemy.events.onKilled.add(glowOut, this);
    });
    
}

function glowOut(enemy){
    if(enemy.name = 'open'){
        score -= enemy.damageAmount;
    }
    if(enemy.name = 'hit'){
        enemy.loadTexture('purple');
        enemy.name = 'open';
    }

    
    if(enemy.damageAmount != 3){
        enemy.damageAmount = 3;
    }
    
}

function fire() {

    if (game.time.now > nextFire && signals.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var signal = signals.getFirstDead();

        signal.reset(tdrs.x , tdrs.y );
        signal.width = 150;
        signal.height= 40;
        signal.rotation = game.physics.arcade.angleToPointer(tdrs);
        game.physics.arcade.moveToPointer(signal, 500);
    }

}

function signalSuccess(signal, purple){

    purple.loadTexture('green');
    purple.checkWorldBounds = true;

    if(purple.name != 'hit'){
        score += purple.damageAmount;
    }
    purple.name = 'hit';

    if(first_hit){
        game.paused = true;
        first_hit = false;
       if(lvl == 0){modal('first-hit-modal', 'cont');}
        else if(lvl == 2){modal('first-hit-hubble-modal', 'cont');}
        else if(lvl == 4){modal('first-hit-iss-modal', 'cont');}
        else{return;}
    }
    if(purple.damageAmount == 5 || first_hit_hubble){
        modal('first-hit-hubble-modal', 'hubble-cont');
    }
    if(purple.damageAmount == 10 || first_hit_iss){
        modal('first-hit-iss-modal', 'iss-cont');
    }
    purple.damageAmount = 0;
}

function modal(modal, bttn, nextModal, nextBttn){
    game.paused = true;

    var modal = document.getElementById(modal);
    modal.className = 'modal';

    var positionInfo = modal.getBoundingClientRect();
    var width = positionInfo.width;
    modal.style.height = width;
    if(nextModal != null){
        var next = document.getElementById(nextBttn);
        next.onclick = function(){
            modal.className = '';
            modal = document.getElementById(nextModal);
            modal.className = 'modal';

        }    
    }

    var next = document.getElementById(bttn);
    next.onclick = function(){
        modal.className = '';
        game.paused = false;
        
    }
}

function popQuiz(){
    modal('quiz_modal', 'backToGame');
    var quizData = quizQuestions[lvl];
    questionDiv = document.getElementById("insert-quiz");
    questionDiv.innerHTML += '<p> ' +  quizData.question + ' </p> <form>' + quizQuestions[lvl].choice_1 +  quizQuestions[lvl].choice_2  +  quizQuestions[lvl].choice_3  + quizQuestions[lvl].choice_4 + '</form>';

    var guess = document.getElementById('guessButton');
    var backToGame = document.getElementById('backToGame');

    guess.onclick = function(){

        var playerGuess = document.querySelector('input[name = "answer"]:checked').id;

        
        if(playerGuess == quizQuestions[lvl].correct){
            questionDiv.innerHTML += "<br> <p> <strong>Correct!</strong>   " + quizQuestions[lvl].answer + "</p>" + "<br><p>As a bonus for anwering correctly: </p>" + quizQuestions[lvl].boost_message;
            quizQuestions[lvl].boost();
        }
        else{
            questionDiv.innerHTML += "<br> <p> <strong>Wrong!</strong>   " + quizQuestions[lvl].answer+ "</p>";
        }
        document.getElementById(playerGuess).checked = true;
        guess.style.display = 'none';
        backToGame.style.display = 'block';
        //game.time.events.add(Phaser.Timer.SECOND * quizQuestions[lvl].boost_time ,quizQuestions[lvl].unBoost());
    }
    

    
}


function levelUp(lvl){ 
        
        var levelparams = LevelData[lvl];
        tutorialmessage = levelparams.tutorialmessage;
        tdrs_img = levelparams.tdrs_img;
        title = levelparams.title;
        score = levelparams.score;
        hubble = levelparams.hubble;
        iss = levelparams.iss;
        sat_speed = levelparams.sat_speed;
        gen_modal = levelparams.gen_modal;
        

        satellites.callAll('kill');
        glow.callAll('kill');
        signals.callAll('kill');
        
        
        score = levelparams.score;
        
        intro = false;
        quiz = true;
        var div =document.getElementById('insert-txt');
        div.innerHTML = '';
        questionDiv.innerHTML = '';
}

function render() {
   
}