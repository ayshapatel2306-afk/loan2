/**
 * Sweet Slice Cake Shop - JavaScript File
 * Contains: Product data, Search/Filter/Sort logic, Shopping Cart operations,
 * Form validations, Light/Dark mode toggling, Slider, Accordion, and Toast system.
 */

// --- PRODUCT DATA ARRAY ---
const PRODUCTS = [
    {
        id: 1,
        name: "Fudge Chocolate Dream",
        category: "Chocolate Cake",
        price: 24.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
        description: "Rich, decadent chocolate fudge layers topped with silky chocolate ganache.",
        subFlavors: [
            "Chocolate Cake (Classic)",
            "Black Forest",
            "Choco Oreo",
            "Choco Kitkat",
            "Choco Mousse",
            "Choco Truffle"
        ]
    },
    {
        id: 2,
        name: "Classic Black Forest",
        category: "Black Forest",
        price: 26.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60",
        description: "Traditional German style with sour cherries, whipped cream, and shaved chocolate flakes."
    },
    {
        id: 3,
        name: "Velvet Crimson Rose",
        category: "Red Velvet",
        price: 28.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500&auto=format&fit=crop&q=60",
        description: "Elegant red velvet layers paired with our signature creamy vanilla bean frosting."
    },
    {
        id: 4,
        name: "Vanilla Bean Custard",
        category: "Vanilla Cake",
        price: 22.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&auto=format&fit=crop&q=60",
        description: "Fluffy vanilla sponge cake layered with homemade vanilla custard cream."
    },
    {
        id: 5,
        name: "Strawberry Sweetheart",
        category: "Strawberry Cake",
        price: 25.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=60",
        description: "Fresh farm strawberry compote sandwiched between light strawberry sponge layers."
    },
    {
        id: 6,
        name: "Exotic Fruit Carnival",
        category: "Fruit Cake",
        price: 27.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?w=500&auto=format&fit=crop&q=60",
        description: "A colorful topping of glazed kiwi, grapes, peaches, and berries on cream layers."
    },
    {
        id: 7,
        name: "Salted Butterscotch Crunch",
        category: "Butterscotch Cake",
        price: 23.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&auto=format&fit=crop&q=60",
        description: "Buttery sponge with home-cooked butterscotch sauce and crunchy praline pieces."
    },
    {
        id: 8,
        name: "Tropical Pineapple Bliss",
        category: "Pineapple Cake",
        price: 21.99,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1557925923-cd4648e21187?w=500&auto=format&fit=crop&q=60",
        description: "Light and refreshing sponge soaked in sweet pineapple juice and whipped cream."
    },
    {
        id: 9,
        name: "Pastel Cupcake Box (6 pcs)",
        category: "Cupcakes",
        price: 15.99,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60",
        description: "An assortment of velvet, chocolate, and vanilla cupcakes with pastel cream swirls."
    },
    {
        id: 10,
        name: "Golden Birthday Confetti",
        category: "Birthday Special Cake",
        price: 34.99,
        rating: 5,
        image: "https://images.unsplash.com/photo-1533782650963-d601885f3336?w=500&auto=format&fit=crop&q=60",
        description: "Tall confetti celebration cake with colorful sprinkles and a milk chocolate drip."
    }
];

// --- CART STATE ---
let cart = JSON.parse(localStorage.getItem("sweet_slice_cart")) || [];

// --- CONSTANTS FOR FEES ---
const GST_RATE = 0.05; // 5% GST
const DELIVERY_CHARGE = 4.99;

// --- DOM ELEMENTS ---
document.addEventListener("DOMContentLoaded", () => {
    // Nav & Sidebar Elements
    const cartBtn = document.getElementById("cart-btn");
    const mobileCartBtn = document.getElementById("mobile-cart-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCountBadge = document.getElementById("cart-count");
    const mobileCartCountBadge = document.getElementById("mobile-cart-count");
    
    // Price breakdown
    const subtotalEl = document.getElementById("cart-subtotal");
    const gstEl = document.getElementById("cart-gst");
    const deliveryEl = document.getElementById("cart-delivery");
    const totalEl = document.getElementById("cart-total");

    // Product Rendering Elements
    const productsGrid = document.getElementById("products-grid");
    const searchInput = document.getElementById("search-input");
    const sortSelect = document.getElementById("sort-select");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Theme Toggle
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector("i") : null;

    // Custom Order Form Preview
    const imageUploadInput = document.getElementById("ref-image");
    const imagePreviewContainer = document.getElementById("image-preview");

    // Checkout / Place Order / Success elements
    const customOrderForm = document.getElementById("custom-order-form");
    const newsletterForm = document.getElementById("newsletter-form");
    const checkoutModal = document.getElementById("checkout-modal");
    const successModal = document.getElementById("success-modal");
    const closeCheckoutBtn = document.getElementById("close-checkout-btn");
    const closeSuccessBtn = document.getElementById("close-success-btn");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const checkoutTriggerBtn = document.getElementById("checkout-trigger");
    const checkoutSummaryEl = document.getElementById("checkout-summary-items");
    const checkoutTotalEl = document.getElementById("checkout-final-total");
    const checkoutForm = document.getElementById("checkout-form");
    const paymentMethods = document.getElementsByName("payment-method");
    const upiDetails = document.getElementById("upi-details");
    const cardDetails = document.getElementById("card-details");

    // Mobile Menu
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    // Back to top
    const backToTopBtn = document.getElementById("back-to-top");

    // Review Slider
    const reviews = document.querySelectorAll(".review-card");
    const prevReviewBtn = document.getElementById("prev-review");
    const nextReviewBtn = document.getElementById("next-review");

    // Accordion FAQ
    const faqQuestions = document.querySelectorAll(".faq-question");

    // --- APP INITIALIZATION ---
    initTheme();
    renderProducts();
    updateCartUI();
    initSlider();

    // --- THEME TOGGLE ---
    function initTheme() {
        const savedTheme = localStorage.getItem("sweet_slice_theme") || "light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        updateThemeIcon(savedTheme);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            let currentTheme = document.documentElement.getAttribute("data-theme");
            let newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("sweet_slice_theme", newTheme);
            updateThemeIcon(newTheme);
            showToast(`Switched to ${newTheme} mode!`, "success");
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === "dark") {
            themeIcon.className = "fas fa-sun";
        } else {
            themeIcon.className = "fas fa-moon";
        }
    }

    // --- PRODUCT RENDERING WITH SEARCH, FILTER, AND SORT ---
    let currentCategory = "all";
    let searchQuery = "";
    let currentSort = "default";

    function renderProducts() {
        if (!productsGrid) return;
        productsGrid.innerHTML = "";

        // Filter products
        let filtered = PRODUCTS.filter(prod => {
            const matchesCategory = currentCategory === "all" || prod.category === currentCategory;
            const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  prod.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        // Sort products
        if (currentSort === "low-to-high") {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === "high-to-low") {
            filtered.sort((a, b) => b.price - a.price);
        }

        if (filtered.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-cookie-bite"></i>
                    <p>No cakes found matching your selection.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(product => {
            const ratingStars = getStarsHTML(product.rating);
            const card = document.createElement("div");
            card.className = "product-card animate-fade-in";
            
            let subFlavorHTML = '';
            if (product.subFlavors && product.subFlavors.length > 0) {
                subFlavorHTML = `
                    <div class="subflavor-selector-wrapper" style="margin-bottom: 12px; display: flex; flex-direction: column; gap: 5px;">
                        <label style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Select Flavor Option:</label>
                        <select class="product-subflavor-select" style="font-size: 0.85rem; padding: 6px 12px; width: 100%; border-radius: 6px; background-color: var(--bg-primary); border: 1px solid var(--border-color); color: var(--text-primary);">
                            ${product.subFlavors.map(sf => `<option value="${sf}">${sf}</option>`).join('')}
                        </select>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                    <span class="product-badge">${product.category}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-rating">
                        ${ratingStars}
                        <span class="rating-num">(${product.rating})</span>
                    </div>
                    ${subFlavorHTML}
                    <div class="product-footer">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <div class="quantity-control-wrapper">
                            <button class="qty-btn dec-qty-btn" aria-label="Decrease quantity"><i class="fas fa-minus"></i></button>
                            <input type="number" class="qty-input" value="1" min="1" max="10" readonly>
                            <button class="qty-btn inc-qty-btn" aria-label="Increase quantity"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            `;

            // Attach event listeners for quantity control within the card
            const decBtn = card.querySelector(".dec-qty-btn");
            const incBtn = card.querySelector(".inc-qty-btn");
            const qtyInput = card.querySelector(".qty-input");
            const addToCartBtn = card.querySelector(".add-to-cart-btn");

            decBtn.addEventListener("click", () => {
                let currentVal = parseInt(qtyInput.value);
                if (currentVal > 1) {
                    qtyInput.value = currentVal - 1;
                }
            });

            incBtn.addEventListener("click", () => {
                let currentVal = parseInt(qtyInput.value);
                if (currentVal < 10) {
                    qtyInput.value = currentVal + 1;
                }
            });

            addToCartBtn.addEventListener("click", () => {
                const quantity = parseInt(qtyInput.value);
                const subflavorSelect = card.querySelector(".product-subflavor-select");
                const subflavor = subflavorSelect ? subflavorSelect.value : null;
                addToCart(product.id, quantity, subflavor);
                // Reset quantity selector
                qtyInput.value = 1;
            });

            productsGrid.appendChild(card);
        });
    }

    function getStarsHTML(rating) {
        let starsHTML = "";
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHTML += '<i class="fas fa-star text-gold"></i>';
            } else if (i === fullStars + 1 && hasHalf) {
                starsHTML += '<i class="fas fa-star-half-alt text-gold"></i>';
            } else {
                starsHTML += '<i class="far fa-star text-gold"></i>';
            }
        }
        return starsHTML;
    }

    // --- SEARCH AND FILTER ACTIONS ---
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value;
            renderProducts();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            renderProducts();
        });
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });

    // --- CART LOGIC ---
    function addToCart(productId, qty, subFlavor = null) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        let displayName = product.name;
        if (subFlavor) {
            displayName = `${product.name} (${subFlavor})`;
        }

        const existingItem = cart.find(item => item.id === productId && item.subFlavor === subFlavor);
        if (existingItem) {
            existingItem.quantity += qty;
            if (existingItem.quantity > 10) existingItem.quantity = 10;
        } else {
            cart.push({
                id: product.id,
                name: displayName,
                price: product.price,
                image: product.image,
                category: product.category,
                quantity: qty,
                subFlavor: subFlavor
            });
        }

        saveCart();
        updateCartUI();
        showToast(`${displayName} added to cart!`, "success");
    }

    function updateCartUI() {
        // Update Count Badges
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountBadge) {
            cartCountBadge.textContent = totalItems;
            cartCountBadge.style.display = totalItems > 0 ? "flex" : "none";
        }
        if (mobileCartCountBadge) {
            mobileCartCountBadge.textContent = totalItems;
            mobileCartCountBadge.style.display = totalItems > 0 ? "flex" : "none";
        }

        // Render Cart items in Sidebar
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty.</p>
                    <button class="btn btn-outline" id="start-shopping-btn">Start Shopping</button>
                </div>
            `;
            const shopBtn = document.getElementById("start-shopping-btn");
            if (shopBtn) {
                shopBtn.addEventListener("click", () => {
                    closeCart();
                    document.getElementById("cakes").scrollIntoView({ behavior: "smooth" });
                });
            }
            
            // Set prices to zero
            subtotalEl.textContent = "$0.00";
            gstEl.textContent = "$0.00";
            deliveryEl.textContent = "$0.00";
            totalEl.textContent = "$0.00";
            
            if (checkoutTriggerBtn) checkoutTriggerBtn.disabled = true;
            return;
        }

        if (checkoutTriggerBtn) checkoutTriggerBtn.disabled = false;

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartKey = `${item.id}_${item.subFlavor || ''}`;

            const cartItemRow = document.createElement("div");
            cartItemRow.className = "cart-item";
            cartItemRow.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    <div class="cart-item-controls">
                        <div class="quantity-control-wrapper small">
                            <button class="qty-btn cart-dec-btn"><i class="fas fa-minus"></i></button>
                            <input type="number" class="qty-input" value="${item.quantity}" readonly>
                            <button class="qty-btn cart-inc-btn"><i class="fas fa-plus"></i></button>
                        </div>
                        <button class="cart-item-remove-btn" aria-label="Remove item"><i class="far fa-trash-alt"></i></button>
                    </div>
                </div>
            `;

            // Quantity buttons logic
            cartItemRow.querySelector(".cart-dec-btn").addEventListener("click", () => {
                modifyCartItemQuantityByKey(cartKey, -1);
            });
            cartItemRow.querySelector(".cart-inc-btn").addEventListener("click", () => {
                modifyCartItemQuantityByKey(cartKey, 1);
            });
            cartItemRow.querySelector(".cart-item-remove-btn").addEventListener("click", () => {
                removeCartItemByKey(cartKey);
            });

            cartItemsContainer.appendChild(cartItemRow);
        });

        // Price calculations
        const gst = subtotal * GST_RATE;
        const total = subtotal + gst + DELIVERY_CHARGE;

        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        gstEl.textContent = `$${gst.toFixed(2)}`;
        deliveryEl.textContent = `$${DELIVERY_CHARGE.toFixed(2)}`;
        totalEl.textContent = `$${total.toFixed(2)}`;
    }

    function modifyCartItemQuantityByKey(cartKey, delta) {
        const parts = cartKey.split('_');
        const id = parseInt(parts[0]);
        const subFlavor = parts[1] || null;

        const item = cart.find(item => item.id === id && item.subFlavor === subFlavor);
        if (!item) return;

        item.quantity += delta;

        if (item.quantity <= 0) {
            cart = cart.filter(item => !(item.id === id && item.subFlavor === subFlavor));
            showToast("Item removed from cart.", "info");
        } else if (item.quantity > 10) {
            item.quantity = 10;
            showToast("Maximum limit per item is 10.", "warning");
        }

        saveCart();
        updateCartUI();
    }

    function removeCartItemByKey(cartKey) {
        const parts = cartKey.split('_');
        const id = parseInt(parts[0]);
        const subFlavor = parts[1] || null;

        const item = cart.find(item => item.id === id && item.subFlavor === subFlavor);
        cart = cart.filter(item => !(item.id === id && item.subFlavor === subFlavor));
        
        saveCart();
        updateCartUI();
        if (item) {
            showToast(`${item.name} removed.`, "info");
        }
    }

    function saveCart() {
        localStorage.setItem("sweet_slice_cart", JSON.stringify(cart));
    }

    // --- SIDEBAR SLIDE IN/OUT ---
    function openCart() {
        if (cartSidebar) cartSidebar.classList.add("open");
        if (cartOverlay) cartOverlay.classList.add("visible");
        document.body.style.overflow = "hidden"; // disable scroll
    }

    function closeCart() {
        if (cartSidebar) cartSidebar.classList.remove("open");
        if (cartOverlay) cartOverlay.classList.remove("visible");
        document.body.style.overflow = ""; // enable scroll
    }

    if (cartBtn) cartBtn.addEventListener("click", openCart);
    if (mobileCartBtn) mobileCartBtn.addEventListener("click", openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
    if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

    // --- TOAST NOTIFICATIONS ---
    function showToast(message, type = "success") {
        const toastContainer = document.getElementById("toast-container");
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = `toast toast-${type} animate-slide-in-right`;

        let icon = "fa-check-circle";
        if (type === "warning") icon = "fa-exclamation-triangle";
        if (type === "info") icon = "fa-info-circle";
        if (type === "error") icon = "fa-times-circle";

        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Remove toast after animation completes
        setTimeout(() => {
            toast.classList.replace("animate-slide-in-right", "animate-slide-out-right");
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // --- CUSTOM CAKE FORM IMAGE PREVIEW ---
    if (imageUploadInput) {
        imageUploadInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    imagePreviewContainer.innerHTML = `
                        <div class="preview-img-box">
                            <img src="${event.target.result}" alt="Uploaded Reference">
                            <button type="button" class="remove-preview-btn" id="remove-preview-btn">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    `;
                    document.getElementById("remove-preview-btn").addEventListener("click", () => {
                        imageUploadInput.value = "";
                        imagePreviewContainer.innerHTML = "";
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // --- CHOCOLATE SUB-FLAVOR TOGGLE ---
    const custFlavorSelect = document.getElementById("cust-flavor");
    const chocoSubflavorGroup = document.getElementById("choco-subflavor-group");
    const custChocoSubflavor = document.getElementById("cust-choco-subflavor");

    if (custFlavorSelect && chocoSubflavorGroup) {
        custFlavorSelect.addEventListener("change", () => {
            if (custFlavorSelect.value === "Chocolate Cake") {
                chocoSubflavorGroup.style.display = "block";
                if (custChocoSubflavor) custChocoSubflavor.required = true;
            } else {
                chocoSubflavorGroup.style.display = "none";
                if (custChocoSubflavor) {
                    custChocoSubflavor.required = false;
                    custChocoSubflavor.value = "";
                }
            }
        });
    }

    // --- FORM VALIDATION: CUSTOM CAKE ORDER ---
    if (customOrderForm) {
        customOrderForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Simple validation check
            const name = document.getElementById("cust-name").value.trim();
            const phone = document.getElementById("cust-phone").value.trim();
            const address = document.getElementById("cust-address").value.trim();
            const flavor = document.getElementById("cust-flavor").value;
            const chocoSubflavor = custChocoSubflavor ? custChocoSubflavor.value : "";
            const weight = document.getElementById("cust-weight").value;
            const date = document.getElementById("delivery-date").value;
            const time = document.getElementById("delivery-time").value;

            if (!name || !phone || !address || !flavor || !weight || !date || !time) {
                showToast("Please fill out all required custom order fields.", "error");
                return;
            }

            if (flavor === "Chocolate Cake" && !chocoSubflavor) {
                showToast("Please select a chocolate flavor option.", "error");
                return;
            }

            if (!/^\d{10}$/.test(phone.replace(/[\s\-\(\)]/g, ""))) {
                showToast("Please enter a valid 10-digit phone number.", "warning");
                return;
            }

            // Simulate form submission
            const displayFlavor = flavor === "Chocolate Cake" ? `Chocolate Cake (${chocoSubflavor})` : flavor;
            showToast(`Custom cake (${displayFlavor}) request submitted!`, "success");
            customOrderForm.reset();
            if (chocoSubflavorGroup) chocoSubflavorGroup.style.display = "none";
            if (custChocoSubflavor) custChocoSubflavor.required = false;
            if (imagePreviewContainer) imagePreviewContainer.innerHTML = "";
        });
    }

    // --- CHECKOUT & SUCCESS MODAL ACTIONS ---
    if (checkoutTriggerBtn) {
        checkoutTriggerBtn.addEventListener("click", () => {
            if (cart.length === 0) return;
            
            closeCart();
            openCheckoutModal();
        });
    }

    function openCheckoutModal() {
        if (!checkoutModal) return;
        checkoutModal.classList.add("visible");
        document.body.style.overflow = "hidden";

        // Render Checkout Summary
        if (checkoutSummaryEl) {
            checkoutSummaryEl.innerHTML = "";
            let subtotal = 0;

            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                const li = document.createElement("li");
                li.className = "checkout-sum-item";
                li.innerHTML = `
                    <span>${item.name} x ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutSummaryEl.appendChild(li);
            });

            const gst = subtotal * GST_RATE;
            const finalTotal = subtotal + gst + DELIVERY_CHARGE;

            if (checkoutTotalEl) {
                checkoutTotalEl.textContent = `$${finalTotal.toFixed(2)}`;
            }
        }
    }

    function closeCheckoutModal() {
        if (checkoutModal) checkoutModal.classList.remove("visible");
        document.body.style.overflow = "";
    }

    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckoutModal);

    // Payment details fields switcher
    if (paymentMethods) {
        paymentMethods.forEach(radio => {
            radio.addEventListener("change", () => {
                if (radio.value === "upi") {
                    upiDetails.style.display = "block";
                    cardDetails.style.display = "none";
                } else if (radio.value === "card") {
                    upiDetails.style.display = "none";
                    cardDetails.style.display = "block";
                } else {
                    upiDetails.style.display = "none";
                    cardDetails.style.display = "none";
                }
            });
        });
    }

    // Checkout form place order action
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Validate Checkout details
            const shipAddress = document.getElementById("ship-address").value.trim();
            const shipPhone = document.getElementById("ship-phone").value.trim();
            
            if (!shipAddress || !shipPhone) {
                showToast("Please fill in delivery details.", "error");
                return;
            }

            const paymentChoice = document.querySelector('input[name="payment-method"]:checked').value;
            if (paymentChoice === "upi") {
                const upiId = document.getElementById("upi-id").value.trim();
                if (!upiId) {
                    showToast("Please fill in your UPI ID.", "warning");
                    return;
                }
            } else if (paymentChoice === "card") {
                const cardName = document.getElementById("card-name").value.trim();
                const cardNumber = document.getElementById("card-number").value.trim();
                const cardExpiry = document.getElementById("card-expiry").value.trim();
                const cardCvv = document.getElementById("card-cvv").value.trim();
                if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
                    showToast("Please fill in all credit card details.", "warning");
                    return;
                }
            }

            // Order Placement Success!
            closeCheckoutModal();
            openSuccessModal();
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartUI();
        });
    }

    function openSuccessModal() {
        if (successModal) successModal.classList.add("visible");
        document.body.style.overflow = "hidden";
    }

    function closeSuccessModal() {
        if (successModal) successModal.classList.remove("visible");
        document.body.style.overflow = "";
    }

    if (closeSuccessBtn) closeSuccessBtn.addEventListener("click", closeSuccessModal);

    // --- REVIEWS SLIDER ---
    let currentReviewIndex = 0;

    function initSlider() {
        if (reviews.length === 0) return;
        showReview(currentReviewIndex);
    }

    function showReview(index) {
        reviews.forEach((review, i) => {
            review.classList.remove("active");
            if (i === index) {
                review.classList.add("active");
            }
        });
    }

    if (nextReviewBtn) {
        nextReviewBtn.addEventListener("click", () => {
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            showReview(currentReviewIndex);
        });
    }

    if (prevReviewBtn) {
        prevReviewBtn.addEventListener("click", () => {
            currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
            showReview(currentReviewIndex);
        });
    }

    // Auto review rotation
    setInterval(() => {
        if (reviews.length > 0) {
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            showReview(currentReviewIndex);
        }
    }, 6000);

    // --- FAQ ACCORDION ---
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector(".faq-toggle-icon i");

            // Toggle active class on question
            question.classList.toggle("active");

            // Toggle answer layout
            if (answer.style.maxHeight) {
                answer.style.maxHeight = null;
                answer.style.paddingTop = "0";
                answer.style.paddingBottom = "0";
                if (icon) icon.className = "fas fa-plus";
            } else {
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.paddingTop = "15px";
                answer.style.paddingBottom = "15px";
                if (icon) icon.className = "fas fa-minus";
            }
        });
    });

    // --- MOBILE MENU TOGGLE ---
    if (menuToggle) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (navLinks.classList.contains("active")) {
                icon.className = "fas fa-times";
            } else {
                icon.className = "fas fa-bars";
            }
        });
    }

    // Close menu when clicking nav links on mobile
    const linkItems = document.querySelectorAll(".nav-links a");
    linkItems.forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
            }
        });
    });

    // --- SCROLL EFFECTS & BACK TO TOP ---
    window.addEventListener("scroll", () => {
        // Sticky Header Effect
        const header = document.querySelector(".navbar");
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- NEWSLETTER SIGNUP ---
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() !== "") {
                showToast("Thank you for subscribing to Sweet Slice!", "success");
                emailInput.value = "";
            }
        });
    }
});
