const myGraph = ForceGraph3D();
const section = document.getElementById("grafico");
const listadoAtomos = document.getElementById("listaAtomos");
const botonGuardar = document.getElementById("botonGuardar");
const modal = new bootstrap.Modal(document.getElementById("modalGuardar"));
const botonAceptar = document.getElementById("botonAceptarModal");
const nombreEstructuraTextBox = document.getElementById("nombreEstructura")
const buscadorAtomos = document.getElementById("buscadorAtomos");
const gDataCreatio = { nodes: [], links: [] }
let idNode = 0;


let timeout;
buscadorAtomos.addEventListener("input", () => {
  clearTimeout(timeout);
  timeout = setTimeout(cargarAtomos, 500);
});


const cargarAtomos = async function () {
  listadoAtomos.innerHTML = "";
  listadoAtomos.innerHTML = plantillaAtomos({
    atomos: await buscarAtomos(buscadorAtomos.value)
  });
}


listadoAtomos.addEventListener("click", estructuraGraph)

async function estructuraGraph(evt) {
  if (evt.target.tagName == "LI") {
    const atomo = await cargarAtomo(evt.target.closest("li").dataset.id);
    if (atomo) {
      const node = { id: ++idNode, val: atomo.val, color: atomo.color, peso: atomo.peso }
      gDataCreatio.nodes.push(node)
      myGraph.graphData(gDataCreatio)
    }
  }
}

botonGuardar.addEventListener("click", guardar)
async function guardar(evt) {
  modal.show()
}

botonAceptar.addEventListener("click", aceptar)
async function aceptar() {
  if (nombreEstructuraTextBox.value.length != 0) {
    const gData = { nodes: [], links: [] }
    for (let node of gDataCreatio.nodes) {
      if (colorActual && node.color == "yellow") node.color = colorActual
      gData.nodes.push({ id: node.id, val: node.val, color: node.color, peso: node.peso });
    }
    for (let link of gDataCreatio.links) {
      gData.links.push({ source: link.source.id, target: link.target.id });
    }

    const estructuraNueva = {
      nombre: nombreEstructuraTextBox.value,
      gData
    }
    if (await guardarEstructuraNueva(estructuraNueva)) {
      location.replace("./index.html")
    }
  } else {
    nombreEstructuraTextBox.style.backgroundColor = "IndianRed"
  }

}


let atomoActual = undefined;
let colorActual = undefined;
myGraph.onNodeClick(function (node, event) {
  if (atomoActual) {
    if (node != atomoActual) {
      atomoActual.color = colorActual
      gDataCreatio.links.push({ source: atomoActual.id, target: node.id });
      atomoActual = undefined;
    } else {
      node.color = colorActual
      atomoActual = undefined
    }
  } else {
    atomoActual = node;
    colorActual = node.color
    node.color = "yellow"
  }
  myGraph.graphData(gDataCreatio)
})



myGraph.onNodeRightClick(function (node, event) {
  gDataCreatio.nodes = borrarAtomo(gDataCreatio.nodes, node)
  gDataCreatio.links = borrarLinksAsociados(gDataCreatio.links, node.id)
  myGraph.graphData(gDataCreatio)
})

function borrarAtomo(array, node) {
  return array.filter(function (elemento) {
    return elemento != node;
  });
}

function borrarLinksAsociados(array, id) {
  return array.filter(function (elemento) {
    return (elemento.source.id != id && elemento.target.id != id)
  })
}

myGraph.onLinkRightClick(function (link, event) {
  gDataCreatio.links = borrarLink(gDataCreatio.links, link)
  myGraph.graphData(gDataCreatio)
})

function borrarLink(array, link) {
  return array.filter(function (elemento) {
    return elemento != link;
  });
}





cargarAtomos();


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

async function buscarAtomos(busqueda) {
  return await enviarFetch(
    `/atomos?busqueda=${busqueda}`
  );
}

async function cargarAtomo(id) {
  return await enviarFetch(`/atomos/${id}`)
}

async function guardarEstructuraNueva(estructura) {
  return await enviarFetch(`/estructuras`, "POST", estructura)
}



//NetGraph
myGraph(section)
  .graphData(gDataCreatio);
gDataCreatio.nodes.pop()
gDataCreatio.links.pop()