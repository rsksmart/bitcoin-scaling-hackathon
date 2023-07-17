import express from 'express';
const app = express();
import mongoose from "mongoose"
const port = 8080;
import path from 'path';
import * as url from 'url';
import { UsuarioRegister } from './public/usuarios/Usuarios.js';
import { UsuarioRender } from './public/usuarios/filter.js';
import { callSafeMint } from './callToContract.js'
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.static(path.join(__dirname, './public')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + './public'));
});
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname + './public/register.html'))
})
app.post("/register", UsuarioRegister)
app.get("/users", UsuarioRender)
app.get('/mint', callSafeMint)

//Conexion DB Mongo

mongoose.connect("mongodb+srv://fedec123:fedec123@cluster0.vrgmt0m.mongodb.net/?retryWrites=true&w=majority").then(() => console.log ("Base de datos conectada"))

app.listen(port, (err) => {
    if(!err){
        console.log(`Server listening port 8080`)
    }else {
        console.log('Error al escuchar el puerto')
    }
})
