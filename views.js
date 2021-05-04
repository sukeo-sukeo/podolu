'use strict'

import Diary from "./components/Diary.js";
import Timer from "./components/Timer.js";
import Search from './components/Search.js'

class ViewControl {
  // display:none;を付け替えてページ切り替え
  update(href) {
    const mainpages = document.getElementsByClassName("main-wrapper");
    // `.main-wrapperのid名`と`クリックしたaタグのhref名`が同じdisplayを表示。それ以外は非表示にする.
    [...mainpages].forEach((page) => {
      if (page.id === 'searchModal') return;
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

  searchDialog() {
    const btn = document.getElementById('searchBtn')
    const result = document.getElementById('result') 
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      const items = await new Search().searchBooks();
      if (!items) return;
      console.log(items);

      const texts = items.map(item => {
        return `
        <div class="item">
          <a href="${item.link}">
            <img src="${item.image}" alt="">
          </a>
          <div class="nes-table-responsive">
            <table class="nes-table is-bordered is-dark">
              <tbody>
                <tr>
                  <td>タイトル</td>
                  <td>${item.title}</td>
                </tr>
                <tr>
                  <td>説明</td>
                  <td>${item.description}</td>
                </tr>
                <tr>
                  <td>出版社/出版日</td>
                  <td>${item.publisher} / ${item.date}</td>
                </tr>
                <tr>
                  <td>ページ数</td>
                  <td>${item.pageCount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>`;
      })
      result.innerHTML = texts.join('')
    })
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


export default ViewControl; 