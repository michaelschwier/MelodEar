function GameStatus(options={})
{
    this.initLevel = function(options) 
    {
        var initUserNotes = []
        for (var y = 0; y < 5; y++) {
            row = []
            for (var x = 0; x < (this.level + 1); x++) {
                row.push("")
            }
            initUserNotes.push(row)
        }
        this.userNotes = options.userNotes || initUserNotes
        this.levelTries[this.level - 1] = -1
        this.successes[this.level - 1] = 0
    }

    this.date = options.date || getCurrLocalDateString()
    this.gameIdx = options.gameIdx || getTodaysGameIndex()
    this.level = options.level || 1
    this.levelTries = Array(5).fill(-1)
    this.successes = Array(5).fill(0)
    this.initLevel(options)

    this.nextLevel = function() {
        this.level += 1
        this.initLevel({})
    }

    this.levelFinished = function(success) {
        this.successes[this.level - 1] = success ? 1 : 0
        if (this.currTry() > 0) {
            this.levelTries[this.level - 1] = this.currTry()
        }
    }

    this.noNotes = function()
    {
        return this.userNotes[0].length
    }

    this.noTries = function()
    {
        return this.userNotes.length
    }

    this.currTry = function()
    {
        var currTry = 0
        for (var row of this.userNotes) {
            if (row[this.noNotes() - 1] == "") {
                break
            }
            currTry++
        }
        return currTry
    }

    this.currSlotIdx = function()
    {
        if (this.currTry() >= this.noTries()) {
            return 0
        }
        var currSlotIdx = 0
        // Due to implementation of this.currTry() at least the last note must still be ""
        for (var note of this.userNotes[this.currTry()]) {
            if (note == "") {
                break
            }
            currSlotIdx++
        }
        return currSlotIdx
    }

    this.save = function()
    {
        setCookie("gsDate", this.date, 1)
        setCookie("gsGameIdx", this.gameIdx, 1)
        setCookie("gsLevel", this.level, 1)
        setCookie("gsLevelTries", this.levelTries.join(","), 1)
        setCookie("gsSuccesses", this.successes.join(","), 1)
        for (var y = 0; y < this.userNotes.length; y++) {
            rowNotes = this.userNotes[y].join(",")
            setCookie("gsNotesRow" + y, rowNotes, 1)
        }
    }

    this.load = function()
    {
        try {
            var date = getCookie("gsDate")
            var gameIdx = parseInt(getCookie("gsGameIdx"))
            if (gameIdx != getTodaysGameIndex()) {
                return
            }
            var level = parseInt(getCookie("gsLevel"))
            var levelTries = getCookie("gsLevelTries").split(",")
            for (var i = 0; i < levelTries.length; i++) {
                levelTries[i] = parseInt(levelTries[i])
            }
            var successes = getCookie("gsSuccesses").split(",")
            for (var i = 0; i < successes.length; i++) {
                successes[i] = parseInt(successes[i])
            }
            var userNotes = []
            for (var y = 0; y < this.userNotes.length; y++) {
                var row = getCookie("gsNotesRow" + y).split(",")
                userNotes.push(row)
            }
            this.date = date
            this.gameIdx = gameIdx
            this.level = level
            this.levelTries = levelTries
            this.successes = successes
            this.userNotes = userNotes
            if ((this.noNotes() - 1) != this.level) {
                console.log("Inconsistent game state for level " + this.level + " and no. notes " + this.level + ". Going back to last valid level")
                this.level = this.noNotes() - 1
            }
        }
        catch (e) {
            console.log("ERROR in GameStatus.load: ", e)
        }
    }
}
