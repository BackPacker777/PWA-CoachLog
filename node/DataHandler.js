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

     static findRecords(coach, callback) {
          DB.find({ coachID: coach }, (err, docs) => {
               if (docs.length > 0) {
                    callback(docs);
               } else {
                    callback(false);
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