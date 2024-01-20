// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("bricked-up JS imported successfully!");
});

const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

togglePassword.addEventListener('click', () => {
  const type = password
    .getAttribute('type') === 'password' ?
    'text' : 'password';
  password.setAttribute('type', type);
  
  togglePassword.classList.toggle('bi-eye')
})