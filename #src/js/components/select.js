//Работа с блоком select  из  parts/main_product.html
const select = () => {
    document.querySelectorAll('.select').forEach((selectBlock) => {
        const selectTitle = selectBlock.querySelector('.select__title');
        const selectList = selectBlock.querySelector('.select__list');
        const selectListItem = selectBlock.querySelectorAll('.select__list-item');
        const selectInput = selectBlock.querySelector('.select__input_hidden');

        selectTitle.addEventListener('click', () => {
            selectList.classList.toggle('select__list_active');
        });

        selectListItem.forEach((elem) => {
            elem.addEventListener('click', function (evt) {
                evt.stopPropagation();
                selectTitle.textContent = this.textContent;
                selectInput.value = this.textContent;
                selectList.classList.remove('select__list_active');
            });
        });

        document.addEventListener('click', (e) => {
            if (e.target !== selectTitle) {
                selectList.classList.remove('select__list_active');
            }
        });
    });
};

select();
