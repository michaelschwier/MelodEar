function KeyBoard(options)
{
    this.sceneKeyBoard = options.sceneKeyBoard
    this.scene = [this.sceneKeyBoard]

    this.stateChanged = function(oldState, newState)
    {
        if ((oldState == States.RevealingUserNotes) && (newState == States.Idle)) {
            for (var layer of this.scene) {
                for (var node of layer) {
                    if ("reset" in node)
                    node.reset()
                }
            }    
        }
    }

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
            if ("handleMouseDown" in node) {
                node.handleMouseDown(pos)
            }
        }
    }
}


function KeyBoardBuilder(options)
{
    this.resources = options.resources
    this.audioCache = options.audioCache

    this.build = function(level, commandReceiver, resultsCollector)
    {
        var sceneKeyBoard = []
        sceneKeyBoard.push(new Sprite({
            image: this.resources.getImage("title"),
            x: 800,
            y: 0
        }))
        sceneKeyBoard.push(new Button({
            image: this.resources.getImage("info"),
            x: 40,
            y: 20},
            new ShowInfoCommand())
        )
        sceneKeyBoard.push(new Button({
            image: this.resources.getImage("help"),
            x: 240,
            y: 20},
            new ShowHelpCommand())
        )
        sceneKeyBoard.push(new Button({
            image: this.resources.getImage("results"),
            x: 2200,
            y: 20},
            new ShowResultsCommand(resultsCollector))
        )
        sceneKeyBoard.push(new ButtonLimitedClicks({
            x: 40,
            y: 2330,
            image: this.resources.getImage("playUser"),
            inactiveImage: this.resources.getImage("playUserInactive"),
            maxClicks: 1
        }, new PlayUserNotesCommand(commandReceiver)))
        sceneKeyBoard.push(new ButtonLimitedClicks({
            x: 1770,
            y: 2330,
            image: this.resources.getImage("playTarget"),
            inactiveImage: this.resources.getImage("playTargetInactive"),
            maxClicks: 1
        }, new PlayTargetNotesCommand(commandReceiver)))
        sceneKeyBoard.push(new Sprite({
            image: this.resources.getImage("level" + level),
            x: 900,
            y: 2375
        }))
        var whiteNotes = ["c4", "d4", "e4", "f4", "g4", "a4", "b4", "c5"]
        keyImage = this.resources.getImage("keyWhite")
        for (var i = 0; i < 8; i++) {
            var whiteKey = new Button({
                    x: i * 300,
                    y: 2600,
                    image: keyImage
                }, 
                new NotePressedCommand(commandReceiver, whiteNotes[i]))
            sceneKeyBoard.push(whiteKey)
        }
        keyImage = this.resources.getImage("keyBlack")
        for (var i of [0,1,3,4,5]) {
            var blackKey = new Sprite({
                x: 190 + (i * 300),
                y: 2600,
                image: keyImage
                })
            sceneKeyBoard.push(blackKey)
        }
        return new KeyBoard({
            sceneKeyBoard: sceneKeyBoard
        })
    }

}
