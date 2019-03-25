var router = require("express").Router();
var agenda_controller = require("../../controllers/agendaController");

// GET request for getting an Agenda. If not exist, will create it
router.get("/:phoneNumber", agenda_controller.agendainstance_get);

module.exports = router;
