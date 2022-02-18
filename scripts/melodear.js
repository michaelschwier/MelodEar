(function() {
  // ----- Global variables -------------------------------
  var language = "de"
  var isPhoneGapApp = false;
  var lastTimeStamp = null;
  var resources;
  var audioCache = {};
  var canvas;
  var gamePhase;
  var levelCreator;
  var gameStatusCreator;
  var mouseIsPressed = false;

  // --------------------------------------------------------------------------
  function setupAudioCache()
  {
    audioCache["c4"] = new Howl({src: ["audio/c4.mp3"]});
    audioCache["d4"] = new Howl({src: ["audio/d.mp3"]});
    audioCache["e4"] = new Howl({src: ["audio/e.mp3"]});
    audioCache["f4"] = new Howl({src: ["audio/f.mp3"]});
    audioCache["g4"] = new Howl({src: ["audio/g.mp3"]});
    audioCache["a4"] = new Howl({src: ["audio/a.mp3"]});
    audioCache["b4"] = new Howl({src: ["audio/b.mp3"]});
    audioCache["c5"] = new Howl({src: ["audio/c5.mp3"]});  
  }

  // --------------------------------------------------------------------------
  function resizeGame()
  {
    var gameContainer = document.getElementById('gameContainer');
    var referenceWidthToHeight = 800 / 1000;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > referenceWidthToHeight) {
        gameContainer.style.height = '100vh';
        gameContainer.style.width = '80vh';
    } 
    else {
      gameContainer.style.height = '125vw';
      gameContainer.style.width = '100vw';
    }
  }

  // --------------------------------------------------------------------------
  function getTouchClientPosition(e)
  {
    var touchPos = {};
    touchPos.valid = false;
    if (e.targetTouches.length == 1) {
      var touch = e.targetTouches[0];
      touchPos.clientX = touch.clientX;
      touchPos.clientY = touch.clientY;
      touchPos.valid = true;
    }
    return touchPos;
  }
  
  function getCanvasPosition(e)
  {
    var clientRect = canvas.getBoundingClientRect();
    x = e.clientX - clientRect.left;
    y = e.clientY - clientRect.top;
    x *= canvas.width / clientRect.width;
    y *= canvas.height / clientRect.height;
    var position = {};
    position.canvasX = x;
    position.canvasY = y;
    return position;
  }
  
  function handleTouchMove(e)
  {
    e.preventDefault();
    touchPos = getTouchClientPosition(e)
    if (touchPos.valid) {
      pos = getCanvasPosition(touchPos);
      gamePhase.handleTouchMove(pos);
    }
  }

  function handleTouchStart(e)
  {
    e.preventDefault();
    touchPos = getTouchClientPosition(e)
    if (touchPos.valid) {
      pos = getCanvasPosition(touchPos);
      gamePhase.handleMouseDown(pos);
    }
  }

  function handleMouseMove(e)
  {
    e.preventDefault();
    if (mouseIsPressed) {
      pos = getCanvasPosition(e);
      gamePhase.handleTouchMove(pos);
    }
  }

  function handleMouseDown(e)
  {
    e.preventDefault();
    if (e.button == 0) {
      mouseIsPressed = true;
    }
    pos = getCanvasPosition(e);
    gamePhase.handleMouseDown(pos);
  }

  function handleMouseUp(e)
  {
    e.preventDefault();
    if (e.button == 0) {
      mouseIsPressed = false;
    }
  }
  
    // --------------------------------------------------------------------------
    function IntroPhase() {
      this.startGame = false;
  
      this.handleTouchMove = function(pos)
      { }
  
      this.handleMouseDown = function(pos)
      { 
        this.startGame = true;
        // hack to convince Safari and other browsers to play audio
        dummyAudio = new Audio("audio/silence.mp3");
        dummyAudio.play();
        setupAudioCache();
      }
  
      this.update = function(frameTime = 0.0)
      {
      }
  
      this.render = function()
      {
      }
  
      this.getNextGamePhase = function()
      {
        if (this.startGame) 
        {
          return new MainGamePhase(1);
        }
        else {
          return this;
        }
      }
    }
    
  // --------------------------------------------------------------------------
  function GamePhase(scene) 
  {
    this.scene = scene;

    this.handleTouchMove = function(pos)
    { 
      for (var key in this.scene) {
        if (this.scene[key]) {
          if ("handleTouchMove" in this.scene[key]) {
            this.scene[key].handleTouchMove(pos);
          }
        }
      }
    }

    this.handleMouseDown = function(pos)
    { 
      for (var key in this.scene) {
        if (this.scene[key]) {
          if ("handleMouseDown" in this.scene[key]) {
            this.scene[key].handleMouseDown(pos);
          }
        }
      }
    }
    
    this.update = function(frameTime = 0)
    { 
      for (var key in this.scene) {
        if (this.scene[key]) {
          if ("update" in this.scene[key]) {
            this.scene[key].update(frameTime);
          }
        }
      }
    }

    this.render = function()
    { 
      for (var key in this.scene) {
        if (this.scene[key]) {
          if ("render" in this.scene[key]) {
            this.scene[key].render(canvas.getContext("2d"));
          }
        }
      }
    }

    this.getNextGamePhase = function()
    { 
      return this;
    }
  }

  // --------------------------------------------------------------------------
  function MainGamePhase(startLevel)
  {
    this.level = startLevel;
    this.results = []
    this.finishedDelay = 1.0;
    GamePhase.call(this, levelCreator.getScene(this.level, this));


    this.levelFinished = function(levelResult) {
      this.results.push(levelResult)
      console.log(this.results)
      if (levelResult.success && (this.level < 5)) {
          this.level++
          this.scene = levelCreator.getScene(this.level, this)
      }
    }
    
    // this.super_update = this.update;
    // this.update = function(frameTime)
    // {
    //   this.super_update(frameTime);
    // }

    this.getNextGamePhase = function()
    {
      return this;
    }

  }
  

  // --------------------------------------------------------------------------
  function getPassedFrameTimeInSeconds(timeStamp)
  {
    if (isNaN(timeStamp)) {
      return 0;
    }
    if (!lastTimeStamp) {
      lastTimeStamp = timeStamp;
    }
    var timePassed = (timeStamp - lastTimeStamp) / 1000.0;
    lastTimeStamp = timeStamp;
    return timePassed;
  }
  
  // --------------------------------------------------------------------------
  function gameLoop(timeStamp) 
  {
    var timePassed = getPassedFrameTimeInSeconds(timeStamp);

    window.requestAnimationFrame(gameLoop);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    gamePhase.update(timePassed);
    gamePhase.render();
    gamePhase = gamePhase.getNextGamePhase();
  }
  
  // --------------------------------------------------------------------------
  function initGame()
  {
    document.getElementById("gameContainer").style.backgroundImage="none"; 

    canvas = document.getElementById("gameCanvas");
    canvas.width = 2400;
    canvas.height = 3000;

    levelCreator = new LevelCreator(resources, audioCache)
    gamePhase = new IntroPhase();

    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
  
    gameLoop();
  }

  // --------------------------------------------------------------------------
  // START
  // --------------------------------------------------------------------------
  resizeGame();
  window.addEventListener('resize', resizeGame);
  window.addEventListener('orientationchange', resizeGame);

  language = getLanguage()
  // console.log("Switching game language to", language)

  // Language agnostic images
  resources = new ResourcePreLoader();
  resources.addImage("key", "images/key.png");
  resources.addImage("lines", "images/lines.png");
  resources.addImage("c4", "images/c4.png");
  resources.addImage("d4", "images/d4.png");
  resources.addImage("e4", "images/e4.png");
  resources.addImage("f4", "images/f4.png");
  resources.addImage("g4", "images/g4.png");
  resources.addImage("a4", "images/a4.png");
  resources.addImage("b4", "images/b4.png");
  resources.addImage("c5", "images/c5.png");
  resources.addImage("whiteout", "images/whiteout.png")
  resources.addImage("frameBlueNoFill", "images/frameBlueNoFill.png")
  resources.addImage("frameBlueLightFill", "images/frameBlueLightFill.png")
  resources.addImage("frameBlueFill", "images/frameBlueFill.png")
  resources.addImage("frameGreenFill", "images/frameGreenFill.png")
  resources.addImage("frameRedFill", "images/frameRedFill.png")
  resources.addImage("keyWhite", "images/keyWhite.png")
  resources.addImage("keyBlack", "images/keyBlack.png")
  resources.addImage("playTarget", "images/playTarget.png")
  resources.addImage("playUser", "images/playUser.png")
  // Translated Images

  resources.loadAndCallWhenDone(initGame);
} ());

