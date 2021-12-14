'use strict';

var preloadSceneConfig  = {
    key: 'preloadScene',
    active: true,
    visible: true,
    preload: bootLoader,
    create: bootCreate,
};

var startGameSceneConfig = {
    key: 'startGame',
    active: false,
    visible: false,
    preload: preload,
    create: create,
    update: update
}

var endGameSceneConfig = {
    key: 'endGame',
    active: false,
    visible: false,
    preload: endLoader,
    create: endCreate,
}

var monitorWidth = document.body.offsetWidth;            
var monitorHeight = document.body.offsetHeight;

var w = window.innerWidth * window.devicePixelRatio,
    h = window.innerHeight * window.devicePixelRatio;
if(h > 800) {
    var div = h / 800; //800 is target
    w = w / div;
    h = 800;
}

/*
this.safeZone = {
    width: this.game.width,
    height: this.game.height,
    x: 0,
    y: 0,
};
var heightWidthRatio = 1.9;
var currentHeightWidthRatio = this.game.height / this.game.width;
if (currentHeightWidthRatio > heightWidthRatio) {
    this.safeZone.height = this.game.width * heightWidthRatio;
    this.safeZone.y = (this.game.height — this.safeZone.height) / 2;
}
else {
    this.safeZone.width = this.game.height / heightWidthRatio;
    this.safeZone.x = (this.game.width — this.safeZone.width) / 2;
}
*/

var config = {
   // type: Phaser.AUTO,
		type: Phaser.CANVAS,
    parent: 'phaser-example',
   	//width: 640,
   	//height: 480,
   	width: 640,
   	height: 480,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [ preloadSceneConfig, startGameSceneConfig, endGameSceneConfig ],   
};

var game = new Phaser.Game(config);
var player;
var platforms;
var cursors;
var stars;
var number_stars = 11;
var bombs;
var mushrooms;
var scoreText;
var score = 0;
var startGame = false;
var gameOver = false;
var attackBomb = false;
var userName = null;
var timedEvent = null;
var timerText;
var start_game = false;

//var buttonvertical;
//var buttonhorizontal;
//var buttondiagonal;
var buttonjump;
var buttonleft;
var buttonright;

var isBtnLeft = false;
var isBtnRight = false;
var isBtnJump = false;


var left=false;
var right=false;
var jump=false;

var text;
var text_content = [];
var startText;
var endText;

//resize();
//window.addEventListener("resize", resize, false);



function bootLoader(){
    this.load.image('preloadScene', 'assets/src/BG/forest.png');
}

function bootCreate(){
    //this.add.image(400,300, 'preloadScene');
    this.add.image(400,300, 'preloadScene');
    userName = prompt("Please enter your name", "Anonym");
    while(userName == null){
        userName = prompt("Please enter your name", "Anonymous");
    }
        
    text_content = getTextContent(userName);
    this.add.text(250,32,'Idila Lands',{font: "30px Arial", fill: "#e29117", align:"center"});
    this.add.text(80, 80,text_content, { font: "16px Arial", fill: "#e29117", align:'center' });
    this.startText = this.add.text(210, 230,'PRESS HERE TO CONTINUE', { font: "20px Arial", fill: "#e29117", align:'center' }).setInteractive();
		
		this.startText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.startText.width, this.startText.height), Phaser.Geom.Rectangle.Contains);
		
    cursors = this.input.keyboard.createCursorKeys();
    
    if( this.scene.key == 'preloadScene' ){
        var current_this = this;
        
        
        this.startText.on('pointerdown', function () {
    			score = 0;
      		start_game = true;
          game.scene.pause();
          current_this.scene.launch('startGame');
				});
    		
    		
        this.input.keyboard.on('keydown', function (event) {
            if(event.code == 'Enter' && start_game == false){
            		score = 0;
            		start_game = true;
                game.scene.pause();
                current_this.scene.launch('startGame');
                
            }
            //console.dir(event);
        });
	      
    }
    
  
}

function endLoader(){
    this.load.image('preloadScene', 'assets/src/BG/forest.png');
}

function endCreate(){
    this.add.image(400,300, 'preloadScene');
    var final_score = 'Congratulations '+userName+',\nyour final score is '+score+' Points\n\n'+'TOP TEN';    
    var topTen = getTopTen();
	
    this.add.text(180,32,final_score,{font: "32px Arial", fill: "#e29117", align:"center"});    
    this.add.text(300, 200, topTen, { font: "22px Arial", fill: "#e29117", align:'left' });
    this.endText = this.add.text(230, 470,'Press HERE to RESTART the game', { font: "22px Arial", fill: "#000", align:'center' });
		this.endText.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.endText.width, this.endText.height), Phaser.Geom.Rectangle.Contains);
    cursors = this.input.keyboard.createCursorKeys();
    
    this.endText.on('pointerdown', function () {
			location.reload();
		});
    
    

}

function preload(){

    this.load.image('forest', 'assets/src/BG/forest.png');
    this.load.image('bush_1', 'assets/src/Object/bush_1.png');
    this.load.image('bush_2', 'assets/src/Object/bush_2.png');
    this.load.image('bush_3', 'assets/src/Object/bush_3.png');
    this.load.image('bush_4', 'assets/src/Object/bush_4.png');

    this.load.image('crate', 'assets/src/Object/crate.png');

    this.load.image('tree_1', 'assets/src/Object/tree_1.png');
    this.load.image('tree_2', 'assets/src/Object/tree_2.png');
    this.load.image('tree_3', 'assets/src/Object/tree_3.png');

    //this.load.image('doorLocked', 'assets/src/Object/doorLocked.png');
    //this.load.image('DoorOpen', 'assets/src/Object/DoorOpen.png');
    //this.load.image('DoorUnlocked', 'assets/src/Object/DoorUnlocked.png');

    this.load.image('base_1', 'assets/src/tiles/1.png');
    this.load.image('base_2', 'assets/src/tiles/2.png');
    this.load.image('base_3', 'assets/src/tiles/3.png');
    this.load.image('base_4', 'assets/src/tiles/4.png');
    this.load.image('base_5', 'assets/src/tiles/5.png');
    this.load.image('base_6', 'assets/src/tiles/6.png');
    this.load.image('base_7', 'assets/src/tiles/7.png');
    this.load.image('base_8', 'assets/src/tiles/8.png');
    this.load.image('base_9', 'assets/src/tiles/9.png');
    this.load.image('base_10', 'assets/src/tiles/10.png');
    this.load.image('base_11', 'assets/src/tiles/11.png');
    this.load.image('base_12', 'assets/src/tiles/12.png');
    this.load.image('base_13', 'assets/src/tiles/13.png');
    this.load.image('base_14', 'assets/src/tiles/14.png');
    this.load.image('base_15', 'assets/src/tiles/15.png');
    this.load.image('base_16', 'assets/src/tiles/16.png');
    this.load.image('base_17', 'assets/src/tiles/17.png');
    this.load.image('base_18', 'assets/src/tiles/18.png');
    
    this.load.atlas('ninja', 'assets/src/player/frames/all2.png', 'assets/src/player/frames/all2.json');
    this.load.json('ninjaData', 'assets/src/player/frames/all2.json');

    this.load.image('star', 'assets/src/star.png');
    this.load.image('bomb', 'assets/src/bomb.png');
    this.load.image('mushroom', 'assets/src/Object/mushroom_1.png');

    this.load.image("loading", "assets/sprites/loading.png");
    
    //gamepad buttons
    this.load.image('btnLeft', 'assets/src/buttons/btnLeft.png');
    this.load.image('btnRight', 'assets/src/buttons/btnRight.png');
    this.load.image('btnJump', 'assets/src/buttons/btnSpace.png');
   
}

function create(){
	
    create_animation(this);

    this.add.image(400,300, 'forest');
    platforms = this.physics.add.staticGroup();
    createBase();

   buttonleft = this.add.sprite(70, 450, 'btnLeft').setInteractive().setScale(0.68);
   buttonright = this.add.sprite(150, 450, 'btnRight').setInteractive().setScale(0.68);
   buttonjump = this.add.sprite(465, 450, 'btnJump').setInteractive().setScale(1);
   
 		player = this.physics.add.sprite(65, 200, 'ninja').setScale(0.25).play('turn',true);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

   stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 50 }        
    });

    stars.children.iterate(function (child) {
        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    bombs = this.physics.add.group();
    mushrooms = this.physics.add.group();
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    timerText = this.add.text(350, 16, '', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player,mushrooms, collectMushroom, null, this);
    this.physics.add.overlap(player, stars, collectStar , null, this);
    //this.physics.add.collider(player, bombs, hitBomb, null, this);
}



function update(){
    /*
    if (gameOver){
        return;
    }
    */
     
		buttonleft.on('pointerdown', function () {
			isBtnLeft = true;
			isBtnRight = false;
			isBtnJump = false;
		});     
		
		buttonright.on('pointerdown', function () {
			isBtnLeft = false;
			isBtnRight = true;
			isBtnJump = false;
		});
		
		buttonjump.on('pointerdown', function () {
			isBtnLeft = false;
			isBtnRight = false;
			isBtnJump = true;
		});     
		
		buttonleft.on('pointerup', function () {
			isBtnLeft = false;
			isBtnRight = false;
			isBtnJump = false;
		});     
		
		buttonright.on('pointerup', function () {
			isBtnLeft = false;
			isBtnRight = false;
			isBtnJump = false;
		});
		
		buttonjump.on('pointerup', function () {
			isBtnLeft = false;
			isBtnRight = false;
			isBtnJump = false;
		});  
   
    
    if (cursors.left.isDown || isBtnLeft) // if the left arrow key is down
    {
        player.setVelocityX(-250); // move left
        player.play("left");
    }
    else if (cursors.right.isDown || isBtnRight) // if the right arrow key is down
    {
        player.setVelocityX(250); // move right
        player.play("right");
         
    }else if ( (cursors.up.isDown || isBtnJump) && player.body.touching.down )
    {
        player.body.setVelocityY(-280); // jump up
        player.play("jump");
    }else{
       
        player.body.setVelocityX(0);
        player.play('turn');
        isBtnLeft = false;
        isBtnRight = false;
        isBtnJump = false;
    }

    if(cursors.space.isDown){
        player.play("attack");
    }
    
    //helloButton.on('pointerover', () => { console.log('pointerover'); });

    if(attackBomb){
        timerText.setText('Get the bombs ' + timedEvent.getProgress().toString().substr(0, 4));
        this.physics.add.collider(player,bombs, collectBombs, null, this);
    }else{
        this.physics.add.collider(player, bombs, hitBomb, null, this);  
        
        if(gameOver){  	
        		//sleep(5000);
            this.scene.pause();
            this.scene.launch('endGame');

            this.input.keyboard.on('keydown', function (event) {
	            if(event.code == 'Enter'){
	                location.reload();
	                //gameOver = false;
	                //game.scene.pause();
	                //game.scene.launch('startGame');                
	                //game.scene.restart();
	            }
	        	});
        }
    }
}

function createBase(){
    /*
    platforms.create(60 ,548, 'base_1').refreshBody();
    platforms.create(210, 400, 'base_14').setScale(0.8).refreshBody();
    platforms.create(188, 550, 'base_17');
    platforms.create(310, 550, 'base_17');
    platforms.create(425, 548, 'base_7').setScale(0.8).refreshBody();
    platforms.create(525, 548, 'base_11').setScale(0.8).refreshBody();
    
    platforms.create(640, 548, 'base_17');
    platforms.create(768, 548, 'base_17');
    
    platforms.create(640, 400, 'base_13').setScale(0.5).refreshBody();
    platforms.create(700, 400, 'base_14').setScale(0.5).refreshBody();
    platforms.create(760, 400, 'base_15').setScale(0.5).refreshBody();
    
    platforms.create(600, 280, 'crate').setScale(0.5).refreshBody();
    
    
    platforms.create(270, 180, 'base_13').setScale(0.5).refreshBody();
    platforms.create(330, 180, 'base_14').setScale(0.5).refreshBody();
    platforms.create(390, 180, 'base_14').setScale(0.5).refreshBody();
    platforms.create(450, 180, 'base_15').setScale(0.5).refreshBody();
*/

	platforms.create(30 ,460, 'base_1').setScale(0.6).refreshBody();
	platforms.create(160, 350, 'base_14').setScale(0.5).refreshBody(); 
	
	
	platforms.create(106, 460, 'base_17').setScale(0.6).refreshBody(); //sea
  platforms.create(183, 460, 'base_17').setScale(0.6).refreshBody(); //sea
  platforms.create(260, 460, 'base_17').setScale(0.6).refreshBody(); //sea
  
  platforms.create(337, 460, 'base_7').setScale(0.6).refreshBody();
  platforms.create(410, 460, 'base_11').setScale(0.6).refreshBody();
  
  platforms.create(480, 460, 'base_17').setScale(0.6).refreshBody(); //sea
  platforms.create(557, 460, 'base_17').setScale(0.6).refreshBody(); //sea
  platforms.create(634, 460, 'base_17').setScale(0.6).refreshBody(); //sea
  
  platforms.create(480, 320, 'base_13').setScale(0.5).refreshBody();
  platforms.create(540, 320, 'base_14').setScale(0.5).refreshBody();
  platforms.create(600, 320, 'base_15').setScale(0.5).refreshBody();
  
  platforms.create(430, 210, 'crate').setScale(0.4).refreshBody();
   
  platforms.create(210, 150, 'base_13').setScale(0.4).refreshBody();
  platforms.create(260, 150, 'base_14').setScale(0.4).refreshBody();
  platforms.create(300, 150, 'base_14').setScale(0.4).refreshBody();
  platforms.create(340, 150, 'base_15').setScale(0.4).refreshBody();
    

	
	
    //platforms.create(170, 568, 'base_down');

    //  Now let's create some ledges
    //platforms.create(200, 400, 'base_1');
    //platforms.create(50, 250, 'ground');
    //platforms.create(750, 220, 'ground');
}

function create_animation(current_this){

     current_this.anims.create({ 
        key: 'turn', 
        frames: current_this.anims.generateFrameNames('ninja', { prefix: 'idle_', start: 0, end: 9 }),
        frameRate: 9,
        repeat: -1 
    });   

    current_this.anims.create({ 
        key: 'left', 
        frames: current_this.anims.generateFrameNames('ninja', { prefix: 'run_left_', start: 0, end: 9 }),
        frameRate: 9,
        repeat: -1 
    });   

    current_this.anims.create({ 
        key: 'right', 
        frames: current_this.anims.generateFrameNames('ninja', { prefix: 'run_right_', start: 0, end: 9 }),
        frameRate: 9,
        repeat: -1 
    });   

    current_this.anims.create({ 
        key: 'jump', 
        frames: current_this.anims.generateFrameNames('ninja', { prefix: 'jump_', start: 0, end: 9 }),
        frameRate: 9,
        repeat: -1 
    });   

    current_this.anims.create({ 
        key: 'dead', 
        frames: current_this.anims.generateFrameNames('ninja', { prefix: 'dead_', start: 0, end: 9 }),
        frameRate: 9,
        repeat: -1 
    });   

    current_this.anims.create({ 
        key: 'attack', 
        frames: current_this.anims.generateFrameNames('ninja', { prefix: 'attack_', start: 6, end: 9 }),
        frameRate: 9,
        repeat: -1 
    });   

}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

        if(bombs.countActive(true) >= 2 && mushrooms.countActive(true) == 0 ){
            var mushroom = mushrooms.create(x, 15, 'mushroom');
            mushroom.setBounce(1);
            mushroom.setCollideWorldBounds(true);
            mushroom.allowGravity = true;
        }
    }
}

function collectMushroom(player, mushroom){
    mushroom.disableBody(true, true);
    attackBomb =  true;   
		score += 20;
    scoreText.setText('Score: ' + score);

    if (bombs.countActive(true) > 0){
        
        bombs.children.iterate(function (child){
            //child.disableBody(true, true);
            child.setCollideWorldBounds(false);
            child.allowGravity = true;
            child.setVelocity(0, 0);
        });
        timedEvent = this.time.delayedCall(6000, onEventBomb, [], this);   
    }    
}

function collectBombs(player, bomb){
    console.log("collect_bomb");
    /*
    bombs.children.iterate(function (child){
       child.disableBody(true, true);
    });
    */
}

function hitBomb (player, bomb)
{
        if(attackBomb){
            bomb.disableBody(true, true);
        }else{   
            player.anims.play('dead');
            this.physics.pause();
            player.setTint(0xff0000);
						gameOver = true;
            submitScore();
        }
}

function onEventBomb(){
    
    attackBomb = false;
    timerText.setText('');
    if (bombs.countActive(true) > 0){
        
      bombs.children.iterate(function (child){

          child.setCollideWorldBounds(true);
          child.setVelocity(Phaser.Math.Between(-200, 200), 20);
          child.allowGravity = false;
      });
    }
}

function submitScore(){

    var urlg = "./action.php";
    var querystring = 'type=submitScore'
                       +'&userName='+encodeURIComponent(userName)
                       +'&score='+encodeURIComponent(score);
    $.ajax({
        type: "post",
        url: urlg,
        data: {cryption:querystring},
        context: document.body,
        async: false,
        dataType: "json",
        success: function(data){
            console.log(data);
        }
    });    
}

function getTopTen(){

    var urlg = "./action.php";
    var topten = 'Comunication error restart the game';
    var querystring = 'type=getTopTen';

    $.ajax({
        type: "post",
        url: urlg,
        data: {cryption:querystring},
        context: document.body,
        async: false,
        dataType: "json",
        success: function(data){
            topten = data.topten;
        }
    });

    return topten;
}

function getTextContent(userName){

    var content = [
        "Hello "+userName+"!!!",
        "Welcome into Idila Lands, help Lidia to get the stars.",
        "Remember to eat the magic mushrooms in order to block the bombs",
        "and destroy them passing over, but you\'ve  a few seconds to do this.",
        "For playing, use the left and right cursors to move and up cursor to jump.",
        "Good luck "+userName+".",
    ];
    return content;
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;

    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

