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
    const field = document.getElementById('searchField')
    const modal = document.getElementById('searchModal')
    const btn = document.getElementById('searchBtn')
    //フィールドがフォーカスされたとき全選択
    field.onfocus = () => field.select();  

    //エンターキーでも検索処理発動
    modal.addEventListener('keydown', e => {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        this._fetchAPI();
      }
    });
    
    //検索ボタンで検索処理発動
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      this._fetchAPI()
    });
  }

  async _fetchAPI() {
    // search処理は別ファイルに記載
    const items = await new Search().searchBooks();
    const result = document.getElementById("result"); 
    
    console.log(items);
    if (!items) {
      result.innerHTML = `<h2 style="text-align:center;">見つかりませんでした<h2>`;
      return;
    }

    const texts = items.map(item => {
      return `
      <div class="item">
        <div class="img-wrapper">
          <a href="${item.link}" target="_blank">
            <img src="${item.image}" alt="NoImage" width=128 height=185>
          </a>
          <button class="nes-btn is-success regist-btn">登録</button>
        </div>
        <div class="nes-table-responsive" style="width: 100%;">
          <table class="nes-table is-bordered is-dark">
            <tbody>
              <tr>
                <td>タイトル</td>
                <td>${item.title}</td>
              </tr>
              <tr>
                <td>説明</td>
                <td style="height:150px;">${item.description}</td>
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
    });
    result.innerHTML = texts.join('')
    document.getElementById("searchField").blur();
    Search.setRegistEvent(items)
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