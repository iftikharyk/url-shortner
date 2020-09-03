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

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the world of nothingness"
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});