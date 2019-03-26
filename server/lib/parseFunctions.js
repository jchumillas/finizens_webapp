class ParseFunctions {
  static contactExists(book, number) {
    return book.find(el => el.number === number);
  }
  static parseFile(number, str) {
    let regExCalls = /(C|S)(\d|\s){18}(0|1).{24}\d{14,20}/g;
    let callsStrArray = str.match(regExCalls);
    let callsObjArray = [];
    for (let callStr of callsStrArray) {
      let callObj = {};
      //Remove first Char
      callObj.type = callStr.match(/(C|S)/i)[0];
      callStr = callStr.replace(/(C|S)/i, "");

      //Get Source Number and remove of string
      callObj.sourceNumber = callStr.match(/(\d|\s){9}/i)[0].trim();
      callStr = callStr.replace(/(\d|\s){9}/i, "");

      //Get Destination Number and remove of string
      callObj.destinationNumber = callStr.match(/(\d|\s){9}/i)[0].trim();
      callStr = callStr.replace(/(\d|\s){9}/i, "");

      //Get Incoming/Outgoing Call Char and remove of string
      callObj.callDirection = parseInt(callStr.match(/(0|1)/i)[0]);
      callStr = callStr.replace(/(0|1)/i, "");

      //Get Name and remove of string
      callObj.name = callStr.match(/.{24}/i)[0].trim();
      callStr = callStr.replace(/.{24}/i, "");

      //Remove white spaces
      callStr = callStr.replace(/\s+/i, "");

      //Get Call Date and remove of string
      let strDate = callStr.match(/\d{14}/i)[0];
      callObj.callDate = new Date(
        parseInt(strDate.substring(4, 8)),
        parseInt(strDate.substring(2, 4)) - 1,
        parseInt(strDate.substring(0, 2)),
        parseInt(strDate.substring(8, 10)),
        parseInt(strDate.substring(10, 12)),
        parseInt(strDate.substring(12, 14))
      );
      callStr = callStr.replace(/\w{14}/i, "");

      //Get Call Duration
      let strDuration = callStr.match(/\d{6}/i);
      if (strDuration !== null) {
        callObj.callDuration = new Date(
          0,
          0,
          0,
          parseInt(strDuration[0].substring(0, 2)),
          parseInt(strDuration[0].substring(2, 4)),
          parseInt(strDuration[0].substring(4, 6))
        );
      }
      callsObjArray.push(callObj);
    }
    return this.createBook(number, callsObjArray);
  }
  static createBook(number, callsObjArray) {
    let contacts = [];
    for (let el of callsObjArray) {
      let phoneNumber;

      if (el.callDirection === 0) {
        phoneNumber = el.destinationNumber;
      } else if (el.callDirection === 1) {
        phoneNumber = el.sourceNumber;
      }

      if (!this.contactExists(contacts, phoneNumber)) {
        let objContact = {};
        objContact.number = phoneNumber;
        objContact.name = el.name;
        objContact.calls = [];
        objContact.sms = [];
        contacts.push(objContact);
      }

      let objComunication = {};
      objComunication.date = el.callDate.toLocaleString();
      let contactIndex = contacts.findIndex(x => x.number === phoneNumber);

      if (el.type === "C") {
        objComunication.callDirection = el.callDirection;
        objComunication.duration = el.callDuration.toTimeString().split(" ")[0];
        contacts[contactIndex].calls.push(objComunication);
      } else if (el.type === "S") {
        objComunication.smsDirection = el.callDirection;
        contacts[contactIndex].sms.push(objComunication);
      }
    }
    return {
      number: number,
      contacts: contacts
    };
  }
}

module.exports = ParseFunctions;