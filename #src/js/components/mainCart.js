let checkProductCart = [];

const renderMainCart = (item) => {
  return `<figure class="cart__product start-block" data-id="${item.id}">
      <div class="cart__photo">
        <img class="cart__image" src="${item.mainImage}" alt="${item.name}">
      </div>
        <figcaption class="cart__text">
        <svg class="cart__text-button" viewBox="0 0 18 18" width="18" height="18">
          <path d="M11.2453 9L17.5302 2.71516C17.8285 2.41741 17.9962 2.01336 17.9966 1.59191C17.997 1.17045 17.8299 0.76611 17.5322 0.467833C17.2344 0.169555 16.8304 0.00177586 16.4089 0.00140366C15.9875 0.00103146 15.5831 0.168097 15.2848 0.465848L9 6.75069L2.71516 0.465848C2.41688 0.167571 2.01233 0 1.5905 0C1.16868 0 0.764125 0.167571 0.465848 0.465848C0.167571 0.764125 0 1.16868 0 1.5905C0 2.01233 0.167571 2.41688 0.465848 2.71516L6.75069 9L0.465848 15.2848C0.167571 15.5831 0 15.9877 0 16.4095C0 16.8313 0.167571 17.2359 0.465848 17.5342C0.764125 17.8324 1.16868 18 1.5905 18C2.01233 18 2.41688 17.8324 2.71516 17.5342L9 11.2493L15.2848 17.5342C15.5831 17.8324 15.9877 18 16.4095 18C16.8313 18 17.2359 17.8324 17.5342 17.5342C17.8324 17.2359 18 16.8313 18 16.4095C18 15.9877 17.8324 15.5831 17.5342 15.2848L11.2453 9Z"/>
        </svg>
        <p class="cart__text-title">${item.name}</p>
        <p class="cart__text-info">Price: 
           <span class="cart__text-info_color product-price">$${
             item.quantity * item.price
           }</span>
        </p>
        <p class="cart__text-info">
          Color: <span class="cart__text-info_pl-7">${item.color}</span>
        </p>
        <p class="cart__text-info">
          Size: <span class="cart__text-info_pl-7">${item.sizes}</span>
        </p>
        <p class="cart__text-info">
          Quantity: <span class="cart__text-info_border product-quantity">${
            item.quantity
          }</span>
        </p>
      </figcaption>
    </figure>`;
};

/**
 * Осуществляется проверка открыта страница корзины
 * если да то запускает функции renderCart() и prices()
 * присваивает переменной checkProductCart массив из localStorage
 */
const pageActivity = () => {
  if (document.querySelector('.main-cart')) {
    checkProductCart = JSON.parse(localStorage.user);
    renderCart();
    prices();
  }
};

/**
 * Отрисовываются карточки корзины, либо выводится надпись, что корзина пуста
 */
const renderCart = () => {
  const divCart = document.querySelector('.cart');
  if (checkProductCart.length === 0) {
    divCart.textContent = 'Your shopping cart is unfortunately empty';
  } else {
    const productsMainCart = checkProductCart.map((item) =>
      renderMainCart(item)
    );
    for (let product of productsMainCart) {
      divCart.insertAdjacentHTML('beforeend', product);
    }
  }
  initBtnCart();
};

/**
 * Для отработки функции deleteProduct инициализируются кнопки удаления и
 * класс элемента с которым функция будет работать
 */
const initBtnCart = () => {
  if (document.querySelector('.main-cart')) {
    const btnMainCart = document.querySelectorAll('.cart__text-button');
    let nameClass = 'cart__product';
    deleteProduct(btnMainCart, nameClass);
  } else {
    const btnHeaderCart = document.querySelectorAll('.header-cart__button');
    let nameClass = 'header-cart';
    deleteProduct(btnHeaderCart, nameClass);
  }
};

/**
 *Считает и выводит общую стоимость выбранных товаров и с учетом скидки.
 */
const prices = () => {
  const subTotal = document.querySelector('.sub-total');
  const grandTotal = document.querySelector('.grand-total');
  let finPrices = [];
  let disPrices = [];

  checkProductCart.forEach((item) =>
    finPrices.push(item.price * item.quantity)
  );
  subTotal.textContent = `$${finPrices.reduce(
    (sum, current) => sum + current,
    0
  )}`;

  checkProductCart.forEach((item) =>
    disPrices.push(
      item.price * item.quantity -
        (item.price * item.quantity * item.discount) / 100
    )
  );
  grandTotal.textContent = `$${disPrices.reduce(
    (sum, current) => sum + current,
    0
  )}`;
};

pageActivity();
