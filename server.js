const express = require('express');
const bodyparser = require('body-parser');
const multiparty = require('connect-multiparty');
const { error } = require('console');

const path = require('path');

const fs = require('fs');
const { default: mongoose } = require('mongoose');
const EModel = require("./model/model")
const cors = require('cors')

const PORT = process.env.PORT || 8000;
const app = express();

const MuiltiPartyMiddleware = multiparty({ uploadDir: "./images" });
app.use(cors())
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.get('/', (req, res) => {
    res.status(200).json(
        {
            message: "Data Ready And server Also"
        }
    )
});

app.use(express.static("uploads"));

app.post('/upload', MuiltiPartyMiddleware, (req, res) => {

    var TempFile = req.files.upload;
    var TempPathfile = TempFile.path;

    const targetPathUrl = path.join(__dirname, "./uploads/" + TempFile.name);

    if (path.extname(TempFile.originalFilename).toLowerCase() === ".png" || ".jpg") {

        fs.rename(TempPathfile, targetPathUrl, err => {

            res.status(200).json({
                uploaded: true,
                url: `${TempFile.originalFilename}`
            });

            if (err) return console.log(err);
        })
    }


    console.log(req.files);
})

app.post('/save', async (req, res) => {
    const { data, draft } = req.body
    if (!data || data === "null" || data.length < 10) {
        return res.status(400).send({ msg: "Enter valid data ! ,data must be 10  words !", success: false })
    } else {
        if (await EModel.create({ data, draft })) {
            return res.status(200).send({ msg: "Post uploaded !", success: true, data: data })
        }
    }
})
app.get('/all', async (req, res) => {
    const data = await EModel.find({}).clone()
    return res.send({ success: true, data: data })
})
mongoose.connect("mongodb+srv://kevanultroneous:Gs2vHLkMT4J96UhK@cluster0.2uvjism.mongodb.net/editor?retryWrites=true&w=majority")
    .then((r) => console.log("database connect"))
    .catch((e) => console.log("error" + e))

app.listen(PORT, console.log(`Server Started at PORT :${PORT}`))