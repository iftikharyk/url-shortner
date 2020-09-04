const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 1337;

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// app.get('/', (req, res) => {
//     res.json({
//         message: "Welcome to the world of nothingness"
//     });
// });

// app.get('/:id', (req, res) => {
//     // redirects to url
// });

// app.post('/url', (req, res) => {
//     // create new url
// });

// app.get('/url/:id', (req, res) => {
//     // get url detail
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});