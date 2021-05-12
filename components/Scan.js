'use strict';

class Scan {
  constructor() {
    this.Quagga = Quagga;
    this.result = [];
  }

  init() {
    this.Quagga.init({
      inputStream: {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanResult'),    // Or '#yourElement' (optional)
        constraints: {
          width: 640,
          height: 480
        }
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
    this.result.length = 0;
    const ctx = this.Quagga.canvas.ctx.overlay;
    const ctx_w = this.Quagga.canvas.dom.overlay.width / 2;
    const ctx_h = this.Quagga.canvas.dom.overlay.height / 2;
    const draw_w = 400;
    const draw_h = 100;

    ctx.fillStyle = "gray";
    ctx.lineWidth = 5;
    ctx.strokeRect(ctx_w - (draw_w / 2), ctx_h - (draw_h / 2), draw_w, draw_h);

    return new Promise((resolve, reject) => {
      this.Quagga.onDetected((success) => {
        if (this.result.length > 10) {
          let count = {};
          for (let i = 0; i < this.result.length; i++) {
            let elm = this.result[i];
            count[elm] = (count[elm] || 0) + 1;
          }

          const sorted = Object.entries(count).sort((a, b) => {
            if (a[1] > b[1]) {
              return -1;
            } else {
              return 1;
            }
          });

          const isbn = sorted[0][0];
          this.stop();
          return resolve(isbn)
        }

        const code = success.codeResult.code;
        this.result.push(code);
      });
    })
    
  }


}


export default Scan;