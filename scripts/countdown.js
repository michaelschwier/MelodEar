function Countdown(gameStatus)
{
    var dateTime = getDateTimeInts(gameStatus.date)
    // this.tomorrow = new Date(dateTime[0], dateTime[1], dateTime[2])
    // this.tomorrow.setDate(this.tomorrow.getDate() + 1)
    // this.tomorrow.setHours(0,0,1,1)
    var minutes = (Math.floor(dateTime[4] / 5) + 1) * 5
    this.tomorrow = new Date(dateTime[0], dateTime[1], dateTime[2], dateTime[3], minutes, 1, 1)

    this.updateCountdown = function() 
    {
        var disableNewGameButton = this.expired() ? false : true
        document.getElementById("newGameButton").disabled = disableNewGameButton
        var cds = this.countdownString()
        document.getElementById("countdown").innerHTML = cds
    }

    this.expired = function()
    {
        var cds = this.countdownString()
        return cds == "00:00:00"
    }

    this.countdownString = function()
    {
        var now = new Date().getTime()
        var diff = this.tomorrow - now
        if (diff < 0) {
            return "00:00:00"
        }
        var hours = Math.floor(diff / (1000 * 60 * 60))
        var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((diff % (1000 * 60)) / 1000)
        var hours = String(hours).padStart(2, '0')
        var minutes = String(minutes).padStart(2, '0')
        var seconds = String(seconds).padStart(2, '0')
        return hours + ":" + minutes + ":" + seconds
    }
}

