function GameStatus(options={})
{
    this.initLevel = function(options) 
    {
        this.currTry = options.currTry || 0
        this.currSlotIdx = options.currSlotIdx || 1
        var initUserNotes = []
        for (var y = 0; y < 5; y++) {
            row = []
            for (var x = 0; x < (this.level + 1); x++) {
                row.push("")
            }
            initUserNotes.push(row)
        }
        this.userNotes = options.userNotes || initUserNotes    
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

    this.save = function()
    {
        setCookie("gsDate", this.date, 1)
        setCookie("gsGameIdx", this.gameIdx, 1)
        setCookie("gsLevel", this.level, 1)
        setCookie("gsCurrTry", this.currTry, 1)
        setCookie("gsCurrSlotIdx", this.currSlotIdx, 1)
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
            var currTry = parseInt(getCookie("gsCurrTry"))
            var currSlotIdx = parseInt(getCookie("gsCurrSlotIdx"))
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
            this.currTry = currTry
            this.currSlotIdx = currSlotIdx
            this.levelTries = levelTries
            this.successes = successes
            this.userNotes = userNotes
        }
        catch (e) {
            console.log("ERROR in GameStatus.load: ", e)
        }
    }
}
