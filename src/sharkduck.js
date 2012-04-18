// zesposi_game.js
// I'm going to see what kind of game I can make here.
// April 2012

// * * * Global vars * * *
var thecanvas; //Create variable for the canvas element
var c; //Create variable for the canvas's 2D graphics context
var numberOfImagesLoaded = 0;
var stage;
var waterlineY = 100;
var sharkduckContainer;
var sharkduckAnimation;
var imageSharkduckAll = new Image();
var flashTransitionProgress = 0;
var sdmode = 2;
var spacebarkey = 32;
var isSharkduckMoving = false;
var shiftkey = 16;
var isShiftBeingPressed = false;

var gameStates = ["loading", "title", "intro", "start", "main", "boss", "victory"];


// * * On document ready * * 
$(function(){
	thecanvas = document.getElementById('mycanvas'); //Select the canvas
	c = thecanvas.getContext('2d'); //Get a 2D graphics context
	
	c.fillStyle = "#555";
	c.fillRect(0,0,thecanvas.width, thecanvas.height);
	
	$('body').keydown(function(e){
		if(e.which === spacebarkey)
			isSharkduckMoving = true;
		if(e.which === shiftkey && !isShiftBeingPressed){
			isShiftBeingPressed = true;
			if(sdmode == 2)
				sdmode = 1;
			else if(sdmode == 1)
				sdmode = 2;
			renderFlashTransition();
		}
	});
	$('body').keyup(function(e){
		if(e.which === spacebarkey)
			isSharkduckMoving = false;
		if(e.which === shiftkey)
			isShiftBeingPressed = false;
	});
	
	init();
});

// * * Init * * 
function init(){
	//Load the sprite image files
	imageSharkduckAll.onload = handleImageLoad;
	imageSharkduckAll.onerror = handleImageError;
	imageSharkduckAll.src = "../assets/sharkduck_all.png";
}

// * * Start Game - Build game objects * * 
function startGame(){
	// create a new stage and point it at our canvas:
	stage = new Stage(thecanvas);    
	stage.mouseEventsEnabled = true;
	
    //Add background to stage
    var g = new Graphics();
	g.beginLinearGradientFill(['#2B98FF','#dde'],['0','1'],0,0, 0, waterlineY);
	g.rect(0,0,thecanvas.width,waterlineY); //Background sky
	g.beginLinearGradientFill(['#60c1ee','#0C4D8E','#042234'],['0','.2','1'],0,waterlineY, 0, thecanvas.height);
	g.rect(0,waterlineY,thecanvas.width,thecanvas.height-waterlineY); //Background water
	var s = new Shape(g);
	s.x = 0;
	s.y = 0;
	stage.addChild(s);
	
	//Create sd sprite
	var sharkduckSS = new SpriteSheet({
		images: [imageSharkduckAll],
		frames: {width:60, height:30, regX:0, regY:0},
		animations: {
			swim: [0, 7, "swim", 4],
			swimfast: [0, 7, "swimfast", 2],
			fly: [8, 15, "fly", 4],
			flyfast: [8, 15, "flyfast", 2]
		}
	});
	
	//Make the animation
	sharkduckAnimation = new BitmapAnimation(sharkduckSS);
    sharkduckAnimation.gotoAndPlay("fly"); 	//animate
    sharkduckAnimation.name = "sharkduck";
    sharkduckAnimation.currentFrame = 0;
    
    //Create container for sharkduck's animation and effects
    sharkduckContainer = new Container();
    sharkduckContainer.directionY = 1;
    sharkduckContainer.vY = 2;
    sharkduckContainer.x = 60;
    sharkduckContainer.y = waterlineY-7;
    sharkduckContainer.addChild(sharkduckAnimation);
    
    stage.addChild(sharkduckContainer);

    
    // we want to do some work before we update the canvas,
    // otherwise we could use Ticker.addListener(stage);
    Ticker.addListener(window);
    Ticker.useRAF = true;
    // Best Framerate targeted (60 FPS)
    Ticker.setFPS(60);
}

// * * Tick - draw each frame * * 
function tick() {
    // Hit testing the screen width, otherwise our sprite would disappear
    if (sharkduckContainer.y > thecanvas.height - 30) // We've reached the bottom of our screen
        sharkduckContainer.y = thecanvas.height - 30;

    if (sharkduckContainer.y < 0) // We've reached the top of our screen
        sharkduckContainer.y = 0;
        
    //Switch modes
	if (sdmode == 1){
     	if (!isSharkduckMoving && sharkduckAnimation.currentAnimation != "swim")
     		sharkduckAnimation.gotoAndPlay("swim");
     	if (isSharkduckMoving && sharkduckAnimation.currentAnimation != "swimfast")
     		sharkduckAnimation.gotoAndPlay("swimfast");
     		
     }
     else if (sdmode == 2){
     	if (!isSharkduckMoving && sharkduckAnimation.currentAnimation != "fly")
     		sharkduckAnimation.gotoAndPlay("fly");
     	if (isSharkduckMoving && sharkduckAnimation.currentAnimation != "flyfast")
     		sharkduckAnimation.gotoAndPlay("flyfast");
     }
        
    //Water area check for sharkduck mode
    if (sdmode == 1){
    	if (sharkduckContainer.y < waterlineY - 18){
    		//sharkduckContainer.y = waterlineY - 18;
			//sharkduckContainer.vY = 5;
			//sharkduckContainer.directionY = 1;
		}
		else{
			//Set movement parameters
			if (isSharkduckMoving == false){
				sharkduckContainer.vY = 2;
				sharkduckContainer.directionY = -1;
			}
			else{    	
				sharkduckContainer.vY = 3;
				sharkduckContainer.directionY = 1;
			}
		}
	}
	//Duckshark mode
    if (sdmode == 2){
    	if (sharkduckContainer.y > waterlineY - 18){ //If duckshark is underwater, bring him up
    		//sharkduckContainer.y = waterlineY - 18;
			//sharkduckContainer.vY = 5;
			//sharkduckContainer.directionY = -1;
		}
		else{
			if (isSharkduckMoving == false){
				sharkduckContainer.vY = 3;
				sharkduckContainer.directionY = 1;
			}
			else{    	
				sharkduckContainer.vY = 2;
				sharkduckContainer.directionY = -1;
			}
		}
	}
	
	//Do the move		
	if (sharkduckContainer.directionY == 1)
		sharkduckContainer.y += sharkduckContainer.vY;
	else if (sharkduckContainer.directionY == -1)
		sharkduckContainer.y -= sharkduckContainer.vY;

    // update the stage:
    stage.update();
}

//Special Effects
// * *Render Flash Transistion * * 
function renderFlashTransition(){
	
}

//Image loading functions
function handleImageLoad(e) {
    numberOfImagesLoaded++;
    
    if (numberOfImagesLoaded == 1) {
        numberOfImagesLoaded = 0;
        startGame();
    }
}
function handleImageError(e) {
	console.log("Error Loading Image : " + e.target.src);
}