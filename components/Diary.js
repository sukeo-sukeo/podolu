'use strict'

class Diary {
  constructor() {
    this.writeBox = document.getElementById("bookLog");
    window.addEventListener("click", (e) => {
      this.writeBox.focus();
    });
    window.addEventListener("keydown", (e) => {
      this.writeBox.focus();
    });
  }
}

export default Diary