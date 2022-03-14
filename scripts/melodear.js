(function() {
  // ----- Global variables -------------------------------
  // var language = "de"
  // var isPhoneGapApp = false;
  var lastTimeStamp = null;
  var resources;
  var audioCache = {};
  var canvas;
  var gamePhase;
  var levelCreator;
  var gameStatusCreator;
  var mouseIsPressed = false;
  var resultsShareText = ""

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
    if (isMobile() && !(navigator.userAgent.toLowerCase().indexOf("firefox")>-1) && navigator.share && navigator.canShare && navigator.canShare(shareRecord)) {
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
  isMobile = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
  
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
    document.getElementById("gameContainer").style.backgroundImage="none"
    hideResults()
    this.gameStatus = new GameStatus({level: startLevel})
    this.gameStatus.load()
    this.gameStatus.save()
    this.finishedDelay = 1.0;
    this.countdown = null
    GamePhase.call(this, levelCreator.getScene(this.gameStatus, this));


    this.levelFinished = function(success) {
      if (success && (this.gameStatus.level < 5)) {
        this.gameStatus.nextLevel()
        this.gameStatus.save()
        this.scene = levelCreator.getScene(this.gameStatus, this)
      }
      else {
        showResults(this.gameStatus, success)
        this.countdown = new Countdown(this.gameStatus)
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
  function showResults(gameStatus, success)
  {
    document.getElementById("newGameButton").disabled = true
    newGameButtonWasPressed = false
    noSucesses = success ? gameStatus.level : gameStatus.level - 1
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
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    gamePhase.update(timePassed);
    gamePhase.render();
    gamePhase = gamePhase.getNextGamePhase();
  }
  
  // --------------------------------------------------------------------------
  function initGame()
  {
    rulesModal.style.display = "block";
    document.getElementById("gameContainer").style.backgroundImage="url(\"images/startGame.png\")" 

    canvas = document.getElementById("gameCanvas");
    canvas.width = 2400;
    canvas.height = 3200;

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

  // language = getLanguage()
  // console.log("Switching game language to", language)

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
  resources.addImage("level1", "images/level1.png")
  resources.addImage("level2", "images/level2.png")
  resources.addImage("level3", "images/level3.png")
  resources.addImage("level4", "images/level4.png")
  resources.addImage("level5", "images/level5.png")
  // Translated Images

  resources.loadAndCallWhenDone(initGame);
} ());

