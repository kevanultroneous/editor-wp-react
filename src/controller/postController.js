const EPost = require('../model/post');
var ObjectId = require('mongoose').Types.ObjectId;

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
        return res.status(200).send({ msg: status == 1 ? "Post uploaded !" : "Post drafted !", success: true })
    } else {
        return res.status(500).send({ msg: "Post not uploaded !", success: false })
    }
}

const getAllpost = async (req, res) => {
    const num = req.params['num']
    const allpost = await EPost.find({ parent: num }).sort({ createdAt: -1 }).lean()
    if (allpost) {
        if (allpost.length <= 0) {
            return res.status(200).send({ success: true, data: null })
        } else {
            return res.status(200).send({ success: true, data: allpost })
        }
    } else {
        return res.status(500).send({ success: false, data: "Internal server error !" })
    }
}

const deletePost = async (req, res) => {
    const { postid } = req.body
    if (!ObjectId.isValid(postid)) {
        return res.status(500).send({ msg: "id is not valid !", success: false })
    } else {
        if (await EPost.deleteOne({ _id: postid })) {
            return res.status(200).send({ msg: "Post deleted successfully !", success: true })
        } else {
            return res.status(500).send({ msg: "Post not deleted !", success: false })
        }
    }
}

const getSinglePost = async (req, res) => {
    const postid = req.params['postid']
    try {
        const singlepost = await EPost.findOne({ _id: postid }).lean()
        if (!singlepost) {
            return res.status(200).send({ success: true, data: null })
        } else {
            return res.status(200).send({ success: true, data: singlepost })
        }
    } catch (e) {
        return res.status(500).send({ success: false, data: null })
    }
}

module.exports = {
    uploadPost,
    getAllpost,
    deletePost,
    getSinglePost
}