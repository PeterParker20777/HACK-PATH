
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const characters = "アァイィウヴエェオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\";
const fontSize = 14;

let columns = 0;
let drops = [];
let matrixWidth = 0;
let matrixHeight = 0;

function resizeMatrix() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    matrixWidth = window.innerWidth;
    matrixHeight = window.innerHeight;

    canvas.width = matrixWidth * ratio;
    canvas.height = matrixHeight * ratio;

    canvas.style.width = `${matrixWidth}px`;
    canvas.style.height = `${matrixHeight}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    columns = Math.floor(matrixWidth / fontSize);
    drops = Array.from(
        { length: columns },
        () => Math.random() * (matrixHeight / fontSize)
    );
}

function drawMatrix() {
    ctx.fillStyle = "rgba(5, 8, 7, 0.075)";
    ctx.fillRect(0, 0, matrixWidth, matrixHeight);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const character = characters.charAt(
            Math.floor(Math.random() * characters.length)
        );

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = Math.random() > 0.975
            ? "rgba(150, 255, 190, 0.9)"
            : "rgba(57, 255, 136, 0.65)";

        ctx.fillText(character, x, y);

        if (y > matrixHeight && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i] += 0.45;
    }
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);
let lastFrame = 0;
function matrixLoop(time) {
    if (!document.hidden && time - lastFrame > 45) {
        lastFrame = time;
        drawMatrix();
    }
    requestAnimationFrame(matrixLoop);
}
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(matrixLoop);

