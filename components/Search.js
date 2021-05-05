'use strict'

class Search {
  constructor() {
    this.endpoint = `https://www.googleapis.com/books/v1`
    // query
    this.q;
  }

  async searchBooks() {
    const input = document.getElementById("searchField");
    if (!input.value) return;

    this._checkPattern(input)

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
        description: vi.description ? vi.description :'未登録',
        link: vi.infoLink,
        publisher: vi.publisher ? vi.publisher : "未登録",
        date: vi.publishedDate ? vi.publishedDate : "未登録",
        pageCount: vi.pageCount ? vi.pageCount : "未登録",
        // "2013-05-23"
        image: vi.imageLinks ? vi.imageLinks.smallThumbnail : "../assets/no_image.png",
      };
    });
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

  static setRegistEvent(items) {
    const btns = document.getElementsByClassName('regist-btn');
    [...btns].forEach((btn, i) => {
      btn.setAttribute('id', i)
      btn.addEventListener('click', e => {
        console.log(items[e.target.id]);
        //ブックデータをdatabaseに登録
      })
    })
  }


}

export default Search;