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
          this.handleSubmit();
          this.coach = [];
     }

     static prepApp() {
          document.getElementById('logEntry').style.display = 'none';
     }

     handleBegin() {
          document.getElementById('begin').addEventListener('click', () => {
               if (document.getElementById('coachId').value === '' || !/^\d{6}$/.test(document.getElementById('coachId').value)) {
                    EventHandler.alertId();
               } else {
                    this.performAjax('XMLHttpRequest0', document.getElementById('coachId').value, (response) => {
                         if (response === 'false') {
                              EventHandler.alertId();
                         } else {
                              this.coach = JSON.parse(response);
                              document.getElementById('coachName').innerHTML = `${this.coach.firstName} ${this.coach.lastName}`;
                              document.getElementById('top').style.display = 'none';
                              document.getElementById('logEntry').style.display = 'block';
                         }
                    });
               }
          });
     }

     handleSubmit() {
          document.getElementById('coachingData').addEventListener('submit', (event) => {
               event.preventDefault();
               if (document.getElementById('eventDate').validity.valid && document.getElementById('eventName').validity.valid) {
                    let fieldValues = [];
                    fieldValues[0] = document.getElementById('eventDate').value;
                    // fieldValues[1] = document.getElementById('eventNumber').value;
                    fieldValues[1] = document.getElementById('eventName').value;
                    if (this.validate(fieldValues) === true) {
                         let data = new FormData(document.querySelector('#coachingData'));
                         data.append('coachID', this.coach.coachID);
                         data.append('lastName', this.coach.lastName);
                         data.append('firstName', this.coach.firstName);
                         console.log(data.eventDate);
                         this.performAjax('XMLHttpRequest1', data, (response) => {

                         });
                         document.getElementById('eventDate').value = null;
                         document.getElementById('eventNumber').value = null;
                         document.getElementById('eventName').value = null;
                    }
               }
          });
     }

     static alertId() {
          alert('You must provide your proper NSP ID number to continue.');
     }

     validate(data) {
          let validated = true;
          for (let i = 0; i < data.length; i++) {
               if (typeof data[i] === 'string') {
                    if (data[i] === '') {
                         alert(`Incorrect data entered. ${data[i]}`);
                         validated = false;
                         break;
                    }
               } else {
                    if (!/^\d{1,20}$/.test(data[i])) {
                         alert(`Incorrect data entered.`);
                         validated = false;
                         break;
                    }
               }
          }
          return validated;
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