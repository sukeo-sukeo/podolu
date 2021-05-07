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

    const texts = items.map((item) => {
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
    return texts.join("");
  }

  async _fetchAPI() {
    const input = document.getElementById("searchField");
    if (!input.value) return;

    this._checkPattern(input);

    const res = await fetch(`${this.endpoint}/volumes?q=${this.q}`);
    const data = await res.json();
    console.log(data);
    if (!data.totalItems) return;

    const itemCount = data.totalItems;
    console.log(itemCount);

    const items = data.items.map((item) => {
      let vi = item.volumeInfo;
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
      };
    });
    this.r = items;
    return items;
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

  setRegistEvent() {
    const btns = document.getElementsByClassName("regist-btn");
    console.log(btns);
    // console.log(items);
    [...btns].forEach((btn, i) => {
      btn.setAttribute("id", i);
      btn.addEventListener("click", async (e) => {
        // データベースに登録
        const iid = this._getUniqueStr()
        // const iid = new Date().getTime()
        const uid = "";
        const db = new DB(uid, iid);
        db.add(this.r[e.target.id]);
        
        // 登録したデータをドムに反映
        const item = await db.readone(iid);
        console.log(item);
        const liblary = document.getElementById("liblary");
        const html = `<li id="${iid}"><img src="${item.image}" alt="${item.title}" height=220></li>`;
        liblary.insertAdjacentHTML("beforeend", html);
        
        // flexbox最終行左寄せ
        __adjustLayout();

        // dirlogを閉じる
        document.getElementById("searchDialog").removeAttribute('open')

        // 検索結果をクリア
        document.getElementById('result').innerHTML = ''
       
        // 検索窓もクリア
        document.getElementById("searchField").value = "";
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