var conn = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'radar'
  };
  var knex = require('knex')({
    client: 'mysql',
    connection: conn
  });  
  
  knex('aircraft').truncate()
  .then(function(){
    knex('track').truncate()
    .then(function(){
        knex.destroy();
        console.log("Tables cleared")
    })
  })