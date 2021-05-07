'use strict'

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