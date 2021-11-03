const burger = () => {
    const btnMenu = document.querySelectorAll('.button-menu');
    const divMenu = document.querySelector('.wrapper');
    btnMenu.forEach((el) => {
        el.addEventListener('click', () => {
            divMenu.classList.toggle('wrapper__inactive');
            if (document.querySelector('.wrapper__inactive')) {
                recoverScroll();
            } else {
                unScroll();
            }
        });
    });
};
