'use strict'

import ViewControl from './components/views.js';

const views = new ViewControl();

const main = () => {
  views.update(page.timer)
  views.pomodoloPage();
  views.booksPage();
}

window.onload = () => {
  
  main()

}