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

  this.getScene = function(levelIdx)
  {
    var scene = {}
    scene.gameBoard = this.gameBoardBuilder.build(["c4", "d4", "c4", "d4"])
    scene.keyBoard = this.keyBoardBuilder.build(scene.gameBoard)
    return scene
  }


}



