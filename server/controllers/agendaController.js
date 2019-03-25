var mongoose = require("mongoose");
var Agenda = mongoose.model("Agenda");
const axios = require("axios");
const ParseFunctions = require("../lib/parseFunctions");

exports.agendainstance_get = function(req, res) {
  var phoneNumber = req.params.phoneNumber;

  Agenda.findOne({ number: phoneNumber })
    .then(result => {
      if (result === null) {
        axios({
          method: "GET",
          url:
            "https://gist.githubusercontent.com/miguelgf/e099e5e5bfde4f6428edb0ae94946c83/raw/fa27e59eb8f14ee131fca5c0c7332ff3b924e0b2/communications." +
            phoneNumber +
            ".log"
        })
          .then(result => {
            let objAgenda = ParseFunctions.parseFile(phoneNumber, result.data);
            var agenda = new Agenda();
            agenda.create(objAgenda);
            res.status(200).json(agenda);
          })
          .catch(err => {
            res.sendStatus(404);
          });
      } else {
        res.status(200).json(result);
      }
    })
    .catch(err => {
      res.sendStatus(400);
    });
};
