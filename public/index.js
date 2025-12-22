const myGraph = ForceGraph3D();
const section = document.getElementById("grafico");
const listadoEstructuras = document.getElementById("listaEstructuras");
const buscador = document.getElementById("buscadorEstructuras")
const gDataInit = { nodes: [], links: [] }



estructuraCargada = "";


let timeout;
buscador.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(cargarEstructuras, 500);
});


const cargarEstructuras = async function () {
  listadoEstructuras.innerHTML = "";
  listadoEstructuras.innerHTML = plantillaEstructuras({
    estructuras: await buscarEstructuras(buscador.value),
  });
}


listadoEstructuras.addEventListener("click", estructuraGraph)
async function estructuraGraph(evt) {
  if (evt.target.tagName != "UL") {
    estructuraActual = evt.target.closest("li").textContent;
    if (evt.target.classList.contains("borrarEstructura")) {
      await borrarEstructura(estructuraActual)
      await cargarEstructuras();
      if (estructuraActual == estructuraCargada) {
        cargarEstructuraInicial();
      }
    } else {
      const datos = await cargarEstructura(estructuraActual);
      myGraph.graphData(datos[0]._doc.gData)
      estructuraCargada = datos[0]._doc.nombre;
    }
  }
}
cargarEstructuras();

//fetch
async function enviarFetch(url, metodo = "GET", body) {
  try {
    let opts = { method: metodo };
    if (body) {
      opts.body = JSON.stringify(body);
      opts.headers = { "Content-type": "application/json" };
    }
    const resp = await fetch(url, opts);
    if (resp.ok) {
      const mimeType = resp.headers.get("content-type");
      if (mimeType && mimeType.startsWith("application/json"))
        return await resp.json();
      else return await resp.text();
    } else throw resp.statusText;
  } catch (err) {
    // alert("Hubo un problema: " + err);
  }
}

async function buscarEstructuras(busqueda) {
  ;
  return await enviarFetch(
    `/estructuras?busqueda=${busqueda}`
  );
}

async function cargarEstructura(nombre) {
  return await enviarFetch(`/estructuras/${nombre}`)
}

async function borrarEstructura(nombre) {
  return await enviarFetch(`/estructuras/${nombre}`, "DELETE")
}



cargarEstructuraInicial = function () {
  myGraph.graphData(gDataInit);
}

myGraph(section)
  .graphData(gDataInit);