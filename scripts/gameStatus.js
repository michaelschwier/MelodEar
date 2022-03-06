const States = Object.freeze({
    PlayingTargetNotes: "PlayingTargetNotes",
    PlayingUserNotes:   "PlayingUserNotes",
    RevealingUserNotes: "RevealingUserNotes",
    Idle:               "Idle",
    UserInput:          "UserInput",
    UserInputDone:      "UserInputDone",
    FadeOut:            "FadeOut",
    Finished:           "Finished"
})

function GameStatus(options={})
{
    this.date = options.date || getCurrLocalDateString()
    this.state = options.state || States.PlayingTargetNotes
    this.level = options.level || 1
    this.currTry = options.currTry || 0
    this.currSlotIdx = options.currSlotIdx || 1
    this.userNotes = options.userNotes || Array(5).fill(Array(this.level + 1).fill(""))

    this.save = function()
    {
        setCookie("gsDate", this.date, 1)
        setCookie("gsState", this.state, 1)
        setCookie("gsLevel", this.level, 1)
        setCookie("gsCurrTry", this.currTry, 1)
        setCookie("gsCurrSlotIdx", this.currSlotIdx, 1)
        for (var y = 0; y < this.userNotes.length; y++) {
            rowNotes = his.userNotes[y].join(",")
            setCookie("gsNotesRow" + y, rowNotes, 1)
        }
    }

    this.load = function()
    {
        try {
            var date = getCookie("gsDate")
            if (date != getCurrLocalDateString()) {
                return
            }
            var state = States[getCookie("gsState")]
            var level = parseInt(getCookie("gsLevel"))
            var currTry = parseInt(getCookie("gsCurrTry"))
            var currSlotIdx = parseInt(getCookie("gsCurrSlotIdx"))
            var userNotes = []
            for (var y = 0; y < this.userNotes.length; y++) {
                var row = getCookie("gsNotesRow" + y).split(",")
                userNotes.push(row)
            }
            this.date = date
            this.state = state
            this.level = level
            this.currTry = currTry
            this.currSlotIdx = currSlotIdx
            this.userNotes = this.userNotes
        }
        catch (e) {
            console.log("ERROR in GameStatus.load: ", e)
        }
    }
}
