'use strict';

class Scan {
  constructor() {
    this.Quagga = Quagga;
    this.result = [];
  }

  openScan() {
    this.Quagga.init({
      inputStream: {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanResult'),    // Or '#yourElement' (optional)
        // constraints: {
        //   width: 350,
        //   height: 100
        // }
      },
      decoder : {
        readers : ["ean_reader"]
      }
    },
      function (err) {
        if (err) {
          console.log(err);
          return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
      });
  }

  stop() {
    this.Quagga.stop();
  }

  scan() {
    this.Quagga.onDetected(success => {
      if (this.result.length > 100) {
        this.stop();
        console.log(this.result);
      }
      const code = success.codeResult.code;
      this.result.push(code)
      console.log(code);
      // console.log(this.result);
    });
  }
}


export default Scan;