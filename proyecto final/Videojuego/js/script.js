const ctx = pintura.getContext('2d');
let tuboAncho = 50;
let tuboEspacio = 150;
let velocidadTubo = 2;
let jugador = {x: 150, y: 200, radio: 20, velocidadY: 0, gravedad: 0.5, saltar: -8};
let tubos = [];
let puntaje = 0;
let finJuego = false;
const gameOverText = document.getElementById('gameOver');
const restartButton = document.querySelector('button');
function dibujarJugador() {
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(jugador.x, jugador.y, jugador.radio, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6347'; 
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
}
function dibujarTubos() {
    tubos.forEach(tubo => {
        const grad = ctx.createLinearGradient(tubo.x, 0, tubo.x, pintura.height);
        grad.addColorStop(0, '#32CD32');
        grad.addColorStop(1, '#228B22');
        ctx.fillStyle = grad;
        ctx.fillRect(tubo.x, 0, tuboAncho, tubo.alturaSuperior);
        ctx.fillRect(tubo.x, tubo.alturaSuperior + tuboEspacio, tuboAncho, pintura.height);
    });
}
function moverTubos() {
    tubos.forEach(tubo => {
        tubo.x -= velocidadTubo;
    });

    if (tubos.length > 0 && tubos[0].x < -tuboAncho) {
        tubos.shift();
        puntaje++;
    }

    if (tubos.length === 0 || tubos[tubos.length - 1].x < pintura.width - 300) { 
        let alturaSuperior = Math.floor(Math.random() * (pintura.height - tuboEspacio)); 
        tubos.push({x: pintura.width, alturaSuperior}); 
    }
}
function dibujarPuntaje() {
    ctx.font = '30px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Puntaje: ' + puntaje, 10, 40);
}
function detectarColisiones() {
    if (jugador.y + jugador.radio > pintura.height || jugador.y - jugador.radio < 0) {
        finJuego = true;
    }

    tubos.forEach(tubo => {
        if (jugador.x + jugador.radio > tubo.x && jugador.x - jugador.radio < tubo.x + tuboAncho) {
            if (jugador.y - jugador.radio < tubo.alturaSuperior || jugador.y + jugador.radio > tubo.alturaSuperior + tuboEspacio) {
                finJuego = true;  
            }
        }
    });
}
function actualizarJugador() {
    jugador.velocidadY += jugador.gravedad;
    jugador.y += jugador.velocidadY;
}
function mostrarGameOver() {
    alert('¡Juego Terminado! Tu puntaje fue: ' + puntaje);
    gameOverText.style.display = 'block';
    restartButton.style.display = 'block';
}
function animate() {
    if (finJuego) {
        mostrarGameOver();
        return;
    }
    ctx.clearRect(0, 0, pintura.width, pintura.height);
    dibujarJugador();
    moverTubos();
    dibujarTubos();
    dibujarPuntaje();
    actualizarJugador();
    detectarColisiones();
    requestAnimationFrame(animate);
}
animate();
pintura.addEventListener('click', () => {
    if (!finJuego) {
        jugador.velocidadY = jugador.saltar;
    }
});
restartButton.addEventListener('click', () => {
    finJuego = false;
    puntaje = 0;
    tubos = [];
    jugador.y = 200;
    jugador.velocidadY = 0;
    gameOverText.style.display = 'none';
    restartButton.style.display = 'none';
    animate();
});
