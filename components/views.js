'use strict'

import Diary from "./Diary.js";
import Timer from "./Timer.js";
import Search from './Search.js'
import DB from './database.js'

class ViewControl {
  constructor() {
    this.db = new DB();
    this.timer = new Timer();
    this.search = new Search();
    // ポモドーロするBookData
    this.pomoBook;
    // 変更前のBookData
    this.beforeModified;
  }
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

    //書籍選択時の処理
    if (this.pomoBook) {
      this.pomodoloPage();
    }
    
    
  }
  
  //タイマーページ
  pomodoloPage() { 
    //書籍選択時にタイマー画面へ遷移したときは書籍画像をセットしタイマー起動
    if (this.pomoBook) {
      const bookImg = document.getElementById("pomoBook");
      const pomoCnt = document.getElementById('pomoCount');
      const bookLog = document.getElementById('bookLog');
      bookImg.src = this.pomoBook.image;
      pomoCnt.textContent = this.pomoBook.pomoCount;
      bookLog.textContent = this.pomoBook.memo


      // タイマーインスタンスにも書籍データを渡す
      this.timer.pb = this.pomoBook;
  
      this.timer.reset();
      this.timer.start();
      return;
    }

    console.log("timerPage ok");
    
    this.timer.btn.addEventListener('mousedown', () => 
    this.timer.startTime = performance.now());
    
    this.timer.btn.addEventListener("mouseup", () => {
      this.timer.leaveTime = performance.now();
      const pushTime = this.timer.leaveTime - this.timer.startTime 
      this.timer.pushJudege(pushTime)
    });
  }
  
  //書籍管理ページ
  async booksPage() {
    console.log("booksPage ok");
    
    const items = await this.db.read();

    if (!items) return;

    const text = items.map((item) => {
      return `
      <li><img src="${item.image}" alt="${item.title}" height=220 id="${item.iid}"></li>`;
    });

    // 登録した書籍をHTMLに追加
    const liblary = document.getElementById("liblary");
    liblary.innerHTML = text.join("");

    //レイアウト調整
    __adjustLayout();

    //編集ダイアログ開閉のイベントセット
    
    this._setEvent_editDialog(items)
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

  //書籍編集ダイアログのイベント
  //searchインスタンスにも同じメソッドの記載あり(dbに追加したアイテムへの設定のため)
  _setEvent_editDialog(items) {
    // 書籍クリックで編集ダイアログ表示
    const books = [...liblary.children];
    console.log(books);
    books.forEach((book) => {
      const _this_ = this; // thisを固定(引数も使いたいため変数に代入)
      book.removeEventListener("click", {
        items, _this_,
        handleEvent: this._openEditDialog,
      });
      book.addEventListener("click", {
        items, _this_,
        handleEvent: this._openEditDialog,
      });
    });
    // if (!items.length) {

    //   const book = document.getElementById(item.iid);
    //    book.addEventListener("click", {
    //      items,
    //      _this_,
    //      handleEvent: this._openEditDialog,
    //    });
    // } else {
    // }

    // 「ポモドーロボタン」でポモドーロ開始
    const pomodoloBtn = document.getElementById("startPomodoloBtn");
    pomodoloBtn.removeEventListener("click", (e) => {
      this.pomoBook = this.beforeModified;
      this.update(page.timer);
    });
    pomodoloBtn.addEventListener("click", (e) => {
      this.pomoBook = this.beforeModified;
      this.update(page.timer);
    });

    // 変更確定ボタンのイベント
    const modifideBtn = document.getElementById("modifiedBtn");
    modifideBtn.removeEventListener("click", this._modifideEvent.bind(this));
    modifideBtn.addEventListener("click", this._modifideEvent.bind(this));

  }

  // 編集ダイアログ表示イベント
  // クリックした書籍のIDでデータを検索しレイアウトに反映
  _openEditDialog(e) {
    const editD = document.getElementById("editDialog")
    if (editD.hasAttribute('open')) editD.removeAttribute('open');
    editD.showModal();
    
    if (!this.items.length) {
      // 追加したbookに対しての処理
      this._this_.beforeModified = this.items;
    } else {
      // 初期読み込み時からあるbookに対しての処理
      for (let item of this.items) {
        if (e.target.id === item.iid) {
          this._this_.beforeModified = item;
          break;
        }
      }
    }

    //editboxのレイアウト生成しHTMLに追加
    const editBox = document.getElementById("editBox");
    const memoBox = document.getElementById("memoBox");
    const { textFields, memoField } = __createEditLayout(this._this_.beforeModified);
    editBox.innerHTML = textFields;
    memoBox.innerHTML = memoField;
  }

  //変更ボタンのイベント
  _modifideEvent(e) {
    const fields = document.getElementsByClassName("mark");
    // 変更後のデータを変数へ保存
    let afterModified = {};
    [...fields].forEach((field) => {
      //inputタグとtextareaタグのデータはvalueで取得
      if (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA") {
        afterModified[field.id.split("_")[1]] = field.value;
      } else {
        //ratingはidで
        //それ以外はtextContentで取得
        if (field.id.includes("myRating")) {
          afterModified[field.id.split(":")[0]] = field.id.split(":")[1];
        }
        if (field.id.includes("edit_pomo")) {
          afterModified[field.id.split("_")[1]] = field.textContent;
        }
      }
    });
  
    this.beforeModified.description = afterModified.story;
    this.beforeModified.memo = afterModified.memo;
    this.beforeModified.myRating = Number(afterModified.myRating);
    this.beforeModified.pomoCount = Number(afterModified.pomo);
    this.beforeModified.title = afterModified.title;
    this.beforeModified.modifideAt = __getTime().time;

    console.log(this.beforeModified);
    this.db.update(this.beforeModified)

  }


  // 書籍を検索しHTMLに表示
  async _searchBooks() {
    const result = document.getElementById("result");
    const items = await this.search.searchBooks();
    result.innerHTML = items;
    // viewインスタンス(this)をsearchインスタンスに受け渡し描画を行う => (煩雑になるため良くないと思う)
    this.search.setRegistEvent(this);
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