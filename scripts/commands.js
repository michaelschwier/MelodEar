function DummyCommand(message="") {
  this.message = message

  this.execute = function()
  {
    if (this.message != "") {
      console.log(this.message)
    }
  }
}

function ShowInfoCommand() {
  this.execute = function()
  {
    infoModal.style.display = "block"
  }
}

function ShowHelpCommand() {
  this.execute = function()
  {
    rulesModal.style.display = "block";
  }
}

function ShowResultsCommand(resultsCollector) {
  this.resultsCollector = resultsCollector

  this.execute = function()
  {
    this.resultsCollector.showResultsScreen()
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

function BlackKeyPressedCommand() {
  this.execute = function() 
  {
    showFlashNote("Only white keys are active", 3000)
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

