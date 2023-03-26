/*************************************\
| Update to Air Hockey - Glow Edition |
| ----------------------------------- |
|   Check Out The Settings Menu For   |
|         Special Game Options!       |
\*************************************/


/**Variables**/
var puckSize = 20;
var colorCounter = 0; //Used for "Rainbow" coloring as timer
var puckGlowColor = color(0,0,255,13);
var paddleSize = 40;
var RedOnSide = false;
var GreenOnSide = true;

var paused = true;
var justStarted = true;
var mousePos = false; //Display mouse coordinates
var showPuckPos = false;
var settings = false;

var about = false;
var rainbowPuck = false;
var rainbowBorder = false;
var gameover = false;

var onePlayer = true;
var borderShape = "rectangle";
var displayOval = true;
var topFocus;
var bottomFocus;
var outside = false;

frameRate(60);

var drawLine = function(x1,y1,x2,y2, r, g, b) {
    // glow
    strokeWeight(10);
    stroke(r, g, b, 90);
    line(x1,y1,x2,y2);
    // Line
    stroke(0);
    strokeWeight(6);
    line(x1,y1,x2,y2);
};

var glowLine =function(x1,y1,x2,y2, glowColor, vertical){
    var StrokeWeight=9;
    /**Glow**/
    if(rainbowBorder){
        colorMode(HSB);
        stroke(colorCounter,255,255,20);
        colorMode(RGB);
    }else{
        stroke(glowColor);
    }
    if(borderShape !== "oval"){
    for(var i=0;i<20;i++){
        strokeWeight(StrokeWeight+(i*1.3));
        if(vertical){
            line(x1,y1+(StrokeWeight/1.75),x2,y2-(StrokeWeight/1.75));
        } else {
            line(x1+(StrokeWeight/1.75),y1,x2-(StrokeWeight/1.75),y2);
        }
    }
    }
    /**Inner Line**/
    stroke(255, 255, 255,230);
    strokeWeight(StrokeWeight);
    line(x1,y1,x2,y2);
};

var glowArc =function(xpos, ypos, w, h, startRotate, stopRotate, glowColor){
    var StrokeWeight=9;
    /**Glow**/
    if(rainbowBorder){
        colorMode(HSB);
        stroke(colorCounter,255,255,10);
        colorMode(RGB);
    }else{
        stroke(glowColor);
    }
    noFill();
    for(var i=0;i<15;i++){
        strokeWeight(StrokeWeight+(i*1.5));
        arc(xpos, ypos, w, h, startRotate, stopRotate);
    }
    /**Inner Line**/
    stroke(255, 255, 255,220);
    strokeWeight(StrokeWeight);
    arc(xpos, ypos, w, h, startRotate, stopRotate);
};

var drawArc = function(xpos, ypos, w, h, startRotate, stopRotate) {
    noFill();
    // glow
    strokeWeight(10);
    stroke(255, 255, 255, 90);
    arc(xpos, ypos, w, h, startRotate, stopRotate);
    
    // Line
    stroke(0, 0, 0);
    strokeWeight(4);
    arc(xpos, ypos, w, h, startRotate, stopRotate);
};

var pauseButton = function (xpos, ypos, size){
    noFill();
    // glow
    if(dist(mouseX, mouseY, xpos, ypos) < size/1.5){
        strokeWeight(12);
    } else {
        strokeWeight(9);
    }
    stroke(0, 255, 255, 130);
    ellipse(xpos, ypos, size, size);
    
    // Line
    stroke(150, 255, 255);
    strokeWeight(5);
    ellipse(xpos, ypos, size, size);
    
    rectMode(CENTER);
    fill(0, 255, 242);
    rect(xpos,ypos-(size/7),size/2.5,size/15, 5);
    rect(xpos,ypos+(size/7),size/2.5,size/15, 5);
    mouseClicked = function(){
        if(!paused && dist(mouseX, mouseY, xpos, ypos) < size/1.5){
            paused = true;
        }
    };
};

/**Paddle Function**/
var player2Y = 105;
var player2X = width/2;
var player1Y = 395;
var player1X = width/2;
var AI_MOVE_SPEED = 5;

/**2 Player Movement Variables**/
var PLAYER_MOVE_SPEED = 8;
var xv = 0;
var yv = 0;
var xa = 0;
var ya = 0;
var x1Pos = 100;
var y1Pos = height/2;
var x2Pos = width-100;
var y2Pos = height/2;
var keys = [];
var keyPressed = function() { 
  keys[keyCode] = true;
};
var keyReleased = function() { 
  keys[keyCode] = false; 
};

var Paddle = function(x,y,c,player){
    this.pos = new PVector(x,y);
    this.vel = new PVector(0,0);
    this.accel = new PVector(0,0);
    this.c = c;
    this.s = paddleSize;
    this.player = player;
};//vars
Paddle.prototype.update = function(){
    this.vel.add(this.accel);
    this.accel.mult(0);
    this.pos.add(this.vel);
    this.vel.mult(0.99);
    while(this.vel.mag()>10){
        this.vel.div(1.1);
    }
    
    /**Positioning**/
    if(onePlayer){
        if(this.player === 1){
            this.pos.set(
              min(max(mouseX, width*0.18), width/1.2),
              min(max(mouseY, height/2), height/1.15));
            if(mouseY > height/2 && mouseY < height/1.5 && mouseX > width*0.25 && mouseX < width/1.4) {
                RedOnSide = true;
            }
        }
        if(this.player === 2){
            this.pos.set(
              min(max(player2X, width*0.18), width/1.2),
              min(max(player2Y, 50), height/2));
        }
    } else {
        if(this.player === 1){
            this.pos.set(
              min(max(x1Pos, 80), 395),
              min(max(y1Pos, 110), height-110));
        }
        if(this.player === 2){
            this.pos.set(
              min(max(x2Pos, width/2), width-80),
              min(max(y2Pos, 110), height-110));
        }
        
        /**Move Green Paddle**/
        if (keyIsPressed && keys[UP] && y2Pos>150) { //this checks if up arrow is pressed
            yv = yv - (PLAYER_MOVE_SPEED/10);
        } //move Up
        if (keyIsPressed && keys[DOWN] && y2Pos<height-150) {
            yv = yv + (PLAYER_MOVE_SPEED/10);
        } //move Down
        if (keyIsPressed && keys[LEFT] && x2Pos>width/2+40) {
            xv = xv - (PLAYER_MOVE_SPEED/10);
        } //move Left
        if (keyIsPressed && keys[RIGHT] && x2Pos<width-110) {
            xv = xv + (PLAYER_MOVE_SPEED/10);
        } //move Right
        xv = xv * 0.9; //slowing it down
        yv = yv * 0.9;
        x2Pos += xv; //setting the positions to the positions + movement
        y2Pos += yv;
        fill(255, 255, 255);
            
        /**Move Red Paddle**/
        if (keyIsPressed && keys[87] && y1Pos>150) { //this checks if up arrow is pressed
            ya = ya - (PLAYER_MOVE_SPEED/10);
        } //move Up
        if (keyIsPressed && keys[83] && y1Pos<height-150) {
            ya = ya + (PLAYER_MOVE_SPEED/10);
        } //move Down
        if (keyIsPressed && keys[65] && x1Pos>110) {
            xa = xa - (PLAYER_MOVE_SPEED/10);
        } //move Left
        if (keyIsPressed && keys[68] && x1Pos<width/2-40) {
            xa = xa + (PLAYER_MOVE_SPEED/10);
        } //move Right
        xa = xa * 0.9; //slowing it down
        ya = ya * 0.9;
        x1Pos += xa; //setting the positions to the positions + movement
        y1Pos += ya;
    }
}; //Positioning
Paddle.prototype.bounce = function(pos){
    var bounce = false;
    if (dist(pos.x,pos.y,this.pos.x,this.pos.y)<(this.s/2) + puckSize && !bounce){
        this.repel = PVector.sub(this.pos,pos);
        fill(255,255,255,50);
        //ellipse(this.pos.x-this.repel.x/2,this.pos.y-this.repel.y/2,20,20);
        this.repel.normalize();
        this.repel.div(dist(pos.x,pos.y,this.pos.x,this.pos.y)-this.s/100);
        this.repel.mult(25);
        this.vel.add(this.repel*2);
        bounce = true;
    } else { bounce = true;}
}; //bounce
Paddle.prototype.display = function(){
    noFill();
    var StrokeWeight=15;
    /**Glow**/
    stroke(this.c[0],this.c[1],this.c[2],this.c[3]);
    for(var i=0;i<20;i++){
        strokeWeight(StrokeWeight+i);
        ellipse(this.pos.x,this.pos.y,this.s,this.s);
    }
    /**Inner Line**/
    stroke(255, 255, 255,100);
    for(var i=0;i<20;i+=2){
        strokeWeight(StrokeWeight);
        ellipse(this.pos.x,this.pos.y,this.s,this.s);
    }
}; // ball details
Paddle.prototype.control = function(){
    if(onePlayer){
    this.pos.set(mouseX, mouseY);
    }
};
Paddle.prototype.run = function(){
    this.update();
    this.display();
};

/**Puck Function**/
var pucks = [];
var positions = [];
if(onePlayer){
   positions = [[width/2,height/2],[190,250],[310,250],[250,190],[250,310],[115,250],[380,250]];
} else {
   positions = [[width/2,height/2],[190,250],[310,250],[250,190],[250,310],[250,115],[250,380]];
}
var posPlacement = [45,80,115,150,185,220,255];
var puckAngle = [0,0,0,0,0,0,0];

var Puck = function(x,y){
    this.pos = new PVector(x,y);
    this.vel = new PVector(0,0);
    this.accel = new PVector(0,0);
    this.s = puckSize;
    this.inHole = false;
}; //vars
Puck.prototype.update = function(){
    this.vel.add(this.accel);
    this.accel.mult(1.01);
    this.pos.add(this.vel);
    this.vel.mult(0.99);
    while(this.vel.mag()>50){
        this.vel.div(1.1);
    }
    if(borderShape === "rectangle"){
        if(onePlayer){
            if (this.pos.y<40){
                this.vel.y=abs(this.vel.y);
            }
            if (this.pos.y>height-40){
                this.vel.y=-abs(this.vel.y);
            }
            if (this.pos.x<90){
                this.vel.x=abs(this.vel.x);
            }
            if (this.pos.x>width-95){
                this.vel.x=-abs(this.vel.x);
            }
        } else {
            if (this.pos.y<90){
                this.vel.y=abs(this.vel.y);
            }
            if (this.pos.y>height-90){
                this.vel.y=-abs(this.vel.y);
            }
            if (this.pos.x<45){
                this.vel.x=abs(this.vel.x);
            }
            if (this.pos.x>width-45){
                this.vel.x=-abs(this.vel.x);
            }
        }
    } else if(borderShape === "oval"){
        if(onePlayer){
            if(dist(this.pos.x,this.pos.y,width/2,height/2) <= 20+(sq(this.pos.x-width/2)/(width/2.55)  )+(sq(this.pos.y-height/2)/(height/2.05)) && dist(this.pos.x,this.pos.y,width/2,height/2) > (height/5)){ //Width -> Height
                //this.vel.x = 0;
                //this.vel.y = 0;
                if(this.pos.x < width/2){
                    if(this.vel.x < 4){
                        this.vel.x+=2;
                    }
                    
                    if(this.pos.y > 405 && this.pos.y < 430){
                        this.vel.x=abs(this.vel.y);
                    } else {
                        this.vel.x=abs(this.vel.x);
                    }
                    
                } else if(this.pos.x > width/2){
                    if(this.vel.x < 4){
                        this.vel.x+=2;
                    }
                    
                    if(this.pos.y > 405 && this.pos.y < 430){
                        this.vel.x=-abs(this.vel.y);
                    } else {
                        this.vel.x=-abs(this.vel.x);
                    }
                }
                
                if(this.pos.y > 405 && this.pos.y < 430){
                    this.vel.y=-abs(this.vel.x);
                } else if(this.pos.y > 70 && this.pos.y < 95){
                    this.vel.y=abs(this.vel.x);
                } else if(this.pos.y < 135){
                    this.vel.y=abs(this.vel.y);
                } else if(this.pos.y > 370){
                    this.vel.y=-abs(this.vel.y);
                }
                
                outside = true;
            }else {
                outside = false;
            }
        } else{
            if(dist(this.pos.x,this.pos.y,width/2,height/2) <= 20+(sq(this.pos.x-width/2)/255   )+(sq(this.pos.y-height/2)/181) && dist(this.pos.x,this.pos.y,width/2,height/2) > 100){
                if(this.pos.y < height/2){
                    if(this.vel.y < 4){
                        this.vel.y+=2;
                    }
                    this.vel.y=abs(this.vel.y);
                } else if(this.pos.y > height/2){
                    if(this.vel.y < 4){
                        this.vel.y+=2;
                    }
                    this.vel.y=-abs(this.vel.y);
                }
                
                if(this.pos.x < 135){
                    this.vel.x=abs(this.vel.x);
                } else if(this.pos.x > 370){
                    this.vel.x=-abs(this.vel.x);
                }
                
                outside = true;
            }else {
                outside = false;
            }
        }
    }
    this.ihHole=false;
    
   /**Speed Control**/    
    if(this.vel.x > 20){
        this.vel.x = 20;
    }else if(this.vel.x < -20){
        this.vel.x = -20;
    }
    
    if(this.vel.y > 20){
        this.vel.y = 20;
    }else if(this.vel.y < -20){
        this.vel.y = -20;
    }
}; //walls & speed
Puck.prototype.bounce = function(pos){
    var bounce = false;
    if (dist(pos.x,pos.y,this.pos.x,this.pos.y)<(this.s/2) + paddleSize && !bounce){
        if(pos.y<=width/2 && GreenOnSide || pos.y>=width/2 && RedOnSide){
        this.repel = PVector.sub(this.pos,pos);
        this.repel.normalize();
        this.repel.div((dist(pos.x,pos.y,this.pos.x,this.pos.y)-this.s)/100);
       /**Speed Control**/
        if(this.repel > 20){
            this.repel = 20;
        }else if(this.repel < -20){
            this.repel = -20;
        }
        this.vel.add(this.repel);
        bounce = true;
        }
    } else {bounce = false;}
}; //bounce
Puck.prototype.display = function(){
    colorMode(RGB);
    fill(255, 255, 255);
    var StrokeWeight=15;
   /**Glow**/
    if(rainbowPuck){
        colorMode(HSB);
        puckGlowColor = color(colorCounter, 255, 255, 13);
        stroke(puckGlowColor);
        colorMode(RGB);
    }else{
        colorMode(RGB);
        stroke(puckGlowColor);
    }
    for(var i=0;i<20;i++){
        strokeWeight(StrokeWeight+i);
        ellipse(this.pos.x,this.pos.y,this.s,this.s);
    }
   /**Inner Line**/
    stroke(255, 255, 255,100);
    for(var i=0;i<20;i+=2){
        strokeWeight(StrokeWeight);
        ellipse(this.pos.x,this.pos.y,this.s,this.s);
    }
}; // ball details
Puck.prototype.control = function(){
    //this.pos.set(mouseX, mouseY);
};
Puck.prototype.run = function(){
    if(showPuckPos){
        /**Puck Angle**/
        for(var k = 0;k<pucks.length;k++){
            if(pucks[k].vel.y < 0){
                puckAngle[k] = atan2(pucks[k].vel.y,pucks[k].vel.x);
                puckAngle[k] += 2*abs(puckAngle[k]);
            } else if(pucks[k].vel.y > 0){
                puckAngle[k] = atan2(-pucks[k].vel.y,-pucks[k].vel.x);
                puckAngle[k] += 2*abs(puckAngle[k]);
                puckAngle[k] += 180;
            }
        }
        /**Display**/
        textSize(15);
        fill(255, 255, 255);
        text(round(pucks[0].pos.x)+" & "+round(pucks[0].pos.y),32,posPlacement[0]);
        text(round(puckAngle[0])+ " Deg.",30,posPlacement[0]+15);
        if(pucks.length >= 2){
            text(round(pucks[1].pos.x)+" & "+round(pucks[1].pos.y),32,posPlacement[1]);
            text(round(puckAngle[1])+ " Deg.",30,posPlacement[1]+15);
        }
        if(pucks.length >= 3){
            text(round(pucks[2].pos.x)+" & "+round(pucks[2].pos.y),32,posPlacement[2]);
            text(round(puckAngle[2])+ " Deg.",30,posPlacement[2]+15);
        }
        if(pucks.length >= 4){
            text(round(pucks[3].pos.x)+" & "+round(pucks[3].pos.y),32,posPlacement[3]);
            text(round(puckAngle[3])+ " Deg.",30,posPlacement[3]+15);
        }
        if(pucks.length >= 5){
            text(round(pucks[4].pos.x)+" & "+round(pucks[4].pos.y),32,posPlacement[4]);
            text(round(puckAngle[4])+ " Deg.",30,posPlacement[4]+15);
        }
        if(pucks.length >= 6){
            text(round(pucks[5].pos.x)+" & "+round(pucks[5].pos.y),32,posPlacement[5]);
            text(round(puckAngle[5])+ " Deg.",30,posPlacement[5]+15);
        }
        if(pucks.length >= 7){
            text(round(pucks[6].pos.x)+" & "+round(pucks[6].pos.y),32,posPlacement[6]);
            text(round(puckAngle[6])+ " Deg.",30,posPlacement[6]+15);
        }
    }
    this.update();
    this.display();
};

/**Play Function**/
//Variables
var redScore = 0;  //variable to keep track of current score
var greenScore = 0;
var cdnumber = 145;
var tempCdNumber = cdnumber;
var numberOfPucks = 1;
var wallTrans = 20;

//Create Objects
var paddles = [];
paddles.push(new Paddle(player1X, player1Y, [255, 0, 0, 25], 1));//Red Paddle
paddles.push(new Paddle(player2X, player2Y, [0, 255, 0, 25], 2));//Green Paddle

var createPucks = function(){
    if (numberOfPucks < 1){
        numberOfPucks = 1;
    }
    if (numberOfPucks > positions.length){
        numberOfPucks = positions.length;
    }
    
    if(paused){
        for(var i=0;i < pucks.length;i++){
            pucks.splice(i,1);
        }
    }
    if (pucks.length < numberOfPucks){
        for(var n=0;n<numberOfPucks;n++){
            //fix the array input
            if (pucks.length < numberOfPucks){
                pucks.push(new Puck(positions[n][0], positions[n][1]));
            }
        }
    }
};
var countdown = function(){
    fill(255, 255, 255);
    if(cdnumber > -21){
        if(cdnumber > puckSize){
            fill(255, 255, 255);
            var StrokeWeight=15;
            /**Glow**/
            if(rainbowPuck){
                colorMode(HSB);
                puckGlowColor = color(colorCounter, 255, 255, 13);
                stroke(puckGlowColor);
                colorMode(RGB);
            }else{
                colorMode(RGB);
                stroke(puckGlowColor);
            }
            for(var i=0;i<20;i++){
                strokeWeight(StrokeWeight+i);
                ellipse(width/2,height/2,cdnumber,cdnumber);
            }
            /**Inner Line**/
            stroke(255, 255, 255,100);
            for(var i=0;i<20;i+=2){
                strokeWeight(StrokeWeight);
                ellipse(width/2,height/2,cdnumber,cdnumber);
            }
        }
        cdnumber-=4;
    }
    if (cdnumber < 19){
        createPucks();
    }
};
var hole = function(x,y,count){
    var holeW,holeH;
    if(onePlayer){
        holeW = 95;
        holeH = 30;
    } else {
        holeW = 30;
        holeH = 95;
    }
    
    var cdReset = function(){
        cdnumber=120;
        for(var i=0;i < pucks.length;i++){
            pucks[i].inHole=false;
        }
    };
    
    noFill();
    noStroke();
    /*fill(255, 0, 0);
    stroke(235, 221, 235);*/
    rectMode(CENTER);
    rect(x,y,holeW,holeH);
    rectMode(TOP);
    for(var i=0;i < pucks.length;i++){
        if (pucks[i].pos.x>x-holeW/2 && pucks[i].pos.x<x+holeW/2 && pucks[i].pos.y>y-holeH/2 && pucks[i].pos.y<y+holeH/2){
            pucks[i].inHole=true;
        }
        if (pucks[i].inHole===true){
            if(pucks.length>=1){
                pucks.splice(i,1);
                i=0;
            }
            
            if(count === 0) {
                redScore++;
            } else {
                greenScore++;
            }
            
            cdReset();
            countdown();
            
            //pucks[i].inHole=false;
        }
    }
};
var AI = function(pos){
    var goHome = function(){
        if(abs(player2Y-height/4)<2){
            player2Y=height/4;
        }else if(player2Y>height/4){
            player2Y -= AI_MOVE_SPEED/2;
        } else{
            player2Y += AI_MOVE_SPEED/2;
        }
        if(abs(player2X-width/2)<1.5){
            player2X=width/2;
        }else if(player2X>width/2){
            player2X -= AI_MOVE_SPEED;
        } else{
            player2X += AI_MOVE_SPEED;
        }
    };
    
    if (pos.y < height/2){
        /**Back Away**/
        if (pos.x<100 || pos.x>width-100 || pos.y<45 || borderShape === "oval" && dist(pos.x,pos.y,width/2,height/2) <= 20+(sq(pos.x-width/2)/180)+(sq(pos.y-height/2)/250)){
            goHome();
        }else{
            /**Puck X**/
            /*if (abs(player2X-pos.x)/1.1 < PLAYER_MOVE_SPEED){
                player2X = pos.x;
            }*/
            if (player2X> pos.x) {
                player2X -= AI_MOVE_SPEED;
            }
            if (player2X-pos.x <= AI_MOVE_SPEED) {
                player2X += AI_MOVE_SPEED;
            }
            
            /**Puck Y**/
            if (abs(player2Y-pos.y) < AI_MOVE_SPEED){
                player2Y = pos.y;
            }
            if (player2Y > pos.y+50) {
               player2Y -= AI_MOVE_SPEED;
            }
            if (player2Y-pos.y <= AI_MOVE_SPEED) {
                player2Y += AI_MOVE_SPEED;
            }
        }
    } else{
        goHome();
    }
};
    
/**Pause Menu Variables**/
var selectedColor = 0; //Used to determine puck color
var showcaseSize = 20;
var showcaseBlueSize = 20;
var showcasePinkSize = 20;
var showcaseYellowSize = 20;
var showcaseRainbowSize = 20;
var offSideWarning = false;
var borderOptions = false;
var borderType = 2;
var displayFps = false;

var pauseMenu = function(){
    //Background & Border
    var StrokeWeight=9;
    stroke(0);
    fill(0);
    rect(width/2,height/2,270,300,10);
    fill(255, 255, 255);
    textSize(35);
    text("Glow Hockey", width/2,height/3);
    //Glow
    colorMode(HSB);
    stroke(frameCount%255,255,255,25);
    colorMode(RGB);
    rectMode(CENTER);
    for(var i=0;i<20;i++){
        strokeWeight(StrokeWeight+(i*1.3));
        noFill();
        rect(width/2,height/2,250,300,1);
    }
    //Inner Line
    stroke(255, 255, 255,100);
    for(var i=0;i<20;i+=2){
        strokeWeight(StrokeWeight);
        rect(width/2,height/2,250,300,2);
    }

    /**Pause Buttons**/
    var btnW = 150;
    var btnH = 45;
    var button = function(x,y,txt, btnHeight){
        if(btnHeight !== undefined){
            btnH = btnHeight;
        } else {
            btnH = 45;
        }
        //Glow
        colorMode(HSB);
        stroke(frameCount%255,255,255,25);
        colorMode(RGB);
        rectMode(CENTER);
        fill(0, 0, 0);
        for(var i=0;i<10;i++){
            strokeWeight(StrokeWeight+(i*1.85));
            rect(x,y,btnW,btnH,15);
        }
        //Inner Line
        noFill();
        stroke(255, 255, 255);
        strokeWeight(StrokeWeight);
        rect(x,y,btnW,btnH,15);
        
        textAlign(CENTER);
        textSize(40);
        fill(255, 255, 255);
        if(btnHeight !== undefined){
            text(txt, x , y+btnH/2.8);
        } else{
            text(txt, x , y+btnH/3.5);
        }
    };
    /**Clicking**/
    if(!settings && !about && !offSideWarning){
        if(justStarted){
            button(width/2,height/2.5, "Start");
            button(width/2,height/1.55, "About");
        } else{
            button(width/2,height/2.5, "Restart");
            button(width/2,height/1.55, "Resume");
            
            fill(0, 0, 0);
            ellipse(60,height-60,100,100);
            if(!rainbowBorder){
                rainbowBorder = true;
                glowArc(60,height-60,100,100,0,360,color(255,0,0,wallTrans));
                rainbowBorder = false;
            } else{
                glowArc(60,height-60,100,100,0,360,color(255,0,0,wallTrans));
            }
            fill(255, 255, 255);
            rect(60,height-50,35,30);
            rect(43,height-80,0,20);
            triangle(35,height-70,60,height-90,81,height-71);
            stroke(0, 0, 0);
            rect(60,height-40,5,20);
        }
        button(width/2,height/1.92, "Settings");
    
        mouseClicked = function(){
            if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/2.5-btnH/2 && mouseY < height/2.5+btnH/2){
                if(justStarted){
                    //Start
                    offSideWarning = true;
                    justStarted = false;
                }else{
                    /**Restart**/
                    for(var i=0;i < pucks.length;i++){
                        pucks.splice(i,1);
                        i=0;
                    }
                    player2Y = 105;
                    player2X = width/2;
                    redScore = 0;
                    greenScore = 0;
                    cdnumber=100;
                    if(onePlayer){
                       positions = [[width/2,height/2],[190,250],[310,250],[250,190],[250,310],[115,250],[380,250]];
                    } else {
                       positions = [[width/2,height/2],[190,250],[310,250],[250,190],[250,310],[250,115],[250,380]];
                    }
                    createPucks();
                    paused = false;
                }
            }else if(mouseX>width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.92-btnH/2 && mouseY < height/1.92+btnH/2){
                //Settings
                settings = true;
            } else if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.55-btnH/2 && mouseY < height/1.55+btnH/2){
                if(justStarted){
                    //About
                    about = true;
                }else{
                    //Resume
                    paused = false;
                }
            } else if(dist(mouseX,mouseY,60,height-60)<50 && !offSideWarning){
                justStarted = true;
                for(var i=0;i < pucks.length;i++){
                    pucks.splice(i,1);
                    i=0;
                }
                player2Y = 105;
                player2X = width/2;
                redScore = 0;
                greenScore = 0;
                cdnumber=100;
            }
        };
    }
    
    /**OffSide Warning**/
    if(offSideWarning){
        stroke(0);
        fill(0);
        rect(width/2,height/2,215,262, 3);
        
        fill(255, 255, 255);
        textAlign(LEFT);
        textSize(28);
        text("Your Paddle can only touch the Puck if its onside! \n(The lower half of the screen)",width/2.9,height/3.5,200, 200);
        textAlign(CENTER);
        button(width/2,height/1.55, "Close");
        
       /**Clicking**/
        mouseClicked = function(){
            if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.55-btnH/2 && mouseY < height/1.55+btnH/2){
                offSideWarning = false;
                paused = false;
            }
        };
    }
    
    /**Settings Menu**/
    if(settings){
        /**Backround**/
        stroke(0);
        fill(0);
        rect(width/2,height/2,215,262, 3);
        button(width/2,height/1.5, "Back", 40);
        
        /**Actual Settings**/
    
        var showcasePuck = function(x,y,showcaseColor,size){
            colorMode(RGB);
            fill(255, 255, 255);
            var StrokeWeight=15;
            //Glow
            stroke(showcaseColor);
            for(var i=0;i<20;i++){
                strokeWeight(StrokeWeight+i);
                ellipse(x,y,size,size);
            }
            //Inner Line
            stroke(255, 255, 255,100);
            for(var i=0;i<20;i+=2){
                strokeWeight(StrokeWeight);
                ellipse(x,y,size,size);
            }
        };
        
        /**Puck Color**/
        textSize(25);
        if(!borderOptions){
            text("Choose Puck Color",width/2, height/3.37);
        }
        var showPuckX = width/2, showPuckY = height/2.93;
        /**Colors**/
        showcasePuck(showPuckX/1.35,showPuckY,color(0,0,255,25),showcaseBlueSize); //Blue
        showcasePuck(showPuckX/1.11,showPuckY,color(255,0,255,25),showcasePinkSize); //Pink
        showcasePuck(showPuckX*1.08,showPuckY,color(255,255,0,25),showcaseYellowSize); //Yellow
        colorMode(HSB);
        showcasePuck(showPuckX*1.26,showPuckY,color(colorCounter,255,255,25),showcaseRainbowSize);
        colorMode(RGB);
        
        /**Selected Color**/
        if(selectedColor === 0){
            showcaseBlueSize = (-2.5 * cos(showcaseSize)) + puckSize;
            showcaseSize += 12.5; //Blue selected
        }else if(selectedColor === 1){
            showcasePinkSize = (-2.5 * cos(showcaseSize)) + puckSize;
            showcaseSize += 12.5; //Pink selected
        }else if(selectedColor === 2){
            showcaseYellowSize = (-2.5 * cos(showcaseSize)) + puckSize;
            showcaseSize += 12.5; //Yellow selected
        }else if(selectedColor === 3){
            showcaseRainbowSize = (-2.5 * cos(showcaseSize)) + puckSize;
            showcaseSize += 12.5; //Rainbow selected
        }
            
        /**Number Of Pucks**/
        textSize(25);
        fill(255, 255, 255);
        text("Number of Pucks",width/2, height/2.45);
        textSize(30);
        text(numberOfPucks,width/2, height/2.125);
        fill(0, 0, 0);
        stroke(255, 250, 255,200);
        strokeWeight(4);
        rectMode(CENTER);
        
        rect(width/1.7,height/2.2,35,35,5); //Right Arrow
        triangle(width/1.74,height/2.1,width/1.74,height/2.29,width/1.65,height/2.2);
        
        rect(width/2.5,height/2.2,35,35,5); //Left Arrow
        triangle(width/2.4,height/2.1,width/2.4,height/2.29,width/2.6,height/2.2);
        
        if(numberOfPucks<pucks.length){
            for(var i=0;i < pucks.length;i++){
                pucks.splice(i,1);
            }
        }
        
        //More Button
        button(width/2,height/1.8, "More", 40);
            
        /**Clicking - Settings**/
        mouseClicked = function(){
            /**Back Button**/
            if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.5-20 && mouseY < height/1.5+20){
                settings = false; //Back
            }
            
            /**Puck Color**/
            if(dist(mouseX,mouseY,showPuckX/1.35,showPuckY)< 20){
                rainbowPuck = false;
                puckGlowColor = color(0,0,255,13); //Blue
                selectedColor = 0;
            }else if(dist(mouseX,mouseY,showPuckX/1.11,showPuckY)< 20){
                rainbowPuck = false;
                puckGlowColor = color(255,0,255,25); //Pink
                selectedColor = 1;
            }else if(dist(mouseX,mouseY,showPuckX*1.08,showPuckY)< 20){
                rainbowPuck = false;
                puckGlowColor = color(255,255,0,25); //Yellow
                selectedColor = 2;
            }else if(dist(mouseX,mouseY,showPuckX*1.26,showPuckY)< 20){
                rainbowPuck = true;
                /*Boolean 'rainbow' set to toggle colorMode switch for Rainbow color effect in Puck.prototype.display*/
                selectedColor = 3;
            }
            
            /**Number Of Pucks**/
            if(numberOfPucks>1 && mouseX>width/2.5-17.5 && mouseX<width/2.5+17.5 && mouseY>height/2.2-17.5 && mouseY<height/2.2+17.5){
                for(var i=0;i < pucks.length;i++){
                    pucks.splice(i,1);
                }
                numberOfPucks--;
            }
            if(numberOfPucks<7 && mouseX>width/1.7-17.5 && mouseX<width/1.7+17.5 && mouseY>height/2.2-17.5 && mouseY<height/2.2+17.5){
                for(var i=0;i < pucks.length;i++){
                    pucks.splice(i,1);
                }
                numberOfPucks++;
            }
            
            /**Borders Button AKA More Button**/
            if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.8-25 && mouseY < height/1.8+25){
                borderOptions = true;
            }
        };
        
        /**Border Options - Menu**/
        var boxX = width/1.52;
        if(borderOptions){
            //Backround
            stroke(0);
            fill(0);
            rect(width/2,height/2,215,262, 3);
            button(width/2,height/1.5, "Back", 40);
            
            /**Rainbow Border - Toggle**/
            textSize(25);
            text("Rainbow Border",width/2.1, height/2.15);
            fill(0, 0, 0);
            stroke(255, 250, 255,200);
            strokeWeight(4);
            rectMode(CENTER);
            
            rect(boxX,height/2.2,20,20); //Toggling Box
            if(rainbowBorder){
                stroke(255, 250, 255,200);
                line(boxX+10,height/2.28,boxX-10,height/2.13);
                line(boxX-10,height/2.28,boxX+10,height/2.13);
            }
            
            /**Border Type**/
            fill(255, 255, 255);
            textSize(30);
            text(borderShape,width/2+2, height/2.95);
            textSize(25);
            if(onePlayer){
                text("One Player",width/2, height/2.5);
            } else{
                text("Two Player",width/2, height/2.5);
            }
            fill(0, 0, 0);
            stroke(255, 250, 255,200);
            strokeWeight(4);
            rectMode(CENTER);
            
            /**Border Type**/ 
            rect(width/1.55,height/3.1,25,25,5); //Right Arrow
            triangle(width/1.57,height/3.23,width/1.57,height/2.98,width/1.52,height/3.1);
            
            rect(width/2.8,height/3.1,25,25,5); //Left Arrow
            triangle(width/2.71,height/3.23,width/2.71,height/2.98,width/2.9,height/3.1);
            
            if (borderType === 0){
                borderShape = "rectangle";
            } else if (borderType === 1){
                borderShape = "oval";
            }
            
            /** One/Two Player **/
            rect(width/1.55,height/2.6,25,25,5); //Right Arrow
            triangle(width/1.57,height/2.51,width/1.57,height/2.69,width/1.52,height/2.6);
            
            rect(width/2.8,height/2.6,25,25,5); //Left Arrow
            triangle(width/2.71,height/2.51,width/2.71,height/2.69,width/2.9,height/2.6);
            /**Display FPS - Toggle**/
            textSize(25);
            fill(255, 255, 255);
            text("Display FPS",width/2.25, height/1.9);
            
            fill(0, 0, 0);
            stroke(255, 250, 255,200);
            strokeWeight(4);
            rectMode(CENTER);
            rect(boxX,height/1.95,20,20); //Toggling Box
            
            if(displayFps){//Draws an 'X' in the togglebox
                stroke(255, 250, 255,200);
                line(boxX+10,height/1.89,boxX-10,height/2.02);
                line(boxX-10,height/1.89,boxX+10,height/2.02);
            }
            
            /**Puck Position - Toggle**/
            textSize(25);
            fill(255, 255, 255);
            text("Puck Position",width/2.19, height/1.7);
            
            fill(0, 0, 0);
            stroke(255, 250, 255,200);
            strokeWeight(4);
            rectMode(CENTER);
            rect(boxX,height/1.74,20,20); //Toggling Box
            
            if(showPuckPos){//Draws an 'X' in the togglebox
                stroke(255, 250, 255,200);
                line(boxX+10,height/1.79,boxX-10,height/1.69);
                line(boxX-10,height/1.79,boxX+10,height/1.69);
            }
            
            /**Clicking - BorderMenu**/
            mouseClicked = function(){
                /**Rainbow Border**/
                if(mouseX>boxX-10 && mouseX<boxX+10 && mouseY>height/2.28 && mouseY<height/2.13){
                    rainbowBorder = !rainbowBorder;
                }
                
                /**Display FPS**/
                if(mouseX>boxX-10 && mouseX<boxX+10 && mouseY>height/2.02 && mouseY<height/1.89){
                    displayFps = !displayFps;
                }
                
                /**Puck Position**/
                if(mouseX>boxX-10 && mouseX<boxX+10 && mouseY>height/1.79 && mouseY<height/1.69){
                    showPuckPos = !showPuckPos;
                }
                
                /**Border Type**/
                if(mouseX>width/2.8-25/2&&mouseX<width/2.8+25/2&&mouseY>height/3.1-25/2&&mouseY<height/3.1+25/2){
                    if(borderType>0){
                        borderType--;
                    } else{
                        borderType = 1;
                    }
                }
                if(mouseX>width/1.55-25/2&&mouseX<width/1.55+25/2&&mouseY>height/3.1-25/2&&mouseY<height/3.1+25/2){
                    if(borderType<1){
                        borderType++;
                    } else{
                        borderType = 0;
                    }
                }
                
                /** One/Two Player **/
                if(mouseX>width/1.55-25/2&&mouseX<width/1.55+25/2&&mouseY>height/2.51-25/2&&mouseY<height/2.51+25/2){
                    onePlayer = !onePlayer;
                }
                if(mouseX>width/2.8-25/2&&mouseX<width/2.8+25/2&&mouseY>height/2.51-25/2&&mouseY<height/2.51+25/2){
                    onePlayer = !onePlayer;
                }
                
                /**Back Button**/
                if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.5-15 && mouseY < height/1.5+15){
                    borderOptions = false;
                }
            };
        }
    }
        
    /**About**/
    if(about){
        stroke(0);
        fill(0);
        rect(width/2,height/2,215,262, 3);
        
        fill(255, 255, 255);
        textAlign(LEFT);
        textSize(24);
        text("*About:\nThis project is inspired by the popular phone application: \"Glow Hockey\" - Natenai Ariyatrakool. \n*Creator of Project:\n     Daniel Haugen",width/2.9,height/3.5,243, 200);
        
        button(width/2,height/1.5, "Back");
        
        /**Clicking**/
        mouseClicked = function(){
            if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > height/1.5-btnH/2 && mouseY < height/1.5+btnH/2){
                about = false;
            }
        };
    }
    
    /**GameOver**/
    if(gameover){
        stroke(0);
        fill(0);
        rect(width/2,height/2,215,262, 3);
        
        fill(255, 255, 255);
        textAlign(CENTER);
        textSize(35);
        if(greenScore>=7+numberOfPucks){
            if(onePlayer){
                text("You\nLose!",width/3.2,height/2.5,200, 200);
            } else{
                text("Green\nWins!",width/3.2,height/2.5,200, 200);
            }
        }else {
            if(onePlayer){
                text("You\nWin!",width/3.2,height/2.5,200, 200);
            } else{
                text("Red\nWins!",width/3.2,height/2.5,200, 200);
            }
        }
        
        button(width/2,345, "Restart");
        
        /**Clicking**/
        mouseClicked = function(){
            if(mouseX > width/2-btnW/2 && mouseX < width/2+btnW/2 && mouseY > 345-btnH/2 && mouseY < 345+btnH/2){
                gameover = false;
                paused = false;
                redScore = 0;
                greenScore = 0;
                for(var i=0;i < pucks.length;i++){
                    pucks.splice(i,1);
                }
                cdnumber=100;
                createPucks();
            } else if(dist(mouseX,mouseY,60,height-60)<50 && !offSideWarning){
                justStarted = true;
                gameover = false;
                for(var i=0;i < pucks.length;i++){
                    pucks.splice(i,1);
                    i=0;
                }
                player2Y = 105;
                player2X = width/2;
                redScore = 0;
                greenScore = 0;
                cdnumber=100;
            }
        };
    }
};

var undef, then = undef, beginFrame = undef;

var ovalQualities =  function(){
        stroke(82, 82, 82, 210);
        strokeWeight(10);
        noFill();
        if(onePlayer){
            topFocus = (height/2) - sqrt(sq(260)-sq(189));
            bottomFocus = (height/2) + sqrt(sq(260)-sq(189));
            
            ellipse(width/2,height/2,362,510);
            strokeWeight(20);
            stroke(255, 255, 255, 210);
           /**Top Focus**/
            point(width/2,topFocus);
            drawArc(width/2,topFocus, 25,25, 0, 360);
            
           /**Top Focus**/
            stroke(255, 255, 255, 210);
            strokeWeight(20);
            point(width/2,bottomFocus);
            drawArc(width/2,bottomFocus, 25, 25, 0, 360);
            
           /**Border**/
            drawArc(width/2,height/2, 362, 510, 0, 360); //Border
        }else{
            topFocus = (width/2) - sqrt(sq(181)-sq(260));
            bottomFocus = (width/2) + sqrt(sq(181)-sq(260));
            
            ellipse(width/2,height/2,510,362);
            strokeWeight(20);
            stroke(255, 255, 255, 210);
           /**Top Focus**/
            point(topFocus,height/2);
            drawArc(topFocus,height/2, 25,25, 0, 360);
            
           /**Bottom Focus**/
            stroke(255, 255, 255, 210);
            strokeWeight(20);
            point(bottomFocus,height/2);
            drawArc(bottomFocus,height/2, 25, 25, 0, 360);
            
           /**Border**/
            drawArc(width/2,height/2, 510, 362, 0, 360); //Border
        }
    };

/**Draw**/
draw = function() {
    background (0, 0, 0);
    
    colorCounter += 4;
    if(colorCounter > 255){
        colorCounter %= 255;
    }
    
    if(onePlayer){
        if(mouseY>=height/2){
            RedOnSide = true;
        } else {
            RedOnSide = false;
        }
    } else {
        RedOnSide = true;
    }
    
    /**Arena Border**/
    if(borderShape === "rectangle"){
        if(onePlayer){
            glowLine(width-70,20,width-70,(height/2)-10,color(255,255,0,wallTrans),true); //Top-Right Vertical
            glowLine(width-70,(height/2)+10,width-70,height-20,color(0,255,0,wallTrans),true);//Bottom-Right Vertical
            glowLine(70,20,70,(height/2)-10, color(255, 0, 0, wallTrans), true); //Top-Left Vertical
            glowLine(70,(height/2)+10,70,height-20, color(0, 0, 255, wallTrans), true); //Bottom-Left Vertical
            
            glowLine((width/2)+65,15,height-82,15, color(255, 255, 0, wallTrans)); //Top-Right Horizonal
            glowLine(82,15,(width/2)-65,15, color(255, 0, 0, wallTrans)); //Top-Left Horizonal
            
            glowLine((width/2)+65,height-20,width-82,height-20, color(0, 255, 0, wallTrans));//Bottom-Right Horizonal
            glowLine(82,height-20,(width/2)-65,height-20, color(0, 0, 255, wallTrans)); //Bottom-Left Horizonal
        } else {
            glowLine(480,70,480,185, color(0, 255, 0, wallTrans), true); //Top-Right Vertical
            glowLine(480,310,480,425, color(0, 0, 255, wallTrans), true);//Bottom-Right Vertical
            
            glowLine(20,70,20,185, color(255, 255, 0, wallTrans), true); //Top-Left Vertical
            glowLine(20,310,20,425, color(255, 0, 0, wallTrans), true); //Bottom-Left Vertical
            
            glowLine(260,65,467,65, color(0, 255, 0, wallTrans)); //Top-Right Horizonal
            glowLine(32,65,245,65, color(255, 255, 0, wallTrans)); //Top-Left Horizonal
            
            glowLine(260,430,467,430, color(0, 0, 255, wallTrans));//Bottom-Right Horizonal
            glowLine(32,430,245,430, color(255, 0, 0, wallTrans)); //Bottom-Left Horizonal
        }
    } else if(borderShape === "oval"){
        if(onePlayer){
            glowArc(width/2.7,(height/2)-15,width/2,height/1.15,180,270,color(255,0,0,wallTrans)); //Red
            glowArc(width/2.7,(height/2)+15,width/2,height/-1.15,180,270,color(0,0,255,wallTrans)); //Blue
            glowArc(width-width/2.7,(height/2)-15,width/2,height/1.15,-90,0,color(255,255,0,wallTrans)); //Yellow
            glowArc(width-width/2.7,(height/2)+15,width/2,height/-1.15,-90,1,color(0,255,0,wallTrans)); //Green
        } else {
            glowArc(width/2-15,height-180,440,-220,180,270,color(255,0,0,wallTrans)); //Red
            glowArc(width/2+15,height-180,440,-220,-90,0,color(0,0,255,wallTrans)); //Blue 
            glowArc(width/2-15,180,440,220,180,270,color(255,255,0,wallTrans)); //Yellow 
            glowArc(width/2+15,180,440,220,-90,0,color(0,255,0,wallTrans)); //Green 
        }
    } else if(borderShape === "circle"){
        if(onePlayer){
            //glowArc((width/2),height/2,380,400,0,360,color(255,255,255,wallTrans));
        glowArc((width/2),(height/2)-10,380,380,180,250,color(255,0,0,wallTrans)); //Red
        glowArc((width/2),(height/2)+10,380,-380,180,250,color(0,0,255,wallTrans)); //Blue
        glowArc((width/2),(height/2)-10,380,380,-70,0,color(255,255,0,wallTrans)); //Yellow
        glowArc((width/2),(height/2)+10,380,-380,-70,1,color(0,255,0,wallTrans)); //Green
        } else {
        glowArc(width/2-15,height-180,440,-220,180,270,color(255,0,0,wallTrans)); //Red
        glowArc(width/2+15,height-180,440,-220,-90,0,color(0,0,255,wallTrans)); //Blue 
        glowArc(width/2-15,180,440,220,180,270,color(255,255,0,wallTrans)); //Yellow 
        glowArc(width/2+15,180,440,220,-90,0,color(0,255,0,wallTrans)); //Green
        }
    }
    
    /**Arena Details**/
    if(onePlayer){
        if(borderShape !== "circle"){
            drawLine(80, height/2, width-80, height/2, 255, 255, 255); //MidLine
            drawArc(width/2,height/2, (height/8) + (width/8), (height/8) + (width/8), 0, 360);//MiddleCir
            
            drawArc(width/2,20, 125, 125, 0, 180); //Top Goal
            drawArc(width/2,height-20, 125, 125, 180, 360); //Bottom Goal
        } else {
            drawLine(80, height/2, width-80, height/2, 255, 255, 255); //MidLine
            drawArc(width/2,height/2, (height/8) + (width/8), (height/8) + (width/8), 0, 360);//MiddleCir
            
            drawArc(width/2,60, 125, 125, 0, 180); //Top Goal
            drawArc(width/2,height-60, 125, 125, 180, 360); //Bottom Goal
        }
        pauseButton(width/1.05, height/2, 35);
        
        pushMatrix();
        rotate(90);
        textSize(30);
        textAlign(CENTER);
        text(greenScore,height/2.4,width/(-1.07));
        text(redScore,height/1.7,width/(-1.07));
        popMatrix();
    } else {
        drawLine(width/2, 80, width/2, height - 80, 255, 255, 255); //MidLine
        
        drawArc(width/2,height/2, 125, 125, 0, 360); //Middle Circle
        
        drawArc(25,height/2, 125, 125, -90, 90); //Left Goal
        drawArc(475,height/2, 125, 125, 90, 270); //Right Goal
        
        pauseButton(width/2, 30, 35);
        
        textSize(30);
        textAlign(CENTER);
        text(redScore,width/2.5,40);
        text(greenScore,width/1.65,40);
    }
    
    /**Paddles & Puck Setup**/
    if(!paused){
        if(borderShape === "rectangle"){
            PLAYER_MOVE_SPEED = 4.5;
        }else {
            PLAYER_MOVE_SPEED = 5;
        }
        paddles[0].control();
        for(var i=0;i<pucks.length;i++){
            for(var j=0;j<pucks.length;j++){
                if (i!==j){
                    pucks[i].bounce(pucks[j].pos);
                } //Puck-Puck Collision
            }
            for(var k=0;k<paddles.length;k++){
                if(onePlayer){
                    if(k===0 && RedOnSide){
                        pucks[i].bounce(paddles[0].pos);
                    }
                } else {
                    pucks[i].bounce(paddles[0].pos);
                }
                pucks[i].bounce(paddles[1].pos);
            } //Puck-Paddle Collision
        }
        
        for(var i=0;i<pucks.length;i++){
            pucks[i].run();
            if(onePlayer){
                AI(pucks[i].pos);
            }
        }
        for(var i=0;i<paddles.length;i++){
            paddles[i].run();
        }
        countdown();
        
        /**Goals**/
        if(onePlayer){
            hole(width/2,25, 0);
            hole(width/2,height-25, 1);
        } else{
            hole(width-30,height/2, 0);
            hole(30,height/2, 1);
        }
    } else {
        pauseMenu();
    }
    
    /**Developer Options**/
    if(mousePos){
        fill(255, 255, 255);
        text(mouseX+"; "+mouseY,mouseX+10,mouseY+10);
    }
    
    if(displayFps){
        if (then === undef) {
            then = millis();
            beginFrame = frameCount;
        }
        textSize(20);
        fill(255, 255, 255);
        text(1000 * (frameCount - beginFrame) / (millis() - then), 32, 25);
    }
    
    /**Winning**/
    if(greenScore>=7+numberOfPucks || redScore>=7+numberOfPucks){
        for(var i=0;i < pucks.length;i++){
            pucks.splice(i,1);
            i=0;
        }
        gameover = true;
        paused = true;
    }
};