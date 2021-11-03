let items = JSON.parse(localStorage.poductPage);
const renderImagesSlider = (item) => {
    return `<div class ="slider-block__photo">
               <img class ="slider-block__photo-image" src="${item}" alt="photo"/>
            </div>`;
};

const renderSlider = () => {
    if (document.querySelector('.slider')) {
        let listImages = items.productPageImage;
        const imageList = listImages.map(item => renderImagesSlider(item));
        for (let product of imageList) {
            const sliderBlock = document.querySelector('.slider-block');
            sliderBlock.insertAdjacentHTML("beforeend", product);
        }
        document.querySelector('.card__title').textContent = `${items.title}`;
        document.querySelector('.card__name').textContent = `${items.name}`;
        document.querySelector('.card__text').textContent = `${items.description}`;
        document.querySelector('.card__price').textContent = `$${items.price}`;
    }
};

const addCart = () => {
    const cartBtn = document.querySelector('.card__option-button');
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        items.color = document.querySelector('.select__input_hidden[name=select-color]').value;
        items.sizes = document.querySelector('.select__input_hidden[name=select-size]').value;
        items.quantity = parseInt(document.querySelector('.select__input_hidden[name=select-count]').value);

        cartBtn.style.opacity = 0;
        document.querySelector('.card__option').insertAdjacentHTML("beforeend", `<p>The product has been added to the cart</p>`);
        addProduct(items);
        console.log(items);
    });
};

if (document.querySelector('.slider')) {

    renderSlider();
    addCart();
}
