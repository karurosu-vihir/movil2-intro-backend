exports.inicio = (req, res) => {
    res.send("Hola Mundo");
}

exports.otra = (req, res) => {
    let objeto = {
        nombre: "Carlos",
        apellido: "Vijil",
        clase: "Movil II"
    };
    res.json(objeto);
}

exports.nombre = (req, res) => {
    let objeto = {
        nombre: "Carlos",
        apellido: "Vijil",
        clase: "Movil II"
    };
    res.statusCode = 303;
    res.json({nombrecompleto: `${objeto.nombre} ${objeto.apellido}`});
}

