const States = Object.freeze({
    PlayingTargetNotes: Symbol("PlayingTargetNotes"),
    PlayingUserNotes:   Symbol("PlayingUserNotes"),
    RevealingUserNotes: Symbol("RevealingUserNotes"),
    Idle:               Symbol("Idle"),
    UserInput:          Symbol("UserInput"),
    UserInputDone:      Symbol("UserInputDone"),
    FadeOut:            Symbol("FadeOut"),
    Finished:           Symbol("Finished")
})

function GameBoard(options)
{
    this.state = States.PlayingTargetNotes
    this.audioCache = options.audioCache
    this.targetNotes = options.targetNotes
    this.resultsCollector = options.resultsCollector
    this.sceneBoard = options.sceneBoard
    this.sceneWhiteout = options.sceneWhiteout
    this.scene = [this.sceneBoard, this.sceneWhiteout]
    this.currTry = 0
    this.currSlotIdx = 1
    this.targetPlayIdx = 0
    this.userPlayIdx = this.targetNotes.length
    this.playCountDown = 1.0
    this.noteMatches = []
    this.stateChangeListeners = []

    this.addStateChangeListener = function(listener)
    {
        this.stateChangeListeners.push(listener)
    }

    this.setState = function(newState)
    {
        var oldState = this.state
        this.state = newState
        for (var listener of this.stateChangeListeners) {
            listener.stateChanged(oldState, newState)
        }
        console.log("state changed:", oldState, newState)
    }

    this.playTargetNotes = function(startDelay = 0.0)
    {
        if (this.state == States.Idle) {
            this.setState(States.PlayingTargetNotes)
            this.targetPlayIdx = 0
            this.playCountDown = startDelay
        }
    }

    this.handlePlayTargetNotesPressed = function() {
        this.playTargetNotes()
    }

    this.playUserNotes = function(startDelay = 0.0)
    {
        if (((this.state == States.Idle) || (this.state == States.UserInputDone)) && (this.currTry > 0)) {
            this.setState(this.state == States.Idle ? States.PlayingUserNotes : States.RevealingUserNotes)
            this.userPlayIdx = 0
            this.playCountDown = startDelay
        }
    }

    this.handlePlayUserNotesPressed = function() {
        this.playUserNotes()
    }

    this.handleNotePressed = function(note)
    {   
        if (this.state == States.Idle) {
            if (this.sceneBoard[this.currTry][this.currSlotIdx].targetNote == note) {
                this.audioCache[note].play()
                this.sceneBoard[this.currTry][this.currSlotIdx].setNote(note)
                this.noteMatches.push([true])
                this.currSlotIdx++
                this.setState(States.UserInput)
            }
        }
        else if (this.state == States.UserInput) {
            this.audioCache[note].play()
            var isCorrectNote = this.sceneBoard[this.currTry][this.currSlotIdx].setNote(note)
            this.noteMatches[this.currTry].push(isCorrectNote)
            if (this.currSlotIdx == this.targetNotes.length) {
                this.currTry++
                this.currSlotIdx = 1
                this.setState(States.UserInputDone)
                this.playUserNotes(1.0)
            }
            else {
                this.currSlotIdx++
            }
        }
    }

    this.fadeout = function()
    {
        for (var y = 0; y < 5; y++) {
            for (var x = 1; x <= this.targetNotes.length; x++) {
                console.log(y,x)
                this.sceneBoard[y][x].fadeout((4-y)*0.05 + (this.targetNotes.length-x)*0.08)
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
                var slot = this.sceneBoard[this.currTry][1 + this.targetPlayIdx]
                var note = this.targetNotes[this.targetPlayIdx]
                this.audioCache[note].play()
                slot.highlight()
                this.targetPlayIdx++
                this.playCountDown = 0.5
            }
            if (this.targetPlayIdx == this.targetNotes.length) {
                this.setState(States.Idle)
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
                    if (this.playCountDown <= 0) {
                        if (this.noteMatches[this.currTry-1].every(Boolean) || (this.currTry >= 5)) {
                            this.setState(States.FadeOut)
                            this.playCountDown = 0.8
                            this.fadeout()
                        }
                        else {
                            this.sceneWhiteout.shift()
                            this.setState(States.Idle)
                        }
                    }
                }
                else {
                    this.setState(States.Idle)
                }
            }
        }
        else if (this.state == States.FadeOut) {
            if (this.playCountDown <= 0) {
                if (this.noteMatches[this.currTry-1].every(Boolean)) {
                    this.setState(States.Finished)
                    this.resultsCollector.levelFinished({
                        success: true,
                        tries: this.currTry
                    })
                }
                else if (this.currTry >= 5) {
                    this.setState(States.Finished)
                    this.resultsCollector.levelFinished({
                        success: false,
                        tries: this.currTry
                    })
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

    this.build = function(targetNotes, resultsCollector)
    {
        return new GameBoard({
            audioCache: this.audioCache,
            targetNotes: targetNotes,
            resultsCollector: resultsCollector,
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
            sceneRow.push(new Slot(450, 400 * y, targetNotes[0], this.resources, y*0.05, targetNotes[0]))
            for (var x = 1; x < targetNotes.length; x++) {
                sceneRow.push(new Slot(450 + (x * 300), 400 * y, targetNotes[x], this.resources, y*0.05 + x*0.08))
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


function Slot(x, y, targetNote, resources, initAnimationDelay=0, initNote="lines")
{
    this.x = x
    this.y = y
    this.initAnimationSteps = [0.0, 0.4, 0.7, 0.85, 0.95, 1.0]
    this.highlightAnimationSteps = [1.0, 0.95, 0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0]
    this.fadeoutAnimationSteps = [1.0, 0.95, 0.85, 0.7, 0.4, 0.0]
    this.targetNote = targetNote
    this.playedNote = ""
    this.resources = resources
    this.noteSprite = new ZoomAnimationSprite({
        image: this.resources.getImage(initNote),
        x: this.x,
        y: this.y,
        zoomSteps: this.initAnimationSteps
    })
    this.noteSprite.play(initAnimationDelay)
    this.frameSprite = new ZoomAnimationSprite({
        image: this.resources.getImage("frameBlueLightFill"),
        x: this.x,
        y: this.y,
        zoomSteps: this.initAnimationSteps
    })
    this.frameIsInHighlightAnimationMode = false
    this.frameSprite.play(initAnimationDelay)
    this.greenFrame = new ZoomAnimationSprite({
        image: this.resources.getImage("frameGreenFill"),
        x: this.x,
        y: this.y,
        zoomSteps: this.highlightAnimationSteps
    })
    this.redFrame = new ZoomAnimationSprite({
        image: this.resources.getImage("frameRedFill"),
        x: this.x,
        y: this.y,
        zoomSteps: this.highlightAnimationSteps
    })

    this.setNote = function(note)
    {
        this.playedNote = note
        this.noteSprite = new ZoomAnimationSprite({
            image: this.resources.getImage(note),
            x: this.x,
            y: this.y,
            zoomSteps: [1.0]
        })
        this.frameSprite = new ZoomAnimationSprite({
            image: this.resources.getImage("frameBlueNoFill"),
            x: this.x,
            y: this.y,
            zoomSteps: this.highlightAnimationSteps
        })
        this.highlight()
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
        this.highlight()
    }

    this.highlight = function()
    {
        if (!this.frameIsInHighlightAnimationMode) {
            this.frameSprite.setZoomSteps(this.highlightAnimationSteps)
            this.frameIsInHighlightAnimationMode = true
        }
        this.frameSprite.play()
    }

    this.fadeout = function(delay=0)
    {
        this.noteSprite.setZoomSteps(this.fadeoutAnimationSteps)
        this.frameSprite.setZoomSteps(this.fadeoutAnimationSteps)
        this.noteSprite.play(delay)
        this.frameSprite.play(delay)
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
