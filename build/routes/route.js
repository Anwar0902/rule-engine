"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const handler_1 = __importDefault(require("../controllers/rule-validation/handler"));
const routes = new express.Router();
// routes.post("/:memberlogin", createRuleValidator(), validateRequest, RuleValidation.create);
routes.post("/validate", handler_1.default.validate);
exports.default = routes;
//# sourceMappingURL=route.js.map