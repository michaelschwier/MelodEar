function DummyCommand(message="") {
  this.message = message

  this.execute = function()
  {
    if (this.message != "") {
      console.log(this.message)
    }
  }
}

// --------------------------------------------------------------------------

