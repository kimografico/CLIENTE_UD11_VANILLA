function sesion(param, userSession = null) {
    if (param == 'cargar') {
        return getCookie(usertext.value);
    } else if (param == 'guardar' && userSession) {
        setCookie(usertext.value, JSON.stringify(userSession), 30); // Duración de 30 días
        console.log('COOKIE HECHA');
    }
}

// let foo = JSON.parse(cookie);