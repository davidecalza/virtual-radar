var express = require('express');
var router = express.Router();

var config = require('./local_conf.js');		
var lib = require('./lib.js');					

router.get('/', function (req, res) {
    res.sendFile(__dirname + "/help.html");
});

router.get('/Album', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM album ORDER BY id_album;');
});

router.get('/Dati', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ ORDER BY file_path;');
});

router.get('/Dati/Album/:id_album', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE id_album=? ORDER BY file_path;', req.params.id_album);
});

router.get('/Dati/All/Contiene/:string', function (req, res) {
	str ='%'+req.params.string+'%';
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( intestazione LIKE ? ) OR ( soggetto LIKE ? ) OR ( soggetto_titolo LIKE ? ) ORDER BY file_path;', [str,str,str]);
});

router.get('/Dati/Intestazione/Contiene/:string', function (req, res) {
	str ='%'+req.params.string+'%';
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( intestazione LIKE ? ) ORDER BY file_path;', str);
});

router.get('/Dati/Soggetto/Contiene/:string', function (req, res) {
	str ='%'+req.params.string+'%';
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( soggetto LIKE ? ) ORDER BY file_path;',  str);
});

router.get('/Dati/Titolo/Contiene/:string', function (req, res) {
	str ='%'+req.params.string+'%';
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( soggetto_titolo LIKE ? ) ORDER BY file_path;', str);
});

router.get('/Dati/Codice/:codice', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE codice=?;', req.params.codice);
});

router.get('/Dati/Data/BW/:data_min/:data_max', function (req, res) {
	dmin=req.params.data_min;
	dmax=req.params.data_max;
	
	// verificare ...
    // SELECT * FROM v_dati_publ WHERE (data_min <= data_a) and (data_max >= data_da);
    
	lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE (? <= data_a) and (? >= data_da);',[dmin,dmax]);
});

router.get('/Dati/Data/EQ/:data', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ? between data_da and data_a;', req.params.data);
});

router.get('/Dati/Data/GE/:data', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( data_da >= ? );', req.params.data);
});

router.get('/Dati/Data/LE/:data', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( data_a <= ? );', req.params.data);
});

router.get('/Dati/Data/Valid/:valid', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( data_esecuz_da_valid = ? );', req.params.valid);
});

router.get('/Dati/Data/Giorno/:data', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE ( data_da = ? ) AND ( data_da = data_a );', req.params.data);
});

router.get('/Dati/Fondo/:id_fondo', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE id_fondo=? ORDER BY file_path;', req.params.id_fondo);
});

router.get('/Dati/Serie/:id_serie', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM v_dati_publ WHERE id_serie=? ORDER BY file_path;', req.params.id_serie);
});

router.get('/Fields/Priv', function (req, res) {
    res.json(config.fields_priv);
})

router.get('/Fields/Publ', function (req, res) {
    res.json(config.fields_publ);
})

router.get('/Fondi', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM fondi ORDER BY id_fondo;');
});

router.get('/Serie', function (req, res) {
    lib.eseguiQuery(res, 'SELECT * FROM serie ORDER BY id_serie;');
});

router.get('/Version', function (req, res) {
    res.end(config.ws_version);
})

module.exports = router;
