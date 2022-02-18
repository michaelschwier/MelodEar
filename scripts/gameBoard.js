function GameBoard(options)
{
    const States = Object.freeze({
        PlayingTargetNotes: Symbol("PlayingTargetNotes"),
        PlayingUserNotes:   Symbol("PlayingUserNotes"),
        RevealingUserNotes: Symbol("RevealingUserNotes"),
        Idle:               Symbol("Idle"),
        UserInput:          Symbol("UserInput"),
        UserInputDone:      Symbol("UserInputDone"),
        Finished:           Symbol("Finished")
    })
    this.state = States.PlayingTargetNotes
    this.audioCache = options.audioCache
    this.targetNotes = options.targetNotes
    this.sceneBoard = options.sceneBoard
    this.sceneWhiteout = options.sceneWhiteout
    this.scene = [this.sceneBoard, this.sceneWhiteout]
    this.currTry = 0
    this.currSlotIdx = 1
    this.targetPlayIdx = 0
    this.userPlayIdx = this.targetNotes.length
    this.playCountDown = 1.0
    this.noteMatches = []

    this.playTargetNotes = function(startDelay = 0.0)
    {
        if (this.state == States.Idle) {
            this.state = States.PlayingTargetNotes
            this.targetPlayIdx = 0
            this.playCountDown = startDelay
        }
    }

    this.playUserNotes = function(startDelay = 0.0)
    {
        if (((this.state == States.Idle) || (this.state = States.UserInputDone)) && (this.currTry > 0)) {
            this.state = this.state == States.Idle ? States.PlayingUserNotes : States.RevealingUserNotes
            this.userPlayIdx = 0
            this.playCountDown = startDelay
        }
    }

    this.handleNotePressed = function(note)
    {   
        if (this.state == States.Idle) {
            if (this.sceneBoard[this.currTry][this.currSlotIdx].targetNote == note) {
                this.audioCache[note].play()
                this.sceneBoard[this.currTry][this.currSlotIdx].setNote(note)
                this.noteMatches.push([true])
                this.currSlotIdx++
                this.state = States.UserInput
            }
        }
        else if (this.state == States.UserInput) {
            this.audioCache[note].play()
            var isCorrectNote = this.sceneBoard[this.currTry][this.currSlotIdx].setNote(note)
            this.noteMatches[this.currTry].push(isCorrectNote)
            if (this.currSlotIdx == this.targetNotes.length) {
                this.currTry++
                this.currSlotIdx = 1
                this.state = States.UserInputDone
                this.playUserNotes(1.0)
            }
            else {
                this.currSlotIdx++
            }
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
        if (this.playCountDown > 0) {
            this.playCountDown -= frameTime
        }
        if (this.state == States.PlayingTargetNotes) {
            if ((this.targetPlayIdx < this.targetNotes.length) && (this.playCountDown <= 0)) {
                var note = this.targetNotes[this.targetPlayIdx]
                this.audioCache[note].play()
                this.targetPlayIdx++
                this.playCountDown = 0.5
            }
            if (this.targetPlayIdx == this.targetNotes.length) {
                this.state = States.Idle
            }
        }
        else if ((this.state == States.PlayingUserNotes) || (this.state == States.RevealingUserNotes)) {
            if ((this.userPlayIdx < this.targetNotes.length) && (this.playCountDown <= 0)) {
                var slot = this.sceneBoard[this.currTry - 1][1 + this.userPlayIdx]
                var note = slot.playedNote
                this.audioCache[note].play()
                slot.reveal()
                this.userPlayIdx++
                this.playCountDown = 0.5
            }
            if (this.userPlayIdx == this.targetNotes.length) {
                if (this.state == States.RevealingUserNotes) {
                    if (this.noteMatches[this.currTry-1].every(Boolean)) {
                        this.state = States.Finished
                    }
                    else if (this.currTry >= 5) {
                        this.state = States.Finished
                    }
                    else {
                        this.sceneWhiteout.shift()
                        this.state = States.Idle
                    }
                }
                else {
                    this.state = States.Idle
                }
            }
        }
        // console.log(this.state)
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
        return this.targetNote == this.playedNote
    }

    this.reveal = function() 
    {
        if (this.targetNote == this.playedNote) {
            this.frameSprite = this.greenFrame
        }
        else {
            this.frameSprite = this.redFrame
        }
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
