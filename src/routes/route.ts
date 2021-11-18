const express = require("express");

import {createRuleValidator, validateRequest} from "../middlewares/validations"
import RuleValidation from "../controllers/rule-validation/handler";

const routes = new express.Router();

// routes.post("/:memberlogin", createRuleValidator(), validateRequest, RuleValidation.create);
routes.post("/validate", RuleValidation.validate);
export default routes;