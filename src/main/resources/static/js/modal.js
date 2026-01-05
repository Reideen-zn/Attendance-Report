// Управление модальным окном
function openModal() {
  const modal = document.getElementById('itemModal');
  modal.classList.add('show');
}

function closeModal() {
  const modal = document.getElementById('itemModal');
  modal.classList.remove('show');
  currentEditId = null;
}

function setModalTitle(title) {
  document.getElementById('modalHeader').textContent = title;
}

function setModalForm(htmlForm) {
  document.getElementById('itemForm').innerHTML = htmlForm;
}

function getModalFormData() {
  const form = document.getElementById('itemForm');
  const formData = new FormData(form);
  const data = {};
  for(let [key, value] of formData) {
    data[key] = value;
  }
  return data;
}

// Закрыть модалку при клике на overlay и ESC
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('itemModal');
  if(modal) {
    modal.addEventListener('click', (e) => {
      if(e.target === modal) closeModal();
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
});
