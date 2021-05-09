'use strict'

class Timer {
  constructor() {
    this.timer = document.getElementById("timer");
    this.btn = document.getElementById("timerBtn");
    console.log(this.timer);
    console.log(this.btn);
    this.second = 0;
    this.minute = 0;
    this.timeText;
    this.intervalID;

    // pomodol中のbook
    this.pb;
  }

  _rest() {
    //休憩中の処理
    //5分
    //ボタンの色を赤に
    //ボタンのテキストをrelax...に
    //現在のポモドーロ回数の表示
    //データにポモドーロ回数を持たせる
  }

  countUp() {
    if (this.minute === 25) {
      if (this.pb) {
        this.pb.pomoCount += 1;
        alert("ポモドーロ ", this.pb.pomoCount);
      } else {
        alert("ポモドーロ ");
      }
      this._timerInit();
      this._rest()
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
    console.log(this.pb);
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