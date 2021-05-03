'use strict'

// import {nesCSS} from './setting.js'

const main = (views) => {
  // イベントセットとデータ取得し最初に全ページ描画
  views.pomodoloPage();
  views.booksPage();
  // get.data()

  // page遷移イベントを設定
  [...document.getElementsByTagName('a')].forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const pagename = a.href.split('/').pop()
      views.update(pagename)
    })
  })

}

//views
class ViewControl {
  // display:none;を付け替えてページ切り替え
  update(href) {
    const mainpages = document.getElementsByClassName("main-wrapper");

    // `.main-wrapperのid名`と`クリックしたaタグのhref名`が同じdisplayを表示。それ以外は非表示にする.
    [...mainpages].forEach((page) => {
      if (page.id === href) { 
        //適用cssの判定
        this._judgeCSSframWork(page)
        page.style.display = "";
      } else {
        page.style.display = "none";
      }
    });
  }

  //タイマーページ
  pomodoloPage() {
    console.log("timerPage ok");
    
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
  
  //書籍管理ページ
  booksPage() {
    console.log('booksPage ok');
    this._adjustLayout()
  }

  //flex最終行左寄せの処理
  _adjustLayout() {
    const parent = document.getElementsByClassName("book-img-wrapper")[0];
    const children = parent.children;
    const max_cnt = 4;
    const add_cnt = (max_cnt - (children.length % max_cnt));
    const damey = `<li><img></li>`;
    console.log(add_cnt);
    for (let i = 0; i < add_cnt; i++) {
      parent.insertAdjacentHTML("beforeend", damey);
    }
  }


  //timerPageではnesCSSは適用しない
  _judgeCSSframWork(page) {
    const nesLink = document.getElementById("nes");
    if (page.id === "timerPage") {
      nesLink.disabled = true;
    } else {
      nesLink.disabled = false;
    }
  }

}

//compornents
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
  const views = new ViewControl();
  //初期画面のidを渡す
  views.update('booksPage')

  main(views)

}