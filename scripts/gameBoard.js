function GameBoard(options)
{
    this.status = options.gameStatus
    this.resultsCollector = options.resultsCollector
    this.sceneBoard = options.sceneBoard
    this.sceneWhiteout = options.sceneWhiteout
    this.scene = [this.sceneBoard, this.sceneWhiteout]
    this.targetPlayIdx = 0
    this.noNotes = this.sceneBoard[0].length - 1
    this.userPlayIdx = this.noNotes
    this.playCountDown = 1.0
    this.stateChangeListeners = []

    this.notesMatch = function(tryIdx) {
        if (tryIdx < this.sceneBoard.length) {
            match = true
            for (var i = 1; i < this.sceneBoard[tryIdx].length; i++) {
                var slot = this.sceneBoard[tryIdx][i]
                match &= slot.notesMatch()
            }
            return match
        }
        return false
    }
    
    this.addStateChangeListener = function(listener)
    {
        this.stateChangeListeners.push(listener)
    }

    this.setState = function(newState)
    {
        var oldState = this.status.state
        this.status.state = newState
        for (var listener of this.stateChangeListeners) {
            listener.stateChanged(oldState, newState)
        }
        // console.log("state changed:", oldState, newState)
    }

    this.playTargetNotes = function(startDelay = 0.0)
    {
        if (this.status.state == States.Idle) {
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
        if (((this.status.state == States.Idle) || (this.status.state == States.UserInputDone)) && (this.status.currTry > 0)) {
            this.setState(this.status.state == States.Idle ? States.PlayingUserNotes : States.RevealingUserNotes)
            this.userPlayIdx = 0
            this.playCountDown = startDelay
        }
    }

    this.handlePlayUserNotesPressed = function() {
        this.playUserNotes()
    }

    this.handleNotePressed = function(note)
    {   
        if (this.status.state == States.Idle) {
            if (this.sceneBoard[this.status.currTry][this.status.currSlotIdx].targetNote == note) {
                this.sceneBoard[this.status.currTry][this.status.currSlotIdx].setNote(note)
                this.status.currSlotIdx++
                this.setState(States.UserInput)
            }
        }
        else if (this.status.state == States.UserInput) {
            this.sceneBoard[this.status.currTry][this.status.currSlotIdx].setNote(note)
            if (this.status.currSlotIdx == this.noNotes) {
                this.status.currTry++
                this.status.currSlotIdx = 1
                this.setState(States.UserInputDone)
                this.playUserNotes(1.0)
            }
            else {
                this.status.currSlotIdx++
            }
        }
        this.status.save()
    }

    this.fadeout = function()
    {
        for (var y = 0; y < 5; y++) {
            for (var x = 1; x <= this.noNotes; x++) {
                this.sceneBoard[y][x].fadeout((4-y)*0.05 + (this.noNotes-x)*0.08)
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
        if (this.status.state == States.PlayingTargetNotes) {
            if ((this.targetPlayIdx < this.noNotes) && (this.playCountDown <= 0)) {
                var slot = this.sceneBoard[this.status.currTry][1 + this.targetPlayIdx]
                slot.playTargetNote()
                slot.highlight()
                this.targetPlayIdx++
                this.playCountDown = 0.5
            }
            if (this.targetPlayIdx == this.noNotes) {
                this.setState(States.Idle)
            }
        }
        else if ((this.status.state == States.PlayingUserNotes) || (this.status.state == States.RevealingUserNotes)) {
            if ((this.userPlayIdx < this.noNotes) && (this.playCountDown <= 0)) {
                var slot = this.sceneBoard[this.status.currTry - 1][1 + this.userPlayIdx]
                slot.playUserNote()
                slot.reveal()
                this.userPlayIdx++
                this.playCountDown = 0.5
            }
            if (this.userPlayIdx == this.noNotes) {
                if (this.status.state == States.RevealingUserNotes) {
                    if (this.playCountDown <= 0) {
                        if (this.notesMatch(this.status.currTry-1) || (this.status.currTry >= 5)) {
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
        else if (this.status.state == States.FadeOut) {
            if (this.playCountDown <= 0) {
                if (this.notesMatch(this.status.currTry-1)) {
                    this.setState(States.Finished)
                    this.resultsCollector.levelFinished({
                        noNotes: this.noNotes,
                        success: true,
                        tries: this.status.currTry
                    })
                }
                else if (this.status.currTry >= 5) {
                    this.setState(States.Finished)
                    this.resultsCollector.levelFinished({
                        noNotes: this.noNotes,
                        success: false,
                        tries: this.status.currTry
                    })
                }
            }
        }
        // console.log(this.status.state)
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
        var gameStatus = new GameStatus({level: targetNotes.length - 1})
        return new GameBoard({
            gameStatus: gameStatus,
            resultsCollector: resultsCollector,
            sceneBoard: this.buildBoardScene(targetNotes, gameStatus),
            sceneWhiteout: this.buildWhiteoutScene(targetNotes, gameStatus),
        })
    }

    this.getInitFrame = function(savedNote, savedNoteRevealed, targetNote)
    {
        if (savedNote == "") {
            return "frameBlueLightFill"
        }
        else if (savedNoteRevealed) {
            return savedNote == targetNote ? "frameGreenFill" : "frameRedFill"
        }
        else {
            return "frameBlueNoFill"
        }
    }

    this.buildBoardScene = function(targetNotes, gameStatus)
    {
        var sceneBoard = []
        for (var y = 0; y < 5; y++) {
            var sceneRow = []
            sceneRow.push(new Sprite({
                image: this.resources.getImage("key"),
                x: 150,
                y: 400 * y
            }))
            initFrame = "frameBlueLightFill"
            sceneRow.push(new Slot(450, 400 * y, targetNotes[0], gameStatus.userNotes[y], 0, this.resources, this.audioCache, y*0.05, targetNotes[0], initFrame))
            for (var x = 1; x < targetNotes.length; x++) {
                initFrame = "frameBlueLightFill"
                sceneRow.push(new Slot(450 + (x * 300), 400 * y, targetNotes[x], gameStatus.userNotes[y], x, this.resources, this.audioCache, y*0.05 + x*0.08, "", initFrame))
            }
            sceneBoard.push(sceneRow)
        }
        return sceneBoard
    }

    this.buildWhiteoutScene = function(targetNotes, gameStatus)
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
        // for (var y = 1; y < currTry; y++) {
        //     sceneWhiteout.shift()
        // }
        return sceneWhiteout
    }
}


function Slot(x, y, targetNote, userNotes, userNoteIdx, resources, audioCache, initAnimationDelay=0, initNote="", initFrame="frameBlueLightFill")
{
    this.x = x
    this.y = y
    this.initAnimationSteps = [0.0, 0.4, 0.7, 0.85, 0.95, 1.0]
    this.highlightAnimationSteps = [1.0, 0.95, 0.9, 0.95, 1.0, 1.05, 1.1, 1.05, 1.0]
    this.fadeoutAnimationSteps = [1.0, 0.95, 0.85, 0.7, 0.4, 0.0]
    this.targetNote = targetNote
    this.userNotesRow = userNotes
    this.userNoteIdx = userNoteIdx
    this.resources = resources
    this.audioCache = audioCache
    this.noteSprite = new ZoomAnimationSprite({
        image: this.resources.getImage(initNote == "" ? "lines" : initNote),
        x: this.x,
        y: this.y,
        zoomSteps: this.initAnimationSteps
    })
    this.noteSprite.play(initAnimationDelay)
    this.frameSprite = new ZoomAnimationSprite({
        image: this.resources.getImage(initFrame),
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

    this.notesMatch = function(){
        return this.targetNote == this.userNotesRow[this.userNoteIdx]
    }

    this.playTargetNote = function()
    {
        this.audioCache[this.targetNote].play()
    }

    this.playUserNote = function()
    {
        if (this.userNotesRow[this.userNoteIdx] != "") {
            this.audioCache[this.userNotesRow[this.userNoteIdx]].play()
        }
    }

    this.setNote = function(note)
    {
        this.userNotesRow[this.userNoteIdx] = note
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
        this.playUserNote()
    }

    this.reveal = function() 
    {
        if (this.targetNote == this.userNotesRow[this.userNoteIdx]) {
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
