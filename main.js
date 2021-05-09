'use strict'

import ViewControl from './components/views.js';

const main = (views) => {
  // 各viewのイベントセットとデータ取得
  views.pomodoloPage();
  views.booksPage();
  views.searchDialog();
  // get.data()

  // page遷移イベントを設定
  [...document.getElementsByTagName('a')].forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const pagename = a.href.split('/').pop()
      views.update(pagename)
    })
  })

}


window.onload = () => {

  
  const views = new ViewControl();
  //初期画面のidを渡す
  views.update(page.books)
  main(views)

}