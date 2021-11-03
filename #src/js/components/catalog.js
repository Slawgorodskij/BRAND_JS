const catalog = (list) => {
    if (document.querySelector('.catalog')) {
        let paginationDynamic = document.querySelector('.product-pagination__dynamic')
        let countElemPage = Math.ceil(list.length / +productItems.dataset.count)
        paginationDynamic.innerHTML = ''
        for (let i = 1; i <= countElemPage; i++) {
            paginationDynamic.insertAdjacentHTML('beforeend', `<div class = "product-pagination__link">${i}</div>`)
        }
        renderPage(list)
        let paginationLink = document.querySelectorAll('.product-pagination__link')
        let backPage = document.querySelector('.back-page')
        let forwardPage = document.querySelector('.forward-page')
        paginationLink.forEach(elem => {
            if (+elem.textContent === 1) {
                elem.classList.add('product-pagination__link_active')
            }
            elem.addEventListener('click', evt => {
                deleteClass(paginationLink)
                evt.target.classList.add('product-pagination__link_active')
                renderPage(list, +evt.target.textContent)
            })
        })
        backPage.addEventListener('click', next => {
            let nextValue = next.target.innerText
            nextPage(nextValue, list, paginationLink, countElemPage)
        })
        forwardPage.addEventListener('click', next => {
            let nextValue = next.target.innerText
            nextPage(nextValue, list, paginationLink, countElemPage)
        })
    }

}

const deleteClass = (elemClass) => {
    elemClass.forEach(elem => {
        elem.classList.remove('product-pagination__link_active')
    })
}

const nextPage = (next, list, nameClass, countElemPage) => {
    console.log(countElemPage)
    let numPage = +document.querySelector('.product-pagination__link_active').textContent
    deleteClass(nameClass)
    switch (next) {
        case'<':
            numPage -= 1;
            break;
        case'>':
            numPage += 1;
            break;
    }
    if (numPage < 1) {
        numPage = countElemPage
    }
    if (numPage > countElemPage) {
        numPage = 1
    }

    nameClass.forEach(elem => {
        if (+elem.textContent === numPage) {
            elem.classList.add('product-pagination__link_active')
        }
        renderPage(list, numPage)
    })
}
