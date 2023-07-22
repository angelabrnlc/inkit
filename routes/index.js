/* Así importamos los módulos necesarios y configura el enrutador para la aplicación Express. */
let express = require("express");
let bodyparser = require("body-parser");
let router = express.Router();

let database = require("../database");

/* Estas líneas de código están configurando el enrutador para usar el middleware `body-parser`. */
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({ extended: false }));

/* Este código define una ruta GET para la URL raíz ("/"), de forma que se renderice la vista principal (Index/Home). Tambien creamos una session de express donde guardaremos nuestro usuario. La vista renderizada se enviará como respuesta al cliente. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", session: req.session });
});

/* Este código está definiendo un controlador de ruta para la URL "/tatuadores". Cuando se realiza una solicitud GET a esta URL, el código ejecuta una consulta de la base de datos para recuperar todas las filas de la tabla "users", ordenadas por la columna "user_ig". Luego, ejecuta otra consulta para recuperar todas las filas de la tabla "img". Una vez que se completan ambas consultas, el código genera la vista "tatuadores.ejs", pasando los datos e imágenes recuperados como variables a
la vista. */
router.get("/tatuadores", (req, res, next) => {
  const query3 = `SELECT * FROM users ORDER BY user_ig`;

  database.query(query3, (err, data) => {
    if (err) {
      throw err;
    } else {
      const query4 = `SELECT * FROM img`;
      database.query(query4, (err, images) => {
        if (err) {
          throw err;
        } else {
          res.render("tatuadores.ejs", {
            data: data,
            image: images,
          });
        }
      });
    }
  });
});

// Este GET funciona de la misma forma que el anterior salvo que la tabla users es ordenada por "user_style" y se renderiza la vista "estilos.ejs"¡
router.get("/estilos", (req, res, next) => {
  const query3 = `SELECT * FROM users ORDER BY user_style`;

  database.query(query3, (err, data) => {
    if (err) {
      throw err;
    } else {
      const query4 = `SELECT * FROM img`;
      database.query(query4, (err, images) => {
        if (err) {
          throw err;
        } else {
          res.render("estilos.ejs", {
            data: data,
            image: images,
          });
        }
      });
    }
  });
});

// Este GET funciona de la misma forma que el anterior salvo que la tabla users es ordenada por "user_location" y se renderiza la vista "ubicaciones.ejs"
router.get("/ubicaciones", (req, res, next) => {
  const query3 = `SELECT * FROM users ORDER BY user_location`;

  database.query(query3, (err, data) => {
    if (err) {
      throw err;
    } else {
      const query4 = `SELECT * FROM img`;
      database.query(query4, (err, images) => {
        if (err) {
          throw err;
        } else {
          res.render("ubicaciones.ejs", {
            data: data,
            image: images,
          });
        }
      });
    }
  });
});

/* La función `router.post("/newUser", ...)` es un controlador de ruta para la solicitud POST al punto final "/newUser". Esta crea un nuevo usuario de nuestra página mediante los datos recogidos del formulario con req.body.  */
router.post("/newUser", (req, res, next) => {
  let user_name = req.body.user_name; //requiere el email desde el formulario del body. No hay que importarlo porque ya está en el html y la ruta.
  let user_mail = req.body.user_mail;
  let user_password = req.body.user_password;
  let user_location = req.body.user_location;
  let user_ig = req.body.user_ig;
  let user_style = req.body.user_style;
  console.log(user_name);
  if (user_name && user_mail && user_password) {
    query10 = `SELECT user_name FROM users WHERE user_name="${user_name}";`;
    database.query(query10, (error, data) => {
      if (data > 0) {
        res.send("Ese nombre de usuario ya ha sido registrado");
      } else if (data == 0) {
        query = `INSERT INTO users (user_name, user_mail, user_password, user_location, user_ig, user_style) VALUES ("${user_name}", "${user_mail}", "${user_password}", "${user_location}", "${user_ig}", "${user_style}")`;
        database.query(query, (error) => {
          if (error) {
            throw error;
          }
        });
      } else if (error) {
        throw error;
      }
    });
  } else {
    res.send("Introduce un usuario válido para el registro");
  }
  res.redirect("/");
  res.end();
});

/* La función `router.post("/login", ...)` es un controlador de ruta para la solicitud POST al punto final "/login". Es responsable de manejar la funcionalidad de inicio de sesión de la aplicación. Una vez introducido los datos del usuario, si este lo ha hecho correctamente, los datos son guardados en la session mediante un bucle for aplicados a las columnas de la tabla users donde el email del login coincida con aquel de la columna user_mail*/
router.post("/login", (req, res, next) => {
  let user_mail = req.body.user_mail;
  let user_password = req.body.user_password;

  if (user_mail && user_password) {
    query = `SELECT * FROM users WHERE user_mail="${user_mail}"`;

    database.query(query, (error, data) => {
      if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
          if (data[i].user_password == user_password) {
            req.session.user_name = data[i].user_name;
            req.session.user_mail = data[i].user_mail;
            req.session.user_location = data[i].user_location;
            req.session.user_ig = data[i].user_ig;
            req.session.user_style = data[i].user_style;
            res.redirect("/");
          } else {
            res.send("Contraseña incorrecta");
          }
        }
      } else {
        res.send("Email incorrecto");
      }
      res.end();
    });
  } else {
    res.send("Por favor, introduce un usuario y contraseña válido");
    res.end();
  }
});

//Este GET destruye la session creada para que pueda ser iniciada session de nuevo desde otro usuario.
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

//Estos GET funcionan igual, cada uno renderiza una vista ("register.ejs" y "nosotros.ejs")
router.get("/register", (req, res, next) => {
  res.render("register");
});
router.get("/nosotros", (req, res, next) => {
  res.render("nosotros");
});

/* El código `router.get("/update", ...)` está definiendo un controlador de ruta para la solicitud GET al punto final "/update". Aquí requerimos la session para poder utilizar los datos de users donde el user_name coincida con el de la tabla users.  */
router.get("/update", (req, res, next) => {
  const user_name = req.session.user_name;
  if (!user_name) {
    res.sendStatus(400);
    return;
  }

  const query2 = `SELECT * FROM img WHERE user_name="${user_name}"`;

  database.query(query2, (err, results2) => {
    if (err) {
      console.error("Error al realizar la consulta 2:", err);
      res.sendStatus(500);
      return;
    }
    res.render("update", {
      user_name,
    });
  });
});

/* La función `router.get("/personalA", ...)` es un controlador de ruta para la solicitud GET al punto final "/personalA". Es responsable de representar la vista "personalA", que muestra la información personalizada de cada usuario si esta logeado. Es decir, mediante el user_name guardado en session recogemos sus datos, las reviews y las imagenes que estan relacionadas con el usuario mediante el user_name de cada tabla. */
router.get("/personalA", (req, res, next) => {
  const user_name = req.session.user_name;
  const user_mail = req.session.user_mail;
  const user_ig = req.session.user_ig;
  const user_style = req.session.user_style;
  const user_location = req.session.user_location;
  const user_info = req.session.user_info;

  if (!user_name) {
    res.sendStatus(400);
    return;
  }

  const query2 = `SELECT * FROM img WHERE user_name="${user_name}"`;

  database.query(query2, (err, results2) => {
    if (err) {
      console.error("Error al realizar la consulta 2:", err);
      res.sendStatus(500);
      return;
    } else {
      const images = results2;
      const query5 = `SELECT * FROM reviews WHERE user_name="${user_name}"`;
      database.query(query5, (err, results5) => {
        if (err) {
          throw err;
        } else {
          res.render("personalA", {
            user_name,
            user_ig,
            user_location,
            user_mail,
            user_style,
            user_info,
            user: images,
            reviews: results5,
          });
        }
      });
    }
  });
});

/* El código siguiente define un controlador de ruta para una solicitud POST a "updateData". Mediante los datos guardados en session podemos definir que fila de la tabla users queremos modificar y mediante distintas querys modificamos los valores*/
router.post("/updateData", (req, res, next) => {
  let user_name = req.session.user_name;
  let user_mail = req.body.user_mail;
  let user_location = req.body.user_location;
  let user_ig = req.body.user_ig;
  let user_style = req.body.user_style;

  query = `SELECT * FROM users WHERE user_name="${user_name}"`;
  database.query(query, (error, data) => {
    if (user_mail) {
      query = `UPDATE users SET user_mail="${user_mail}" WHERE user_name="${user_name}"`;
    }
    if (user_ig) {
      query = `UPDATE users SET user_ig="${user_ig}" WHERE user_name="${user_name}"`;
    }
    if (user_location) {
      query = `UPDATE users SET user_location="${user_location}" WHERE user_name="${user_name}"`;
    }
    if (user_style) {
      query = `UPDATE users SET user_style="${user_style}" WHERE user_name="${user_name}"`;
    }

    database.query(query, (error) => {
      if (error) {
        console.log(error);
      }
    });
  });
  res.redirect("/personalA");
  res.end();
});

/* El código anterior define un controlador de ruta para una solicitud POST a "/createReview". Mediante el user_name guardado en sesion crea una fila nueva de la tabla reviews generando una nueva reseña. */
router.post("/createReview", (req, res, next) => {
  const user_name = req.session.user_name;
  let user_stars = req.body.user_stars;
  let tattoo_ig = req.body.tattoo_ig;

  const query6 = `INSERT INTO reviews (user_name, user_stars, tattoo_ig) VALUES ("${user_name}", "${user_stars}", "${tattoo_ig}")`;

  database.query(query6, (err, data) => {
    res.redirect("/personalA");
    res.end();
  });
});

/* Este código define un controlador de ruta para la solicitud POST al punto final "/createReview". Es responsable de eliminar una reseña de la tabla reviews mediante el user_name guardado en session y el nombre del tatuador de la reseña en la base de datos. */
router.post("/deleteReview", (req, res, next) => {
  const user_name = req.session.user_name;
  let tattoo_ig = req.body.tattoo_ig;

  query7 = `DELETE FROM reviews WHERE user_name="${user_name}" AND tattoo_ig="${tattoo_ig}"`;

  database.query(query7, (err, data) => {
    res.redirect("/personalA");
    res.end();
  });
});

/* El código define un controlador de ruta para una solicitud POST al punto final "updateReview". Este controlador es responsable de actualizar la puntuación de una reseña en la base de datos, mediante el user_name guardado en session y el nombre del tatuador de la reseña. */
router.post("/updateReview", (req, res, next) => {
  const user_name = req.session.user_name;
  let tattoo_ig = req.body.tattoo_ig;
  let user_stars = req.body.user_stars;

  query8 = `UPDATE reviews SET user_stars="${user_stars}" WHERE user_name="${user_name}" AND tattoo_ig="${tattoo_ig}"`;

  database.query(query8, (err, data) => {
    res.redirect("/personalA");
    res.end();
  });
});

/* La función `router.post("/deleteUser", ...)` es un controlador de ruta para la solicitud POST al punto final "/deleteUser". Es responsable de eliminar un usuario de la base de datos. */
router.post("/deleteUser", (req, res, next) => {
  let user_mail = req.session.user_mail;
  query = `DELETE FROM users WHERE user_mail="${user_mail}"`;
  database.query(query, (error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    }
  });
  res.send("Sentimos que te dieras de baja. ¡Vuelve pronto!");

  req.session.destroy();
  res.end();
});

//Así exportamos la hoja de rutas
module.exports = router;
