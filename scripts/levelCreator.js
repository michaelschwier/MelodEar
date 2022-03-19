const availableNotes = ["c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5"]

function LevelCreator(resources, audioCache)
{
  // this.levelDefinitions = levelDefinitions;
  this.resources = resources;
  this.audioCache = audioCache;
  this.gameBoardBuilder = new GameBoardBuilder({
    resources: this.resources,
    audioCache: this.audioCache
  })
  this.keyBoardBuilder = new KeyBoardBuilder({
    resources: this.resources,
    audioCache: this.audioCache,
  })

  this.getScene = function(gameStatus, resultsCollector)
  {
    var scene = {}
    var initialRandomNoteIdx = new Math.seedrandom(gameStatus.gameIdx.toString())
    initialRandomNoteIdx = Math.floor(initialRandomNoteIdx() * availableNotes.length)
    var notes = [availableNotes[initialRandomNoteIdx]]
    var randomNumberGenerator = new Math.seedrandom(gameStatus.gameIdx.toString() + "-" + gameStatus.level.toString())
    for (var i = 0; i < gameStatus.level; i++) {
      var randomIdx = Math.floor(randomNumberGenerator() * availableNotes.length)
      var nextNote = availableNotes[randomIdx]
      while (nextNote == notes[notes.length - 1]) {
        randomIdx = Math.floor(randomNumberGenerator() * availableNotes.length)
        nextNote = availableNotes[randomIdx]  
      }
      notes.push(nextNote)
    }
    scene.gameBoard = this.gameBoardBuilder.build(notes, gameStatus, resultsCollector)
    scene.keyBoard = this.keyBoardBuilder.build(gameStatus.level, scene.gameBoard, resultsCollector)
    // HACK, think about smth nicer here
    scene.gameBoard.addStateChangeListener(scene.keyBoard)
    return scene
  }


}



