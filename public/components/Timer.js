'use strict'

class Timer {
  constructor() {
    this.timer = document.getElementById("timer");
    this.btn = document.getElementById("timerBtn");
    this.pomoText = document.getElementById("pomoCount");
    
    this.second = 0;
    this.minute = 0;
    this.timeText;
    this.intervalID;

    // 休憩中かどうか
    this.isRest = false;
    this.isMove = false;

    // pomodol中のbook
    this.pb;

    // database
    this.db;
  }

  countUp() {
    // 読書中のとき
    if (this.minute === 25) {
      navigator.vibrate(500);
      if (this.pb) {
        this.pb.pomoCount += 1;
      }
      this.pomoText.textContent = this.pb.pomoCount;
      this.db.update(this.pb);
      alert(this.pb ? `ポモドーロ${this.pb.pomoCount}回目達成!`: 'ポモドーロ！' );
      this._timerInit();
      this.isRest = true;
      this.start();
      return;
    }

    //休憩中のとき
    if (this.isRest) {
      if (this.minute == 5) {
        navigator.vibrate(500);
        
        alert('休憩終了...');
        this._timerInit();
        this.isRest = false;
        this.start();
        return;
      }
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
    this.isMove = true;
    if (this.isRest) {
      this.btn.textContent = "relax";
      //btnカラーチェンジする
    } else {
      this.btn.textContent = "stop";
    }
    this.intervalID = setInterval(() => this.countUp(), 1000);
  }

  stop() {
    this.btn.textContent = "start";
    clearInterval(this.intervalID);
  }

  reset() {
    this.stop();
    this._timerInit();
    this.isRest = false;
    this.isMove = false;
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
    this.isRest = false;
    this.isMove = false;
  }
}

export default Timer