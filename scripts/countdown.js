function Countdown(gameStatus)
{
    dateStrings = gameStatus.date.split("-")
    var yyyy = parseInt(dateStrings[0])
    var mm = parseInt(dateStrings[1]) - 1
    var dd = parseInt(dateStrings[2])
    this.tomorrow = new Date(yyyy, mm, dd)
    this.tomorrow.setDate(this.tomorrow.getDate() + 1)
    this.tomorrow.setHours(0,0,0,0)

    this.updateCountdown = function() 
    {
        disableNewGameButton = this.expired() ? false : false
        document.getElementById("newGameButton").disabled = disableNewGameButton
        var cds = this.countdownString()
        document.getElementById("countdown").innerHTML = cds
    }

    this.expired = function()
    {
        cds = this.countdownString()
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
        hours = String(hours).padStart(2, '0')
        minutes = String(minutes).padStart(2, '0')
        seconds = String(seconds).padStart(2, '0')
        return hours + ":" + minutes + ":" + seconds
    }
}

