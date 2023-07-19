/* Este código está configurando un enrutador para manejar solicitudes HTTP relacionadas con los usuarios. */
var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
