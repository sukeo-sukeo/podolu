'use strict'

const main = () => {
  // 最初にすべて描画
  ViewControl.pomodoloPage();
  //ViewControl.booksPage();
  //data取得

  // 疑似SPAのpage遷移を設定
  [...document.getElementsByTagName('a')].forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const pagename = a.href.split('/').pop()
      ViewControl.update(pagename)
    })
  })

}

class ViewControl {

  // display:none;を付け替えてページ切り替え
  static update = (href) => {
    const mainpages = document.getElementsByClassName("main-wrapper");

    // `.main-wrapperのid`と`クリックしたaタグのhref`が同じならdisplayを表示。それ以外は非表示
    [...mainpages].forEach((page) => {
      if (page.id === href) {
        page.style.display = "";
      } else {
        page.style.display = "none";
      }
    });
  }

  //タイマーページ描画
  static pomodoloPage = () => {
    const timer = new Timer();
    const diary = new Diary();
  
    timer.btn.addEventListener('mousedown', () => 
      timer.startTime = performance.now());
  
    timer.btn.addEventListener("mouseup", () => {
      timer.leaveTime = performance.now();
      const pushTime = timer.leaveTime - timer.startTime 
      timer.pushJudege(pushTime)
    });
  }


}

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
      this._timerInit()
      return
    }

    this.second ++
    
    if (this.second < 10) {
      this.second = `0${Number(this.second)}`;
    } else {
      this.second = this.second
    }
    if (this.second > 59) {
      this.second = `00`
      this.minute ++
    }

    if (this.minute < 10) {
      this.minute = `0${Number(this.minute)}`
    } else {
      this.minute = this.minute
    }
    this.timeText = `${this.minute}:${this.second}`
    this.timer.textContent = this.timeText
  }

  start() {
    this.btn.textContent = "stop";
    this.intervalID = setInterval(() => this.countUp(), 1000);
  }

  stop() {
    this.btn.textContent = "start";
    clearInterval(this.intervalID)
  }
  
  reset() {
    console.log("do reset");
    this.stop()
    this._timerInit()
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

class Diary {
  constructor() {
    this.writeBox = document.getElementById('bookLog')
    window.addEventListener("click", (e) => {
      this.writeBox.focus();
    });
    window.addEventListener("keydown", (e) => {
      this.writeBox.focus();
    });
  }

}

window.onload = () => {
  main()

}