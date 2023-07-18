import { UsersRegister } from "../../models/usuarioSchema.js";
import path from "path";
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const UsuarioRegister = async ( req, res ) => {

    const usuarios = req.body

    try {

        const arrayRegister = new UsersRegister(usuarios)
        await arrayRegister.save()

        console.log(arrayRegister)

        res.sendFile(path.join(__dirname, '../index.html'))

    } catch (error) {
        console.log(error)
    }
}