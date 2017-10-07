//set up the level / canvas

var lvl = -1;
var dy = -3;
var current_tdrs = document.getElementsByClassName("tdrs_image");
tdrs_x = [250, 400, 310, 160, 550, 670, 50, 235, 100];
var interval;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
var slideIndex = 0;
var lvl_multiplier = 1;

ctx.fillStyle = "white";
lvlMessage();

//start a new level

function level(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var paddleRotate = 1;
    //mpaddleRotate = 0;
    var rightPressed = false;
    var  leftPressed = false;
    var firePressed = false;
    var pathdir;
    var rockets = [];
    var satellites = [];
    var channel_1 = (canvas.height / 2) -((canvas.height / 2)/4) *2;
    var channel_2 = (canvas.height / 2) - ((canvas.height / 2)/4) ;
    var channel_3 = (canvas.height / 2);
    var channel_4 = (canvas.height / 2) + ((canvas.height / 2)/4)  ;
    var filled_1 = false;
    var filled_2 = false;
    var filled_3 = false;
    var filled_4 = false;
    var succesRate = 10;
    var timer = 30;
    var this_tdrs = current_tdrs[lvl-1];
    var x = 0;
    var prevTime = 30;
    var bg = document.getElementById("bg");
   

//tdrs constructor

    function tdrs() {       
        ctx.save();
        ctx.translate((canvas.width/2), (canvas.height/2)-canvas.height/3); //let's translate       
        ctx.rotate(Math.PI /180 * paddleRotate); //increment the angle and rotate the image       
        ctx.translate(-((canvas.width/2)), -((canvas.height/2)-canvas.height/3)); //let's translate
        ctx.drawImage(this_tdrs, (canvas.width/2) - canvas.height/8, (canvas.height/2) -canvas.height/3 - canvas.height/8,canvas.height / 5,canvas.height / 5);
    }

//satellite constructor

    function satellite(channel){
        this.glow = document.getElementById("red");
        this.channel = channel;    
        this.connected = false;
        this.returnTime = 0;
        var chooser = Math.random();
       
        this.dx = 2 * lvl_multiplier;
        this.x = 0;

        //place generic satellites at highest and lowest altitude

        if (channel == channel_4 || channel == channel_1){
       
            this.img = document.getElementById("sat-1");
            this.score = 1;
            this.size= 70;
            this.glowOffset = 10;
        
        }
        else if(channel == channel_3){
            if(chooser <0.5){
            this.img = document.getElementById("hubble");
            this.score = 3;
            this.size = 50;
            this.glowOffset = 25;
            }
            else{
                this.img = document.getElementById("sat-1");
                this.score = 1;
                this.size= 70;
                this.glowOffset = 10;
            }
        }
        else{
            if(chooser<0.45){
                this.img = document.getElementById("ISS");
                this.score = 5;
                this.size = 80;
                this.glowOffset = 10;
                }
            else{
                this.img = document.getElementById("sat-1");
                this.score = 1;
                this.size= 70;
                this.glowOffset = 10;    
            }
        }
    }

//comm signal constructor

    function path(dx) {
        this.dx = dx;
        this.x =(canvas.width/2);
        this.y = (canvas.height/2)-canvas.height/3 ;       
    }

//continusously loop through draw to render game

    function draw() {

        //end of level

        if(timer <= 0){ 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rockets.splice(0,rockets.length);
            satellites.splice(0,satellites.length)
            lvl++;
            lvl_multiplier+=0.5; 
            
            lvlMessage();
        }


        if(succesRate <= 0){
            gameOver();
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
       
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bg,0,0, canvas.width, canvas.height);
        ctx.drawImage(antenna,canvas.width/2 - canvas.width / 3,canvas.height-120, 70, 150);
        timer-=0.01;
        if(timer <= prevTime - 5){slideIndex++; prevTime = timer;}
        ctx.font = "25px Raleway";
        
        ctx.fillText(Math.round(timer),50,50);
        ctx.fillText(succesRate,canvas.width - 100,50);

        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(0, canvas.height/2 - canvas.height/3);
        ctx.lineTo(canvas.width/2 + canvas.height /7 , canvas.height/2 - canvas.height/3);
        ctx.stroke();
        ctx.moveTo(canvas.width/2 + canvas.height / 2, canvas.height/2- canvas.height/3);
        ctx.lineTo(canvas.width, canvas.height/2- canvas.height/3);
        ctx.stroke();
        var geosynchronous = "geosynchronous orbit";
        ctx.font = "italic  17px Arial";
         ctx.save();

        ctx.fillText(geosynchronous,canvas.width/2 + canvas.height /3 , canvas.height/2 - canvas.height/3.05);
        
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.rect(canvas.width/2 - canvas.width/5,canvas.height/2 + canvas.height/3.5,canvas.width * 0.6 ,canvas.height/5);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "14px Raleway"
        infoSlider(Math.round(timer));
        
        //randomly add satellites within each height category
        var timedRelease = Math.random();
        if(timedRelease < 0.01){
            if(!(filled_1)){satellites.push(new satellite(channel_1)); filled_1 = true;}
            else if(!(filled_2)){satellites.push(new satellite(channel_2)); filled_2 = true;}
            else if(!(filled_3)){satellites.push(new satellite(channel_3)); filled_3 = true;}
            else if(!(filled_4)){satellites.push(new satellite(channel_4)); filled_4 = true;}
        }
    
        
    //show fired comm signals
        if(firePressed == true){
            for(i = 0; i < rockets.length; i++){
                //move the rockets
                ctx.strokeStyle = "rgba(255,215,0,0.6)";
                ctx.lineWidth = 2;
                rockets[i].x -= rockets[i].dx;
                rockets[i].y -= dy;
            
                ctx.beginPath();     
                ctx.moveTo((canvas.width/2), (canvas.height/2)-canvas.height/3);
                ctx.lineTo(rockets[i].x, rockets[i].y);
                ctx.stroke();        

                //remove comm signal once it goes off screen
                if(rockets[i].y > canvas.height||rockets[i].x > canvas.width - 50 || rockets[i].x <0  ){rockets.splice(i,1);}
            }
        }

for(j = 0; j < satellites.length; j++){
         if(satellites[j].connected == true){
                if(!(satellites[j].returnTime >= timer + 1)){
                    ctx.strokeStyle = "rgba(255,215,0,0.6)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo((canvas.width/2), (canvas.height/2)-canvas.height/3);
                    ctx.lineTo(canvas.width/2 - canvas.width / 3.25,canvas.height-120, 70, 150);
                    ctx.stroke();
                    //ctx.fillText("Space-to-Space Link", canvas.width /2 + satellites[j].dx, satellites[j].channel);
                    //sctx.fillText("Space-to-Ground Link", canvas.width/2 - canvas.width / 2.5,canvas.height-130);
                    }
                }
            }
    //draw tdrs!
    tdrs(); 
    ctx.restore();

    //draw satellites
         for(i = 0; i < satellites.length; i++){        
                ctx.drawImage(satellites[i].glow, satellites[i].x-satellites[i].glowOffset, satellites[i].channel-satellites[i].glowOffset,100,100);
                ctx.drawImage(satellites[i].img,satellites[i].x, satellites[i].channel,satellites[i].size,satellites[i].size);
                
                satellites[i].x += satellites[i].dx;
                //remove satellites when they go offscreen and free up height channel
                if(satellites[i].x > canvas.width || satellites[i].x < -5){ 
                    if(satellites[i].channel == channel_1){
                        filled_1 = false;
                    }
                    if(satellites[i].channel == channel_2){
                        filled_2 = false;

                    }
                    if(satellites[i].channel == channel_3){
                        filled_3 = false;
                    }
                    if(satellites[i].channel == channel_4){
                        filled_4 = false;
                    }
                    
                    succesRate -=satellites[i].score ;
                    satellites.splice(i,1);
                }
            }


           //check for comm signal touching satellite
            for(j = 0; j<satellites.length; j++){
                for(i = 0; i<rockets.length; i++){
                    
                    if(satellites[j].connected == false && (rockets[i].x >= (satellites[j].x - 20)) && (rockets[i].x<= (satellites[j].x + 20)) &&
                    (rockets[i].y >= (satellites[j].channel - 50)) && (rockets[i].y <= (satellites[j].channel + 150))){
                    succesRate += satellites[j].score;
                    satellites[j].glow = document.getElementById("green");
                    satellites[j].connected = true;
                    satellites[j].returnTime = timer;
                    rockets.splice(i,1);
                    }
                
            }
    //move tdrs based on user input 

        if(rightPressed && paddleRotate < 90 ) {
            //if(mousemoved == true){paddleRotate=0;mousemoved=false;}
            paddleRotate+=0.3;
        }
        else if(leftPressed && paddleRotate > -90) {
           // if(mousemoved == true){paddleRotate=0;mousemoved=false;}
            paddleRotate-=0.3;
        }
 
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = true;
        }
        else if(e.keyCode == 37) {
            leftPressed = true; 
        }
        else if(e.keyCode == 32) {
            firePressed = true;
            pathdir = paddleRotate /5;
                if(rockets.length <= 32)
                     rockets.push(new path(pathdir));               
                    }
    }

    function keyUpHandler(e) {
        if(e.keyCode == 39) {
            rightPressed = false;
        }
        else if(e.keyCode == 37) {
            leftPressed = false;
        }   
    }
    interval = setInterval(draw, 10);
}

function lvlMessage(){
    var play = false;
    clearInterval(interval);
    var next = false;
    var cont = true;

        function drawIntro(){
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.font = "28px Raleway";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#202021";
        //ctx.fillRect((canvas.width/8)/2, (canvas.height/8)/2, canvas.width -canvas.width/8, canvas.height-canvas.height/8);    
        ctx.fillStyle = "white"; 
        var text = getLevelMessage();
        var maxWidth = canvas.width - 200;
        var lineHeight = 40;
        var x = (canvas.width)/2;
        var y = 90;
        
        wrapText(ctx, text, x, y, maxWidth, lineHeight);

        if(lvl > 0){
            
            ctx.font = "25px Raleway";
            var maxWidth = canvas.width - 250;
            var lineHeight = 35;
            var x = (canvas.width)/2;
            var y = 120;
            var text2 = getLevelMessage2();
            wrapText(ctx, text2, x, y, maxWidth, lineHeight);
            var y = 190;
            if(next == false){
                var text3 = getLevelMessage3(1);
                wrapText(ctx, text3, x, y, maxWidth, lineHeight);
                cont = false;
             }
            else if (next == true){   
       
               var text4 = getLevelMessage3(0);
               wrapText(ctx, text4, x, y, maxWidth, lineHeight);
               cont = true;
             }
            

        }
        buttons(next);
        
            /*ctx.fillText(levelMessage,canvas.width/2 ,30);
            ctx.fillText(levelMessage2,canvas.width/2 ,60);
            ctx.fillStyle = "white";
            ctx.fillText(levelMessage3,canvas.width/2 ,90);
            var backButton = document.getElementById('back');
            ctx.drawImage(backButton,canvas.width/2 - 110 ,canvas.height/2+120);
           
            var playButton = document.getElementById('play');
            ctx.drawImage(playButton,canvas.width/2 +20 ,canvas.height/2+120);*/

            document.addEventListener("click", onClick, false);
            function onClick(e) {  
                var x = e.clientX;
                var y = e.clientY; 
                if(lvl > 0 && next == false){
                    next = true;

                }
                else if(cont == true){
                   if(x <= canvas.width/2 + canvas.width / 30 && x >=canvas.width/2 - canvas.width / 30 && y <= canvas.height - canvas.height / 7 && y >= canvas.height - canvas.height / 2 ){play = true; }
                }
            }


            if(play == true){

               
                if(lvl>0){
                   
                    lvl+=1;
                    clearInterval(interval);
                    level();
                }
                else if(lvl == 0){
                    lvl+=1;
                    clearInterval(interval);
                    lvlMessage(lvl);
                }
                else if(lvl == -1){
                    ctx.fillStyle = "red";
                    lvl+=1;
                    clearInterval(interval);
                    lvlMessage(lvl);

                }

        }
    }

    interval = setInterval(drawIntro, 10);   
}

function buttons(nxt){
    var next = document.getElementById("next");

    if(lvl == -1){
        ctx.font = "40px Raleway";
        ctx.fillStyle = "white";
        ctx.fillText("NEXT", canvas.width/2 - canvas.width / 40,canvas.height - canvas.height / 5);
        ctx.drawImage(next,canvas.width/2 + canvas.width / 40, canvas.height - canvas.height / 3.5, canvas.width / 20, canvas.width / 20);
    }
    else if(lvl == 0){
                ctx.font = "40px Raleway";
        ctx.fillStyle = "white";
        ctx.fillText("NEXT", canvas.width/2 - canvas.width / 40,canvas.height - canvas.height / 5);
        ctx.drawImage(next,canvas.width/2 + canvas.width / 40, canvas.height - canvas.height / 3.5, canvas.width / 20, canvas.width / 20);
    }
    else if(lvl>0 && nxt == false){
                ctx.font = "40px Raleway";
        ctx.fillStyle = "white";
        ctx.fillText("NEXT", canvas.width/2 - canvas.width / 40,canvas.height - canvas.height / 8);
        ctx.drawImage(next,canvas.width/2 + canvas.width / 40, canvas.height - canvas.height / 5, canvas.width / 20, canvas.width / 20);
    }
    else{
        ctx.font = "40px Raleway";
        ctx.fillStyle = "white";
        ctx.fillText("PLAY", canvas.width/2 - canvas.width / 40,canvas.height - canvas.height / 8);
        ctx.drawImage(next,canvas.width/2 + canvas.width / 40, canvas.height - canvas.height / 5, canvas.width / 20, canvas.width / 20);
    }
}
function getLevelMessage(){
    switch(lvl){
        case 1:
        levelMessage = "TDRS-C (TDRS-3) – Launched September 29, 1988";
        break;
        case 2:
        levelMessage = "TDRS-E(TDRS-5) – Launched August 02, 1991";
        break;
        case 3:
        levelMessage = "TDRS-F (TDRS-6) – Launched January 13, 1993";
        break;
        case 4:
        levelMessage = "TDRS-G (TDRS-7) – Launched July 13, 1995";
        break;
        case 5:
        levelMessage = "TDRS-H (TDRS-8) – Launched June 30, 2000";
        break;
        case 6:
        levelMessage = "TDRS-I (TDRS-9) – Launched March 8, 2002";
        break;
        case 7:
        levelMessage = "TDRS-J (TDRS-10) – Launched December 4, 2002";
        break;
        case 8:
        levelMessage = "TDRS-K (TDRS-11) – Launched January 30, 2013";
        break;
        case 9:
        levelMessage = "TDRS-L (TDRS-12) – Launched January 23, 2014";
        break;
        case 10:
        levelMessage = "TDRS-M – Scheduled for Launch Summer 2017";
        break;
        case 11:
        levelMessage = "Congratulations! You have succesfully relayed data through all nine of the TDRS Satellites, enabling the success of missions inlcuding the Hubble Space Telescope and International Space Station! The Exploration and Space Communications division innovates the future of space communications. Moving forward, challenges will increase as the world sends more spacecraft into orbit, seeking a better understanding of the universe and our role in it. ESC’s team of experts will be there every step of the way to provide superior communications services that connect astronauts and spacecraft to their teams on Earth.Over the next several years, the Space Network Ground Segment Sustainment project will work to update the Space Network’s ground stations, which partner with TDRS to deliver data to customers. As missions require increasingly higher data rates, ESC is looking into a new technology: laser communications. By encoding data into beams of light and shooting them to ground stations on Earth, NASA could move exponentially larger amounts of data in a single second than ever before. The next laser communications pathfinder mission, Laser Communications Relay Demonstration, is expected to launch in 2019.";
        break;
        case 0:
        levelMessage = "How To Play" ;
        break;
        case -1:
        levelMessage = "Started in the early 1970's, the Tracking and Data Relay Satellite (TDRS) comprises the space segment of the Space Network. NASA Goddard Space Flight Center manages the development and operations of the TDRS satellites. The current Tracking and Data Relay Satellite configuration consists of nine in-orbit satellites (four first generation, three second generation and two third generation satellites) distributed to provide near continuous information relay service to missions like the Hubble Space Telescope (HST) and the International Space Station (ISS)";
        break;
    }
    return levelMessage;
}
function getLevelMessage2(){
    if(lvl == 1 || lvl == 2 || lvl == 3 || lvl == 4){
        levelMessage2 = "First Generation TDRS:";
    }
    else if(lvl == 5 || lvl ==6 || lvl ==7){
        levelMessage2 = "Second Generation TDRS:";
    }
    else if(lvl==0){
        levelMessage3 = "Use the left and right arrow keys to aim the TDRS and the space key to send communication signals from passing satellites.  ";
    }
    else if(lvl<11){
        levelMessage2 = "Third Generation TDRS:";
    }
    
    return levelMessage2;
}
function getLevelMessage3(num){
  
    if(lvl == 1 || lvl == 2 || lvl == 3 || lvl == 4){
        levelMessage3 = "TDRS, positioned above Earth in geosynchronous orbit, confirmed that theory, improving the coverage of NASA’s communications network from 15 percent to more than 95 percent. The project also significantly reduced network operations costs and increased the number of spacecraft the network could connect with at one time from two to 20. The development of this system modernized NASA’s communications network to keep pace with current and future customer needs. In fact, these spacecraft far outlived their 10-year operational lifespans. Some of them even continue to operate today.";
        levelMessage4 = "NASA developed the Tracking and Data Relay Satellites (TDRS) to provide nearly continuous, around-the-clock communications coverage for spacecraft in low-Earth orbit. By the 1970s when the project began in earnest, more than 50 spacecraft required NASA space communications support. The cost of maintaining ground stations was rising and the ground-based networks only achieved coverage during about 15 percent of a spacecraft’s orbit. NASA needed a more efficient network, and they theorized space-based satellites could help resolve these challenges.";
                 
    }
    else if(lvl == 5 || lvl ==6 || lvl ==7){
        levelMessage3 = "Shortly after the completion of TDRS’s first-generation constellation, the team commissioned a second generation of satellites to implement new technology and to support customers’ evolving requirements. Improvements in data-collection technology required higher-bandwidth connections capable of delivering larger volumes of data per second. TDRS H, I and J would not succeed the first generation of satellites, but join them, expanding the capabilities of the fleet.";
        levelMessage4 = "With new components and systems, the team increased data rates to more than 30 times that of the first-generation fleet and increased power transmission significantly. Ka-band capability was also added, enabling much larger transmissions and international compatibility with European and Japanese systems in case of emergencies. These spacecraft launched between 2000 and 2002, and all three continue to operate to this day.";
    }
    else if(lvl<11){
        levelMessage3 = "As NASA began to decommission the first generation of TDRS spacecraft shortly before 2010, the agency commissioned a third generation of spacecraft to replenish the fleet, ensuring its continued operations and reliability for years to come.";
        levelMessage4 = "With more data moving today than ever before, the new spacecraft must be able to support higher data volumes and increased transmission rates. The team must also improve the agility of the system overall. The third TDRS generation uses ground-based beam-forming, a departure from the system used in the second generation. Ground-based beam-forming provides more flexible communications services and even the ability to tailor services for each customer. The first third-generation spacecraft, TDRS-K, launched in 2013, and the final one, TDRS-M, is expected to launch in 2017. ";
    }
    else LevelMessage3 = "";
    if(num==1){return levelMessage3;}
    else{return levelMessage4;}
    
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        ctx.textAlign="center"; 
        context.fillText(line, x, y);
}

function gameOver(){
    clearInterval(interval);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function infoSlider(timer){
    var information = ["The SN provides communications and navigation services for a variety of missions/users, including launch vehicles, satellites/satellite busses, payloads, and researchers on Earth (e.g., South Pole locations)."
     , "The SN is currently composed of a fleet of relay satellites, known as the Space Segment, and associated ground systems, known as the Ground Segment.  The SN Space Segment’s fleet includes the Tracking and Data Relay Satellites (TDRS), located in geosynchronous orbit, and serves as a data relay system between the SN ground systems and the user platforms."
     , "The tandem RF/optical signal path from an SN Ground Segment terminal through a relay satellite and on to a customer/user platform is referred to as a forward link.  The tandem RF/optical signal path from a customer/user platform to the relay satellite and back to a ground terminal is referred to as a return link."
     ,"The portion of a forward or return link that connects a ground terminal with the relay satellite is referred to as a Space-to-Ground Link (SGL); the portion of a forward or return link that connects the relay satellite with a customer/user platform is referred to as a Space-to-Space Link (SSL)"
     ];  
    
    if(slideIndex > information.length-1){
        slideIndex = 0;
    }
    
    wrapText(ctx, information[slideIndex], canvas.width/2 + canvas.width/10,canvas.height/2 + canvas.height/3, canvas.width *0.5, canvas.height/25);
    

}