"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var axios = require('axios');
const route_1 = __importDefault(require("./routes/route"));
var app = express();
var PORT = 3000;
app.get('/', function (req, res) {
    res.status(200).send('Hello world anwar hussain');
});
app.get('/rule', function (req, res) {
    axios.post('https://hooks.slack.com/services/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', { text: `My name is anwar!!` }).then(() => res.send("Slack notification send successfully!!!")).catch(() => res.send("Slack notification Not send successfully!!!"));
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
app.use(express.json());
app.use("/rules", route_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map