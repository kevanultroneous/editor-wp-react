const ECategory = require("../model/category")

const uploadCategory = async (req, res) => {
    const { title } = req.body
    if (!title || title === "null" || title.length <= 3) {
        return res.status(400).send({ msg: "Enter valid category title ! ,length must be greater than 3 words !", success: false })
    } else {
        if (await ECategory.create({ title })) {
            return res.status(200).send({ msg: "Category uploaded !", success: true })
        } else {
            return res.status(500).send({ msg: "Category not uploaded !", success: false })
        }
    }
}


module.exports = {
    uploadCategory
}