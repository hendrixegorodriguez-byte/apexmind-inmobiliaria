import { showToast } from '../components/toast.js';
import { APP_CONFIG, ROLES, ROUTES } from '../config/constants.js';
import { navigate } from '../router/router.js';
import { login } from '../services/auth.service.js';

export const loginView = {
  title: 'Ingresar',

  async render() {
    const demoHint = APP_CONFIG.USE_MOCK_API
      ? `<p class="small text-secondary mt-4 mb-0">Demo — administrador: <code>admin@apexmind.test</code> / <code>admin123</code><br>
         cliente: <code>cliente@apexmind.test</code> / <code>cliente123</code></p>`
      : '';
    return `
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="h4 text-white fw-bold mb-4">Iniciar sesión</h1>
        <form id="login-form" novalidate>
          <div class="mb-3">
            <label class="form-label text-light" for="login-email">Correo electrónico</label>
            <input class="form-control form-control-dark" id="login-email" name="email" type="email" autocomplete="username" required>
            <div class="invalid-feedback">Ingresa un correo válido.</div>
          </div>
          <div class="mb-3">
            <label class="form-label text-light" for="login-password">Contraseña</label>
            <input class="form-control form-control-dark" id="login-password" name="password" type="password" autocomplete="current-password" required minlength="6">
            <div class="invalid-feedback">La contraseña debe tener al menos 6 caracteres.</div>
          </div>
          <div class="alert alert-danger py-2 d-none" id="login-error" role="alert"></div>
          <button class="btn btn-gold w-100 py-2" type="submit">Ingresar</button>
        </form>
        ${demoHint}
      </div>
    </div>`;
  },

  mount(root) {
    const form = root.querySelector('#login-form');
    const errorBox = root.querySelector('#login-error');
    const submit = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorBox.classList.add('d-none');
      form.classList.add('was-validated');
      if (!form.checkValidity()) return;

      submit.disabled = true; // evita envíos dobles mientras responde el servidor
      try {
        const { email, password } = Object.fromEntries(new FormData(form));
        const user = await login(email, password);
        showToast(`¡Bienvenido, ${user.name}!`);
        navigate(user.role === ROLES.ADMIN ? ROUTES.DASHBOARD : ROUTES.HOME);
      } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.remove('d-none');
        submit.disabled = false;
      }
    });
  },
};
