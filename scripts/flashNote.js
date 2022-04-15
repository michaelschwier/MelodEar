var solutionFlashDiv = null

function showFlashNote(message, duration)
{
    var flashNoteDiv = document.createElement("div")
    flashNoteDiv.setAttribute("class","flashNote")
    flashNoteDiv.innerHTML = message
    setTimeout(function(){flashNoteDiv.remove();}, duration)
    document.body.appendChild(flashNoteDiv)
}

function showSolutionFlash(targetNotes, duration)
{
    hideSolutionFlash()
    solutionFlashDiv = document.createElement("div")
    solutionFlashDiv.setAttribute("class", "solutionFlash")
    content = ""
    for (var note of targetNotes) {
        content += "<img src=\"images/" + note + "_key.png\"/>"
    }
    solutionFlashDiv.innerHTML = content
    document.body.appendChild(solutionFlashDiv)
}

function hideSolutionFlash()
{
    if (solutionFlashDiv) {
        solutionFlashDiv.remove()
        solutionFlashDiv = null
    }
}
