'use strict'

import DB from './database.js';

testbtn.addEventListener("click", (e) => {
  new DB().delete()
});

class Search {
  constructor() {
    this.endpoint = `https://www.googleapis.com/books/v1`;
    // query
    this.q;
    // result
    this.r;
  }

  async searchBooks() {
    const items = await this._fetchAPI();

    console.log(items);
    if (!items) {
      return `<h2 style="text-align:center;">見つかりませんでした<h2>`;
    }

    const texts = __createSearchResultLayout(items);

    return texts.join("");
  }

  async _fetchAPI() {
    const input = document.getElementById("searchField");
    if (!input.value) return;

    this._checkPattern(input);

    const res = await fetch(`${this.endpoint}/volumes?q=${this.q}`);
    const data = await res.json();

    if (!data.totalItems) return;

    console.log(data);
    const itemCount = data.totalItems;
    console.log(itemCount);

    const items = data.items.map((item) => {
      let vi = item.volumeInfo;
      let isbn = this._getIsbn(vi);
      // let si = item.saleInfo;
      // console.log(String(vi.description).length);
      return {
        title: vi.title,
        description: vi.description ? vi.description : "未登録",
        link: vi.infoLink,
        publisher: vi.publisher ? vi.publisher : "未登録",
        date: vi.publishedDate ? vi.publishedDate : "未登録",
        pageCount: vi.pageCount ? vi.pageCount : "未登録",
        // "2013-05-23"
        image: vi.imageLinks
          ? vi.imageLinks.smallThumbnail
          : "../assets/no_image.png",
        isbn: isbn,
      };
    });
    this.r = items;
    return items;
  }

  _getIsbn(vi) {
    let isbnArray = vi.industryIdentifiers;
    let isbnA, isbnB;
    let _ = "未登録";

    if (!isbnArray) return _;

    isbnA = isbnArray[0].identifier;
    if (isbnArray.length === 1) {
      isbnB = _;
    } else {
      isbnB = isbnArray[1].identifier;
    }

    if (isbnArray.length === 1) return isbnA.length > 13 ? _ : isbnA;

    if (isbnA.length > 13) isbnA = _;
    if (isbnB.length > 13) isbnA = _;
    if (isbnA === _ && isbnB === _) return _;

    if (
      (isbnA === _ && isbnB.length === 10) ||
      (isbnB === _ && isbnA.length === 13) ||
      isbnA.length > isbnB.length
    )
      return `${isbnB} / ${isbnA}`;

    return `${isbnA} / ${isbnB}`;
  }

  _checkPattern(input) {
    //10桁以上13桁以下の数字かどうかをチェック
    const pattern = /^([0-9]{10,13})$/;
    console.log(pattern.test(input.value));
    if (pattern.test(input.value)) {
      console.log("isbn");
      this.q = `isbn:${input.value}`;
    } else {
      console.log("テキスト");
      this.q = input.value;
    }
  }

  //描画まで行いたいためviewインスタンスをもってきた
  setRegistEvent(view) {
    const btns = document.getElementsByClassName("regist-btn");

    [...btns].forEach((btn, i) => {
      btn.setAttribute("id", i);
      btn.addEventListener("click", async (e) => {
        // データベースに登録
        const iid = this._getUniqueStr();
        // const iid = new Date().getTime()
        const uid = "";
        const db = new DB(uid, iid);
        db.add(this.r[e.target.id]);

        // 登録したデータをドムに反映
        const item = await db.readone(iid);
        const liblary = document.getElementById("liblary");
        const html = `<li><img id="${iid}" src="${item.image}" alt="${item.title}" height=220></li>`;
        liblary.insertAdjacentHTML("beforeend", html);

        // flexbox最終行左寄せ
        __adjustLayout();

        // dirlogを閉じる
        document.getElementById("searchDialog").removeAttribute("open");

        // 検索結果をクリア
        document.getElementById("result").innerHTML = "";

        // 検索窓もクリア
        document.getElementById("searchField").value = "";

        //エディットダイアログのイベントセット
        //描画まで行いたいためviewインスタンスを使用
        view._setEvent_editDialog(item);
        // this._setEvent_editDialog(item, view);
      });
    });
  }

  // 追加された書籍をクリックで編集ダイアログ表示
  //扱うデータが単体か複数か違うだけでviewsと処理が重複です(途中からじわじわ思ったのですがクラス分けをミスりました)
  _setEvent_editDialog(item, view) {
    const book = document.getElementById(item.iid);
   
    book.addEventListener("click", {
      item,
      view,
      handleEvent: this._openEditDialog,
    });

    // 「ポモドーロボタン」でポモドーロ開始
    const pomodoloBtn = document.getElementById("startPomodoloBtn");
    pomodoloBtn.addEventListener("click", (e) => {
      view.pomoBook = item;
      view.update(page.timer);
    });

    // 変更確定ボタンのイベント
    const modifideBtn = document.getElementById("modifiedBtn");
    modifideBtn.removeEventListener("click", view._modifideEvent.bind(view)); 
    modifideBtn.addEventListener("click", view._modifideEvent.bind(view)); 
  }

  //編集ダイアログ表示イベント
  _openEditDialog(e) {
    document.getElementById("editDialog").showModal();
    // クリックした書籍のIDでデータを検索しレイアウトに反映
    this.view.beforeModified = this.item;

    //editboxのレイアウト生成しHTMLに追加
    const editBox = document.getElementById("editBox");
    const memoBox = document.getElementById("memoBox");
    const { textFields, memoField } = __createEditLayout(this.item);
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

    this.view.beforeModified.description = afterModified.story;
    this.view.beforeModified.memo = afterModified.memo;
    this.view.beforeModified.myRating = Number(afterModified.myRating);
    this.view.beforeModified.pomoCount = Number(afterModified.pomo);
    this.view.beforeModified.title = afterModified.title;
    this.view.beforeModified.modifideAt = __getTime().time;

    console.log(this.view.beforeModified);
    this.view.db.update(this.view.beforeModified);
  }

  _getUniqueStr(myStrong) {
    let strong = 1000;
    if (myStrong) strong = myStrong;
    return (
      new Date().getTime().toString(16) +
      Math.floor(strong * Math.random()).toString(16)
    );
  }
}

export default Search;