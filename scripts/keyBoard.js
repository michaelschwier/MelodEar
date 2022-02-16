function KeyBoard(options)
{
    this.sceneKeyBoard = options.sceneKeyBoard
    this.scene = [this.sceneKeyBoard]

    this.update = function(frameTime = 0)
    {
        for (var layer of this.scene) {
            for (var node of layer) {
                node.update(frameTime)
            }
        }
    }

    this.render = function(renderContext)
    {
        for (var layer of this.scene) {
            for (var node of layer) {
                node.render(renderContext)
            }
        }
    }

    this.handleMouseDown = function(pos)
    {
        for (var node of this.sceneKeyBoard) {
            node.handleMouseDown(pos)
        }
    }
}


function KeyBoardBuilder(options)
{
    this.resources = options.resources
    this.audioCache = options.audioCache

    this.build = function()
    {
        var sceneKeyBoard = []
        keyImage = this.resources.getImage("keyWhite")
        for (var i = 0; i < 8; i++) {
            var whiteKey = new Button({
                    x: i * 300,
                    y: 2400,
                    clickAreaY: 2700,
                    clickAreaHeight: 300,
                    image: keyImage
                }, 
                new DummyCommand())
            sceneKeyBoard.push(whiteKey)
        }
        keyImage = this.resources.getImage("keyBlack")
        for (var i of [0,1,3,4,5]) {
            var blackKey = new Button({
                x: 160 + (i * 300),
                y: 2400,
                image: keyImage
                }, 
                new DummyCommand())
            sceneKeyBoard.push(blackKey)
        }
        return new KeyBoard({
            sceneKeyBoard: sceneKeyBoard
        })
    }

}
