const db = require("./dbMoleculas.js")

const estructura1 = {
    nombre: "Ácido clorhídrico",
    gData: {
        nodes: [{
            id: 1,
            color: "blue",
            val: 10,
            peso: 123.23
        },
        {
            id: 2,
            color: "blue",
            val: 10,
            peso: 123.23
        },
        {
            id: 3,
            color: "red",
            val: 30,
            peso: 200.84
        }],
        links: [{
            source: 3,
            target: 1
        },
        {
            source: 3,
            target: 2
        }]
    }
}


const estructura2 = {
    nombre: "Dióxido de carbono",
    gData: {
        nodes: [{
            id: 1,
            color: "blue",
            val: 10,
            peso: 123.23
        },
        {
            id: 2,
            color: "blue",
            val: 10,
            peso: 123.23
        },
        {
            id: 4,
            color: "blue",
            val: 10,
            peso: 123.23
        },
        {
            id: 3,
            color: "red",
            val: 30,
            peso: 200.84
        }],
        links: [{
            source: 3,
            target: 1
        },
        {
            source: 3,
            target: 2
        },
        {
            source: 3,
            target: 4
        }]
    }
}


const estructura3 = {
    nombre: "Prueba a borrar",
    gData: {
        nodes: [{
            id: 1,
            color: "blue",
            val: 10,
            peso: 123.23
        },
        {
            id: 2,
            color: "red",
            val: 30,
            peso: 123.23
        }],
        links: [{
            source: 1,
            target: 2
        }]
    }
}

const atomo1 = {
    nombre: "Hidrógeno",
    val: 25,
    color: "white",
    descripcion: "Descipción de hidrógeno",
    numeroPeriodico: 1,
    peso: 23
}

const atomo2 = {
    nombre: "Carbono",
    val: 5,
    color: "Grey",
    descripcion: "Descipción de Carbono",
    numeroPeriodico: 5,
    peso: 136
}

const atomo3 = {
    nombre: "Cobre",
    val: 10,
    color: "Orange",
    descripcion: "Descipción de Cobre",
    numeroPeriodico: 29,
    peso: 250
}


const start = async function () {
    db.conectar().then(() => console.log("Conectado"))
    try {
        // db.guardarEstructura(estructura1).then(() => console.log("Estructura1 guardada.") )
        // db.guardarEstructura(estructura2).then(() => console.log("Estructura2 guardada.") )
        // await db.guardarEstructura(estructura3);
        // await db.guardarEstructura(estructura1);
        // await db.guardarEstructura(estructura2);

        await db.guardarAtomo(atomo1);
        await db.guardarAtomo(atomo2);
        await db.guardarAtomo(atomo3);

    } catch (err) {
        console.log(err)
    }
    // let a = "Ácido"
    // console.log(await db.buscarEstructuras(a))
    // console.log(estructura2);


    db.cerrarConexion().then(() => console.log("Desconectado"))

}
start()
