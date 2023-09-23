// banner image slider
const banner__images = document.querySelector(".banner__images");
const banner__bullets = document.querySelector(".banner__bullets");
const banner__next = document.querySelector(".banner__next");
const banner__previous = document.querySelector(".banner__previous");
const banner__text__h2 = document.querySelector(".banner__text h2");

let images__data = [
    {
        src: `images/banner-1.webp`,
        title: "Smart Watches"
    },
    {
        src: `images/banner-2.webp`,
        title: "Phones"
    },
    {
        src: `images/banner-3.jpg`,
        title: "Laptops"
    }
];

for(let i = 0; i < images__data.length; i++) {
    let bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.setAttribute("img-id", i);
    banner__bullets.append(bullet);
}

let bullets = document.querySelectorAll(".bullet");

banner_img_slider(0);

bullets.forEach(ele => {
    ele.onclick = function(e) {
        bullets.forEach(ele => {ele.classList.remove("active-bullet")});
        banner_img_slider(+e.currentTarget.getAttribute("img-id"));
    }
});

banner__next.onclick = function() {
    let active__bullet =  document.querySelector(".active-bullet");
    active__bullet.classList.remove("active-bullet");

    if(+active__bullet.getAttribute("img-id") < (images__data.length - 1)) {
        bullets.forEach((ele) => {
            if(ele.getAttribute("img-id") == (+active__bullet.getAttribute("img-id") + 1)) {
                let next__id = ele.getAttribute("img-id");

                banner_img_slider(next__id);
            }
        });
    } else{
        banner_img_slider(0);
    }
    
}

banner__previous.onclick = function() {
    let active__bullet =  document.querySelector(".active-bullet");
    active__bullet.classList.remove("active-bullet");

    if(+active__bullet.getAttribute("img-id") > 0) {
        bullets.forEach((ele) => {
            if(ele.getAttribute("img-id") == (+active__bullet.getAttribute("img-id") - 1)) {
                let previous__id = ele.getAttribute("img-id");
                banner_img_slider(previous__id);
            }
        });

    } else{
        banner_img_slider(images__data.length - 1);
    }
    
}

function banner_img_slider(index) {
    banner__text__h2.textContent = images__data[index].title;
    banner__images.style.cssText = `background: url(${images__data[index].src}) no-repeat; background-size: cover`;
    bullets[index].classList.add("active-bullet");
}

// search results
const search__container = document.querySelector(".search__container");
const search__container__input = document.querySelector(".search__container input");
const search__btn = document.querySelector(".search__btn");

let search__results = document.createElement("ul"); 

search__container__input.oninput = function() {
    search__container.classList.add("focused");

    let search__word = new RegExp(this.value, "i");
    
    fetch_data("all_products.json").then(res => {
        let results = new Set();

        all_products.forEach(ele => {
            if(ele.title.search(search__word) !== -1){
                results.add(ele.title);
            }
        });

        search__results.className = "search__results list-unstyled p-1";
        search__container.append(search__results);
        search__results.innerHTML = "";

        if(results.size > 1) {
            results.forEach(ele => {
                let result = document.createElement("li");

                result.className = "p-2";
                result.textContent = ele;
                result.setAttribute("product-name", ele);

                search__results.append(result);
            });
        } else{
            search__results.remove();
        }

        let results__items = document.querySelectorAll(".search__results li");

        results__items.forEach(ele => {
            ele.onclick = function() {
                search__container__input.value = ele.getAttribute("product-name");
                search__results.remove();
            }
        });

        if(!this.value) {
            search__results.remove();
        }

    });
}

search__container__input.onblur = function (){
    search__container.classList.remove("focused");
}

search__btn.onclick = function() {
    if(search__container__input.value) {
        display_loading_spinner(products__container);

        fetch_data("all_products.json").then(res => {
            products__container.classList.remove("loading");
            let search__results = document.querySelector(".search__results");
            const results = [];

            all_products.forEach(ele => {
                if(ele.title == search__container__input.value) {
                    results.push(ele);
                }
            });

            if(results.length >= 1) {
                results.forEach(ele => {
                    products__container.classList.remove("no__results");
                    render_products(ele);
                    display_product_preview(ele);
                    set_product_rating();
                    location.href = "#products__section"; 
                    search__container__input.value = "";
                });
                
            } else{
                products__container.classList.add("no__results");
                products__container.innerHTML = "<h3>No Results</h3>";
                location.href = "#products__section"; 
                search__container__input.value = "";
                if(search__results){
                    search__results.remove();
                }
            }

        });
    }

}

// categories 
const categories__cards__container = document.querySelector('.categories__cards__container');
const categories__next = document.querySelector('.categories__next');
const categories__previous = document.querySelector('.categories__previous');

categories__logos.forEach((ele, i) => {
    let category__card = document.createElement("div");
    let category__card__img = document.createElement("img");
    let category__card__hover = document.createElement("div");

    category__card.className = `${ele.name}__category`;
    category__card.setAttribute("category-id", i);
    category__card.setAttribute("name", ele.name);
    category__card__hover.className = "category__card__hover d-flex justify-content-center align-items-center";
    category__card__hover.textContent = ele.name;
    category__card__img.src = ele.src;

    categories__cards__container.append(category__card);
    category__card.append(category__card__img);
    category__card.append(category__card__hover);
});

const category__cards = document.querySelectorAll(".categories__cards__container > div");
let count = 1;

category__cards.forEach(ele => {
    ele.addEventListener("click", () => {

        let category__title = document.querySelector(".products__section h2");
        category__title.textContent = ele.getAttribute("name");

        display_loading_spinner(products__container);
        
        fetch_data("all_products.json").then(res => {
            all_products.forEach(el => {
                if(el.category == ele.getAttribute("name")) {
                    products__container.classList.remove("loading");
                    render_products(el);
                    set_product_rating();
                    display_product_preview();
                    change_currency()
                }
            });
        });
    });
});

categories__next.onclick = function() {
    let categories__card__width = document.querySelector(".categories__cards__container > div").clientWidth + 30;
    categories__cards__container.scrollLeft += categories__card__width;
}

categories__previous.onclick = function() {
    let categories__card__width = document.querySelector(".categories__cards__container > div").clientWidth + 30;
    categories__cards__container.scrollLeft -= categories__card__width;
}

function image_slider_move(element) {
    let translate__length = (element.clientWidth + 30) * count;
    return translate__length;
}

// products
const products__show__more__btn = document.querySelector('.products__show__more__btn');
const products__container = document.querySelector(".products__container");
const displayed__items = new Set();

window.addEventListener("load", () => {
    fetch_data('all_products.json').then(res => {
        for(let i = 0; ; i++) {
            let random__num = Math.trunc(Math.random() * all_products.size);
            if(displayed__items.size == all_products.size) {
                break;
            }else{
                displayed__items.add(random__num);
            }
        }
    
        displayed__items.forEach(index => {
            render_products([...all_products][index]);
        });

        set_product_rating();
        display_product_preview();
    });
    
});

// global function
function render_products(ele) {

    function product_price() {
        let current__currency = JSON.parse(localStorage.getItem("currency"));
        return `${(ele.price * current__currency.rate).toFixed(2)} ${current__currency.name}`;
    }

    function product_rate() {
        if(ele.rating) {
            return ele.rating
        } else{
            return 4;
        }
    }

    let div = document.createElement("div");
    div.className = "product position-relative mx-3 mb-4 ";
    div.setAttribute("product-id", ele.id);
    div.innerHTML = `
        <div class="product__img__container">
            <img src=${img_src(ele)} alt="${ele.title}">
        </div>

        <div class="product__info p-2 ">
            <span class="category__name">${ele.category}</span>
            <h3>${ele.title}</h3>
            <span class="product__price" price-USD="${ele.price}">${product_price()}</span>
        </div>

        <div class="product__discount px-1">${product_discount()}</div>

        <div class="product__rating" rate=${product_rate()}>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
            <i class="fa-regular fa-star"></i>
    </div>`;
        
    products__container.append(div);

    function product_discount() {
        if(ele.discountPercentage) {
            return ele.discountPercentage + " %"
        } else 
        return ""
    }

    let product__discount = document.querySelector(".product__discount");
    if(!product__discount.textContent) {
        product__discount.classList.remove("px-1")
    }
}

function set_product_rating() {
    let product__rating = document.querySelectorAll(".product__rating");

    product__rating.forEach(ele => {
        let rate = Math.ceil(+ele.getAttribute("rate"));
        let product__rating__icons = ele.children;

        for(let i = 0; i < rate; i++) {
            [...product__rating__icons][i].classList.remove("fa-regular");
            [...product__rating__icons][i].classList.add("fa-solid");
        }
    });

}

