const username = sessionStorage.getItem('username');
const btnAtras = document.getElementById('btnAtras');
const btnGrabar = document.getElementById('btnGrabar');
const cargando = document.getElementById('cargando');
document.getElementById('listado').innerText = 'Listado de ' + username;
document.getElementById('tablaCompleta').style.display = 'none';
cargarPreguntas(true);

function validar09(input) {
    input.value = input.value.replace(/[^0-9]/g, '').substring(0, 1);
}

function atras() {
    window.location.href = 'index.html';
}

// Construye la tabla con las preguntas de la cookie
function construirTabla(){
    const tabla = document.getElementById('tablaListado');
    let galleta = getCookie(username);
    let preguntas = JSON.parse(galleta).preguntas;
    let contenidoTabla = '';
    for (let i = 0; i < preguntas.length; i++) {
        let fila = preguntas[i];
        contenidoTabla += 
            '<tr>' +
                '<td>' + fila[0] + '</td>' +
                '<td>' + fila[1] + '</td>' +
                '<td>' + fila[2] + '</td>' +
                '<td>' + 'OK' + '</td>' +
            '</tr>';
    }
    tabla.innerHTML = contenidoTabla;
};

// Saca la lista de preguntas de la cookie
function promesaPreguntas(retraso = false){
    let delay = retraso ? 5000 : 0;
    let galleta = getCookie(username);
    return new Promise((resolve, reject) => {
        if (!galleta){
            reject('⚠️ No hay usuario activo ⚠️');
        } else {
            setTimeout(() => {
                let listaPreguntas = JSON.parse(galleta).preguntas;
                resolve(listaPreguntas);
            }, delay);
        }
      });
}

// Pide a la promesa que cargue las preguntas existentes en la cookie, y construye la tabla con ellas
async function cargarPreguntas(retraso) {
    try {
        let preguntas = await promesaPreguntas(retraso);
        if (preguntas.length == 0){
            cargando.innerText = 'TODAVÍA NO HAY PREGUNTAS GRABADAS';
        } else {
            construirTabla();
            document.getElementById('tablaCompleta').style.display = 'block';
            document.getElementById('cargando').style.display = 'none';
        }
    } catch (error) {
        setTimeout(() => {
            cargando.innerText = error;
        }, 2000);
    }

}

// Añade la pregunta enviada a la cookie
function promesaPregunta(pregunta, respuesta, puntuacion){
    return new Promise((resolve, reject) => { 
        setTimeout(() => {
            let galleta = getCookie(username);
            let grabando = document.getElementById("grabando");

            if (!galleta){
                if (grabando) grabando.innerText = 'ERROR';
                return reject('No hay usuario activo');
            }

            if (pregunta === '' || puntuacion === ''){
                if (grabando) grabando.innerText = 'ERROR';
                return reject('Faltan datos en la pregunta o puntuación');
            }

            try {
                galleta = JSON.parse(galleta);
            } catch (error) {
                if (grabando) grabando.innerText = 'ERROR';
                return reject('Error al parsear la cookie');
            }

            let listaPreguntas = galleta.preguntas;
            listaPreguntas.push([pregunta, respuesta, puntuacion, 'OK']);
            galleta.preguntas = listaPreguntas;

            setCookie(username, JSON.stringify(galleta), 30);
            if (grabando) grabando.innerText = 'OK';
            resolve('Pregunta grabada con éxito');
        }, 5000);
    });
}


// Recoge los datos del formulario y las manda a una promesa que las guarda en la cookie
async function grabarPregunta() {
    btnAtras.disabled = true;
    let pregunta = document.getElementById('pregunta').value;
    let respuesta = document.querySelector('input[name="respuesta"]:checked').value;
    let puntuacion = document.getElementById('puntos').value;

    if (cargando.style.display != 'none'){
        document.getElementById('tablaCompleta').style.display = 'block';
        document.getElementById('cargando').style.display = 'none';
    }

    vaciarForm();
    
    try {

        let entradaNueva = 
            '<tr>' +
                '<td>' + pregunta + '</td>' +
                '<td>' + respuesta + '</td>' +
                '<td>' + puntuacion + '</td>' +
                '<td id="grabando">' + 'Grabando...' + '</td>' +
            '</tr>';
        document.getElementById('tablaListado').insertAdjacentHTML('beforeend', entradaNueva);

        await promesaPregunta(pregunta, respuesta, puntuacion);
    } catch (error) {
        // await promesaPregunta(pregunta, respuesta, puntuacion); // No es necesario
    } finally {
        let grabando = document.getElementById("grabando");
        grabando.removeAttribute("id");
        
        if (!document.getElementById('grabando')) btnAtras.disabled = false;
    }
}

// Comprueba que el formulario se haya rellenado con una [función anónima autoejecutable]
(function() {
    let pregunta = document.getElementById('pregunta');
    let radios = document.querySelectorAll('input[name="respuesta"]');
    let puntuacion = document.getElementById('puntos');

    function comprobarForm() {
        
        let radiosArray = Array.from(radios);
        let algunMarcado = false;

        for (let i = 0; i < radiosArray.length; i++) {
            if (radiosArray[i].checked) {
                algunMarcado = true;
            }
        }

        if (pregunta.value != '' && puntuacion.value != '' && algunMarcado) {
            btnGrabar.disabled = false;
        } else {
            btnGrabar.disabled = true;
        };
    }

    pregunta.addEventListener('input', comprobarForm);
    document.getElementById('verdadero').addEventListener('input', comprobarForm);
    document.getElementById('falso').addEventListener('input', comprobarForm);
    puntuacion.addEventListener('input', comprobarForm);
})();

// Vacía el formulario
function vaciarForm(){
    document.getElementById('pregunta').value = '';
    document.getElementById('puntos').value = '';
    document.querySelectorAll('input[name="respuesta"]').forEach(radio => radio.checked = false);
}