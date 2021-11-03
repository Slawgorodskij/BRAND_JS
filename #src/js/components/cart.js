

const allProductsCart = [];
const cartBlock = document.querySelector('.cart-block');

/** Проверяю: обновление страницы, отсутствие "товаров в корзине", наличие информации в
 * localStorage.user; при соблюдении условий отрисовывается корзина.
 * Запускаю deleteProduct(), что бы при отрисовке отработал "querySelectorAll"
 */
const checkMemory = () => {
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.user) {
      let checkProduct = JSON.parse(localStorage.user);
      if (checkProduct.length > 0 && !cartBlock.children[1]) {
        for (let data of checkProduct) {
          allProductsCart.push(data);
        }
        if (!document.querySelector('.main-cart')) {
          const productsListCart = checkProduct.map((item) =>
            renderProductCart(item)
          );
          for (let product of productsListCart) {
            cartBlock.insertAdjacentHTML('beforeend', product);
          }
          initBtnCart();
        }
      }
      updateCartCounter(allProductsCart);
    }
  });
};

/**
 * Отображение корзины при наведении курсора
 * Необходимо подумать, почему при добавлении класса, скрол остается...
 */
const blockCart = () => {
  const itemCart = document.querySelector('.header-icons__cart');
  const cartBlock = document.querySelector('.cart-block');

  if (!document.querySelector('.main-cart')) {

    itemCart.addEventListener('mouseover', () => {
      cartBlock.classList.remove('invisible');
      unScroll();

      if (allProductsCart.length === 0) {
        cartBlock.textContent = 'Товар не выбран';
      }
    });

    itemCart.addEventListener('mouseout', () => {
      document.querySelector('.cart-block').classList.add('invisible');
      recoverScroll();
    });
  }
};

/**
 * отключает скролл и блокирует сдвиг окна
 */
const unScroll = () => {
  const pageWidth = document.documentElement.scrollWidth;
  const scroll = calcScroll();
  document.body.style.overflow = 'hidden';
  document.body.style.marginRight = `${scroll}px`;
  document.querySelector('.header').style.width = `${pageWidth}px`;
};

/**
 * Возвращает на место скролл
 */
const recoverScroll = () => {
  document.body.style.overflow = '';
  document.body.style.marginRight = '';
  document.querySelector('.header').style.width = '100%';
};

/**
 * Определяет размер "скролла"
 * @returns {number}
 */
const calcScroll = () => {
  let div = document.createElement('div');

  div.style.width = '50px';
  div.style.height = '50px';
  div.style.overflowY = 'scroll';
  div.style.visibility = 'hidden';

  document.body.appendChild(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();

  return scrollWidth;
};

const renderProductCart = (item) => {
  return `<figure class="header-cart start-block" data-id="${item.id}">
      <div class="header-cart__photo">
        <img class="header-cart__image" src="${item.mainImage}" alt="${item.name}">
      </div>
      <figcaption class="header-cart__text">
        <svg class="header-cart__button" viewBox="0 0 18 18" width="11" height="11">
          <path d="M11.2453 9L17.5302 2.71516C17.8285 2.41741 17.9962 2.01336 17.9966 1.59191C17.997 1.17045 17.8299 0.76611 17.5322 0.467833C17.2344 0.169555 16.8304 0.00177586 16.4089 0.00140366C15.9875 0.00103146 15.5831 0.168097 15.2848 0.465848L9 6.75069L2.71516 0.465848C2.41688 0.167571 2.01233 0 1.5905 0C1.16868 0 0.764125 0.167571 0.465848 0.465848C0.167571 0.764125 0 1.16868 0 1.5905C0 2.01233 0.167571 2.41688 0.465848 2.71516L6.75069 9L0.465848 15.2848C0.167571 15.5831 0 15.9877 0 16.4095C0 16.8313 0.167571 17.2359 0.465848 17.5342C0.764125 17.8324 1.16868 18 1.5905 18C2.01233 18 2.41688 17.8324 2.71516 17.5342L9 11.2493L15.2848 17.5342C15.5831 17.8324 15.9877 18 16.4095 18C16.8313 18 17.2359 17.8324 17.5342 17.5342C17.8324 17.2359 18 16.8313 18 16.4095C18 15.9877 17.8324 15.5831 17.5342 15.2848L11.2453 9Z"/>
        </svg>
        <p class="header-cart__title">${item.name}</p>
        <p class="header-cart__info">
          Price: <span class="header-cart__info_color product-price">$${
            item.quantity * item.price
          }</span>
        </p>
        <p class="header-cart__info">
          Color: <span class="header-cart__info_pl-7">${item.color}</span>
        </p>
        <p class="header-cart__info">
          Size: <span class="header-cart__info_pl-7">${item.size}</span>
        </p>
        <p class="header-cart__info">
          Quantity: <span class="header-cart__info_border product-quantity">${
            item.quantity
          }</span>
        </p>
      </figcaption>
    </figure>`;
};

/**
 * следит за кнопками "добавления в корзину"
 * @param list данные из JSON (products.json) после отработки fetch.
 * передает объект в addProduct()
 */
const shoppingCart = (list) => {
  let cartBtns = document.querySelectorAll('.product__hover');
  cartBtns.forEach((el) => {
    el.addEventListener('click', (e) => {
      const idx = +e.currentTarget.dataset.id;
      for (let dataProduct of list) {
        if (dataProduct.id === idx) {
          addProduct(dataProduct);
        }
      }
    });
  });
};

/**
 * Запуск функции осуществляется после получения информации из
 * shoppingCart (при клике на карточку) или checkMemory (при перезагрузке страницы)
 * @param item - объект содержащий информацию о товаре
 * запускает:
 * updateCart для отображения в корзине количества товара и стоимости,
 * deleteProduct для начала контроля за кнопками "delete",
 * updateCartCounter для отражения количества товара в корзине.
 */
const addProduct = (item) => {
  if (!document.querySelector('.main-cart')) {
    let find = allProductsCart.find((product) => product.id === item.id);
    if (find) {
      find.quantity++;
      // putJson(allProductsCart);
      localStorage.user = JSON.stringify(allProductsCart);
      let nameClass = 'header-cart';
      updateCart(find, nameClass);
    } else {
      allProductsCart.push(item);
      localStorage.user = JSON.stringify(allProductsCart);
      cartBlock.insertAdjacentHTML('beforeend', renderProductCart(item));
      //  putJson(allProductsCart);
      initBtnCart();
    }
    updateCartCounter(allProductsCart);
  }
};

/**
 * С момента создания карточек товара в корзине следит за кнопками "delete"
 * имеется ошибка (не могу понять почему иногда удаляет по несколько товаров за раз)
 */
const deleteProduct = (btn, transit) => {
  let selectedProduct = JSON.parse(localStorage.user);
  btn.forEach((el) => {
    el.addEventListener('click', (e) => {
      let parent = e.currentTarget.closest('.start-block');
      const idx = parseInt(parent.dataset.id);
      let find = selectedProduct.find((product) => product.id === idx);
      if (find.quantity > 1) {
        find.quantity--;
        localStorage.user = JSON.stringify(selectedProduct);
        updateCart(find, transit);
      } else {
        parent.remove();
        selectedProduct.splice(find, 1);
        localStorage.user = JSON.stringify(selectedProduct);
        if (selectedProduct.length === 0) {
          cartBlock.textContent = 'The product is not selected';
        }
      }
      updateCartCounter(selectedProduct);
    });
  });
};

/**
 * Необходимо проработать общую стоимость
 * @param product - объект содержащий информацию о товаре
 */
const updateCart = (product, name) => {
  let block = document.querySelector(`.${name}[data-id="${product.id}"]`);
  block.querySelector('.product-quantity').textContent = `${product.quantity}`;
  block.querySelector('.product-price').textContent = `$${
    product.quantity * product.price
  }`;
};

/**
 * Запускается из трех функций: checkMemory, addProduct и deleteProduct
 *  * @param data = allProductsCart коллекция объектов с информацией о товаре
 *  создается массив из "quantity" знаячения которых складываются и выводятся на страницу.
 */
const updateCartCounter = (data) => {
  let cartCounter = document.querySelector('.header-cart__counter');
  let allQuantity = [];
  if (!data) {
    cartCounter.textContent = 0;
  }
  data.forEach((item) => allQuantity.push(item.quantity));
  cartCounter.textContent = allQuantity.reduce(
    (sum, current) => sum + current,
    0
  );
};

checkMemory();
blockCart();
burger();
