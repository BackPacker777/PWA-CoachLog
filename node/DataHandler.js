//   todo:

"use strict";

const FS = require ('fs'),
     DATASTORE = require('nedb'),
     DB = new DATASTORE({ filename: './data/log_db.json', autoload: true });
     this.data = [];

class DataHandler {
	constructor() {

	}

     static loadCerts() {
          const CERTS = {
               key: FS.readFileSync('./data/certs/server.enc.key'),
               cert: FS.readFileSync('./data/certs/server.crt')
          };
          return CERTS;
     }

     static loadCoachData(filePath) {
          return FS.readFileSync(filePath, 'utf8');
     }

     loadLogData(callback) {
          DB.find({}, (err, docs) => {
               if (docs.length != null) {
                    callback(docs);
               }
          });
     }

     static updateData(data) {
          DB.update({ _id: data.id }, {
                 coachID: data.coachID
               , lastName: data.lastName
               , firstName: data.firstName
               , eventDate: data.eventDate
               , eventNumber: data.eventNumber
               , eventName: data.eventName
          }, { upsert: true,
               returnUpdatedDocs: true });
     }

     static addData(data) {
          delete data.id;  // remove id field out of JSON parameter
          DB.insert(data);
     }

     /*queryData(data) { // keep as a reference for method below
      const THAT = this; //change to arrow function later
      // console.log(`DataHandler output: ${data.id}`);
      DB.findOne({ _id: data.id }, function(err, docs) {
      if (docs == null) {
      THAT.addData(data);
      } else {
      THAT.updateData(data);
      }
      });
      }*/

     static queryData(data) {
          DB.findOne({ _id: data.id }, (err, docs) => {
               if (docs == null) {
                    DataHandler.addData(data);
               } else {
                    DataHandler.updateData(data);
               }
          });
     }
}

module.exports = DataHandler;