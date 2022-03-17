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
    var notes = ["c4", "e4", "g4", "e4", "b4", "e4", "c4"]
    scene.gameBoard = this.gameBoardBuilder.build(notes.slice(0, gameStatus.level + 1), gameStatus, resultsCollector)
    scene.keyBoard = this.keyBoardBuilder.build(gameStatus.level, scene.gameBoard, resultsCollector)
    // HACK, think about smth nicer here
    scene.gameBoard.addStateChangeListener(scene.keyBoard)
    return scene
  }


}



