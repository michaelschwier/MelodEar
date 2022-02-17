function DummyCommand(message="") {
  this.message = message

  this.execute = function()
  {
    if (this.message != "") {
      console.log(this.message)
    }
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

