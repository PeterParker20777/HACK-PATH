/* INFORMATION MODAL */

const modal = document.getElementById("infoModal");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");

function openModal() {
    modal.classList.add("show");
}

function closeModal() {
    modal.classList.remove("show");
}

document.getElementById("loginButton").addEventListener("click", event => {
    event.preventDefault();
    openModal();
});

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeModal();
    }
});

