const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');
require('dotenv').config();

const db = monk(process.env.MONGO_URI);
const urls = db.get('urls');
urls.createIndex({ slug: 1 }, { unique: true });

const app = express();
const port = process.env.PORT || 1337;

const schema = yup.object().shape({
    slug: yup.string().trim().matches(/[\w\-]/i),
    url: yup.string().url().required()
});

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

app.get('/:id', async (req, res) => {
    // redirects to url
    const { id: slug } = req.params;
    try {
        const url = await urls.findOne({ slug });
        if (url) {
            res.redirect(url.url);
        }
        res.redirect(`/?error=${slug} not found`);
    } catch (error) {
        res.redirect(`/?error=Link not found`)
    }
});

app.post('/url', async (req, res, next) => {
    // create new url
    let { slug, url } = req.body;

    try {
        if (!slug) {
            slug = nanoid(5);
        } else {
            const urlExist = await urls.findOne({ slug });
            if (urlExist) {
                throw new Error('Slug is in use');
            }
        }

        slug = slug.toLowerCase();
        // const secret = nanoid(10).toLowerCase();

        await schema.validate({
            slug,
            url
        });

        const newUrl = {
            url,
            slug
        }
        const created = await urls.insert(newUrl);

        res.json({ created });

    } catch (error) {
        next(error);
    }
});

app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }

    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'Do not worry, everything will be alright soon!' : error.stack
    });
});

// app.get('/url/:id', (req, res) => {
//     // get url detail
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});