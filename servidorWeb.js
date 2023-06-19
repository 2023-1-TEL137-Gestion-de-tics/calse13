const express = require("express");
const app = express();
const path = require("path");
const bp = require("body-parser");
const multer = require("multer");
const mult = multer();
const mysql = require("mysql2");
const e = require("express");

let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "hr"
});

app.get("/api/employee/list", function (req, res) {

    //let sql = "select e.*,e.salary + 100 from employees e";
    let sql = "select * from employees";

    conn.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log("Total de empleados obtenidos: ", result.length);
        for (let i = 0; i < result.length; i++) {
            //la respuesta viene como "Strings"
            let salaryAsFloat = parseFloat(result[i].salary);
            result[i].salary = salaryAsFloat + 100;
        }
        //console.log(result);
        res.json(result);
    });

    console.log("fin del método?");
});

app.get("/api/employee/buscar/:nombre", function (req, res) {

    let nombre = req.params.nombre;

    let sql = "select * from employees where lower(first_name) like ?";

    let parametros = ["%" + nombre + "%"];

    conn.query(sql, parametros, function (err, results) {
        if (err) throw err;
        res.json(results);
    })
});

app.get("/api/jobs", (req, res) => {
    listarEmpleados(res);
});

function listarEmpleados(res){
    conn.query("select * from jobs", (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
}

app.post("/api/jobs", bp.urlencoded({extended: true}), (req, res) => {

    let jobId = req.body.jobId;
    let jobTitle = req.body.jobTitle;
    let minSalary = req.body.minSalary;
    let maxSalary = req.body.maxSalary;

    let sql = "insert into jobs (job_id, job_title, min_salary, max_salary) VALUES (?,?,?,?)";
    let params = [jobId, jobTitle, minSalary, maxSalary];

    conn.query(sql,params,(err, result, fields) => {
       if(err) throw err;

       listarEmpleados(res);
    });

});

app.get("/hola", function (req, res) {
    res.send("Hola!");
});

app.get("/holaHtml", function (req, res) {
    res.sendFile(path.join(__dirname, "vistas/hola.html"));
});

//parámetro clase13?nombre=leonardo&apellido=abanto
app.get("/clase13", function (req, res) {
    let nombre = req.query.nombre;
    let apellido = req.query.apellido;
    console.log("nombre:", nombre);
    if (apellido !== undefined) {
        console.log("apellido:", apellido);
    } else {
        console.log("no se envió apellido");
    }
    res.send("nombre recibido: " + nombre);
});

//parámetro clase131/dana/nolasco
app.get("/clase131/:nombre/:apellido", (req, res) => {
    let nombre = req.params.nombre;
    let apellido = req.params.apellido;

    res.send("nombre recibido: " + nombre);
});

//cabecera: application/x-www-form-urlencoded
app.post("/formulario", bp.urlencoded({extended: true}), function (req, res) {
    lecturaBodyHtml(req, res);
});

//cabecera: application/json
app.post("/formulario2", bp.json(), function (req, res) {
    lecturaBodyHtml(req, res);
});

//cabecera: multipart/form-data
app.post("/formulario3", mult.none(), function (req, res) {
    lecturaBodyHtml(req, res);
});

function lecturaBodyHtml(req, res) {
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;

    console.log("nombre", nombre);

    res.json({
        nombreRecibido: nombre,
        apellidoRecibido: apellido
    });
}

app.listen(3000, function () {
    console.log("Servidor iniciado correctamente en el puerto 3000");
});

//GET "/Hola"
/*@GetMapping("/Hola")
public String hola(){
    return "vista";
}
*/
