const mysql = require('mysql2');
const fs = require('fs');

const conn = new mysql.createConnection({ 
  host: "mysqlisapserver.mysql.database.azure.com", 
  user: "isaproot", 
  password: "1To3For5", 
  database: "isapdb", 
  port: 3306, 
  ssl: { ca: fs.readFileSync("./config/DigiCertGlobalRootCA.crt.pem") }
});

conn.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to ISAP Database Successfully.');
});



 module.exports=conn;
  