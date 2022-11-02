const EPost = require('../model/post');

const uploadPost = async (req, res) => {
    const { data, draft } = req.body
    if (!data || data === "null" || data.length < 10) {
        return res.status(400).send({ msg: "Enter valid data ! ,data must be 10  words !", success: false })
    } else {
        if (await EPost.create({ data, draft })) {
            return res.status(200).send({ msg: "Post uploaded !", success: true, data: data })
        }
    }
}

module.exports = {
    uploadPost
}