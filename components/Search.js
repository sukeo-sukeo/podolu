'use strict'

import DB from './database.js';

// testbtn.addEventListener("click", (e) => {
//   new DB().delete()
// });

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

    const itemCount = data.totalItems;

    const items = data.items.map((item) => {
      let vi = item.volumeInfo;
      let isbn = this._getIsbn(vi);
      
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
    if (pattern.test(input.value)) {
      this.q = `isbn:${input.value}`;
    } else {
      this.q = input.value;
    }
  }

  setRegistEvent(view) {
    const btns = document.getElementsByClassName("regist-btn");

    // dbへの登録イベントをセット
    [...btns].forEach((btn, i) => {
      btn.setAttribute("id", i);
      btn.addEventListener("click", async (e) => {
        // データベースに登録
        const iid = this._getUniqueStr();
        // const iid = new Date().getTime()
        const res = await view.db.add(this.r[e.target.id], iid);

        //登録成功時 res = true
        if (res) {
          const item = await view.db.readone(iid);
          view._setBooks([item], 'add')
          view._setEventOfEditDialog([item]);
        } else {
        //登録失敗時 res = false
          alert('書籍の登録に失敗しました...')
        }
        document.getElementById("searchDialog").close();
      });
    });
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



//一応保管↓ 完成後に削除
// 登録したデータをドムに反映
    // const item = await db.readone(iid);
    // const liblary = document.getElementById("liblary");
    // const html = `<li><img id="${iid}" src="${item.image}" alt="${item.title}" height=220></li>`;
    // liblary.insertAdjacentHTML("beforeend", html);

    // // flexbox最終行左寄せ
    // __adjustLayout();

    // // dirlogを閉じる
    // document.getElementById("searchDialog").removeAttribute("open");

    // // 検索結果をクリア
    // document.getElementById("result").innerHTML = "";

    // // 検索窓もクリア
    // document.getElementById("searchField").value = "";

    // //エディットダイアログのイベントセット
    // const book = document.getElementById(item.iid);
    // book.addEventListener("click", {
    //   item,
    //   view,
    //   handleEvent: view._openEditDialog,
    // });