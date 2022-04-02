(function() {
  // ----- Global variables -------------------------------
  // var language = "de"
  // var isPhoneGapApp = false;
  const onMobile = isMobile()
  var lastTimeStamp = null;
  var resources;
  var audioCache = {};
  var gamePhase;
  var mouseIsPressed = false;
  var resultsShareText = ""

  canvas = document.createElement("canvas")
  canvas.width = 2400
  canvas.height = 3200

  screenCanvas = document.getElementById("gameCanvas");
  screenCanvas.width = canvas.width
  screenCanvas.height = canvas.height


  // ----- Beta Test Dialog ---------------------------------------------------------------------
  var betaModal = document.getElementById("betaModal");
  var betaAcceptButton = document.getElementById("betaAcceptButton")
  betaAcceptButton.onclick = function(event) {
    event.stopImmediatePropagation()
    setCookie("showBetaTestNotice", "True", 1)
    betaModal.style.display = "none";
  }

  // ----- Info Dialog ---------------------------------------------------------------------
  var infoModal = document.getElementById("infoModal");
  infoModal.onclick = function() {
    infoModal.style.display = "none";
  }

  // ----- Rules Dialog ---------------------------------------------------------------------
  var rulesModal = document.getElementById("rulesModal");
  rulesModal.onclick = function() {
    rulesModal.style.display = "none";
  }

  // ----- Results Dialog ---------------------------------------------------------------------
  var resultsModal = document.getElementById("resultsModal")

  var resultsCloseButton = document.getElementById("resultsCloseButton")
  resultsCloseButton.onclick = function() {
    resultsModal.style.display = "none";
  }

  var shareButton = document.getElementById("shareButton")
  shareButton.onclick = function(event) {
    event.stopImmediatePropagation()
    shareRecord = {
      text: resultsShareText,
    }
    if (onMobile && !(navigator.userAgent.toLowerCase().indexOf("firefox")>-1) && navigator.share && navigator.canShare && navigator.canShare(shareRecord)) {
      navigator.share(shareRecord)
    }
    else {
      console.log("No mobile or no navigator.share, sharing to clipboard.")
      navigator.clipboard.writeText(resultsShareText);
    }
  }

  var newGameButtonWasPressed = false
  var newGameButton = document.getElementById("newGameButton")
  newGameButton.onclick = function(event) {
    event.stopImmediatePropagation()
    newGameButtonWasPressed = true
  }

  // ----- Cookie Policy Dialog ---------------------------------------------------------------------
  var cookiePolicyModal = document.getElementById("cookiePolicyModal")
  var acceptCookiesButton = document.getElementById("acceptCookiesButton")
  acceptCookiesButton.onclick = function(event) {
    event.stopImmediatePropagation()
    setCookie("cookiesAllowed", "True", 1000)
    cookiePolicyModal.style.display = "none"
  }

  var rejectCookiesButton = document.getElementById("rejectCookiesButton")
  rejectCookiesButton.onclick = function(event) {
    event.stopImmediatePropagation()
    cookiePolicyModal.style.display = "none"
  }

  // --------------------------------------------------------------------------
  function setupAudioCache()
  {
    audioCache["c4"] = new Howl({src: ["audios/c4.mp3"]});
    audioCache["d4"] = new Howl({src: ["audios/d4.mp3"]});
    audioCache["e4"] = new Howl({src: ["audios/e4.mp3"]});
    audioCache["f4"] = new Howl({src: ["audios/f4.mp3"]});
    audioCache["g4"] = new Howl({src: ["audios/g4.mp3"]});
    audioCache["a4"] = new Howl({src: ["audios/a4.mp3"]});
    audioCache["b4"] = new Howl({src: ["audios/b4.mp3"]});
    audioCache["c5"] = new Howl({src: ["audios/c5.mp3"]});  
  }

  // --------------------------------------------------------------------------
  function resizeGame()
  {
    var gameContainer = document.getElementById('gameContainer');
    var referenceWidthToHeight = 750 / 1000;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > referenceWidthToHeight) {
        gameContainer.style.height = '100vh';
        gameContainer.style.width = '75vh';
        document.documentElement.style.setProperty('--modal-width', '70vh');
    } 
    else {
      gameContainer.style.height = '133vw';
      gameContainer.style.width = '100vw';
      document.documentElement.style.setProperty('--modal-width', '94vw');
    }
    var clientRect = screenCanvas.getBoundingClientRect();
    if ((!onMobile) && (clientRect.width < canvas.width / 2)) {
      screenCanvas.width = Math.round(canvas.width / 2)
      screenCanvas.height = Math.round(canvas.height / 2)
    }
    else {
      screenCanvas.width = canvas.width
      screenCanvas.height = canvas.height
    }
    showFlashNote("RES " + clientRect.width + " " + clientRect.height + " " + screenCanvas.width + " " + screenCanvas.height, 3000)
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
    var clientRect = screenCanvas.getBoundingClientRect();
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
        dummyAudio = new Audio("audios/silence.mp3");
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

    this.render = function(ctx)
    { 
      for (var key in this.scene) {
        if (this.scene[key]) {
          if ("render" in this.scene[key]) {
            this.scene[key].render(ctx);
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
    document.getElementById("gameContainer").style.backgroundImage="none"
    hideResults()
    this.levelCreator = new LevelCreator(resources, audioCache)
    this.gameStatus = new GameStatus({level: startLevel})
    this.gameStatus.load()
    this.gameStatus.save()
    this.finishedDelay = 1.0;
    this.countdown = null
    GamePhase.call(this, this.levelCreator.getScene(this.gameStatus, this));


    this.levelFinished = function(success) {
      if (success && (this.gameStatus.level < 5)) {
        this.gameStatus.nextLevel()
        this.gameStatus.save()
        this.scene = this.levelCreator.getScene(this.gameStatus, this)
      }
      else {
        this.countdown = new Countdown(this.gameStatus)
        showResults(this.gameStatus)
      }
    }

    this.showResultsScreen = function() {
      if (this.countdown) {
        showResults(this.gameStatus)
      }
      else {
        showFlashNote("Finish your current game to show results", 3000)
      }
    }
    
    this.GamePhase_update = this.update;
    this.update = function(frameTime)
    {
      if (this.countdown) {
        this.countdown.updateCountdown()
      }
      this.GamePhase_update(frameTime);
    }

    this.getNextGamePhase = function()
    {
      if (this.countdown && this.countdown.expired()) {
        if (newGameButtonWasPressed || (resultsModal.style.display == "none")) {
          return new MainGamePhase(1)
        }
      }
      return this;
    }
  }
  

  // --------------------------------------------------------------------------
  function hideResults()
  {
    document.getElementById("newGameButton").disabled = true
    newGameButtonWasPressed = false
    resultsModal.style.display = "none";
  }

  // --------------------------------------------------------------------------
  function showResults(gameStatus)
  {
    document.getElementById("newGameButton").disabled = true
    newGameButtonWasPressed = false
    noSucesses = 0
    for (s of gameStatus.successes) {
      if (s > 0) {
        noSucesses++
      }
    }
    if (noSucesses > 0) {
      document.getElementById("resultsTitle").textContent = "Congratulations, you finished Level " + noSucesses
    }
    else {
      document.getElementById("resultsTitle").textContent = "Sorry, better luck next time!"
    }
    content = "<table style=\"margin-left: auto; margin-right: auto;\"><tr><th>Level</th><th>Finished</th><th>Tries</th></tr>"
    for (var i = 0; i < 5; i++) {
      if (gameStatus.levelTries[i] > 0) {
        content += "<tr><td>" + (i + 1) + "</td><td>" + (gameStatus.successes[i] ? "Yes" : "No") + "</td><td>" + gameStatus.levelTries[i] + "</td></tr>"
      }
      else {
        content += "<tr><td>" + (i + 1) + "</td><td>No</td><td>-</td></tr>"
      }
    }
    content += "</table>"
    document.getElementById("resultsResults").innerHTML = content

    uNote = " \u2669"
    uRepLeft = "\u{1D106}"
    uRepRight = " \u{1D107}"
    uTimes = " \u{D7}"
    resultsShareText = "MelodEar " + gameStatus.gameIdx + " " + noSucesses + "/5\n\n"
    for (var levelIdx = 0; levelIdx < 5; levelIdx++) {
      if (gameStatus.successes[levelIdx]) {
        resultsShareText += uRepLeft
        for (var n = 0; n < levelIdx + 2; n++) {
          resultsShareText += uNote
        }
        resultsShareText += uRepRight + uTimes + gameStatus.levelTries[levelIdx] + "\n"
      }
    }
    resultsShareText += "\nhttps://www.melodear.net"
    resultsModal.style.display = "block"
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
    var ctx = screenCanvas.getContext("2d")
    var octx = canvas.getContext("2d")
    ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
    octx.clearRect(0, 0, canvas.width, canvas.height);

    gamePhase.update(timePassed);
    if (screenCanvas.width < canvas.width) {
      // render offscreen and do one power of 2 downscale for better render quality (see also resizeGame)
      gamePhase.render(octx);
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
                    0, 0, screenCanvas.width, screenCanvas.height);
    }
    else {
      gamePhase.render(ctx);
    }
    gamePhase = gamePhase.getNextGamePhase();
  }
  
  // --------------------------------------------------------------------------
  function initGame()
  {
    if (!getCookie("skipRulesAtStart")) {
      rulesModal.style.display = "block";
      setCookie("skipRulesAtStart", "True", 1000)
    }
    document.getElementById("gameContainer").style.backgroundImage="url(\"images/startGame.png\")" 

    gamePhase = new IntroPhase();

    screenCanvas.addEventListener("touchmove", handleTouchMove);
    screenCanvas.addEventListener("touchstart", handleTouchStart);
    screenCanvas.addEventListener("mousedown", handleMouseDown);
    screenCanvas.addEventListener("mouseup", handleMouseUp);
    screenCanvas.addEventListener("mousemove", handleMouseMove);
  
    gameLoop();
  }

  // --------------------------------------------------------------------------
  // START
  // --------------------------------------------------------------------------
  resizeGame();
  window.addEventListener('resize', resizeGame);
  window.addEventListener('orientationchange', resizeGame);

  if (!getCookie("showBetaTestNotice")) {
    betaModal.style.display = "block"
  }

  if (!getCookie("cookiesAllowed")) {
    cookiePolicyModal.style.display = "block";
  }
  else {
    setCookie("cookiesAllowed", "True", 1000)
  }

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
  resources.addImage("playTargetInactive", "images/playTargetInactive.png")
  resources.addImage("playUser", "images/playUser.png")
  resources.addImage("playUserInactive", "images/playUserInactive.png")
  resources.addImage("title", "images/title.png")
  resources.addImage("help", "images/help.png")
  resources.addImage("info", "images/info.png")
  resources.addImage("results", "images/results.png")
  resources.addImage("level1", "images/level1.png")
  resources.addImage("level2", "images/level2.png")
  resources.addImage("level3", "images/level3.png")
  resources.addImage("level4", "images/level4.png")
  resources.addImage("level5", "images/level5.png")
  // Translated Images

  resources.loadAndCallWhenDone(initGame);
} ());

