//Работа с parts/filter.html
if (document
    .querySelector('.filter-menu__title')) {
    document.querySelector('.filter-menu__title').addEventListener('click', (evt) => {
        // evt.stopPropagation();
        console.log(evt)
        document.querySelector('.navigation').classList.toggle('navigation_active');
        if (document.querySelector('.navigation_active')) {
            document
                .querySelector('.filter-menu')
                .classList.add('filter-menu_border');
            document.querySelector('.filter-menu__title').style.color = '#EF5B70';
            document.querySelector('.filter-menu__icon').style.fill = '#EF5B70';
        } else {
            document.querySelector('.filter-menu__title').style.color = '#000000';
            document.querySelector('.filter-menu__icon').style.fill = '#000000';
            document
                .querySelector('.filter-menu')
                .classList.remove('filter-menu_border');
        }
    });


    document.querySelectorAll('.navigation__group-name').forEach((elem) => {
        elem.addEventListener('click', function (evt) {
            // evt.stopPropagation();
            this.nextElementSibling.classList.toggle('navigation__group-item_active');
        });
    });

    const filterItemsJs = document.querySelectorAll('.filter-items-js');
    filterItemsJs.forEach((elem) => {
        elem.addEventListener('click', function (evt) {
            // evt.stopPropagation();
            this.nextElementSibling.classList.toggle('item-list_active');
        });
    });

    /**
     * Функция следит за чекбоксами с размером.
     * Формирует массив.
     * Скрывает выведенные карточки если они не "подходят",
     * Выводит новые соответствующие введенным символам.
     */
    const filterSize = () => {
        let filteredSize = [];
        let inputCheckbox = document.querySelectorAll('.filter-size__btn_mr-10');
        inputCheckbox.forEach(elem => {
            elem.addEventListener('change', (evt) => {
                if (evt.currentTarget.checked) {
                    filteredSize = filteredSize.concat(productsList.filter((el) => el.sizes === evt.target.value));
                } else {
                    let deleteElem = productsList.filter((el) => el.sizes === evt.target.value)
                    deleteElem.forEach(arrelem => filteredSize.pop(deleteElem))
                }
                if (filteredSize.length) {
                    catalog(filteredSize);
                } else {
                    catalog(productsList)
                }
            })
        });
    };
    filterSize()

//========================================//

    const priceScale = document.querySelector('.filter-price__scale');
    const priceBar = document.querySelector('.filter-price__bar');
    const toggleMin = document.querySelector('.filter-price__toggle_min');
    const toggleMax = document.querySelector('.filter-price__toggle_max');
    const inputTop = document.querySelector('.filter-price__input_top');
    const inputBottom = document.querySelector('.filter-price__input_bottom');

    inputTop.value = 50;
    inputBottom.value = 100;

    const priceMin = 0;
    const priceMax = 300

    let lastPosMin = 0;
    let lastPosMax = 0;

    const distanceValue = (inputValue) => {
        return Math.round(inputValue * priceScale.clientHeight / priceMax)
    }

    const locationToggleMin = (valueMin) => {
        const valueTop = distanceValue(valueMin)
        toggleMin.style.top = `${valueTop}px`;
        priceBar.style.top = `${valueTop}px`;
    }

    const locationToggleMax = (valueMax) => {
        const valueBottom = distanceValue(valueMax)
        toggleMax.style.top = `${valueBottom}px`;
        priceBar.style.bottom = `${priceScale.clientHeight - valueBottom}px`;
    }

    locationToggleMin(inputTop.value);
    locationToggleMax(inputBottom.value)


    //При вводе значения input

    inputTop.addEventListener('input', (inputEvent) => {
        if (+inputEvent.target.value <= (+inputBottom.value - 20) && +inputEvent.target.value >= +priceMin) {
            locationToggleMin(+inputEvent.target.value);
            filterPriceMin(inputEvent.target.value);
        }
    })

    inputBottom.addEventListener('input', (inputEvent) => {
        if (+inputEvent.target.value >= (+inputTop.value + 20) && +priceMax >= +inputEvent.target.value) {
            locationToggleMax(+inputEvent.target.value);
            filterPriceMax(inputEvent.target.value);
        }
    })


    //перемещение мышью и вывод значения в input

    const valueInput = (valueOffsetTop) => {
        return Math.round((valueOffsetTop * priceMax) / priceScale.clientHeight);
    }

    const moveToggleMin = (MouseEvent) => {
        let positionMin = MouseEvent.clientY - lastPosMin;
        let distance = toggleMin.offsetTop + positionMin;
        if (distance >= 0 && distance < toggleMax.offsetTop - 10) {
            toggleMin.style.top = `${distance}px`;
            priceBar.style.top = `${distance}px`;
            lastPosMin = MouseEvent.clientY;
            inputTop.value = valueInput(distance);
            filterPriceMin(inputTop.value);
        }
    };

    const moveToggleMax = (MouseEvent) => {
        let positionMax = MouseEvent.clientY - lastPosMax;
        let distance = toggleMax.offsetTop + positionMax;
        if (toggleMin.offsetTop + 10 < distance && distance <= priceScale.clientHeight) {
            toggleMax.style.top = `${distance}px`;
            priceBar.style.bottom = `${priceScale.clientHeight - distance}px`;
            lastPosMax = MouseEvent.clientY;
            inputBottom.value = valueInput(distance);
            filterPriceMax(inputBottom.value);
        }
    };

    toggleMin.addEventListener('mousedown', function (evt) {
        lastPosMin = evt.clientY;
        this.addEventListener('mousemove', moveToggleMin);
        this.addEventListener('mouseup', mUp);
    });

    toggleMax.addEventListener('mousedown', function (evt) {
        lastPosMax = evt.clientY;
        this.addEventListener('mousemove', moveToggleMax);
        this.addEventListener('mouseup', mUp);
    });

    const mUp = function () {
        this.removeEventListener('mousemove', moveToggleMin);
        this.removeEventListener('mousemove', moveToggleMax);
        this.removeEventListener('mouseup', mUp);
    };


    /**
     * Формирует массив.
     * Выводит карточки соответствующие выбранным значениям.
     */

    const filterPriceMin = (valueMin) => {
        let filteredPrice = [];
        let filteredPriceFin = [];

        filteredPrice = filteredPrice.concat(productsList.filter((el) => +el.price >= +valueMin))
        filteredPriceFin = filteredPriceFin.concat(filteredPrice.filter((el) => +el.price <= +inputBottom.value))

        filteredPriceFin.sort((a, b) => +a.price - +b.price);

        if (filteredPrice.length) {
            catalog(filteredPriceFin);
        } else {
            catalog(productsList);
        }
    };

    const filterPriceMax = (valueMax) => {
        let filteredPrice = [];
        let filteredPriceFin = [];

        filteredPrice = filteredPrice.concat(productsList.filter((el) => +el.price <= +valueMax));
        filteredPriceFin = filteredPriceFin.concat(filteredPrice.filter((el) => +el.price >= +inputTop.value));

        filteredPriceFin.sort((a, b) => +a.price - +b.price);

        if (filteredPrice.length) {
            catalog(filteredPriceFin);
        } else {
            catalog(productsList);
        }
    };
}


//===========================================//


