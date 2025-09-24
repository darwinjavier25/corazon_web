const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');

// Variables para la animación
let animationId = null;
let pulsePhase = 0;
const pulseSpeed = 0.02;
const minPulseScale = 0.8;
const maxPulseScale = 1.2;

// Ajustar el tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(1, -1); // Invertir el eje Y para que crezca hacia arriba
}

// Función para dibujar un corazón
function drawHeart(scale, color, lineWidth = 1, pulse = 1) {
    ctx.beginPath();
    
    // Aplicar el efecto de pulso
    const pulseEffect = minPulseScale + (Math.sin(pulsePhase) * 0.5 + 0.5) * (maxPulseScale - minPulseScale);
    const currentScale = scale * pulse * pulseEffect;
    
    // Usamos la misma ecuación paramétrica del código Python
    for (let n = 0; n <= 2 * Math.PI * 10; n += 0.1) {
        const x = 16 * Math.pow(Math.sin(n), 3);
        const y = 13 * Math.cos(n) - 5 * Math.cos(2 * n) - 2 * Math.cos(3 * n) - Math.cos(4 * n);
        
        if (n === 0) {
            ctx.moveTo(x * currentScale, y * currentScale);
        } else {
            ctx.lineTo(x * currentScale, y * currentScale);
        }
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth * (1 + 0.2 * Math.sin(pulsePhase));
    ctx.stroke();
}

// Dibujar un pétalo en orientación vertical (hacia +Y en el sistema actual)
function drawPetal(petalWidth, petalLength, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(petalWidth * 0.6, petalLength * 0.55, 0, petalLength);
    ctx.quadraticCurveTo(-petalWidth * 0.6, petalLength * 0.55, 0, 0);
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1.5;
    ctx.fill();
    ctx.stroke();

    // Línea central (vena del pétalo)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(0, petalLength * 0.55, 0, petalLength);
    ctx.strokeStyle = 'rgba(170, 118, 0, 0.6)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
}

// Función para dibujar un girasol con pétalos animados
function drawSunflower(x, y, baseScale = 1) {
    ctx.save();
    ctx.translate(x, y);

    // Efecto de latido sincronizado con el corazón
    const pulseEffect = minPulseScale + (Math.sin(pulsePhase) * 0.5 + 0.5) * (maxPulseScale - minPulseScale);
    const currentScale = baseScale * pulseEffect;

    const petals = 24;
    const sway = 0.12 * Math.sin(pulsePhase * 0.8); // leve oscilación
    const petalLen = 28 * currentScale;
    const petalWid = 10 * currentScale;

    // Pétalos
    for (let i = 0; i < petals; i++) {
        const angle = i * (2 * Math.PI / petals) + sway;
        ctx.save();
        ctx.rotate(angle);
        drawPetal(petalWid, petalLen, '#FFD54F', '#F9A825');
        ctx.restore();
    }

    // Disco central con degradado radial
    const diskRadius = 12 * currentScale;
    const grad = ctx.createRadialGradient(0, 0, diskRadius * 0.2, 0, 0, diskRadius);
    grad.addColorStop(0, '#6D4C41');
    grad.addColorStop(1, '#3E2723');
    ctx.beginPath();
    ctx.arc(0, 0, diskRadius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Líneas radiales en el disco central
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 213, 79, 0.35)';
    ctx.lineWidth = 1;
    const radialLines = 24;
    for (let i = 0; i < radialLines; i++) {
        const a = (i / radialLines) * Math.PI * 2 + sway * 0.4;
        const inner = diskRadius * 0.25;
        const outer = diskRadius * 0.95;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
        ctx.lineTo(Math.cos(a) * outer, Math.sin(a) * outer);
        ctx.stroke();
    }
    ctx.restore();

    // Tallo
    ctx.beginPath();
    ctx.moveTo(0, -diskRadius);
    ctx.quadraticCurveTo(6 * currentScale, -40 * currentScale, 0, -80 * currentScale);
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hojas
    function drawLeaf(offsetY, flip = 1) {
        ctx.save();
        ctx.translate(0, offsetY);
        ctx.scale(flip, 1);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(18 * currentScale, -8 * currentScale, 26 * currentScale, -20 * currentScale);
        ctx.quadraticCurveTo(14 * currentScale, -8 * currentScale, 0, 0);
        ctx.fillStyle = '#43A047';
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    drawLeaf(-35 * currentScale, 1);
    drawLeaf(-55 * currentScale, -1);

    ctx.restore();
}

// Función para dibujar múltiples corazones concéntricos con efecto de latido
function drawHearts() {
    // Actualizar la fase del pulso
    pulsePhase += pulseSpeed;
    
    // Limpiar el canvas
    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    
    const colors = ['#ff4081', '#ff79b0', '#ffb6c1', '#ffc0cb', '#ffd700'];
    const numHearts = 15; // Número de corazones concéntricos
    const maxScale = 4;   // Escala máxima
    
    // Dibujar cada corazón con un pequeño desfase en la animación
    for (let i = 1; i <= numHearts; i++) {
        const scale = (i / numHearts) * maxScale;
        const color = colors[i % colors.length];
        // Hacer que los corazones más grandes sean más delgados
        const lineWidth = 2 * (1 - (i / (numHearts * 1.5)));
        // Añadir un pequeño desfase a cada corazón para un efecto de onda
        const pulseOffset = i * 0.3;
        drawHeart(scale, color, lineWidth, 1 + 0.1 * Math.sin(pulsePhase + pulseOffset));
    }
    
    // Dibujar un girasol al lado derecho del corazón
    // Ajuste de posición relativo, considerando el tamaño del corazón (hasta ~64 unidades en X con maxScale=4)
    const sunflowerX = 120; // hacia la derecha
    const sunflowerY = 0;   // centrado verticalmente
    drawSunflower(sunflowerX, sunflowerY, 1.2);
    
    // Continuar la animación
    animationId = requestAnimationFrame(drawHearts);
}

// Iniciar o detener la animación
function toggleAnimation() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
        startBtn.textContent = 'Iniciar';
    } else {
        drawHearts();
        startBtn.textContent = 'Detener';
    }
}

// Manejadores de eventos
startBtn.addEventListener('click', toggleAnimation);

resetBtn.addEventListener('click', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    startBtn.textContent = 'Iniciar';
    pulsePhase = 0; // Reiniciar la fase de la animación
});

// Inicialización
window.addEventListener('load', () => {
    resizeCanvas();
    // Mostrar un mensaje inicial
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Haz clic en "Iniciar" para comenzar', 0, 0);
});

// Redimensionar el canvas cuando cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    resizeCanvas();
    // Si la animación está en curso, se redibujará automáticamente
    if (!animationId) {
        // Mostrar un mensaje si la animación no está en curso
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Haz clic en "Iniciar" para comenzar', 0, 0);
    }
});
