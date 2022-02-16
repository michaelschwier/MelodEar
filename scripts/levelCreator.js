function LevelCreator(resources, audioCache)
{
  // this.levelDefinitions = levelDefinitions;
  this.resources = resources;
  this.audioCache = audioCache;
  this.boardBuilder = new GameBoardBuilder({
    resources: this.resources,
    audioCache: this.audioCache
  })

  this.getScene = function(levelIdx)
  {
    var scene = {}
    scene.gameBoard = this.boardBuilder.build(["c4", "d4", "c4", "d4"])
    return scene
  }


}



