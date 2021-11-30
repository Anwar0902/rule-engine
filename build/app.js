"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var axios = require('axios');
const sessions = require('express-session');
const route_1 = __importDefault(require("./routes/route"));
var app = express();
var PORT = 3000;
app.get('/', function (req, res) {
    res.status(200).send('Hello world anwar hussain');
});
// app.listen(PORT, function() {
//     console.log('Server is running on PORT:',PORT);
// });
// let x = `
//     (function abc(t){
//         setTimeout(()=>console.log("anwar"), 1000);
//     })
// `;
// let z = eval(x);
// console.log(typeof z(12));
app.use(express.urlencoded({ extended: false }));
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
console.log("console for check---------");
global.debug = true;
app.use(express.json());
app.use("/rules", route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map