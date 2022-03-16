function showFlashNote(message, duration)
{
    var flashNoteDiv = document.createElement("div")
    flashNoteDiv.setAttribute("class","flashNote")
    flashNoteDiv.innerHTML = message
    setTimeout(function(){flashNoteDiv.remove();}, duration)
    document.body.appendChild(flashNoteDiv)
}
