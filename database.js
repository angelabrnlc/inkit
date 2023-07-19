/* Este código importa el módulo `mysql` y crea una conexión a una base de datos MySQL. */
const mysql = require("mysql");
const database = mysql.createConnection({
  host: "db4free.net",
 database: "inkitsql",
  user: "angelasql",
  password: "proyectoSQL",
  port: "3306",
});

/* La función se utiliza para establecer una conexión con la base de datos MySQL. Toma como argumento una función de callback, que se ejecuta una vez que se establece la conexión o se produce un error. */
database.connect(function (err) {
  if (err) {
    throw err;
  } else {
    console.log("Conectado y a topisimo");
  }
});

//Exportamos la base de datos
module.exports = database;
