var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

var AgendaSchema = new mongoose.Schema(
  {
    number: Number,
    contacts: [
      {
        number: Number,
        name: String,
        calls: [
          {
            callDirection: Number,
            date: String,
            duration: String
          }
        ],
        sms: [
          {
            smsDirection: Number,
            date: String
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

AgendaSchema.plugin(uniqueValidator, { message: "is already taken" });

AgendaSchema.methods.create = function(obj) {
  this.number = obj.number;
  this.contacts = obj.contacts;
  return this.save();
};

mongoose.model("Agenda", AgendaSchema);
