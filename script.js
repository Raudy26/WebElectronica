document.addEventListener('DOMContentLoaded', () => {
    // Array de ejemplo de productos
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
            name: "Protoboard de 830 puntos",
            description: "Ideal para prototipado rápido sin soldaduras.",
            price: 20,
            imageUrl: "imagen/protoboard.jpg" // Ruta local
        }
    ];

    const productListDiv = document.getElementById('product-list');
    const cartCountSpan = document.getElementById('cart-count');
    const sideCart = document.getElementById('side-cart');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const generatePdfBtn = document.getElementById('generate-pdf-btn'); // Botón para generar PDF

    let cart = []; // Array para almacenar los productos en el carrito

    // Función para renderizar los productos
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

    // Función para agregar eventos a los botones "Agregar al Carrito"
    function addCartEventListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = parseInt(event.target.dataset.id);
                addToCart(productId);
            });
        });
    }

    // Función para añadir productos al carrito
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCartDisplay();
        }
    }

    // Función para actualizar la visualización del carrito
    function updateCartDisplay() {
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            generatePdfBtn.disabled = true; // Deshabilitar botón si el carrito está vacío
        } else {
            emptyCartMessage.style.display = 'none';
            generatePdfBtn.disabled = false; // Habilitar botón si hay ítems
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">&times;</button>
                `;
                cartItemsList.appendChild(cartItem);
                total += item.price * item.quantity;
            });
            addCartItemEventListeners(); // Volver a añadir listeners después de renderizar
        }

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;
        cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Función para añadir eventos a los botones de cantidad y eliminar
    function addCartItemEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(button => {
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
        const item = cart.find(i => i.id === productId);
        if (item) {
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease') {
                item.quantity--;
                if (item.quantity <= 0) {
                    removeItemFromCart(productId);
                    return; // Salir para evitar actualizar dos veces si se elimina
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

    // --- Función para generar la cotización en PDF ---
    async function generateQuotePDF() {
        if (cart.length === 0) {
            alert('El carrito está vacío. Agrega productos antes de generar la cotización.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let yPos = 20;
        const margin = 10;
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título de la Cotización
        doc.setFontSize(24);
        doc.text("Cotización de ElectroBits", pageWidth / 2, yPos, { align: "center" });
        yPos += 15;

        // Fecha de la Cotización
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 15;

        // Encabezados de la tabla
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("Producto", margin, yPos);
        doc.text("Cantidad", pageWidth * 0.5, yPos, { align: "center" });
        doc.text("Precio Unit.", pageWidth * 0.7, yPos, { align: "right" });
        doc.text("Subtotal", pageWidth - margin, yPos, { align: "right" });
        yPos += 7;
        doc.line(margin, yPos, pageWidth - margin, yPos); // Línea divisoria
        yPos += 10;
        doc.setFont(undefined, 'normal');

        // Ítems del carrito
        let totalCotizacion = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            doc.text(item.name, margin, yPos);
            doc.text(item.quantity.toString(), pageWidth * 0.5, yPos, { align: "center" });
            doc.text(`$${item.price.toFixed(2)}`, pageWidth * 0.7, yPos, { align: "right" });
            doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
            totalCotizacion += subtotal;
            yPos += 10;
            if (yPos > doc.internal.pageSize.getHeight() - 40) { // Si se acerca al final de la página, añade una nueva
                doc.addPage();
                yPos = 20; // Reiniciar posición Y para la nueva página
                doc.setFontSize(12);
                doc.setFont(undefined, 'bold');
                doc.text("Producto", margin, yPos);
                doc.text("Cantidad", pageWidth * 0.5, yPos, { align: "center" });
                doc.text("Precio Unit.", pageWidth * 0.7, yPos, { align: "right" });
                doc.text("Subtotal", pageWidth - margin, yPos, { align: "right" });
                yPos += 7;
                doc.line(margin, yPos, pageWidth - margin, yPos);
                yPos += 10;
                doc.setFont(undefined, 'normal');
            }
        });

        // Total
        yPos += 10;
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: $${totalCotizacion.toFixed(2)}`, pageWidth - margin, yPos, { align: "right" });
        yPos += 20;

        // Información de la página y derechos
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text("ElectroBits - Tu Tienda de Piezas Electrónicas", pageWidth / 2, yPos, { align: "center" });
        yPos += 7;
        doc.text("&copy; 2025 ElectroBits. Todos los derechos reservados.", pageWidth / 2, yPos, { align: "center" });
        yPos += 7;
        doc.text("Para cualquier consulta, contáctanos a través de nuestra web.", pageWidth / 2, yPos, { align: "center" });

        // Guardar el PDF
        doc.save("Cotizacion_ElectroBits.pdf");
    }

    // Event Listener para el botón de generar PDF
    generatePdfBtn.addEventListener('click', generateQuotePDF);

    // Cargar los productos cuando la página se cargue
    renderProducts();
    updateCartDisplay(); // Inicializar el carrito (estará vacío al principio)

    // Simulación de desplazamiento suave para los enlaces de navegación
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

    // Validar el formulario de contacto (ejemplo básico)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        });
    }
});