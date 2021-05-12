'use strict'

// import firebase from './firebase.js';
import auth from './firebase.js';

class Login {
  constructor() {
    this.inputData = {};
    this.name = null;
    this.uid = null;

    this.errorM = document.getElementById('errorM')
  }

  openModal() {
    const dialog = document.getElementById('loginDialog')
    dialog.showModal();
  }
  
  closeModal() {
    const dialog = document.getElementById('loginDialog')
    dialog.close();
  }

  getInput() {
    const inputs = [...document.getElementsByClassName('input-outer')];
    
    inputs.forEach(input => {
      this.inputData[input.children[1].id] = input.children[1].value
    });
  }

  signup(db) {
    this.getInput();
   
    if (!this.inputData.name || this.inputData.name === 'ログイン') {
       this.errorM.textContent = "User Nameを入力してください";
        // this.loading = false
        return
    } else {
      if (confirm(`User Nameは ${this.inputData.name} でよろしいですか？\n※今の所変更はできません`)) {
        
      } else {
        return
      }
    }
      // this.loading = true
    auth.auth
      .createUserWithEmailAndPassword(this.inputData.email, this.inputData.password)
      .then(async registed => {
        const user = registed.user;
        this.name = this.inputData.name;
        this.uid = user.uid;
        db.uid = await user.uid;
        db.name = this.name;
        db.add(this.inputData, 'userData');
        alert("成功しました！");
        document.getElementById("loged").textContent = this.name;
        this.closeModal();
        }).catch(err => {
           this.errorM.textContent = `${err.code}\n${err.message}`;
        })
   }
  
  login(db) {
    this.getInput();
    auth.auth
      .signInWithEmailAndPassword(this.inputData.email, this.inputData.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // this.name = this.inputData.name;
        this.uid = user.uid;
        db.uid = user.uid;
        //dbからユーザーネーム取得
        const username = await db.readone('getUser');
        this.name = username;
        db.name = username;
        alert('成功しました！')
        document.getElementById("loged").textContent = this.name;;
        this.closeModal();
      })
      .catch((err) => {
        this.errorM.textContent = `${err.code}\n${err.message}`
      });
  }

  logout(db) {
    if (!confirm('ログアウトしますか？')) return;
    auth.auth.signOut()
      .then(() => {
        location.reload()
      })
      .catch((error) => {
        // An error happened.
      });
  }

  checkUser(db) {
    return new Promise((resolve, reject) => {
      auth.auth.onAuthStateChanged(async user => {
        if (user) {
          this.uid = user.uid;
          db.uid = user.uid;
          //dbからユーザーネーム取得
          const username = await db.readone('getUser');
          this.name = username;
          db.name = username;
          return resolve(user);
        } else {
          return resolve(null)
        }
      });
    })
  }
  
  hasUid() {
    let result;
    if (!this.uid) {
      alert('ログインをしてください');
      this.openModal();
      result = false;
    } else {
      result = this.uid;
    }
    return result
  }
  
}

export default Login;