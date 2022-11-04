const ECategory = require("../model/category")
var ObjectId = require('mongoose').Types.ObjectId;

const uploadCategory = async (req, res) => {
    const { title, subcategory } = req.body
    if (!title || title === "null" || title.length <= 3 && !newtitle.length >= 30) {
        return res.status(400).send({ msg: "Enter valid category title ! ,length must be greater than 3 and lessthan 30 words !", success: false })
    } else {
        if (await ECategory.create({ title, subcategory })) {
            return res.status(200).send({ msg: "Category uploaded !", success: true })
        } else {
            return res.status(500).send({ msg: "Category not uploaded !", success: false })
        }
    }
}

const getAllCategory = async (req, res) => {
    const cats = await ECategory.find({ isDelete: false }).sort({ createdAt: -1 }).lean()
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
                const deletemany = await ECategory.updateMany(multiid)
                if (deletemany) {
                    return res.status(200).send({ success: true, msg: 'categories deleted !' })
                } else {
                    return res.status(500).send({ success: true, msg: 'categories not deleted !' })
                }
            }
        } else {
            const deletecat = await ECategory.updateOne({ _id: catid }, { isDelete: true })
            if (deletecat) {
                return res.status(200).send({ success: true, msg: 'category deleted !' })
            } else {
                return res.status(500).send({ success: false, msg: 'category not deleted !' })
            }
        }
    }
}

const updateCategory = async (req, res) => {
    const { catid, newtitle, subcategory, multiid } = req.body
    let status = 0, errorPlace = { s: false, id: null };
    if (multiid) {
        for (let ids = 0; ids < multiid.length; ids++) {
            if (!ObjectId.isValid(multiid[ids]._id)) {
                status = 1
                return res.status(500).send({ msg: `${ids + 1} id is not valid id for Operation !` })
            } else {
                status = 0
            }
        }
        if (status === 0) {
            for (let ids = 0; ids < multiid.length; ids++) {
                if (await ECategory.updateOne({ _id: multiid[ids]._id }, { $set: { selected: multiid[ids].checked } })) {
                    errorPlace = { s: false, id: null }
                } else {
                    errorPlace = { s: true, id: multiid[ids]._id }
                }
            }
            if (errorPlace.s === false && errorPlace.id === null) {
                return res.status(200).send({ msg: 'Categories selected successfully !', success: true })
            } else {
                return res.status(500).send({ msg: `Operation failed at  ${errorPlace.id} !` })
            }
        }
    } else {
        if (!newtitle || newtitle === "null" || newtitle.length <= 3 && !newtitle.length >= 30) {
            return res.status(400).send({ msg: "Enter valid new category title ! ,length must be greater than 3 and lessthan 30 words !", success: false })
        }
        if (!catid || !ObjectId.isValid(catid)) {
            return res.status(400).send({ success: false, msg: 'catid is not valid !' })
        } else {
            const updatecatname = await ECategory.findOneAndUpdate({ _id: catid }, { title: newtitle, subcategory }).clone()
            if (updatecatname) {
                return res.status(200).send({ success: true, msg: 'category edited successfully !' })
            } else {
                return res.status(500).send({ success: false, msg: 'category edited failed !' })
            }
        }
    }
}

module.exports = {
    uploadCategory,
    getAllCategory,
    deleteCategory,
    updateCategory
}