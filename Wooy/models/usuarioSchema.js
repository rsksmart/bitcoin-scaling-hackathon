import { url } from "inspector";
import mongoose from "mongoose";
import { URL } from "url";

const registerSchema = mongoose.Schema ({
    email: String,
    token: String,
    token_name: String,
    token_img: String,
    site_url: String,
})

export const UsersRegister = mongoose.model('usuarios', registerSchema)