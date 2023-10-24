const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''

}

document.addEventListener('DOMContentLoaded', () => {
    datosSelect();
    criptoMonedasSelect.addEventListener('change', leerValor);
    monedasSelect.addEventListener('change', leerValor);
    formulario.addEventListener('submit', validarFormulario);

})

function leerValor(e) {
    e.preventDefault();

    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda)

}

const obtenerCriptoMonedas = criptomonedas => new Promise((resolve) => {
    resolve(criptomonedas);
})

function llenarSelectCriptomonedas(criptomonedas) {

    criptomonedas.forEach((cripto) => {
        const { Name, FullName } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptoMonedasSelect.appendChild(option);
    })
}


async function datosSelect() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptoMonedas(resultado.Data);
        llenarSelectCriptomonedas(criptomonedas);


    } catch (error) {
        console.log(error);
    }
}

function validarFormulario(e) {
    e.preventDefault();

    const moneda = document.querySelector('#moneda').value;
    const criptomoneda = document.querySelector('#criptomonedas').value;

    if (moneda === "" || criptomoneda === "") {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    obtenerInfo();

}

function mostrarAlerta(msg) {
    const existeAlerta = document.querySelector('.error');
    if (existeAlerta) {
        return;
    }
    const divMensaje = document.createElement('DIV');
    divMensaje.textContent = msg;
    divMensaje.classList.add('error');

    formulario.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
    }, 3000)
}

async function obtenerInfo(){

    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    try{

        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        mostrarCotizacionHTML(resultado.DISPLAY[criptomoneda][moneda])

    }catch(error){
        console.log(error);
    }
}


function mostrarCotizacionHTML(cotizacion){

    limpiarHTML();

    const {PRICE, LOWDAY, HIGHDAY, LASTUPDATE, CHANGEPCT24HOUR} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día <span>${HIGHDAY}</span></p>`

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día <span>${LOWDAY}</span></p>`

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas <span>${CHANGEPCT24HOUR}%</span></p>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización <span>${LASTUPDATE}</span></p>`



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `
    resultado.appendChild(spinner);
}
