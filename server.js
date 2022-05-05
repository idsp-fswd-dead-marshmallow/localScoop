const app = require('./app.js');
const express = require("express")
const PORT = process.env.PORT || 8000; // let express set PORT, else make it 8000
const dbConnection = require("./database/databaseConnection")

// app.set("view engine", "ejs")

app.listen(PORT, () => console.log(`server should be running at http://localhost:${PORT}/`))


