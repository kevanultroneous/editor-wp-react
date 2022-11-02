const EPost = require('../model/post');

const uploadPost = async (req, res) => {
    const { title,
        fimg,
        category,
        date,
        author,
        content,
        smeta,
        stitle,
        sdesc,
        url,
        status,
        parent } = req.body
    if (await EPost.create({
        title,
        fimg,
        category,
        date,
        author,
        content,
        smeta,
        stitle,
        sdesc,
        url,
        status,
        parent
    })) {
        return res.status(200).send({ msg: status == 1 ? "Post uploaded !" : "Post drafted !", success: true, data: data })
    } else {
        return res.status(200).send({ msg: "Post not uploaded !", success: false })
    }
}

module.exports = {
    uploadPost
}