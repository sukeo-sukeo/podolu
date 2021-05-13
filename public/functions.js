'use strict'

// 定義群
const page = {
  timer: 'timerPage',
  books: 'booksPage'
}


// グローバル関数は __ の接頭詞をつける
const __getTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();

  const time = `${year}/${month}/${day}/${h}:${m}:${s}`;
  const mili = date.getTime();
 
  return {time, mili}
}

// 未使用
const __asc = (a, b) => {
  return a - b
}

//flex最終行左寄せの処理
const __adjustLayout = () => {
  // dameyがあれば一度削除してから追加する
  const dameys = document.getElementsByClassName('damey')
  if (dameys.length) {
    [...dameys].forEach(damey => {
      damey.remove()
    })
  }

  const parent = document.getElementsByClassName("book-img-wrapper")[0];
  const children = parent.children;
  const max_cnt = 4;
  const add_cnt = max_cnt - (children.length % max_cnt);
  
  const damey = `<li class="damey" style="border:none;"><img height=0"></li>`;
  const text = [];
  for (let i = 0; i < add_cnt; i++) {
    text.push(damey)
  }
  parent.insertAdjacentHTML("beforeend", text.join(''));
}

//編集ダイアログのレイアウト
const __createEditLayout = (item) => {
  const stars = __createRatingStar(item.myRating).join("");

  return {
    textFields: `
  <div class="edit-field-image">
    <p class="nes-text is-warning"><span id="edit_pomo" class="pomo-count mark">${item.pomoCount}</span>ポモドーロ</p>
    <img src="${item.image}" alt="${item.title}" width="240" height="300">
    <div class="mark" id="myRating:${item.myRating}">
      ${stars}
    </div>
  </div>
  <div class="edit-field">
    <label for="edit_title">タイトル</label>
    <input type="text" class="nes-input is-dark edit-field-inner mark" value="${item.title}" id="edit_title">
    <label for="edit_pubrish">出版</label>
    <input type="text" class="nes-input is-dark edit-field-inner mark" value="${item.publisher}" id="edit_pubrish">
    <label for="edit_registed">登録日</label>
    <input type="text" class="nes-input is-dark edit-field-inner mark" value="${item.registedAt}" id="edit_registed" readonly>
    <label for="edit_story">あらすじ</label>
    <textarea type="text" class="nes-input is-dark edit-field-inner mark" id="edit_story">${item.description}</textarea>
  </div>
  `,
    memoField: `
  <label for="edit_memo">感想・メモ</label>
  <div class="edit-memo-wrapper">
    <textarea class="nes-textarea is-dark edit-memo mark" id="edit_memo" cols="30" rows="5">${item.memo}</textarea>
  </div>
  `,
  };
}

//受け取った数字の分だけスターを生成します
//maxStarとの差分の空のスターを生成します
const __createRatingStar = (starNum) => {
  const maxStar = 5;
  let stars = [];
  for (let i = 0; i < maxStar; i++) {
    if (i < starNum) {
      stars.push(
        `<i class="nes-icon star star:${i + 1}" onclick="__moveRating(${
          i + 1
        }, this)"></i>`
      );
    } else {
      stars.push(
        `<i class="nes-icon star star:${
          i + 1
        } is-transparent" onclick="__moveRating(${i + 1}, this)"></i>`
      );
    }
  }
  return stars;
};

//onclickで呼ばれます
//domはcreateRatingStar関数でつくられます
const __moveRating = (starNum, node) => {
  const stars = __createRatingStar(starNum).join("");

  node.parentNode.id = `myRating:${starNum}`;
  node.parentNode.innerHTML = stars;

}

// 検索結果のレイアウト
const __createSearchResultLayout = (items) => {
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
          <tr>
            <td>ISBN</td>
            <td>${item.isbn}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>`;
  });
  return texts;
}

// swipe機能
// 作成中(未実装)
const __swipe = () => {
  var rgb_color = 0;
    function setSwipe(elem) {
    var t = document.querySelector(elem);
    var s_X;
    var e_X;
    var dist = 30;
    t.addEventListener('touchstart', function(e) {
     e.preventDefault();
     s_X = e.touches[0].pageX;
    });
    t.addEventListener('touchmove', function(e) {
     e.preventDefault();
     e_X = e.changedTouches[0].pageX;
    });
    t.addEventListener('touchend', function(e) {
      if (s_X > e_X + dist) {
       t.textContent = '<<<?-左にスワイプされました';
       rgb_color = rgb_color + 16;
       t.style.backgroundColor = "rgb("+ rgb_color + ","+ rgb_color + "," + rgb_color + ")";
      } else if (s_X + dist < e_X) {
       t.textContent = '右にスワイプされました?->>>';
       rgb_color = rgb_color + 16;
       t.style.backgroundColor = "rgb(" + rgb_color + "," + rgb_color + "," + rgb_color + ")";
      }
     });
    }
    setSwipe('body');
}
