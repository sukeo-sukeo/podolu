'use strict'

class Timer {
  constructor() {
    this.timer = document.getElementById("timer");
    this.btn = document.getElementById("timerBtn");
    this.second = 0;
    this.minute = 0;
    this.timeText;
    this.intervalID;
  }

  countUp() {
    if (this.minute === 25) {
      alert("ポモドーロ!");
      this._timerInit();
      return;
    }

    this.second++;

    if (this.second < 10) {
      this.second = `0${Number(this.second)}`;
    } else {
      this.second = this.second;
    }
    if (this.second > 59) {
      this.second = `00`;
      this.minute++;
    }

    if (this.minute < 10) {
      this.minute = `0${Number(this.minute)}`;
    } else {
      this.minute = this.minute;
    }
    this.timeText = `${this.minute}:${this.second}`;
    this.timer.textContent = this.timeText;
  }

  start() {
    this.btn.textContent = "stop";
    this.intervalID = setInterval(() => this.countUp(), 1000);
  }

  stop() {
    this.btn.textContent = "start";
    clearInterval(this.intervalID);
  }

  reset() {
    console.log("do reset");
    this.stop();
    this._timerInit();
  }

  pushJudege(pushTime) {
    let longPusuTime = 500;
    if (pushTime > longPusuTime) {
      //長押しのときタイマーリセット
      if (confirm("reset ok?")) {
        this.reset();
      }
    } else {
      //長押しじゃないときの処理
      if (this.btn.textContent === "start") {
        this.start();
        return;
      }
      if (this.btn.textContent === "stop") {
        this.stop();
        return;
      }
    }
  }

  _timerInit() {
    this.stop();
    this.second = 0;
    this.minute = 0;
    this.timeText = "";
    this.timer.textContent = `00:00`;
  }
}

export default Timer