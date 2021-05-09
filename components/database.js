'use strict'
import db from './firebase.js'

class DB {
  constructor(uid, iid) {
    // this.uid = uid;
    this.iid = iid;
    this.uid = "MGFOqcA8I2eVYLAE4PwrvJ0M53s1";
  }
  
  //DBへの登録
  async add(item) {
    const ref = await db.db.collection("users").doc(this.uid);

    //カスタムプロパティ
    const { time, mili } = __getTime()
    item.registedAt = time
    item.modifideAt = time;
    item.sortKey = mili
    item.uid = this.uid
    item.iid = this.iid
    item.pomoCount = 0;
    item.memo = '';
    item.myRating = 0;
    console.log(item);
    
    ref.set({ [this.iid]: item }, { merge: true })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  //登録後の１件読み出し
  async readone(iid) {
    return db.db.collection("users").doc(this.uid)
    .get()
      .then((doc) => {
        const item = doc.data()[iid]
        return item
    })
      .catch((error) => {
      console.log(error);
    })
  }

  //初期読み込み
  async read() {
    const doc = await db.db.collection("users")
      .doc(this.uid).get();
    
    const dataList = doc.data();

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
    console.log('dbupdate');
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
    }).then(() => console.log('success!'))
    .catch((error) => console.log('error: ', error))
  }
  

}


export default DB;