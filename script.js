document.addEventListener('DOMContentLoaded', () => {
    // Array de ejemplo de productos (mantén este array)
    const products = [
        {
            id: 1,
            name: "Microcontrolador Arduino UNO R3",
            description: "Placa de desarrollo popular para proyectos de electrónica.",
            price: 1000,
            imageUrl: "imagen/arduino.jpg" // Ruta local
        },
        {
            id: 2,
            name: "Kit de Sensores para Raspberry Pi",
            description: "Paquete de sensores básicos para tus proyectos con Raspberry Pi.",
            price: 10,
            imageUrl: "imagen/kit.jpg" // Ruta local
        },
        {
            id: 3,
            name: "Resistencias de Película Metálica (100 unidades)",
            description: "Valores variados, alta precisión para tus circuitos.",
            price: 1,
            imageUrl: "imagen/resistencia.jpg" // Ruta local
        },
        {
            id: 4,
            name: "Transistor NPN BC547 (50 unidades)",
            description: "Transistor de propósito general para conmutación y amplificación.",
            price: 5,
            imageUrl: "imagen/transistor.jpg" // Ruta local
        },
        {
            id: 5,
            name: "Transistor de potencia Darlignton",
            description: "Ideal para prototipado rápido sin soldaduras.",
            price: 20,
            imageUrl: "imagen/transistor1.jpg" // Ruta local
        },
        {
            id: 6,
            name: "Mosfet N-CH(40 unidades)",
            description: "Mosfet de potencia",
            price: 10,
            imageUrl: "imagen/mosfet.jpg" // Ruta local
        }
    ];

    const productListDiv = document.getElementById('product-list');
    const cartCountSpan = document.getElementById('cart-count');
    const sideCart = document.getElementById('side-cart');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartIconBtn = document.getElementById('cart-icon-btn'); // Nuevo ID
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const emptyCartMessage = document.querySelector('.empty-cart-message');

    let cart = []; // Array para almacenar los productos en el carrito

    // Función para renderizar los productos (sin cambios aquí)
    function renderProducts() {
        productListDiv.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Agregar al Carrito</button>
                </div>
            `;
            productListDiv.appendChild(productItem);
        });
        addCartEventListeners();
    }

    // Función para agregar eventos a los botones "Agregar al Carrito" (sin cambios aquí)
    function addCartEventListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id); // Convertir a número
                addToCart(productId);
            });
        });
    }

    // --- Nuevo: Funciones para el Carrito Lateral ---

    // Función para añadir productos al carrito
    function addToCart(productId) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                cart.push({ ...productToAdd, quantity: 1 });
            }
        }
        updateCartDisplay();
        openSideCart(); // Abrir el carrito lateral al agregar un producto
    }

    // Función para actualizar la visualización del carrito
    function updateCartDisplay() {
        cartItemsList.innerHTML = ''; // Limpiar la lista actual
        let total = 0;
        let totalItemsInCart = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <div class="item-quantity">
                        <button data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">&times;</button>
                `;
                cartItemsList.appendChild(cartItemDiv);
                total += item.price * item.quantity;
                totalItemsInCart += item.quantity;
            });
        }

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        cartCountSpan.textContent = totalItemsInCart; // Actualizar el contador del icono del carrito
        addCartItemEventListeners(); // Añadir listeners para los botones de cantidad y eliminar
    }

    // Función para añadir listeners a los botones dentro de los ítems del carrito
    function addCartItemEventListeners() {
        document.querySelectorAll('.item-quantity button').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id);
                const action = event.target.dataset.action;
                updateItemQuantity(productId, action);
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id);
                removeItemFromCart(productId);
            });
        });
    }

    // Función para actualizar la cantidad de un ítem en el carrito
    function updateItemQuantity(productId, action) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            if (action === 'increase') {
                cart[itemIndex].quantity++;
            } else if (action === 'decrease') {
                cart[itemIndex].quantity--;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1); // Eliminar si la cantidad llega a 0
                }
            }
            updateCartDisplay();
        }
    }

    // Función para eliminar un ítem del carrito
    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartDisplay();
    }

    // Función para abrir el carrito lateral
    function openSideCart() {
        sideCart.classList.add('open');
    }

    // Función para cerrar el carrito lateral
    function closeSideCart() {
        sideCart.classList.remove('open');
    }

    // Event Listeners para el carrito lateral
    cartIconBtn.addEventListener('click', openSideCart);
    closeCartBtn.addEventListener('click', closeSideCart);

    // Cargar los productos cuando la página se cargue
    renderProducts();
    updateCartDisplay(); // Inicializar el carrito (estará vacío al principio)

    // Simulación de desplazamiento suave para los enlaces de navegación (sin cambios aquí)
    document.querySelectorAll('nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - document.querySelector('header').offsetHeight,
                behavior: 'smooth'
            });
        });
    });

    // Validar el formulario de contacto (ejemplo básico) (sin cambios aquí)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        });
    }
});