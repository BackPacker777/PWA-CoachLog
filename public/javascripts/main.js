//   @todo

"use strict";

class main {
     constructor() {
          new EventHandler();
     }
}

class EventHandler {
     constructor() {
          EventHandler.prepApp();
          this.handleBegin();
          this.handleEnter();
     }

     static prepApp() {
          document.getElementById('logEntry').style.display = 'none';
     }

     handleBegin() {
          document.getElementById('begin').addEventListener('click', () => {
               if (document.getElementById('coachId').value === '' || !/^\d{3,6}$/.test(document.getElementById('coachId').value)) {
                    EventHandler.alertId();
               } else {
                    this.performAjax('XMLHttpRequest0', document.getElementById('coachId').value, (response) => {
                         if (response === 'false') {
                              console.log(`FALSE Line 30`);
                              EventHandler.alertId();
                         } else {
                              document.getElementById('coachName').innerHTML = response;
                              document.getElementById('top').style.display = 'none';
                              document.getElementById('logEntry').style.display = 'block';
                         }
                    });
               }
          });
     }

     handleEnter() {
          document.getElementById('enter').addEventListener('click', () => {
               document.getElementById('eventDate').value = null;
               document.getElementById('eventNumber').value = null;
               document.getElementById('eventName').value = null;
          });
     }

     static alertId() {
          alert('You must provide your proper NSP ID number to continue.');
     }

     performAjax(requestNum, sendToNode, callback) {
          let bustCache = '?' + new Date().getTime();
          const XHR = new XMLHttpRequest();
          XHR.open('POST', document.url  + bustCache, true);
          XHR.setRequestHeader('X-Requested-with', requestNum);
          XHR.send(sendToNode);
          XHR.onload = () => {
               if (XHR.readyState == 4 && XHR.status == 200) {
                    return callback(XHR.responseText);
               }
          };
     }
}







































class FadeStuff {
     constructor(direction, fadeWhat) {
          this.direction = direction;
          this.fadeWhat = fadeWhat;
     }

     doFade() {
          //http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
          let div = document.getElementById(this.fadeWhat);
          if (this.direction == "in") {
               div.style.opacity = 0;
               div.style.visibility = 'visible';
               (function fade() {
                    let val = parseFloat(div.style.opacity);
                    if (!((val += .01) >= 1)) {
                         div.style.opacity = val;
                         requestAnimationFrame(fade);
                    }
               })();
          } else if (this.direction == "out") {
               div.style.opacity = 1;
               (function fade() {
                    if ((div.style.opacity -= .01) <= 0) {
                         div.style.visibility = 'hidden';
                    } else {
                         requestAnimationFrame(fade);
                    }
               })();
          }
     }
}

window.addEventListener('load', () => {
     new main();
});