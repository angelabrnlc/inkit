/* Este código está importando varios módulos y configurando la aplicación Express. */
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyparser = require("body-parser");
const multer = require("multer");
const favicon = require("serve-favicon");

const session = require("express-session");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const database = require("./database");

const app = express();


/* El código está instalando y configurando la administración de sesiones para la aplicación Express para que sean guardadas en el local storage. */
app.use(
  session({
    secret: "proyecto",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});


/* El código establece el directorio donde se encuentran las vistas (plantillas) de la aplicación. En este caso, se establece en el directorio "vistas" en el directorio actual y le informamos que el motor de plantillas será ejs */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* Estas líneas de código configuran funciones de middleware para la aplicación Express. Bodyparser para extraer datos del html, coookieParser para cookies. */
app.use(logger("dev"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cookieParser());

/* Estas líneas de código están configurando la aplicación Express para servir archivos estáticos. */
app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));

/* Nos permite usar un favicon. */
app.use(favicon(path.join(__dirname, "public/images", "monog.png")));

/* Configuramos el enrutamiento para la aplicación. */
app.use("/", indexRouter);
app.use("/users", usersRouter);

/* Este código está configurando los ajustes de almacenamiento y carga para el middleware Multer que nos permitirá almacenar las imagenes en la base de datos */
let storage = multer.diskStorage({
  destination: "public/images/",
  filename: (req, file, callBack) => {
    callBack(null, Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({
  storage: storage,
});

/* Este código está manejando una solicitud POST al punto final "/post". Utiliza el middleware Multer para manejar la carga de archivos en la base de datos mediante el usuario guardado en sesion. */
app.post("/post", upload.single("img"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No se ha enviado ningún archivo");
    return;
  }

  let imgsrc = "images/" + req.file.filename;
  let insert = `INSERT INTO img (user_name, user_img) VALUES ("${req.session.user_name}", "${imgsrc}")`;
 
  database.query(insert, (err, data) => {
    if (err) {
      console.error("Error al insertar el archivo en la BD:", err);
      res.sendStatus(500);
      return;
    }
    console.log("Archivo introducido en la BD");
    res.redirect("/personalA")
    res.end();
  });
});

/*  Iniciamos el servidor y escucha las solicitudes entrantes en el puerto 3001. Una vez que el servidor se haya iniciado correctamente, registrará el mensaje "El servidor está levantado" en la consola. */
app.listen(3001, () => {
  console.log("El servidor está levantado");
});

//Exportamos "app".
module.exports = app;
