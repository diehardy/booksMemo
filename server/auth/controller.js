const { response } = require("express");
const Package = require("./package")
const router = require("./router")

class qualityController {

    async authorizeUser(id_user, name, email, icon) {
        try {
            console.log('searching for a user...')
            const user = await Package.checkUser(id_user)
            if (user[0]) {
                console.log('updating')
                await Package.updateUser(id_user, name, email, icon)
            } else {
                console.log('adding')
                await Package.addUser(id_user, name, email, icon)
            }
            return { id: id_user, name, icon, email }
        } catch (error) {
            console.log(error);
            // return res.status(500).json({ message: "Something went wrong" })
        }
    }

    async findUser(id_user) {
        const user = await Package.checkUser(id_user)
        return user
    }



}

module.exports = new qualityController();


