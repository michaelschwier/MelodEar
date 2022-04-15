function History()
{
    this.gameIndices = parseIntList(getCookie("historyGameIndices"))
    this.scores = parseIntList(getCookie("historyScores"))
    this.maxHistoryLength = 30

    this.add = function(gameStatus)
    {
        var gameIdx = gameStatus.gameIdx
        if ((this.gameIndices.length == 0) || (gameIdx > this.gameIndices[0])) {
            this.gameIndices.unshift(gameIdx)
            this.scores.unshift(gameStatus.getScore())
            while (this.gameIndices.length > this.maxHistoryLength) {
                this.gameIndices.pop()
                this.scores.pop()
            }
            setCookie("historyGameIndices", this.gameIndices.join(","), 1000)
            setCookie("historyScores", this.scores.join(","), 1000)
        }
    }

    this.getAverageScore = function(startIdx, endIdx, minCount=5)
    {
        var selScores = this.scores.slice(startIdx, endIdx)
        if (selScores.length < minCount) {
            return null
        }
        var mean = 0
        for (var s of selScores) {
            mean += s
        }
        mean = Math.round(mean / selScores.length)
        return mean
    }

    this.getAverageScoreString = function(startIdx, endIdx, minCount=5)
    {
        mean = this.getAverageScore(startIdx, endIdx, minCount)
        if (mean == null) {
            return "-"
        }
        else {
            return "" + mean
        }
    }
}
