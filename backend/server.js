// Carga las variables de entorno desde el archivo .env
import dotenv from "dotenv";
dotenv.config(); // Lee el archivo .env y agrega sus variables a process.env


// Utilidades para obtener rutas de archivos cuando se usan módulos ES (import/export)
import { fileURLToPath } from "url";
import { dirname } from "path";

// En módulos ES no existen __filename ni __dirname por defecto,
// por lo que se recrean manualmente.
const __filename = fileURLToPath(import.meta.url); // Ruta absoluta del archivo actual
const __dirname = dirname(__filename); // Carpeta donde se encuentra el archivo actual


// Framework para crear servidores web y APIs
import express from "express";

// Middleware que permite solicitudes entre distintos dominios (CORS)
import cors from "cors";

// Módulo para trabajar con rutas y directorios del sistema operativo
import path from "path";

// Librería para conectarse y realizar consultas a PostgreSQL
import postgres from "postgres";


// Crea una instancia de la aplicación Express
const app = express();


// Permite que aplicaciones externas (frontend, Postman, etc.)
// puedan consumir la API sin bloqueos por políticas CORS
app.use(cors());


// Permite que Express interprete automáticamente
// los cuerpos de las peticiones en formato JSON
app.use(express.json());


// Publica archivos estáticos (HTML, CSS, JS, imágenes, etc.)
// para que puedan ser accedidos desde el navegador
app.use(express.static("../frontend"));


// Obtiene la cadena de conexión almacenada en el archivo .env
const connectionString = process.env.DB_URL;


// Establece la conexión con la base de datos PostgreSQL
// y devuelve un objeto para ejecutar consultas SQL
const sql = postgres(connectionString);

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

const PORT = process.env.PORT || 3000; // aqui se escoge el puerto del servidor

app.listen(PORT, () => { // inicia el servidor con el puerto 3000 o el que de el servidor
    console.log(`Servidor en puerto ${PORT}`); // mensaje de inicio
})