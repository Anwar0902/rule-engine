"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const validations_1 = require("../middlewares/validations");
const handler_1 = __importDefault(require("../controllers/rule-validation/handler"));
const routes = new express.Router();
routes.post("/", (0, validations_1.createRuleValidator)(), validations_1.validateRequest, handler_1.default.validate);
exports.default = routes;
//# sourceMappingURL=route.js.map