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
               if (document.getElementById('coachId0').value === '' || !/^\d{6}$/.test(document.getElementById('coachId0').value)) {
                    EventHandler.alertId();
               } else {
                    this.performAjax('XMLHttpRequest0', document.getElementById('coachId0').value, (response) => {
                         if (response === 'false') {
                              EventHandler.alertId();
                         } else {
                              this.coach = JSON.parse(response);
                              document.getElementById('top').style.display = 'none';
                              document.getElementById('logEntry').style.display = 'block';
                              if (Object.prototype.toString.call(this.coach) === '[object Array]') {
                                   document.getElementById('coachName').innerHTML = `${this.coach[0].firstName} ${this.coach[0].lastName}`;
                                   document.getElementById('coachID').value = this.coach[0].coachID;
                                   document.getElementById('lastName').value = this.coach[0].lastName;
                                   document.getElementById('firstName').value = this.coach[0].firstName;
                                   this.updateEvents();
                              } else {
                                   document.getElementById('coachName').innerHTML = `${this.coach.firstName} ${this.coach.lastName}`;
                                   document.getElementById('coachID').value = this.coach.coachID;
                                   document.getElementById('lastName').value = this.coach.lastName;
                                   document.getElementById('firstName').value = this.coach.firstName;
                              }
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
                    fieldValues[1] = document.getElementById('eventNumber').value;
                    fieldValues[2] = document.getElementById('eventName').value;
                    if (this.validate(fieldValues) === true) {
                         let data = new FormData(document.querySelector('#coachingData'));
                         this.performAjax('XMLHttpRequest1', data, (response) => {
                              this.coach = JSON.parse(response);
                              this.updateEvents();
                         });
                         document.getElementById('eventDate').value = null;
                         document.getElementById('eventNumber').value = null;
                         document.getElementById('eventName').value = null;
                    }
               }
          });
     }

     updateEvents() {
          if (! document.getElementById('eventsHeader')) {
               document.getElementById('existingEvents').innerHTML = (`
                    <div class="row" id="eventsHeader">
                         <div class="medium-4 columns text-center bottom-border"><strong>EVENT DATE</strong></div>
                         <div class="medium-4 columns text-center bottom-border"><strong>EVENT NUMBER</strong></div>
                         <div class="medium-4 columns text-center bottom-border"><strong>EVENT NAME</strong></div>
                    </div>
               `);
          }
          if (Object.prototype.toString.call(this.coach) === '[object Array]') {
               for (let i = 0; i < this.coach.length; i++) {
                    let eventNum = `event${i}`;
                    document.getElementById('existingEvents').innerHTML += (`
                         <div class="row" id=${eventNum}>
                              <div class="medium-4 columns">${this.coach[i].eventDate}</div>
                              <div class="medium-4 columns">${this.coach[i].eventNumber}</div>
                              <div class="medium-4 columns">${this.coach[i].eventName}</div>
                         </div>
                    `);
               }
          } else {
               document.getElementById('existingEvents').innerHTML += (`
                    <div class="row" id=eventNum>
                         <div class="medium-4 columns">${this.coach.eventDate}</div>
                         <div class="medium-4 columns">${this.coach.eventNumber}</div>
                         <div class="medium-4 columns">${this.coach.eventName}</div>
                    </div>
               `);
          }
     }

     static alertId() {
          alert('You must provide your proper NSP ID number to continue.');
     }

     validate(data) {
          let validated = true;
          data[1] = 1;
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

window.addEventListener('load', () => {
     new main();
});