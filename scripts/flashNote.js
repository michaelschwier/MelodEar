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
    var flashNoteDiv = document.createElement("div")
    flashNoteDiv.setAttribute("class", "solutionFlash")
    content = ""
    for (var note of targetNotes) {
        content += "<img src=\"images/" + note + "_key.png\"/>"
    }
    flashNoteDiv.innerHTML = content
    setTimeout(function(){flashNoteDiv.remove();}, duration)
    document.body.appendChild(flashNoteDiv)
}
