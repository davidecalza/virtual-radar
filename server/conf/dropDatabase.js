// DROP DATABASE
// Deletes the database

var conn = {
    host: 'localhost',
    user: 'root',
    password: 'root'
  };
  var knex = require('knex')({
    client: 'mysql',
    connection: conn
  });  
  
  knex.raw("DROP DATABASE radar")
  .then(function(){
      knex.destroy();
      console.log("Database dropped")
  });