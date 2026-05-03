import dotenv from "dotenv"; // importacion de la libreria de dotenv
dotenv.config(); // busca el archivo .env escaneando su contenido y convertiendo sus variables en accecibles

import { fileURLToPath } from "url"; // necesario para usar import (se necesita porque se cambio el tipo de comonsjs a module)
import { dirname } from "path"; // necesario para usar import (se necesita porque se cambio el tipo de comonsjs a module)

const __filename = fileURLToPath(import.meta.url); // necesario para usar import (se necesita porque se cambio el tipo de comonsjs a module)
const __dirname = dirname(__filename); // necesario para usar import (se necesita porque se cambio el tipo de comonsjs a module)



import express  from "express"; // crea el servidor
import cors  from"cors"; // permite que tu HTML acceda al servidor
import path  from"path"; // permite el manejo dinamico entre vistas
import postgres  from"postgres"; // traigo la libreria de postgres

const app = express(); // Crear servidor

app.use(cors()); // Permite peticiones desde tu HTML (evita errores de CORS)
app.use(express.json()); // Permite recibir datos en formato JSON (para formularios, APIs, etc.)
app.use(express.static("../frontend")); // hace uso de todo lo que tiene la carpeta public en el servidor


const connectionString = process.env.DB_URL; // se trae la URL de la base de datos en la nube
const sql = postgres(connectionString); // se conecta con la libreria de postgres en node

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html")); // Crea la url y la conecta con un archivo
});

app.get("/usuarios", (req, res) => {a
    res.sendFile(path.join(__dirname, "../frontend", "pages/users_get.html")); // Crea la url y la conecta con un archivo
});

app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "pages/users_post.html")); // Crea la url y la conecta con un archivo
});

app.get("/usuarios_get", async (req, res) => { // Esto crea una URL: http://localhost:3000/usuarios
    try{
        const result = await sql`SELECT * FROM users`; // cambia la forma de usar las quary
        res.json(result);
    } catch(error){
        console.error(error);
        res.json({ error: "Ocurrió un error" });
    }
});

app.post("/usuarios_post", async (req, res) => {
    try {
        const { name, lastname, age, date, email } = req.body

        await sql`
            INSERT INTO users (name, lastname, age, init_date, email)
            VALUES (${name}, ${lastname}, ${age}, ${date}, ${email})
        `

        res.send("Usuario agregado")
    } catch (error) {
        console.error(error)
        res.send("Error al insertar")
    }
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => { // inicia el servidor con el puerto 3000
    console.log(`Servidor en puerto ${PORT}`); // mensaje de inicio
})