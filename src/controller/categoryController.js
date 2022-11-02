const ECategory = require("../model/category")
var ObjectId = require('mongoose').Types.ObjectId;

const uploadCategory = async (req, res) => {
    const { title } = req.body
    if (!title || title === "null" || title.length <= 3 && !newtitle.length >= 30) {
        return res.status(400).send({ msg: "Enter valid category title ! ,length must be greater than 3 and lessthan 30 words !", success: false })
    } else {
        if (await ECategory.create({ title })) {
            return res.status(200).send({ msg: "Category uploaded !", success: true })
        } else {
            return res.status(500).send({ msg: "Category not uploaded !", success: false })
        }
    }
}

const getAllCategory = async (req, res) => {
    const cats = await ECategory.find({}).sort({ createdAt: -1 }).lean()
    if (cats.length > 0) {
        return res.status(200).send({ success: true, data: cats, msg: 'category availabel !' })
    } else {
        return res.status(200).send({ success: true, data: null, msg: 'category not availabel !' })
    }
}

const deleteCategory = async (req, res) => {
    const { catid, many, multiid } = req.body
    if (!catid || !ObjectId.isValid(catid)) {
        return res.status(400).send({ success: false, msg: 'catid is not valid !' })
    } else {
        if (many) {
            if (!multiid) {
                return res.status(400).send({ msg: "multi Id  is required!", success: false })
            } else {
                const deletemany = await ECategory.deleteMany(multiid)
                if (deletemany) {
                    return res.status(200).send({ success: true, msg: 'categories deleted !' })
                } else {
                    return res.status(500).send({ success: true, msg: 'categories not deleted !' })
                }
            }
        } else {
            const deletecat = await ECategory.deleteOne({ _id: catid })
            if (deletecat) {
                return res.status(200).send({ success: true, msg: 'category deleted !' })
            } else {
                return res.status(500).send({ success: false, msg: 'category not deleted !' })
            }
        }
    }
}

const updateCategory = async (req, res) => {
    const { catid, newtitle } = req.body
    if (!newtitle || newtitle === "null" || newtitle.length <= 3 && !newtitle.length >= 30) {
        return res.status(400).send({ msg: "Enter valid new category title ! ,length must be greater than 3 and lessthan 30 words !", success: false })
    }
    if (!catid || !ObjectId.isValid(catid)) {
        return res.status(400).send({ success: false, msg: 'catid is not valid !' })
    } else {
        const updatecatname = await ECategory.findOneAndUpdate({ _id: catid }, { title: newtitle }).clone()
        if (updatecatname) {
            return res.status(200).send({ success: true, msg: 'category edited successfully !' })
        } else {
            return res.status(500).send({ success: false, msg: 'category edited failed !' })
        }
    }
}

module.exports = {
    uploadCategory,
    getAllCategory,
    deleteCategory,
    updateCategory
}