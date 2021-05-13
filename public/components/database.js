'use strict'
import db from './firebase.js'

class DB {
  constructor() {
    // this.uid = uid;
    // this.iid = iid;
    // ページ表示の最初にlogin.jsから受け取る
    this.uid;
    this.name;
  }
  
  //DBへの登録
  async add(item, iid) {
  
    const ref = await db.db.collection("users").doc(this.uid);
    
    if (iid !== 'userData') {
      //カスタムプロパティ
      const { time, mili } = __getTime()
      item.registedAt = time
      item.modifideAt = time;
      item.sortKey = mili
      item.uid = this.uid
      item.iid = iid
      item.pomoCount = 0;
      item.memo = '';
      item.myRating = 0;
    }
    
    return ref.set({ [iid]: item }, { merge: true }).then(() => {return true})
      .catch((error) => {
        console.error("Error adding document: ", error);
        return false;
      });
  }

  //登録後の１件読み出し
  async readone(iid) {
    return db.db
      .collection("users")
      .doc(this.uid)
      .get()
      .then((doc) => {
        if (iid === 'getUser') {
          const item = doc.data()['userData'];
          return item.name;
        }
        const item = doc.data()[iid];
        delete item["userData"];
        return item;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //初期読み込み
  async read(user) {
    if (!user) return;
    const doc = await db.db
      .collection("users")
      .doc(this.uid)
      .get();
    
    const dataList = doc.data();
    this.name = dataList['userData'].name;
    delete dataList["userData"];
    if (!dataList) return;
    
    //timestamp(sortkey)で並べ替え
    let beforeSortObj = []
    Object.keys(dataList).forEach(key => {
      beforeSortObj.push(dataList[key]);
    })

    //sortKeyでソート
    return beforeSortObj.sort((a, b) => {
      if (a.sortKey < b.sortKey) {
        return -1;
      } else {
        return 1;
      }
    })
    
  }

  //全部消すやつ(今のところdev用)
  delete() {
    db.db.collection("users").doc(this.uid).delete().then(() => {
      console.log('delete');
    // success
      }).catch(error => {
          // error
      })
  }


  async update(item) {
    db.db.collection("users").doc(this.uid).update({
      [item.iid]: {
        date: item.date,
        description: item.description,
        iid: item.iid,
        image: item.image,
        isbn: item.isbn,
        link: item.link,
        memo: item.memo,
        modifideAt: item.modifideAt,
        myRating: item.myRating,
        pageCount: item.pageCount,
        pomoCount: item.pomoCount,
        publisher: item.publisher,
        registedAt: item.registedAt,
        sortKey: item.sortKey,
        title: item.title,
        uid: item.uid,
      }
    }).catch((error) => console.log('error: ', error))
  }
  

}


export default DB;