/* SECRET EASTER EGGS */

const easterEggStyle = document.createElement("style");

easterEggStyle.textContent = `
    .egg-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        pointer-events: none;
        overflow: hidden;
        isolation: isolate;
        background: rgba(0, 0, 0, 0.88);
        animation: eggFadeIn .5s ease;
    }

    @keyframes eggFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .egg-rain-item {
        position: absolute;
        top: -100px;
        font-size: 30px;
        animation: eggRainFall linear forwards;
        will-change: transform;
    }

    .egg-duck {
        filter: grayscale(1) brightness(0);
    }

    @keyframes eggRainFall {
        from {
            transform: translateY(-100px) rotate(0deg);
        }
        to {
            transform: translateY(115vh) rotate(360deg);
        }
    }

    .egg-giant {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: clamp(110px, 22vw, 230px);
        transform: translate(-50%, -160vh) scale(0.5);
        animation: eggGiantDrop 1.3s cubic-bezier(.2,.8,.2,1) forwards;
        will-change: transform;
    }

    @keyframes eggGiantDrop {
        0% {
            transform: translate(-50%, -160vh) scale(0.5) rotate(-25deg);
        }
        75% {
            transform: translate(-50%, -43%) scale(1.12) rotate(8deg);
        }
        88% {
            transform: translate(-50%, -52%) scale(.95) rotate(-5deg);
        }
        100% {
            transform: translate(-50%, -50%) scale(1) rotate(0);
        }
    }

    .egg-burst {
        animation: eggBurst .35s ease-out forwards;
    }

    @keyframes eggBurst {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.8) rotate(25deg);
        }
    }

    .egg-particle {
        position: absolute;
        left: 50%;
        top: 50%;
        font-size: clamp(25px, 5vw, 55px);
        animation: eggParticleFly 1.15s cubic-bezier(.15,.7,.3,1) forwards;
        will-change: transform, opacity;
    }

    @keyframes eggParticleFly {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(.3) rotate(0);
        }
        100% {
            opacity: 0;
            transform:
                translate(
                    calc(-50% + var(--move-x)),
                    calc(-50% + var(--move-y))
                )
                scale(1.3)
                rotate(var(--rotation));
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .egg-rain-item,
        .egg-giant,
        .egg-particle {
            animation-duration: .01ms !important;
        }
    }
`;

document.head.appendChild(easterEggStyle);

let eggRunning = false;
let typingBuffer = "";
let typingTimer = null;

function createEasterEgg(type) {
    if (eggRunning) return;

    eggRunning = true;
    typingBuffer = "";

    const isDuck = type === "blackduck";
    const mainEmoji = isDuck ? "🦆" : "🕷️";
    const particleEmoji = isDuck ? "🦆" : "🕷️";

    const overlay = document.createElement("div");
    overlay.className = "egg-overlay";

    document.body.appendChild(overlay);

    const rainItems = [];

    for (let i = 0; i < 65; i++) {
        const item = document.createElement("span");

        item.className = "egg-rain-item" + (isDuck ? " egg-duck" : "");
        item.textContent = mainEmoji;
        item.style.left = `${Math.random() * 100}%`;
        item.style.animationDuration = `${1.8 + Math.random() * 2.8}s`;
        item.style.animationDelay = `${Math.random() * 2}s`;
        item.style.fontSize = `${20 + Math.random() * 25}px`;

        overlay.appendChild(item);
        rainItems.push(item);
    }

    setTimeout(() => {
        rainItems.forEach(item => item.remove());

        const giant = document.createElement("span");

        giant.className = "egg-giant" + (isDuck ? " egg-duck" : "");
        giant.textContent = mainEmoji;

        overlay.appendChild(giant);

        setTimeout(() => {
            giant.classList.add("egg-burst");

            for (let i = 0; i < 32; i++) {
                const particle = document.createElement("span");

                const angle = Math.random() * Math.PI * 2;
                const distance = 160 + Math.random() * 360;

                particle.className = "egg-particle" + (isDuck ? " egg-duck" : "");
                particle.textContent = particleEmoji;

                particle.style.setProperty(
                    "--move-x",
                    `${Math.cos(angle) * distance}px`
                );

                particle.style.setProperty(
                    "--move-y",
                    `${Math.sin(angle) * distance}px`
                );

                particle.style.setProperty(
                    "--rotation",
                    `${Math.random() * 720 - 360}deg`
                );

                overlay.appendChild(particle);
            }

            setTimeout(() => {
                overlay.remove();
                eggRunning = false;
            }, 1400);

        }, 1450);

    }, 5000);

}

document.addEventListener("keydown", event => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;

    if (eggRunning) return;

    const target = event.target;

    if (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    ) {
        return;
    }

    if (event.key === "Backspace") {
        typingBuffer = typingBuffer.slice(0, -1);
        return;
    }

    if (event.key.length !== 1) return;

    typingBuffer += event.key.toLowerCase();
    typingBuffer = typingBuffer.slice(-11);

    if (typingBuffer.endsWith("blackduck")) {
        createEasterEgg("blackduck");
    } else if (typingBuffer.endsWith("peterparker")) {
        createEasterEgg("peterparker");
    }

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
        typingBuffer = "";
    }, 2500);
});
