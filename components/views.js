'use strict'

import Diary from "./Diary.js";
import Timer from "./Timer.js";
import Search from './Search.js'
import DB from './database.js'

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
  async booksPage() {
    console.log('booksPage ok');
    const db = new DB()
    const items = await db.read()
  
    if (!items) return;

    const text = items.map(item => {
      return `
      <li id="${item.iid}"><img src="${item.image}" alt="${item.title}" height=220></li>`;
    })

    const liblary = document.getElementById('liblary')
    liblary.innerHTML = text.join('')

    __adjustLayout()
  }

  //書籍検索ダイアログ
  searchDialog() {
    //フィールドがフォーカスされたとき全選択
    const field = document.getElementById('searchField')
    field.onfocus = () => field.select();  
    
    //エンターキーでも検索処理発動
    const modal = document.getElementById('searchModal')
    modal.addEventListener('keydown', (e) => {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        this._searchBooks()
        // 結果が表示されたらフォーカスを外す
        field.blur();
      }
    });
    
    //検索ボタンで検索処理発動
    const btn = document.getElementById('searchBtn')
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      this._searchBooks();
      // 結果が表示されたらフォーカスを外す
      field.blur();
    });
  }

  // 書籍情報編集ダイアログ
  editBookDialog() {

  }
  

  // 書籍を検索しHTMLに表示
  async _searchBooks() {
    const result = document.getElementById("result");
    const search = new Search();
    const items = await search.searchBooks();
    result.innerHTML = items;
    search.setRegistEvent();
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