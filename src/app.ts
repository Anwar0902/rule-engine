var express = require('express');
var axios = require('axios');

import routes from "./routes/route"

var app = express();

var PORT = 3000;

app.get('/', function(req, res) {
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
app.use(express.json()) 
app.use("/rules", routes);

export default app;