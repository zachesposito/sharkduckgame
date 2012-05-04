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
var imagesArray = [];
var imageSharkduckAll = new Image();
var imageEgg = new Image();
var imageWave = new Image();
var imageCage = new Image();
var flashTransitionProgress = 0;
var sdmode = 2;
var spacebarkey = 32;
var isSharkduckMoving = false;
var shiftkey = 16;
var isShiftBeingPressed = false;
var hudElements = {};
	hudElements.eggBitmaps = [];
var eggsSaved = 0; //Max 10
var speed = 0; //Max 1200 (20 secs)
var maxspeed = 1200;
var levelobjectmovementrate = 3;
var distanceLeft = 3600;
var score = 0;

var gameStates = ["loading", "title", "intro", "main", "victory"];
var currentGameState = gameStates[0];


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
			//renderFlashTransition();
		}
	});
	$('body').keyup(function(e){
		if(e.which === spacebarkey)
			isSharkduckMoving = false;
		if(e.which === shiftkey)
			isShiftBeingPressed = false;
	});
	
	document.body.ontouchstart = function(e){
		if (e.touches.length == 1){
			isSharkduckMoving = true;
		}
		if (e.touches.length == 2 && !isShiftBeingPressed){
			isShiftBeingPressed = true;
			if(sdmode == 2)
				sdmode = 1;
			else if(sdmode == 1)
				sdmode = 2;
		}
	}
	
	document.body.ontouchend = function(e){
	
		isSharkduckMoving = false;
			
		isShiftBeingPressed = false;
	}
	
	init();
});

// * * Init * * 
function init(){
	//Load the sprite image files
	imagesArray = [
		{image : imageSharkduckAll, file : "../assets/sharkduck_all.png"},
		{image : imageEgg, file : "../assets/egg.png"},
		{image : imageWave, file : "../assets/wavefast.png"},
		{image : imageCage, file : "../assets/cage.png"}
	];
	loadImages(imagesArray);
}
//Reset Main Gameplay - set back to "intro" state, reposition level objects, clear eggs saved and score
function resetMain(){
	for (var i = 0; i < leveldata.length; i++){
		leveldata[i].posX = leveldata[i].resetX;
		leveldata[i].spawned = false;
		leveldata[i].despawned = false;
		leveldata[i].removed = false;
	}
	
	score = 0;
	speed = 0;
	eggsSaved = 0;
	currentGameState = gameStates[2];
}
//* * Loading Screen * * 
function drawLoadingScreen(){
	
}

function drawTitleScreen(){

}

//Draw the intro state
function drawIntro(){
	
}

function drawVictoryScreen(){

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
	
	setupSpriteSheets();
    setupHUDelements();
    // we want to do some work before we update the canvas,
    // otherwise we could use Ticker.addListener(stage);
    Ticker.addListener(window);
    Ticker.useRAF = true;
    // Best Framerate targeted (60 FPS)
    Ticker.setFPS(60);
    
    //resetMain();
    currentGameState = gameStates[3];
}

// * * Tick - draw each frame * * 
function tick() {
	if (currentGameState == gameStates[0]){
	
	}
	if (currentGameState == gameStates[1]){
	
	}
	if (currentGameState == gameStates[2]){
		drawHUDelements();
		drawIntro();
		var speeddirection = 1;
		if (speed > 1200)
			speeddirection = -1;
		if (speed < 300)
			speeddirection = 1;
		speed = speed + (100*speeddirection);
	}
	if (currentGameState == gameStates[3]){
		drawHUDelements();
		drawLevelObjects();
		drawSharkduck();
		speed -= 2;
		if (speed < 0)
			speed = 0;
		distanceLeft--;
	}
	if (currentGameState == gameStates[4]){
	
	}
    // update the stage:
    stage.update();
}

// * * Handle sharkduck movement logic for each tick * * 
function drawSharkduck(){
    // Hit testing the screen width, otherwise our sprite would disappear
    if (sharkduckContainer.y > thecanvas.height - 60) // We've reached the bottom of our screen
        sharkduckContainer.y = thecanvas.height - 60;

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
		if (isSharkduckMoving == false){
			if (sharkduckContainer.y < waterlineY - 18){
				if (sharkduckContainer.y + 5 > waterlineY - 18)
					sharkduckContainer.y = waterlineY - 18;
				else{
					sharkduckContainer.y += 5;
				}
			}
			else {
				sharkduckContainer.vY = 2;
				sharkduckContainer.directionY = -1;
			}
		}
		else{    	
			if (sharkduckContainer.y < waterlineY - 18)
				sharkduckContainer.y += 5;
			sharkduckContainer.vY = 3;
			sharkduckContainer.directionY = 1;
		}
	}
	//Duckshark mode
    if (sdmode == 2){
		if (isSharkduckMoving == false){
			if (sharkduckContainer.y > waterlineY - 18){ //If duckshark is underwater, bring him up
				if (sharkduckContainer.y - 5 < waterlineY - 18)
					sharkduckContainer.y = waterlineY - 18;
				else{
					sharkduckContainer.y -= 5;
				}
			}
			else {
				sharkduckContainer.vY = 3;
				sharkduckContainer.directionY = 1;
			}
		}
		else{    	
			if (sharkduckContainer.y > waterlineY - 18)
				sharkduckContainer.y -= 5;
			sharkduckContainer.vY = 2;
			sharkduckContainer.directionY = -1;
		}
		
	}
	
	//Do the move		
	if (sharkduckContainer.directionY == 1)
		sharkduckContainer.y += sharkduckContainer.vY;
	else if (sharkduckContainer.directionY == -1)
		sharkduckContainer.y -= sharkduckContainer.vY;
}

//* * Draw Level Objects - place and draw seagulls, bugs, jellyfish, eggs, fish, islands, and caves. Anything that sharkduck can hit. * * 
function drawLevelObjects(){
	//Loop through the level's objects and update their position as sharkduck zooms forward. Hopefully this isn't too inefficient.
	for(var i = 0; i < leveldata.length; i++){
		if (leveldata[i].posX < 480 && leveldata[i].posX > -200 && leveldata[i].spawned == false){ //If we should see the object, start playing its animation and add to stage
			leveldata[i].animation.gotoAndPlay("defaultanimation");
			leveldata[i].animation.x = leveldata[i].posX;
			leveldata[i].animation.y = leveldata[i].posY;
			stage.addChild(leveldata[i].animation);
			leveldata[i].spawned = true;
		}
		else if (leveldata[i].posX < 480 && leveldata[i].posX > -200 && leveldata[i].despawned == false){
			if (leveldata[i].posX < 120 && leveldata[i].posX > (60 - leveldata[i].width)){ // If the object is within the X bounds that sharkduck can possibly hit
				if (leveldata[i].posY < (sharkduckContainer.y + 30) && leveldata[i].posY > (sharkduckContainer.y - leveldata[i].height)){
					leveldata[i].despawned = true;
					handleObjectCollision(leveldata[i]);
					console.log("Hit detected on " + leveldata[i].type + "!");
				}
			}
			leveldata[i].animation.x = leveldata[i].posX;
		}
		if (leveldata[i].removed == false){
			if (leveldata[i].posX < -200 || leveldata[i].despawned == true){
				leveldata[i].animation.paused = true;
				stage.removeChild(leveldata[i].animation);
				leveldata[i].removed == true;
			}
		}
		
		leveldata[i].posX -= levelobjectmovementrate;
	}
	stage.addChild(sharkduckContainer);
	
	
}
//* * Draw HUD elements * * 
function drawHUDelements(){
	for (var i = 0; i < hudElements.eggBitmaps.length; i++){
		stage.removeChild(hudElements.eggBitmaps[i]);
	}
	//Draw eggs saved so far
	for (var i = 0; i < eggsSaved; i++){
		stage.addChild(hudElements.eggBitmaps[i]);
	}
	
	//Draw score
	hudElements.scoreText.text = "score: " + score;
	//Draw speed
	hudElements.speedBarShape.scaleX = speed/10;
	
	currentWaveFrame = waveAnimation.currentAnimationFrame;
	//Set wave speed depending on current speed
	if (speed > maxspeed*.75 && waveAnimation.currentAnimation != "fastest")
		waveAnimation.gotoAndPlay("fastest");
	if (speed > maxspeed*.5 && speed <= maxspeed*.75 && waveAnimation.currentAnimation != "fastest")
		waveAnimation.gotoAndPlay("fastest");
	if (speed > maxspeed*.25 && speed <= maxspeed*.5 && waveAnimation.currentAnimation != "faster")
		waveAnimation.gotoAndPlay("faster");
	if (speed <= maxspeed*.25 && waveAnimation.currentAnimation != "slower")
		waveAnimation.gotoAndPlay("slower");
	waveAnimation.currentAnimationFrame = currentWaveFrame;
}

//Special Effects
// * * Render Flash Transistion * * 
function renderFlashTransition(){
	
}

//* * Setup Sprite Sheets - build the spritesheets and animations * *
function setupSpriteSheets(){
    
    var levelobjectimage;
   	var levelobjectframes;
   	var levelobjectanimations;
   	var levelobjectwidth;
   	var levelobjectheight;
    //Build spritesheets and animations for the level objects
	for(var i = 0; i < leveldata.length; i++){
		switch (leveldata[i].type){
			case "egg" :
				levelobjectimage = imageEgg;
				levelobjectframes = {width:20, height:30, regX:0, regY:0};
				levelobjectanimations = {
					defaultanimation: [0, 15, "defaultanimation", 4]
				};
				levelobjectwidth = 20;
				levelobjectheight = 30;
				break;
				
		}
		
		leveldata[i].spritesheet = new SpriteSheet({
			images: [levelobjectimage],
			frames: levelobjectframes,
			animations: levelobjectanimations
		});
		leveldata[i].animation = new BitmapAnimation(leveldata[i].spritesheet);
		leveldata[i].animation.currentFrame = 0;
		leveldata[i].width = levelobjectwidth;
		leveldata[i].height = levelobjectheight;
		
		leveldata[i].resetX = leveldata[i].posX;
	}
	
	//Create waves
	var waveSS = new SpriteSheet({
		images: [imageWave],
		frames: {width:480, height:10, regX:0, regY:0},
		animations: {
			fastest: {
				frames: [0, 2, 4, 6, 8, 10],
				next: "fastest",
				frequency: 1
			},
			faster: [0, 11, "faster",1],
			slower: [0, 11, "slower",2],
			slowest: [0, 11, "slowest",3]
		}
	});
	waveAnimation = new BitmapAnimation(waveSS);
	waveAnimation.gotoAndPlay("fastest");
	waveAnimation.currentFrame = 0;
	waveAnimation.x = 0;
	waveAnimation.y = waterlineY-7;
	stage.addChild(waveAnimation);
	
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
}

//* * Setup HUD Elements - Otherwise we're creating one million bitmap objects * * 
function setupHUDelements(){
	for (var i = 0; i < 10; i++){ //Set up bitmaps now so that all we do later is turn them on
		hudElements.eggBitmaps[i] = new Bitmap(imageEgg);
		hudElements.eggBitmaps[i].sourceRect = new Rectangle(0,0,20,30);
		hudElements.eggBitmaps[i].x = (thecanvas.width - 20) - (15 * i);
		hudElements.eggBitmaps[i].y = 245;
		hudElements.eggBitmaps[i].scaleX = .5;
		hudElements.eggBitmaps[i].scaleY = .5;
	}
	
	hudElements.scoreText = new Text("score: " + score, "16px Arial", "#fff");
	hudElements.scoreText.x = 10;
	hudElements.scoreText.y = 260;
	stage.addChild(hudElements.scoreText);
	
	hudElements.speedText = new Text("speed: ", "16px Arial", "#fff");
	hudElements.speedText.x = 150;
	hudElements.speedText.y = 260;
	stage.addChild(hudElements.speedText);
	
    hudElements.speedBarG = new Graphics();
	hudElements.speedBarG.beginFill("#d33");
	hudElements.speedBarG.rect(0,0,1, 20);
	hudElements.speedBarShape = new Shape(hudElements.speedBarG);
	hudElements.speedBarShape.x = 200;
	hudElements.speedBarShape.y = 245;
	
	stage.addChild(hudElements.speedBarShape);
	
}
//* * Handle Object Collision * * 
function handleObjectCollision(thelevelobject){
	switch (thelevelobject.type){
		case "egg" :
			eggsSaved++;
			speed = 1200;
			score += 1200;
			break;
	}
}
//Image loading functions
function loadImages(thearray){
	
	for (var i = 0; i < thearray.length; i++){
		thearray[i].image.onload = handleImageLoad;
		thearray[i].image.onerror = handleImageError;
		thearray[i].image.src = thearray[i].file;
	}
}
function handleImageLoad(e) {
    numberOfImagesLoaded++;
    
    if (numberOfImagesLoaded == 4) {
        numberOfImagesLoaded = 0;
        startGame();
    }
}
function handleImageError(e) {
	console.log("Error Loading Image : " + e.target.src);
}
