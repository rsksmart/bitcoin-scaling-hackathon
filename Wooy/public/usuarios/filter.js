import { UsersRegister } from "../../models/usuarioSchema.js"

export const UsuarioRender = async (req, res) => {
    try {
        const arrayUsers = await UsersRegister.find().lean()
        res.json(arrayUsers)

    } catch (error) {
        console.log(error)
    }
}


