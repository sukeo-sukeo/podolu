'use strict'

import Diary from "./Diary.js";
import Timer from "./Timer.js";
import Search from './Search.js';
import DB from './database.js';
import Scan from './Scan.js';
import Login from './login.js';

class ViewControl {
  constructor() {
    this.login = new Login();
    this.db = new DB();
    this.timer = new Timer();
    this.search = new Search();
    this.scan = new Scan();

    //ポモ中かどうか
    this.isPomo = false;
    // ポモドーロするBookData
    this.pomoBook = null;
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
        this._judgeCSSframWork(page);
        page.style.display = "";
      } else {
        page.style.display = "none";
      }
    });

    //書籍選択時の処理
    if (this.isPomo) {
      this.pomodoloPage();
    }
  }

  //タイマーページ
  pomodoloPage() {
    // ログインモーダルボタン
    document.getElementById('loged').addEventListener('click', e => {
      e.preventDefault();
      if (e.target.textContent === 'ログイン') {
        this.login.openModal();
      } else {
        this.login.logout(this.db);
      }
    })
  
    //サインアップ
    document.getElementById('signup').addEventListener('click', e => {
      e.preventDefault();
      this.login.signup(this.db);
    })
    //ログイン
    document.getElementById('login').addEventListener('click', e => {
      e.preventDefault();
      this.login.login(this.db, this);
    })


    document.getElementById("loginClose").addEventListener('click', e => {
      e.preventDefault();
      this.login.closeModal();
    })
  


    //書籍選択時にタイマー画面へ遷移したときは書籍画像をセットしタイマー起動
    if (this.isPomo) {
      const bookImg = document.getElementById("pomoBook");
      const pomoCnt = document.getElementById("pomoCount");
      const bookLog = document.getElementById("bookLog");
      bookImg.src = this.pomoBook.image;
      pomoCnt.textContent = this.pomoBook.pomoCount;
      bookLog.value = this.pomoBook.memo;

      // タイマーインスタンスにも書籍データを渡す
      this.timer.pb = this.pomoBook;
      this.timer.db = this.db;

      this.timer.reset();
      this.timer.start();
      return;
    }

    //bookセットbtn
    const setBtn = document.getElementById('bookSet');
    setBtn.addEventListener('click', e => {
      if (!this.login.hasUid()) return;
      this.pomoJudege();
    }) 

    //セット解除btn
    const offBtn = document.getElementById('bookOff');
    offBtn.addEventListener('click', e => {
      if (!this.login.hasUid()) return;
      if (!this.isPomo) {
        alert("書籍をセットしてください");
        return;
      }
      this.pomoJudege('flag');
    }) 

    const logModal = document.getElementById('logModal')

    // 感想ダイアログ内での入力をLSに一時保存
    const textArea = document.getElementById("logModalArea");
    textArea.addEventListener("keydown", (e) => {
      localStorage.setItem("pomoLog", e.target.value);
    });

    // 感想ダイアログ開くボタン
    const logArea = document.getElementById('bookLog');
    logArea.addEventListener('click', e => {
      if (!this.isPomo) return;
      localStorage.setItem('pomoLog', this.pomoBook.memo)
      textArea.value = this.pomoBook.memo;
      logModal.showModal();
    });

    // 感想ダイアログ閉じるボタン
    const logCloseBtn = document.getElementById('logClose');
    logCloseBtn.addEventListener('click', e => {
      const text = localStorage.getItem('pomoLog')
      this.pomoBook.memo = text;
      logArea.value = text;
      this.db.update(this.pomoBook);
      localStorage.removeItem('pomoLog');
      logModal.close();
    });


    this.timer.btn.addEventListener(
      "mousedown",
      () => (this.timer.startTime = performance.now())
    );

    this.timer.btn.addEventListener("mouseup", () => {
      this.timer.leaveTime = performance.now();
      const pushTime = this.timer.leaveTime - this.timer.startTime;
      this.timer.pushJudege(pushTime);
    });
  }

  // ポモ中かどうか判定
  pomoJudege(flag = null) {
    const image = document.getElementById("pomoBook");
    const logArea = document.getElementById("bookLog");
    if (this.isPomo) {
      if (!confirm("タイマーがリセットされます")) return;
    }
    this.timer.reset();
    this.isPomo = false;
    image.src = "./assets/no_image2.png";
    logArea.value = "Please write your impression";
    this.timer.pomoText.textContent = 0;
    this.timer.pb = null;
    if (flag === 'flag') return; 
    this.update(page.books);
  }

  //書籍管理ページ
  async booksPage() {
    // userデータ取得
    const user = await this.login.checkUser(this.db);
    const loged = document.getElementById("loged");
    user
      ? (loged.textContent = this.login.name)
      : (loged.textContent = "ログイン");

    // timer画面へのボタン
    const backBtn = document.getElementById("backTimer");
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.update(page.timer);
    });

    //検索ダイアログ開閉
    const serachArea = document.getElementById("searchArea");
    serachArea.addEventListener("click", (e) => {
      const dialog = document.getElementById("searchDialog")
      if (dialog.hasAttribute('open')) dialog.removeAttribute('open');
      dialog.showModal();
    });
    //書籍検索ダイアログのイベント設定
    this._setEventOfSearchDialog();

    // 登録済のデータ取得
    const items = await this.db.read(user);
    if (items) {
      // 登録済データのDOM挿入
      this._setBooks(items);
      // 登録済データのイベント設定
      this._setEventOfEditDialog(items);
    }
  }

  // 登録済のデータ表示
  _setBooks(items, add=false) {
    const text = items.map((item) => {
      return `
      <li><img src="${item.image}" alt="${item.title}" height=220 id="${item.iid}"></li>`;
    });
    // 登録済書籍データをHTMLに追加
    const liblary = document.getElementById("liblary");
    if (add) {
      liblary.insertAdjacentHTML('beforeend', text.join(''))
    } else {
      liblary.innerHTML = text.join("");
    }
    //レイアウト調整
    __adjustLayout();
  }
  
  //編集ダイアログ開閉のイベントセット
  _setEventOfEditDialog(items) {
    const books = [...liblary.children];
    books.forEach((book) => {
      const _this_ = this; // thisを固定(引数も使いたいため変数に代入)
      book.addEventListener("click", {
        items,
        _this_,
        handleEvent: this._openEditDialog,
      });
    });

    // 「ポモドーロボタン」でポモドーロ開始
    const pomodoloBtn = document.getElementById("startPomodoloBtn");
    pomodoloBtn.addEventListener("click", () => {
      this.pomoBook = this.beforeModified;
      this.isPomo = true;
      this.update(page.timer);
    });

    // 変更確定ボタンのイベント
    const modifideBtn = document.getElementById("modifiedBtn");
    modifideBtn.addEventListener("click", this._modifideEvent.bind(this));
  }

  // クリックした書籍のIDでデータを検索し編集ダイアログに反映してオープン
  _openEditDialog(e) {
    if (e.target.className === 'damey') return;
    // モーダルの開閉をチェック
    const editD = document.getElementById("editDialog");
    if (editD.hasAttribute("open")) editD.close();
    editD.showModal();

    // this = このイベントの変数
    // _this_ = viewインスタンス
    if (this.item) {
      // 追加したbookに対しての処理
      this._this_.beforeModified = this.item;
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
    const { textFields, memoField } = __createEditLayout(
      this._this_.beforeModified
    );
    editBox.innerHTML = textFields;
    memoBox.innerHTML = memoField;

  }

  //変更ボタンのイベント
  _modifideEvent() {
    const fields = document.getElementsByClassName("mark");
    // 変更後のデータを変数へ保存
    let afterModified = {};
    [...fields].forEach((field) => {
      //inputタグとtextareaタグのデータはvalueで取得
      if (field.nodeName === "INPUT" || field.nodeName === "TEXTAREA") {
        afterModified[field.id.split("_")[1]] = field.value;
      } else {
        //ratingはidで、それ以外はtextContentで取得
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

    this.db.update(this.beforeModified);
  }

  //書籍検索ダイアログのイベント設定
  _setEventOfSearchDialog() {

    //isbnスキャン用カメラ起動
    //あとで処理を分割させる!
    const scan = document.getElementById("scan");
    const videoD = document.getElementById("videoModal");
    scan.addEventListener("click", async e => {
      videoD.showModal();
      this.scan.init();
    });

    // スキャン停止ボタンとスキャン開始ボタンの設定
     const goStop = document.getElementById("goStop");
     const goScan = document.getElementById("goScan");
     
     let timer_ID = null; 
     goStop.addEventListener("click", (e) => {
       e.preventDefault();
       this.scan.stop();
       videoD.close();
       clearTimeout(timer_ID);
       timer_ID = null
     });
    
     goScan.addEventListener("click", async (e) => {
       e.preventDefault();

       timer_ID = setTimeout(() => {
         if (videoD.hasAttribute("open")) {
           this.scan.stop();
           videoD.close();
           alert("読み取れませんでした");
          }
       }, 10000);
    
       const res = await this.scan.scan();
       
       const input = document.getElementById("searchField");
       input.value = res;
       videoD.close();
       this._searchBooks();
      //  clearTimeout(timer);
     });

    //フィールドがフォーカスされたとき全選択
    const field = document.getElementById("searchField");
    field.onfocus = () => field.select();

    //エンターキーで検索処理発動
    const modal = document.getElementById("searchModal");
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        this._searchBooks();
        // 結果が表示されたらフォーカスを外す
        field.blur();
      }
    });

    //検索ボタンで検索処理発動
    const btn = document.getElementById("searchBtn");
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      this._searchBooks();
      // 結果が表示されたらフォーカスを外す
      field.blur();
    });

    //ビューンボタンの処理
    const buunBtn = document.getElementById("buunBtn");
    const dialog = document.getElementById("searchDialog");
    let timer = null;
    dialog.addEventListener("scroll", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const topScrollPosition = e.target.scrollTop;
       
        if (topScrollPosition > 300) {
          buunBtn.style.display = "block";
        } else {
          buunBtn.style.display = "none";
        }
      }, 100);
    });
    buunBtn.addEventListener("click", (e) => {
      dialog.scroll({
        top: 0,
        behavior: "smooth",
      });
    });

    //閉じるボタンの処理
    const closeBtn = document.getElementById("serachColseBtn");
    closeBtn.addEventListener("click", (e) => dialog.close());
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