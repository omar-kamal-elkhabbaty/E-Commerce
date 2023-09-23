// loading page
window.addEventListener("load", () => {
document.querySelector("main").style.display = "block";
document.querySelector(".loader").style.display = "none";
});

// scroll to top
let scroll__top__btn = document.querySelector(".scroll__top__btn");
window.addEventListener("scroll", () => {
if(scrollY >= 500) {
  scroll__top__btn.classList.add("displayed");
} else{
  scroll__top__btn.classList.remove("displayed");
}
});

// Currency convert
const currency__container = document.querySelector(".currency__container");
const currency__name = document.querySelector(".currency__name");
const currency__logo = document.querySelector(".currency__logo");
const currency__list__ico = document.querySelector(".currency__container i");

const currencies__data = [];

if(localStorage.getItem("currency")) {
let the__currency__data = JSON.parse(localStorage.getItem("currency"));
currency__name.setAttribute("the-rate", the__currency__data.rate);
currency__name.setAttribute("the-currency", the__currency__data.name);
currency__name.textContent = the__currency__data.name;

currency__logo.src = `https://flagcdn.com/w40/${the__currency__data.name.slice(0, the__currency__data.name.length - 1).toLowerCase()}.png`;
currency__logo.alt = the__currency__data.name;
} else{
let usd = {
  name: "USD",
  rate: 1.0
}

localStorage.setItem("currency", JSON.stringify(usd));
}

fetch_data('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=9271916030654b879d5f13f9d079b58c')
.then(res => {  

  for(let i in res.rates) {
    if(['EUR', 'USD', 'GBP', 'EGP'].includes(i)) {
        let cur = {
            name: i,
            rate: res.rates[i],
            logo__src: `https://flagcdn.com/w40/${i.slice(0, i.length - 1).toLowerCase()}.png`
        }
        currencies__data.push(cur);
    }
  }

  let currency__options = document.createElement("ul");
  currency__options.classList.add("currency__options", "list-unstyled", "p-1");

  currencies__data.forEach((ele) => {
    let currency = document.createElement("li"),
        currency__option__logo = document.createElement("img"),
        currency__option__name = document.createElement("span");
    
    currency__option__logo.src = ele.logo__src;
    currency__option__logo.alt = ele.name;

    currency__option__name.textContent = ele.name;
    currency__option__name.setAttribute("the-currency", ele.name);
    currency__option__name.setAttribute("the-rate", ele.rate);

    currency__container.append(currency__options);
    currency.append(currency__option__logo, currency__option__name);
    currency__options.append(currency);
    
    document.querySelector(".cart__items__preview").classList.remove("listed__cart");
  });

  currency__container.addEventListener("click", () => {
    if(!currency__options.classList.contains("listed")) {
        currency__options.classList.add("listed");
        currency__list__ico.className = "fa-solid fa-chevron-up mx-1";
    } else{
        currency__options.classList.remove("listed");
        currency__list__ico.className = "fa-solid fa-chevron-down mx-1";
    }
  });

  let currencies__items = document.querySelectorAll(".currency__options li");
  currencies__items.forEach(ele => {
    ele.addEventListener("click", (e) => {
        currency__options.classList.add("listed");
        currency__logo.src = e.currentTarget.children[0].getAttribute("src");
        currency__logo.alt = e.currentTarget.children[1].textContent;

        currency__name.textContent = e.currentTarget.children[1].textContent;
        currency__name.setAttribute("the-currency", e.currentTarget.children[1].textContent);
        currency__name.setAttribute("the-rate", e.currentTarget.children[1].getAttribute("the-rate"));

        let currency__obj__in__localStorage = {
            name: currency__name.getAttribute("the-currency"),
            rate: currency__name.getAttribute("the-rate")
        };
        
        localStorage.setItem("currency",  JSON.stringify(currency__obj__in__localStorage));

        // change product currency
        let product__prices = document.querySelectorAll(".product__price");
        let current__currency = JSON.parse(localStorage.getItem("currency"));

        product__prices.forEach(ele => {
            let price = +ele.getAttribute("price-USD");
            ele.textContent = (price * current__currency.rate).toFixed(2) + " " + current__currency.name;
        });
    
    });
  });

});

window.addEventListener("load", () => {
let currency__options__items = document.querySelectorAll(".currency__options li");

  currency__options__items.forEach(ele => {
    ele.addEventListener("click", () => {
      let products__price = document.querySelectorAll(".product__price"),
          theCurrency = JSON.parse(localStorage.getItem("currency"));
      
        products__price.forEach(ele => {
            let the_price_USD = parseInt(ele.getAttribute("price-USD"));
            let the_new_price = (the_price_USD * +theCurrency.rate).toFixed(2);
            
            ele.textContent = the_new_price + " " + theCurrency.name;
      });
    });
  })
});

// set categories
const categories__btn = document.querySelector(".categories__btn");
const categories = new Set();
const all_products = new Set();
const categories__logos = [
{
  name: "smartphones",
  src: "images/samrtphones.jpg"
},
{
  name: "electronics",
  src: "images/electronics.jpg"
},
{
  name: "laptops",
  src: "images/laptops.jpg"
},
{
  name: "watches",
  src: "images/watches.webp"
},
{
  name: "shoes",
  src: "images/shoes.png"
},
{
  name: "fragrances",
  src: "images/Fragrances.jpg"
},
{
  name: "skincare",
  src: "images/skincare.jpg"
},,
{
  name: "men's products",
  src: "images/Men's products.jpg"
},    
{
  name: "women's products",
  src: "images/Women's products.jpg"
},
{
  name: "jewelery",
  src: "images/jewelry.webp"
}
];

fetch_data("all_products.json").then(res => {
  res.forEach((ele, i) => {set_products_obj(ele, i)});

  let categories__options = document.createElement("ul");

  categories__options.className = "categories__options p-2 list-unstyled";
  document.querySelector(".categories__container").append(categories__options);

  categories.forEach((ele) => {
    let category = document.createElement("li");
    let category__logo = document.createElement("img");

    category.className = "category p-2";
    category.setAttribute("category", ele);
    category__logo.classList.add("mx-2")

    categories__logos.forEach(el => {
        if(el.name == ele) {
          category__logo.src = el.src;
        }
    });

    category.prepend(category__logo);
    category.append(category__link(ele));

    categories__options.append(category);
  });


  function set__categories__logos(category, data) {
    data.forEach(el => {
        if(el.name == category) {
            let category__logo = document.createElement("img");
            category__logo.src = el.src;

            return category__logo;
        }
    })
  }


  function category__link(txt) {
    let category__link = document.createElement("a");
    category__link.classList.add("text-decoration-none");
    category__link.href = `#categories__section`;
    category__link.text = txt;

    return category__link;
  }

  categories__btn.onclick = function() {
    if(!categories__options.classList.contains("listed")) {
        categories__options.classList.add("listed");
    } else {
        categories__options.classList.remove("listed");
    }
  }

  let categories__items = document.querySelectorAll(".category");

  categories__items.forEach(ele => {
    ele.onclick = function(e) {
        categories__options.classList.remove("listed");
    }
  });

}); 

// product preview
function display_product_preview() {
  let products = document.querySelectorAll(".product");

  products.forEach(ele => {
    ele.addEventListener("click", () => {
        // display the container 
        document.body.classList.add("overlay");
        // render product
        render_preview(ele);
    });
  });
}

// cart items
const cart__items = new Set();
let saved__cart__items = localStorage.getItem("cart-items");
let cart__ico = document.querySelector(".cart__ico");

if(saved__cart__items) {
  JSON.parse(saved__cart__items).forEach(ele => {cart__items.add(ele)});
}

cart_items_num();

cart__ico.onclick = function() {
  let cart__items__preview = document.querySelector(".cart__items__preview"),
      localStorage__data = JSON.parse(localStorage.getItem("cart-items"));

  if(localStorage__data && localStorage__data.length >= 1) {
    display_cart_preview();
  } else{
    cart__items__preview.classList.remove("listed__cart");
  }
}


// ==== Global function ====

function fetch_data(url) {
const req = fetch(url).then(res => res.json());
return req;
}

function set_products_obj(element, index) {
all_products.add(element);
element.id = index;

if(["Pants","Jackets","Hoodies","Jackets","Hoodies","T-shirt","Jackets","T-shirt","Jackets", "T-shirts"].includes(element.category)) {
  element.category = "men's products";
}

categories.add(element.category);
}

function change_currency() {
  let currencies__items = document.querySelectorAll(".currency__options li");
  
  currencies__items.forEach(ele => {
      ele.addEventListener("click", () => {
          let product__prices = document.querySelectorAll(".product__price");
          let current__currency = JSON.parse(localStorage.getItem("currency"));

          product__prices.forEach(ele => {
              let price = +ele.getAttribute("price-USD");
              ele.textContent = (price * current__currency.rate).toFixed(2) + " " + current__currency.name;
          });
      });
  });

}

function render_preview(element) {
  let product__preview = document.querySelector(".product__preview");

  display_loading_spinner(product__preview);

  fetch_data("all_products.json").then(res => {
    let product__id = +element.getAttribute("product-id"),
        product__obj = [...all_products][product__id];

    product__preview.innerHTML = `
    <i class="product__details__close fa-solid fa-xmark p-2"></i>

    <div class="product__images">
        <div class="main__image__container p-3"></div>

        <div class="product__images__pagination mt-3">
            <div class="images__pagination__container px-2"></div>
            <div class="images__pagination__control next d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-angle-right"></i>
            </div>
            <div class="images__pagination__control previous d-flex justify-content-center align-items-center">
                <i class="fa-solid fa-angle-left"></i>
            </div>
        </div>
    </div>

    <div class="product__details p-2">
        <h2 class="py-1">${product__obj.title}</h2><hr class="m-0">
        <div class="product__description mb-4 mt-3">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam sint itaque saepe beatae, facilis dolorem ipsa ut, accusantium temporibus minima nisi ex porro vel deserunt quae autem voluptates eum ipsam Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laboriosam sint itaque saepe beatae</div>

        <div>
            <div class="product__details__price">
                <span class="the__current__price">
                    <span class="currency__value" product-price="${(product__obj.price * JSON.parse(localStorage.getItem("currency")).rate).toFixed(2)}">
                    ${(product__obj.price * JSON.parse(localStorage.getItem("currency")).rate).toFixed(2)}</span>
                    <span class="currency__name">${JSON.parse(localStorage.getItem("currency")).name}</span>
                </span>
                <del class="the__old__price mx-2"></del>
            </div>

            <p class="availability mb-4">
                Availability : <span>${product_stock()}</span>
            </p>

        </div>

        <div class="product__sale mt-5">
        <button class="add__to__cart py-2 px-3" product-id=${product__obj.id}>
            <i class="fa-solid fa-cart-shopping mx-2  text-decoration-none"></i>
            Add To Cart
        </button>

      </div>

    </div>`;

    // elements functions
      // main image
      const main__image__container = document.querySelector(".main__image__container");
      let main__image = document.createElement("img");

      main__image.className = 'main__image';
      main__image.alt = "product-image";
      main__image.src = img_src(product__obj);
      main__image__container.append(main__image);
      // image zoom
      main__image__container.onmousemove = function(e) {
          let x = (e.clientX - main__image__container.offsetWidth) / main__image__container.offsetWidth * 100,
              y = (e.clientY - main__image__container.offsetHeight) / main__image__container.offsetHeight * 100;

          main__image.style.transform = `translate(${-x}%, ${-y}%) scale(2.4)`;
      }

      main__image__container.ontouchmove = function(e){
          let x = (e.clientX - main__image__container.offsetWidth) / main__image__container.offsetWidth * 100,
              y = (e.clientY - main__image__container.offsetHeight) / main__image__container.offsetHeight * 100;

          main__image.style.transform = `translate(${-x}%, ${-y}%) scale(2)`;
      }

      main__image__container.addEventListener("mouseleave", (e) => {
          main__image.style.transform = `translate(0, 0) scale(1)`;
      });

      // product images pagination
      const images__pagination__container = document.querySelector(".images__pagination__container");
      set_images_pagination();
      pagination_control();
      pagination_images_select();

      // close preview container
      let product__details__close = document.querySelector(".product__details__close");
      product__details__close.onclick = function() {document.body.classList.remove("overlay");}
      product__preview.classList.remove("loading");

      // images slider
      const images__pagination__container__images = document.querySelectorAll(".images__pagination__container img");
      const next = document.querySelector(".next");
      const previous = document.querySelector(".previous");

      if(next && previous) {

          next.onclick = function() {
            let active__image = document.querySelector(".active__image"),
                active__image__id = +active__image.getAttribute("image-id");

              images__pagination__container__images.forEach(ele => {
                images__pagination__container.scrollLeft += 20;

                if(+ele.getAttribute("image-id") == (active__image__id + 1)) {
                  images__pagination__container__images.forEach(ele => {ele.classList.remove("active__image")});
                  ele.classList.add("active__image");
                  main__image.src = ele.src;
                }
              });
          }

          previous.onclick = function() {
            let active__image = document.querySelector(".active__image"),
              active__image__id = +active__image.getAttribute("image-id");
              
            images__pagination__container__images.forEach(ele => {
              images__pagination__container.scrollLeft -= 20;

              if(+ele.getAttribute("image-id") == (active__image__id - 1)) {
                images__pagination__container__images.forEach(ele => {ele.classList.remove("active__image")});
                ele.classList.add("active__image");
                main__image.src = ele.src;
              }
            });
          }

      }

      // old price
      let the__old__price = document.querySelector(".the__old__price");
      the__old__price.textContent = product_price_before_discount();

      // add to cart
      let add__to__cart = document.querySelector(".add__to__cart");

      add__to__cart.onclick = function(e) {
        let item = +e.currentTarget.getAttribute("product-id");

        if(localStorage.getItem("cart-items")) {
          let update__items = new Set( JSON.parse(localStorage.getItem("cart-items")));
          update__items.add(item);
          localStorage.setItem("cart-items", JSON.stringify([...update__items]));
        } else{
          cart__items.add(item);
          localStorage.setItem("cart-items", JSON.stringify([...cart__items]));
        }

        cart_items_num();
      }


    // functions 
    function product_price_before_discount(){
        if(product__obj.discountPercentage) {
            let currency__value = +document.querySelector(".currency__value").textContent;
            let old__price = (currency__value / ((100 - product__obj.discountPercentage))) * 100;

            return old__price.toFixed(2)

        } else if(product__obj.old_price){
          return product__obj.old_price
          
        } else{
          return "";
        }
    }
    
    function product_stock() {
        if(product__obj.stock) {
            return product__obj.stock;
        } else{
            return "Many In Stock"
        }
    }

    function set_images_pagination() {
        if(Array.isArray(product__obj.images)) {
            product__obj.images.forEach((el, i) => {
              let pagination__img = document.createElement("img");
              pagination__img.className = "p-2 pagination__image";
              pagination__img.setAttribute("image-id", i);
              pagination__img.src = el;
              pagination__img.alt = "image_pagination";
              images__pagination__container.append(pagination__img);
            });
        } else{
          let pagination__img = document.createElement("img");
          pagination__img.className = "p-2 pagination__image";
          pagination__img.setAttribute("image-id", 0);
          pagination__img.src = product__obj.images;
          pagination__img.alt = "image_pagination";
          images__pagination__container.append(pagination__img);
        }
    }

    function pagination_control() {
        let images__pagination__container__images = document.querySelectorAll(".images__pagination__container img"),
          images__pagination__control = document.querySelectorAll(".images__pagination__control");
        
        if(images__pagination__container__images.length <= 2) {
          images__pagination__control.forEach(ele => ele.remove());
        }

    }

    function pagination_images_select() {
      let pagination__images = document.querySelectorAll(".pagination__image");
      pagination__images[0].classList.add("active__image");

      pagination__images.forEach(ele => {
        ele.onclick = function(e) {
          pagination__images.forEach(ele => {ele.classList.remove("active__image")});
          e.currentTarget.classList.add("active__image");
          // change the main image
          let main__image = document.querySelector(".main__image");
          main__image.src = e.currentTarget.src;
        }
      });
    }

  });
}

function display_loading_spinner(container) {
  container.innerHTML = "";
  container.classList.add("loading");
  container.innerHTML = `<section class="products__loader justify-content-center align-items-center">
    <div class="spinner-border text-primary spinner-border-sm"
    role="status">
    <span class="visually-hidden"></span>
    </div>
  </section>`;
}

function cart_items_num() {
  let cart__items__num = document.querySelector(".cart__items__num");
  if(localStorage.getItem("cart-items")) {
    cart__items__num.textContent = JSON.parse(localStorage.getItem("cart-items")).length
  }
}

function img_src(element) {
  if(Array.isArray(element.images)) {
      return element.images[0]
  } else{
      return element.images;
  }
}

function display_cart_preview() {
  let cart__items__preview = document.querySelector(".cart__items__preview"),
      items__id = JSON.parse(localStorage.getItem("cart-items")),
      currency = JSON.parse(localStorage.getItem("currency"));
  // display list
  cart__items__preview.classList.toggle("listed__cart");  
  // loading 
  cart__items__preview.classList.add("loading");
  cart__items__preview.innerHTML = `
    <div class="cart__loader justify-content-center align-items-center">
        <div class="spinner-border text-primary spinner-border-sm"
        role="status">
        <span class="visually-hidden">Loading...</span>
        </div>
    </div>`;

  fetch_data("all_products.json").then(res => {
    // reset content
    cart__items__preview.classList.remove("loading");
    cart__items__preview.innerHTML = `
    <div class="cart__items position-relative pb-3"></div>

    <div class="cart__summary position-relative pt-2">
      <div class="cart__summary__total pb-3">
        Cart Total : <span class="mx-2"></span>
      </div>
      <button class="view__cart__btn py-2 px-3">
        <i href="#" class="fa-solid fa-cart-shopping mx-2 text-decoration-none"></i>
        Order Now
      </button>
    </div>`;

    let cart__items = document.querySelector(".cart__items");
  // render items 
    items__id.forEach(ele => {
      let item = [...all_products][+ele];
      let product__item = document.createElement("div");

      product__item.className = "cart__item position-relative my-3 pb-3";
      product__item.setAttribute("product-id", ele);

      product__item.innerHTML = `
        <i class="fa-solid fa-xmark"></i>
        <div class="cart__item__img__container p-2">
          <img src=${img_src(item)} alt="product-image" product-id=${ele}>
        </div>
        <div class="cart__item__info">
          <h2>${item.title}</h2>

          <div class="cart__item__sale d-flex justify-content-between align-items-center mt-4">
            <div class="cart__item__price">${(currency.rate * item.price).toFixed(2)} ${currency.name}</div>

            <div class="product__count d-flex justify-content-between" max-quantity="10">
              <div class="increase__btn d-flex justify-content-center align-items-center py-1"><i class="fa-solid fa-chevron-up"></i></div>
              <span product-price=${(currency.rate * item.price).toFixed(2)} product-id=${item.id}>1</span>
              <div class="decrease__btn d-flex justify-content-center align-items-center py-1"><i class="fa-solid fa-chevron-down"></i></div>
            </div>
          </div>
        </div>
      </div>`

      cart__items.append(product__item);
    });


// functions  
  // delete item
    let del__btn = document.querySelectorAll(".cart__item .fa-xmark");
      cart__items = new Set(JSON.parse(localStorage.getItem("cart-items")));

    del__btn.forEach(ele => {
      ele.onclick = function() {
        let product__id = +ele.parentElement.getAttribute("product-id");
        // remove from local storage
        ele.parentElement.remove();
        cart__items.delete(product__id);
        localStorage.setItem("cart-items", JSON.stringify([...cart__items]));
        // update num of cart items
        cart_items_num();
        // no items 
        let product__items = document.querySelectorAll(".cart__item");
        if(product__items.length === 0) {
          cart__items__preview.classList.remove("listed__cart");
          cart__items = new Set();
          localStorage.setItem("cart-items", JSON.stringify([...cart__items]));
        } 
        // total price
        total_price()
    }
    });

    // product quantity
    let increase__btn = document.querySelectorAll(".increase__btn"),
        decrease__btn = document.querySelectorAll(".decrease__btn");
    
    increase__btn.forEach(ele => {
      let product__count__num = ele.nextElementSibling;
      ele.onclick = function() {
        if(+product__count__num.textContent < +ele.parentElement.getAttribute("max-quantity")){
          product__count__num.textContent++;
        }
        total_price();
      }
    });
    
    decrease__btn.forEach(ele => {
      let product__count__num = ele.previousElementSibling;
      ele.onclick = function() {
        if(+product__count__num.textContent > 1){
          product__count__num.textContent--;
        }
        total_price();
      }
    }); 

    // total price
    total_price();
  
    function total_price() {
      let product__count__num = document.querySelectorAll(".product__count span"),
          cart__summary__total = document.querySelector(".cart__summary__total span");
      const bill = [];

      product__count__num.forEach(ele => {
        let total__price = (ele.textContent * ele.getAttribute("product-price"))
        ele.setAttribute("total-price", total__price);
        bill.push(+ele.getAttribute("total-price"));
      });

      const total = bill.reduce((initial, ele) => {
        return initial + ele;
      }, 0);

      cart__summary__total.textContent = total.toFixed(2) + ` ${currency.name}`;
    
    }

    // open product preview
    let cart__item__img__container = document.querySelectorAll(".cart__item__img__container img");
    cart__item__img__container.forEach(ele => {
      ele.onclick = function(e) {
        cart__items__preview.classList.remove("listed__cart");
        // display the container 
        document.body.classList.add("overlay");
        // render product
        render_preview(e.currentTarget);
      }
    });


  });

}


