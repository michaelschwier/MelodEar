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

    this.build = function(commandReceiver)
    {
        var sceneKeyBoard = []
        sceneKeyBoard.push(new Button({
            x: 0,
            y: 2200,
            image: this.resources.getImage("playTarget")
        }, new PlayTargetNotesCommand(commandReceiver)))
        sceneKeyBoard.push(new Button({
            x: 1800,
            y: 2200,
            image: this.resources.getImage("playUser")
        }, new PlayUserNotesCommand(commandReceiver)))
        var whiteNotes = ["c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5"]
        keyImage = this.resources.getImage("keyWhite")
        for (var i = 0; i < 8; i++) {
            var whiteKey = new Button({
                    x: i * 300,
                    y: 2400,
                    clickAreaY: 2700,
                    clickAreaHeight: 300,
                    image: keyImage
                }, 
                new NotePressedCommand(commandReceiver, whiteNotes[i]))
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
