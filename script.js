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
