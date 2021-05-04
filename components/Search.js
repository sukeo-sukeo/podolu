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
      return {
        title: vi.title,
        description: vi.description?vi.description:'未登録',
        link: vi.infoLink,
        publisher: vi.publisher ? vi.publisher : "未登録",
        date: vi.publishedDate ? vi.publishedDate : "未登録",
        pageCount: vi.pageCount ? vi.pageCount : "未登録",
        // "2013-05-23"
        image: vi.imageLinks ? vi.imageLinks.smallThumbnail : "",
      };
    });
    return items;
  }



  _checkPattern(input) {
    const pattern10 = /^[-]?([1-9]{10}d*|0)$/;
    const pattern13 = /^[-]?([1-9]{13}d*|0)$/;
    console.log(pattern10.test(input.value));
    console.log(pattern13.test(input.value));
    if (pattern10.test(input.value) || pattern13.test(input.value)) {
      console.log('isbn');
      console.log(input.value);
      this.q = `isbn:${input.value}`;
    } else {
      console.log('テキスト');
      console.log(input.value);
      this.q = input.value;
    }
  }
}

export default Search;