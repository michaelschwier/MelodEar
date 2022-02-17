function GameBoard(options)
{
    this.audioCache = options.audioCache
    this.targetNotes = options.targetNotes
    this.sceneBoard = options.sceneBoard
    this.sceneWhiteout = options.sceneWhiteout
    this.scene = [this.sceneBoard, this.sceneWhiteout]
    this.currTry = 0
    this.currSlotIdx = 1

    this.enterNote = function(note)
    {
        this.sceneBoard[this.currTry][this.currSlotIdx].setNote(note)
        this.currSlotIdx++
    }

    this.handleNotePressed = function(note)
    {   
        if (this.currSlotIdx == 1) {
            if (this.sceneBoard[this.currTry][this.currSlotIdx].targetNote == note) {
                this.audioCache[note].play()
                this.currSlotIdx++
            }
        }
        else if (this.currSlotIdx <= this.targetNotes.length) {
            this.audioCache[note].play()
            this.sceneBoard[this.currTry][this.currSlotIdx].setNote(note)
            this.currSlotIdx++
        }
        
    }

    this.update = function(frameTime = 0)
    {
        for (var layer of this.scene) {
            for (var row of layer) {
                for (var node of row) {
                    node.update(frameTime)
                }
            }
        }
    }

    this.render = function(renderContext)
    {
        for (var layer of this.scene) {
            for (var row of layer) {
                for (var node of row) {
                    node.render(renderContext)
                }
            }
        }
    }

}


function GameBoardBuilder(options)
{
    this.resources = options.resources
    this.audioCache = options.audioCache

    this.build = function(targetNotes)
    {
        return new GameBoard({
            audioCache: this.audioCache,
            targetNotes: targetNotes,
            sceneBoard: this.buildBoardScene(targetNotes),
            sceneWhiteout: this.buildWhiteoutScene(targetNotes)
        })
    }

    this.buildBoardScene = function(targetNotes)
    {
        var sceneBoard = []
        for (var y = 0; y < 5; y++) {
            var sceneRow = []
            sceneRow.push(new Sprite({
                image: this.resources.getImage("key"),
                x: 150,
                y: 400 * y
            }))
            sceneRow.push(new Slot(450, 400 * y, targetNotes[0], this.resources, targetNotes[0]))
            for (var x = 1; x < targetNotes.length; x++) {
                sceneRow.push(new Slot(450 + (x * 300), 400 * y, targetNotes[x], this.resources))
            }
            sceneBoard.push(sceneRow)
        }
        return sceneBoard
    }

    this.buildWhiteoutScene = function(targetNotes)
    {
        var sceneWhiteout = []
        for (var y = 1; y < 5; y++) {
            var sceneRow = []
            for (var x = 0; x <= targetNotes.length; x++) {
                sceneRow.push(new Sprite({
                    image: this.resources.getImage("whiteout"),
                    x: 150 + (x * 300),
                    y: 400 * y
                }))
            }
            sceneWhiteout.push(sceneRow)
        }
        return sceneWhiteout
    }
}


function Slot(x, y, targetNote, resources, initNote="lines")
{
    this.x = x
    this.y = y
    this.targetNote = targetNote
    this.playedNote = ""
    this.resources = resources
    this.noteSprite = new Sprite({
        image: this.resources.getImage(initNote),
        x: this.x,
        y: this.y
    })
    frame = initNote == "lines" ? "frameBlueFill" : "frameBlueNoFill"
    this.frameSprite = new Sprite({
        image: this.resources.getImage(frame),
        x: this.x,
        y: this.y
    })
    this.greenFrame = new Sprite({
        image: this.resources.getImage("frameGreenFill"),
        x: this.x,
        y: this.y
    })
    this.redFrame = new Sprite({
        image: this.resources.getImage("frameRedFill"),
        x: this.x,
        y: this.y
    })

    this.setNote = function(note)
    {
        this.playedNote = note
        this.noteSprite = new Sprite({
            image: this.resources.getImage(note),
            x: this.x,
            y: this.y
        })
        this.frameSprite = new Sprite({
            image: this.resources.getImage("frameBlueNoFill"),
            x: this.x,
            y: this.y
        })
    }

    this.update = function(frameTime = 0)
    {
        this.noteSprite.update(frameTime)
        this.frameSprite.update(frameTime)
    }

    this.render = function(renderContext)
    {
        this.noteSprite.render(renderContext)
        this.frameSprite.render(renderContext)
    }
}
