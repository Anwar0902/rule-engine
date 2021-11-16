const express = require("express");

import {createRuleValidator, validateRequest} from "../middlewares/validations"
import RuleValidation from "../controllers/rule-validation/handler";

const routes = new express.Router();

routes.post("/", createRuleValidator(), validateRequest, RuleValidation.validate);

export default routes;