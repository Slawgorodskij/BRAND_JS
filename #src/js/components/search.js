const searchInput = document.querySelector('.search-form__field');
let filtered = [];

//todo надо подумать о плавном переходе и исключения обновления страницы

const openSearch = () => {
  const btnSearch = document.querySelector('.search-form__btn');
  btnSearch.addEventListener('click', (e) => {
    searchInput.classList.toggle('search-form__inactive');
  });
};

/**
 * Функция следит за вводом информации в поисковую строку.
 * При вводе текста в строку перебирает массив на совпадение введенных символов.
 * Скрывает выведенные карточки если они не "подходят",
 * Выводит новые соответствующие введенным символам.
 */
const filter = () => {
  searchInput.addEventListener('input', (el) => {
    let valueSearch = searchInput.value;
    const regexp = new RegExp(valueSearch, 'i');
    filtered = productsList.filter((el) => regexp.test(el.name));
    productsList.forEach((elem) => {
      const block = document.querySelector(
        `.product[data-id="${elem.id}"]`
      );
      if (block !== null) {
        if (!filtered.includes(elem)) {
          block.classList.add('invisible');
        } else {
          block.classList.remove('invisible');
        }
      }
      if (block === null && filtered.includes(elem)) {
        let product = renderProduct(elem);
        productItems.insertAdjacentHTML('beforeend', product);
      }
      if (valueSearch === '') {
        let productItem = document.querySelectorAll('.product-item');
        productItem.forEach((el) => {
          el.remove();
        });
        renderPage(productsList);
      }
    });
  });
};

openSearch();
filter();
