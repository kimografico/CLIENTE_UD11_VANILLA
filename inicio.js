sessionStorage.clear();

// CONSTANTES
const pattern = /^[^@]+@[^@]+\.[^@]+$/;
// const pattern = /^[^@]+@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,})+$/;  // Este sería el pattern para validar también el dominio correctamente, pero no es lo que pone el enunciado
const msg1 = document.getElementById('mensaje1');
const msg2 = document.getElementById('mensaje2');
const msg3 = document.getElementById('mensaje3');
const aviso = document.getElementById('aviso');
const usertext = document.getElementById('usertext');
const botonEntrar = document.getElementById('botonEntrar');
const botonPreguntas = document.getElementById('botonPreguntas');
const hola = document.getElementById('hola');
const fecha = document.getElementById('fecha');

msg2.style.display = 'none';
msg3.style.display = 'none';

// TEMPORIZADOR
let temporizador = setTimeout(() => {
    mostrarlogin();
}, 5000);

document.addEventListener('keydown', function (event) {
    if (event.key == 'F10' && event.ctrlKey) {
        mostrarlogin();
    }
    clearTimeout(temporizador);
});

// FORMULARIO
function validarUsertext() {
    if (pattern.test(usertext.value)) {
        aviso.style.display = 'none';
        botonEntrar.disabled = false;
    } else {
        aviso.style.display = 'block';
        botonEntrar.disabled = true;
        setTimeout(() => {  // Sin el timeout funciona en chrome, pero no en firefox (https://es.stackoverflow.com/questions/417458/seleccionar-texto-en-firefox)
            usertext.focus();
            usertext.select();
        }, 0);
    }
}

usertext.addEventListener('blur', validarUsertext);


//FUNCIONES

function mostrarlogin() {
    msg2.style.display = 'block';
    msg1.style.display = 'none';
    aviso.style.display = 'none'
}

function saludo() {
    let userSession = getCookie(usertext.value);

    if (!userSession) {    
        userSession = {
            username: usertext.value,
            fecha: formatearFecha(),
            hora: new Date().toLocaleTimeString(),
            preguntas: []
        };
    
    } else {
        userSession = JSON.parse(userSession);
    }

    hola.innerText = 'Hola ' + userSession.username;
    fecha.innerText = 'La última vez que entraste fue el ' + userSession.fecha + ' a las ' + userSession.hora;
    msg3.style.display = 'block';
    msg2.style.display = 'none';

    userSession.fecha = formatearFecha();
    userSession.hora = new Date().toLocaleTimeString();

    sesion('guardar', userSession);
}

function preguntas() {
    window.location.href = 'cuestionario.html';
    sessionStorage.setItem('username', usertext.value);
}

function formatearFecha() {
    const opciones = { day: '2-digit', month: 'short', year: 'numeric' };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    return fecha.replace('.', '');
}
