function DummyCommand(message="") {
  this.message = message

  this.execute = function()
  {
    if (this.message != "") {
      console.log(this.message)
    }
  }
}

function ShowHelpCommand() {
  this.execute = function()
  {
    rulesModal.style.display = "block";
  }
}

function NotePressedCommand(receiver, note) {
  this.receiver = receiver
  this.note = note

  this.execute = function()
  {
    this.receiver.handleNotePressed(this.note)
  }
}

function PlayTargetNotesCommand(receiver) {
  this.receiver = receiver

  this.execute = function()
  {
    this.receiver.handlePlayTargetNotesPressed()
  }
}

function PlayUserNotesCommand(receiver) {
  this.receiver = receiver

  this.execute = function()
  {
    this.receiver.handlePlayUserNotesPressed()
  }
}

