export const initializeEventDelegation = () => {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("msg-modal-open")) {
      eventBus.emit("openModal", target.dataset.modal);
    }
    if (target.classList.contains("msg-modal-close")) {
      eventBus.emit("closeModal", target.closest(".modal").id);
    }
  });
  eventBus.on("openModal", (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal && modal.modalInstance) {
      modal.modalInstance.open();
    }
  });
  eventBus.on("closeModal", (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal && modal.modalInstance) {
      modal.modalInstance.close();
    }
  });
};
