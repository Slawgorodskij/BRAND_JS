const productItems = document.querySelector('.product-items');
const productsList = [];
/**
 * Принимает сведения о товаре и создает карточку товара
 * @param {объект: сведения о товаре} item
 * @returns HTML-код карточки товара
 */
const renderProduct = (item) => {
    return `<figure class="product" data-id="${item.id}">
      <div class="product__photo">
        <img class="product__image" src="${item.mainImage}" alt="${item.name}">
        <div class="product__hover product-hover" data-id="${item.id}">
          <button class=" product-hover__border cart-btn" >
            <svg class="product-hover__logo" viewBox="0 0 32 29" width="32" height="29">
               <path d="M1.18 2.36L4.58 2.36L9.41 19.82C9.55 20.33 10.02 20.69 10.55 20.69L25.41 20.69C25.88 20.69 26.3 20.41 26.49 19.98L31.9 7.56C32.06 7.19 32.02 6.78 31.8 6.44C31.58 6.11 31.21 5.91 30.81 5.91L14.4 5.91C13.75 5.91 13.22 6.44 13.22 7.09C13.22 7.74 13.75 8.27 14.4 8.27L29 8.27L24.62 18.32L11.44 18.32L6.61 0.87C6.47 0.35 6 0 5.46 0L1.18 0C0.53 0 0 0.53 0 1.18C0 1.83 0.53 2.36 1.18 2.36ZM9.43 29C10.91 29 12.11 27.8 12.11 26.32C12.11 24.84 10.91 23.64 9.43 23.64C7.95 23.64 6.75 24.84 6.75 26.32C6.75 27.8 7.95 29 9.43 29ZM26.2 29C26.26 29 26.34 29 26.39 29C27.11 28.94 27.76 28.63 28.23 28.07C28.7 27.54 28.92 26.85 28.88 26.12C28.78 24.67 27.5 23.54 26.02 23.64C24.54 23.74 23.44 25.04 23.53 26.5C23.63 27.9 24.8 29 26.2 29Z"/>
            </svg>    
            <span class="product-hover__text">Add to Cart</span>
          </button>
        </div>
      </div>
      <figcaption class="product__text product-text">
        <h2 class="product-text__title">${item.name}</h2>
        <p class="product-text__description">${item.description}</p>
        <h3 class="product-text__price">$${item.price}</h3>
      </figcaption>
    </figure>`;
};

/**
 * При наличии тега с классом 'product-items', отрисовывает на странице карточки товара.
 * dataset.count содержит информацию о количестве карточек на странице
 * @param {объект: сведения о товарах} list
 * Инициирует запуск:
 * transitionPage(list)
 * shoppingCart(list)
 * для собра информации о кнопках в карточках товара и динамическом контроле за ними
 */
const renderPage = (list, num = 1) => {
    if (productItems) {
        const dataCount = +productItems.dataset.count;
        let startRender = (num - 1) * dataCount;
        let endRender = startRender + dataCount;
        const productList = list.map((item) => renderProduct(item));
        let productListRender = productList.slice(startRender, endRender)
        productItems.innerHTML = ''
        for (let product of productListRender) {
            productItems.insertAdjacentHTML('beforeend', product);

        }
    }
    transitionPage(list);
    shoppingCart(list);

};

/**
 * Делает запрос информации, получает сведения о товарах
 * присваивает productsList информацию полученную из "базы"
 * инициирует выполнение функции renderPage() передав в неё
 */
const getJson = () => {
    fetch('../data/products.json')
        .then((response) => response.json())
        .then((data) => {
            for (let list of data) {
                productsList.push(list);
            }
            catalog(data);
            renderPage(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

/**
 * Следит за кнопками в карточках товара
 * При нажатии определяет какой товар выбран (по id товара)
 * информацию о товаре сохраняет в localStorage
 * осуществляет переход на страницу товара
 * @param {*} list
 */
const transitionPage = (list) => {
    const productText = document.querySelectorAll('.product-text');
    productText.forEach((elem) => {
        elem.addEventListener('click', (evt) => {
            const idx = +evt.currentTarget.parentElement.dataset.id;
            for (let dataProduct of list) {
                if (dataProduct.id === idx) {
                    localStorage.poductPage = JSON.stringify(dataProduct);
                    document.location.href = 'product.html';
                }
            }
        });
    });
};

getJson();
