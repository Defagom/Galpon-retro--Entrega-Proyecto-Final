const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
const carritoIcono = document.querySelector('.carrito-icono');
const carritoContador = document.querySelector('.carrito-contador');
const carritoDropdown = document.querySelector('.carrito-dropdown');
const carritoItems = document.querySelector('.carrito-items');
const carritoTotal = document.querySelector('.carrito-total');
const vaciarBtn = document.getElementById('vaciar-carrito');

actualizarCarrito();

carritoIcono.addEventListener('click', () => {
    carritoDropdown.classList.toggle('hidden');
});

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
        const nombre = btn.dataset.name;
        const precio = parseFloat(btn.dataset.price);

        const itemExistente = carrito.find(item => item.nombre === nombre);

        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }
        
        actualizarCarrito();
        mostrarMensaje('Producto agregado al carrito!', 'success');
    });
});

vaciarBtn.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
    mostrarMensaje('Carrito vaciado.', 'info');
});

carritoItems.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-item') || event.target.closest('.eliminar-item')) {
        const index = event.target.dataset.index || event.target.closest('.eliminar-item').dataset.index;
        
        if (index !== undefined) {
            carrito.splice(index, 1);
            actualizarCarrito();
            mostrarMensaje('Producto eliminado del carrito.', 'info');
        }
    }
});

function actualizarCarrito() {
    carritoItems.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        carritoItems.innerHTML = '<li>El carrito está vacío.</li>';
    } else {
        carrito.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.nombre} x ${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString('es-AR')} ARS
                <button class="eliminar-item" data-index="${index}" aria-label="Eliminar ${item.nombre}"><i class="fas fa-times"></i></button>
            `;
            carritoItems.appendChild(li);
            total += item.precio * item.cantidad;
        });
    }

    carritoContador.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0); 
    carritoTotal.textContent = total.toLocaleString('es-AR'); 
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add('mensaje-flotante', tipo);
    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.classList.add('show');
    }, 10); 

    setTimeout(() => {
        mensajeDiv.classList.remove('show');
        mensajeDiv.classList.add('hide');
        mensajeDiv.addEventListener('transitionend', () => mensajeDiv.remove()); 
    }, 3000);
}

const contactForm = document.querySelector('.contact-form form');
const emailInput = document.getElementById('email');
const telefonoInput = document.getElementById('telefono');

const emailError = document.createElement('div');
emailError.classList.add('error-message');
emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);

const telefonoError = document.createElement('div');
telefonoError.classList.add('error-message');
telefonoInput.parentNode.insertBefore(telefonoError, telefonoInput.nextSibling);

contactForm.addEventListener('submit', function(event) {
    let formIsValid = true;

    emailError.textContent = '';
    telefonoError.textContent = '';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Por favor, ingresa un email válido (ej: tu@dominio.com).';
        formIsValid = false;
    }

    const telefonoPattern = /^\+?[0-9\s-]{7,20}$/; 
    if (telefonoInput.value.trim() !== '' && !telefonoPattern.test(telefonoInput.value)) {
        telefonoError.textContent = 'Por favor, ingresa un número de teléfono válido (solo números, espacios, guiones y "+" inicial).';
        formIsValid = false;
    }

    if (!formIsValid) {
        event.preventDefault(); 
        mostrarMensaje('Por favor, corrige los errores del formulario para enviarlo.', 'error');
    } else {
        mostrarMensaje('Formulario enviado con éxito. ¡Gracias por tu mensaje!', 'success');
    }
});