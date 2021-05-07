'use strict'
import db from './firebase.js'

class DB {
  constructor(uid, iid) {
    // this.uid = uid;
    this.iid = iid;
    this.uid = "MGFOqcA8I2eVYLAE4PwrvJ0M53s1";
  }
  
  async add(item) {
    const ref = await db.db.collection("users").doc(this.uid);

    item.uid = this.uid
    item.iid = this.iid
    const { time, mili } = __getTime()
    item.regitedAt = time
    item.sortKey = mili
    console.log(item);
    
    ref.set({ [this.iid]: item }, { merge: true })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }

  set(item) {
    db.db.collection("books")
      .doc("1")
      .set({ item })
      .then((docRef) => {
        // success
      })
      .catch((error) => {
        // error
      });
  }

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

    return beforeSortObj.sort((a, b) => {
      if (a.sortKey < b.sortKey) {
        return -1;
      } else {
        return 1;
      }
    })
    
  }

  delete() {
    db.db.collection("users").doc(this.uid).delete().then(() => {
      console.log('delete');
    // success
      }).catch(error => {
          // error
      })
        }

        static update() {

        }

}


export default DB;