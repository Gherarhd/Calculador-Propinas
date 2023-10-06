const modalForm = document.querySelector(".modal-body form");

let cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Comida",
  2: "Bebida",
  3: "Postre",
};

const btnGuardarCliente = document.querySelector("#guardar-cliente");
btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;

  //Revisar si hay Campos vacios
  const camposVacios = [mesa, hora].some((campo) => campo === "");

  if (camposVacios) {
    //verificar si ya existe el mensaje
    const existeAlerta = document.querySelector(".invalid-feedback");
    if (!existeAlerta) {
      imprimirAlerta("Todos los campos son obligatorios");
    }
    return;
  }

  //asignar datos del formulario
  cliente = { ...cliente, mesa, hora };
  console.log(cliente);

  //ocultar modal
  const formularioModal = document.querySelector("#formulario");
  const modalBootstrap = bootstrap.Modal.getInstance(formularioModal);
  modalBootstrap.hide();

  //mostrarSecciones

  mostrarSecciones();

  //obtener resultados de la api JSON server
  obtenerResultados();
}
function obtenerResultados() {
  const url = "http://localhost:4000/platillos";
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => mostrarResultados(resultado))
    .catch((resultado) => console.log(resultado));
}

function mostrarResultados(platillos) {
  const contenido = document.querySelector("#platillos .contenido");
  platillos.forEach((plato) => {
    const row = document.createElement("DIV");
    row.classList.add("row", "py-3", "border-top");

    const nombre = document.createElement("DIV");
    nombre.classList.add("col-md-4");
    nombre.textContent = plato.nombre;

    const precio = document.createElement("DIV");
    precio.classList.add("col-md-3", "fw-bold");
    precio.textContent = `$${plato.precio}`;

    const categoria = document.createElement("DIV");
    categoria.classList.add("col-md-3");
    categoria.textContent = categorias[plato.categoria];

    const inputCantidad = document.createElement("INPUT");
    inputCantidad.type = "number";
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `Producto-${plato.id}`;
    inputCantidad.classList.add("form-control");

    //Funcion que detecta la cantidad y el platillo
    inputCantidad.onchange = function () {
      const cantidad = parseInt(inputCantidad.value);
      agregarPlatillo({ ...plato, cantidad });
    };

    const agregar = document.createElement("DIV");
    agregar.classList.add("col-md-2");
    agregar.appendChild(inputCantidad);

    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(agregar);
    contenido.appendChild(row);
  });
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll(".d-none");
  seccionesOcultas.forEach((seccion) => seccion.classList.remove("d-none"));
}

function imprimirAlerta(mensaje) {
  const divMensaje = document.createElement("DIV");
  divMensaje.classList.add("invalid-feedback", "d-block", "text-center");
  divMensaje.textContent = mensaje;
  modalForm.appendChild(divMensaje);
  setTimeout(() => {
    divMensaje.remove();
  }, 3000);
}
function agregarPlatillo(producto) {
  let { pedido } = cliente;
  //revisar que la cantidad sea mayor a cero
  if (producto.cantidad > 0) {
    //Comprueba si el elemento existe
    if (pedido.some((articulo) => articulo.id === producto.id)) {
      //El articulo ya existe
      const pedidoActualizado = pedido.map((articulo) => {
        if (articulo.id === producto.id) {
          articulo.cantidad = producto.cantidad;
        }
        return articulo;
      });
      cliente.pedido = [...pedidoActualizado];
    } else {
      //El articulo no existe, lo agregamos al array
      cliente.pedido = [...pedido, producto];
    }
  } else {
    const resultado = pedido.filter((articulo) => articulo.id !== producto.id);
    cliente.pedido = [...resultado];
  }
  //Limpiar el codigo HTML previo

  limpiarHTML();

  if (cliente.pedido.length) {
    //Mostrar Resumen
    actualizarResumen();
  } else {
    mensajePedidoVacio();
  }
}
function actualizarResumen() {
  const contenido = document.querySelector("#resumen .contenido");

  const resumen = document.createElement("DIV");
  resumen.classList.add("col-md-6", "card", "py-3", "px-3", "shadow");

  const mesa = document.createElement("P");
  mesa.textContent = "Mesa: ";
  mesa.classList.add("fw-bold");

  const mesaSpan = document.createElement("SPAN");
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add("fw-normal");

  const hora = document.createElement("P");
  hora.textContent = "Hora: ";
  hora.classList.add("fw-bold");

  const horaSpan = document.createElement("SPAN");
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add("fw-normal");

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  const heading = document.createElement("H3");
  heading.textContent = "Platillos Consumidos";
  heading.classList.add("py-4", "text-center");

  //Iterar sobre el array de pedidos
  const grupo = document.createElement("UL");
  grupo.classList.add("list-group");

  const { pedido } = cliente;
  pedido.forEach((articulo) => {
    const { nombre, cantidad, precio, id } = articulo;

    const lista = document.createElement("LI");
    lista.classList.add(
      "list-group-item",
      "border",
      "border-dark-subtle",
      "my-2"
    );

    const nombreElemento = document.createElement("H4");
    nombreElemento.classList.add("my-4");
    nombreElemento.textContent = nombre;

    //cantidad de articulo
    const cantidadElemento = document.createElement("P");
    cantidadElemento.textContent = "Cantidad: ";
    cantidadElemento.classList.add("fw-bold");

    const cantidadElementoSpan = document.createElement("SPAN");
    cantidadElementoSpan.textContent = cantidad;
    cantidadElementoSpan.classList.add("fw-normal");
    //Precio del articulo
    const precioElemento = document.createElement("P");
    precioElemento.textContent = "Precio: ";
    precioElemento.classList.add("fw-bold");

    const precioElementoSpan = document.createElement("SPAN");
    precioElementoSpan.textContent = `$ ${precio}`;
    precioElementoSpan.classList.add("fw-normal");

    //sub total del articulo

    const subTotal = document.createElement("P");
    subTotal.textContent = "Subtotal: ";
    subTotal.classList.add("fw-bold");

    const subTotalSpan = document.createElement("SPAN");
    subTotalSpan.textContent = calcularSubtotal(precio, cantidad);
    subTotalSpan.classList.add("fw-normal");

    //boton para eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.textContent = "Eliminar pedido";

    //Función eliminar pedido
    btnEliminar.onclick = function () {
      eliminarPedido(id);
    };

    //Agregar valores a sus contenedores
    cantidadElemento.appendChild(cantidadElementoSpan);
    precioElemento.appendChild(precioElementoSpan);
    subTotal.appendChild(subTotalSpan);

    //Agregar elementos al LI
    lista.appendChild(nombreElemento);
    lista.appendChild(cantidadElemento);
    lista.appendChild(precioElemento);
    lista.appendChild(subTotal);
    lista.appendChild(btnEliminar);

    //Agregar lista al grupo principal
    grupo.appendChild(lista);
  });

  resumen.appendChild(heading);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);

  resumen.appendChild(grupo);

  contenido.appendChild(resumen);
  //Mostrar formulario de propinas
  formularioPropinas();
}

function limpiarHTML() {
  const contenido = document.querySelector("#resumen .contenido");

  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

function calcularSubtotal(precio, cantidad) {
  return `$ ${precio * cantidad}`;
}

function eliminarPedido(id) {
  const { pedido } = cliente;

  const resultado = pedido.filter((articulo) => articulo.id !== id);
  cliente.pedido = [...resultado];
  //Limpiar el codigo HTML previo

  limpiarHTML();
  if (cliente.pedido.length) {
    //Mostrar Resumen
    actualizarResumen();
  } else {
    mensajePedidoVacio();
  }
  //El producto se elimino por lo tanto regreso la cantidad a 0

  const productoEliminado = `#Producto-${id}`;
  const inputEliminado = document.querySelector(productoEliminado);
  inputEliminado.value = 0;
}

function mensajePedidoVacio() {
  const contenido = document.querySelector("#resumen .contenido");

  const texto = document.createElement("P");
  texto.classList.add("text-center");
  texto.textContent = "Añade los elementos del pedido";

  contenido.appendChild(texto);
}

function formularioPropinas() {
  const contenido = document.querySelector("#resumen .contenido");

  const formulario = document.createElement("DIV");
  formulario.classList.add("formulario", "col-md-6");
  const divFromulario = document.createElement("DIV");
  divFromulario.classList.add("card", "py-3", "px-3", "shadow");

  const heading = document.createElement("H3");
  heading.classList.add("my-4", "text-center");
  heading.textContent = "Propinas";

  //Radio Button 10%

  const radio10 = document.createElement("INPUT");
  radio10.type = "radio";
  radio10.name = "propina";
  radio10.value = "10";
  radio10.classList.add("form-check-input");
  radio10.onclick = function () {
    return calcularPropina();
  };

  const radio10Label = document.createElement("LABEL");
  radio10Label.textContent = "10%";
  radio10Label.classList.add("form-check-label");

  const radio10Div = document.createElement("DIV");
  radio10Div.classList.add("form-check");

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  //radio Button 25%
  const radio25 = document.createElement("INPUT");
  radio25.type = "radio";
  radio25.name = "propina";
  radio25.value = "25";
  radio25.classList.add("form-check-input");
  radio25.onclick = calcularPropina;

  const radio25Label = document.createElement("LABEL");
  radio25Label.textContent = "25%";
  radio25Label.classList.add("form-check-label");

  const radio25Div = document.createElement("DIV");
  radio25Div.classList.add("form-check");

  radio25Div.appendChild(radio25);
  radio25Div.appendChild(radio25Label);

  //radio Button 50%
  const radio50 = document.createElement("INPUT");
  radio50.type = "radio";
  radio50.name = "propina";
  radio50.value = "50";
  radio50.classList.add("form-check-input");
  radio50.onclick = calcularPropina;

  const radio50Label = document.createElement("LABEL");
  radio50Label.textContent = "50%";
  radio50Label.classList.add("form-check-label");

  const radio50Div = document.createElement("DIV");
  radio50Div.classList.add("form-check");

  radio50Div.appendChild(radio50);
  radio50Div.appendChild(radio50Label);

  //Agregar al div principal
  divFromulario.appendChild(heading);
  divFromulario.appendChild(radio10Div);
  divFromulario.appendChild(radio25Div);
  divFromulario.appendChild(radio50Div);

  //agregarlo al forrmulario
  formulario.appendChild(divFromulario);
  contenido.appendChild(formulario);
}

function calcularPropina() {
  const { pedido } = cliente;
  let subtotal = 0;
  //calcular el subtotal a pagar
  pedido.forEach((articulo) => {
    subtotal += articulo.cantidad * articulo.precio;
  });

  //selecionar el radio button con la propina del cliente
  const propinaSeleccionada = document.querySelector(
    '[name="propina"]:checked'
  ).value;

  //calcular la propina
  const propina = (subtotal * parseInt(propinaSeleccionada)) / 100;

  //calcular el total a pagar
  const total = subtotal + propina;

  mostrarTotalHTML(subtotal, propina, total);
}

function mostrarTotalHTML(subTotal, propina, total) {
  const divTotales = document.createElement("DIV");
  divTotales.classList.add("total-pagar");

  //Subtotal
  const subtotalParrafo = document.createElement("P");
  subtotalParrafo.classList.add("fs-5", "fw-bold", "mt-5");
  subtotalParrafo.textContent = "Subtotal Consumo: ";

  const subTotalSpan = document.createElement("SPAN");
  subTotalSpan.classList.add("fw-normal");
  subTotalSpan.textContent = `$${subTotal}`;

  subtotalParrafo.appendChild(subTotalSpan);

  //Propina
  const propinaParrafo = document.createElement("P");
  propinaParrafo.classList.add("fs-5", "fw-bold", "mt-1");
  propinaParrafo.textContent = "Propina: ";

  const propinaSpan = document.createElement("SPAN");
  propinaSpan.classList.add("fw-normal");
  propinaSpan.textContent = `$${propina}`;

  propinaParrafo.appendChild(propinaSpan);

  //Total
  const totalParrafo = document.createElement("P");
  totalParrafo.classList.add("fs-5", "fw-bold", "mt-1");
  totalParrafo.textContent = "Total Pagar: ";

  const totalSpan = document.createElement("SPAN");
  totalSpan.classList.add("fw-normal");
  totalSpan.textContent = `$${total}`;

  totalParrafo.appendChild(totalSpan);

  //Eliminar resultado previo
  const totalesPagarDiv = document.querySelector(".total-pagar");
  if (totalesPagarDiv) {
    totalesPagarDiv.remove();
  }

  divTotales.appendChild(subtotalParrafo);
  divTotales.appendChild(propinaParrafo);
  divTotales.appendChild(totalParrafo);

  const formulario = document.querySelector(".formulario > div");
  formulario.appendChild(divTotales);
}

//para abrir el servidor
// json-server --watch db.json --port 4000
