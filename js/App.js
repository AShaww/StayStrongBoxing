/**
 *      cart can be manipulated in the console by typing: "cart.items[index].property = {value}"
 *      You can then save this by entering "saveCart();" in the console
 *      this is a perfect example of to never trust user data
 */

// global scope
var categories = null;
var cart = {
    items: [],
    total: 0
}
const goBack = $('<button>').addClass('btn btn-danger my-2 btn-success col text-center my-3 col-md-12').attr({
    "id": "loadCategories",
    "type": "button",
    "aria-label": "Go Back"
}).html('Go Back');
// run when page is loaded
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('cart') !== null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    saveCart();
    setCheckoutAction()
    $.ajax({
        type: "GET",
        url: "js/products.json",
        success: function (response) {
            categories = response;
            loadItems(response);
        },
        dataType: "JSON",
    });

    $('#loadCategories').on('click', () => {
        clearElement('#item-container');
        clearElement('.footerLink')
        loadItems(categories);
    });

    $("#cart").on("click", () => {
        $(".shopping-cart").fadeToggle("fast");
    });

    $('#navLogo').on('click', () => {
        clearElement('#item-container');
        clearElement('.footerLink')
        loadItems(categories);
    });
    $('#brand').on('click', () => {
        clearElement('#item-container');
        clearElement('#footerLink');
        loadItems(categories);
    });
    updateCart();

});

function setCheckoutAction() {
    // if cart length = 0   sweatalert show...
    $('#goCheckout').off().on('click', () => {  //Add appropriate validtion on control to action  
        if (cart.items.length > 0) {
            window.location.href = "checkout.html"
        } else {
            swal('Empty Cart', ' No item in Cart', 'info');
        }
    })
}
function clearElement(element) { //function argument passing into a function() variable.html('')
    $(element).html('');
}

// load category and display each product on the page
function loadCategory(category) {
    for (let i = 0; i < categories.Categories.length; i++) {
        if (categories.Categories[i].Type === category) {
            category = categories.Categories[i];
            break;
        }
    }
    $('#item-container').prepend(goBack)
    goBack.on(' click', () => {
        clearElement('#item-container');
        clearElement('.footerLink')
        loadItems(categories);
    })

    category.Products.Available.forEach((product) => {
        createItem(product);
    });
}

// load each category as a bootstrap card and show on the page
function loadItems(response) {
    clearElement('#navbarLinks')
    response.Categories.forEach((category) => createCategoryItem(category));
}
// create a cart item 
function createCartItem(cartItem, index) {

    let cartContainer = $('#cartContainer');
    let cartRow = $('<div>').addClass('row mt-1');
    let cartimageContainer = $('<div>').addClass('col-md-3');
    let cartImage = $('<img src="' + cartItem.productImg + '">').attr({
        'width': "75px",
        'height': "auto",
        'alt': cartItem.productTitle
    });
    let information = $('<div>').addClass('col-md-7');
    let infoTitle = $('<div>').html(cartItem.productTitle);
    let infoPrice = $('<div>').html(cartItem.productPrice);
    let actions = $('<div>').addClass('col-md-2');
    let deleteAction = $('<div>').addClass('float-right h3 text-dark pt-1').html('&#215;').data('dataindex', index); //&#215; represents the "x"

    cartContainer.append(cartRow);
    cartRow.append(cartimageContainer);
    cartRow.append(information);
    cartRow.append(actions);

    cartimageContainer.append(cartImage);

    information.append(infoTitle);
    information.append(infoPrice);
    actions.append(deleteAction);

    // this is used to track each product in the cart array
    deleteAction.on('click', () => {
        cart.items[index] = null;
        updateCart();
    });
}

// create a bootstrap card for each category item
function createItem(product) {

    let cardContainer = $("<div>").addClass("col-md-4 my-3");
    let card = $("<div>").addClass("card")
    let cardHeader = $("<div>")
        .addClass("card-header")
        .html(product.productTitle) //Cannot decide on .substring(0,46) either looks like error or on resize looks good... I'll leave it as it is
    let cardImg = $('<img src="' + product.productImg + '" width="100%" height="100%" id="product-image-main">')
        .addClass("product-main-image").attr({
            "alt": product.productTitle + " Product"
        });

    let viewBtn = $('<input>')
        .addClass('btn btn-dark btn-block btn-sm')
        .attr({
            "type": "button",
            "value": "View Product",
            "aria-label": "View Product"
        })
        .html(JSON.stringify(product.sizesAvailable));

    let cardBody = $("<div>").addClass("card-body");

    cardContainer.append(card);
    card.append([cardHeader, cardBody]);
    cardBody.append([cardImg, viewBtn]);

    $(viewBtn).on('click', () => {
        showItem(product);
    })

    $("#item-container").append(cardContainer);
}
// create a bootstrap card for each category
function createCategoryItem(category) {
    let navContainer = $("#navbarLinks");
    let container = $("<div>").addClass("col-md-4");
    let card = $("<div>").addClass("card mb-4 box-shadow border border-success");

    let cardImage = $('<img src="' + category.Image + '">').addClass("card-img-top img-fluid p-4").css({
        'width': "350px",
        'height': "300px"
    }).attr({
        'alt': category.Type + "Category"
    });

    let middleFooter = $('#footerLinks');
    let midFootNav = $('<li>').attr({
        'href': "#",
        'class': "footerLink",
        "aria-label": "Shop " + category.Type + " Bottom Nav Link"
    }).html(category.Type).on("click", () => {
        $("#item-container").html("");
        loadCategory(category.Type);
    });
    //could have used middleFooter.append(navLI) at the bottom // did not work. overwrote the top nav.
    middleFooter.append(midFootNav)

    let navLi = $('<li>').attr({
        'href': "#",
        'class': "nav-link",
        "aria-label": "Shop " + category.Type + " Top Nav Link"
    }).html(category.Type).on("click", () => {
        $("#item-container").html("");
        loadCategory(category.Type);
    });

    let cardBody = $("<div>").addClass("card-body");
    let categoryText = $("<p>").addClass("card-text").html(category.Description);
    let categoryBtns = $("<div>").addClass("d-flex justify-content-between align-items-center");
    let btnGroup = $("<div>").addClass("btn-group");

    let showButton = $("<input>").addClass("btn btn-dark btn-lg").attr({
        type: "button",
        name: category.Type + "Btn",
        id: category.Type + "Btn",
        value: "Shop " + category.Type,
        "aria-label": "Shop " + category.Type
    });

    showButton.on("click", () => {
        clearElement('#item-container');
        loadCategory(category.Type);
    });

    navContainer.append(navLi)  //appending nav items to navbar
    container.append(card);
    card.append(cardImage);
    card.append(cardBody);
    cardBody.append(categoryText);
    cardBody.append(categoryBtns);
    categoryBtns.append(btnGroup);
    btnGroup.append(showButton);

    $("#item-container").append(container);
}

function resetCart() {
    cart = {
        items: [],
        total: 0
    }
    saveCart();
}
// save cart to local storage
function saveCart(cartCount) {
    $('#cartCount').html(cartCount);
    $('#cartTotalPrice').html('£' + cart.total.toFixed(2));
    localStorage.setItem('cart', JSON.stringify(cart));
}

// set total of cart price
function setCartTotal() {
    cart.total = 0;
    for (var i = 0; i < cart.items.length; i++) {
        if (cart.items[i] !== null) cart.total += cart.items[i].productPrice;
    }
}

// display an individual item on the page
function showItem(product) {
    let container = $('#item-container');
    container.html('');
    container.addClass('bg-white pt-2 rounded');

    $('#item-container').prepend(goBack)
    goBack.on(' click', () => {
        clearElement('#item-container');
        clearElement('.footerLink')
        loadItems(categories);
    })


    let imageContainer = $('<div class="col-md-5 text-center">');
    let image = $('<img src="' + product.productImg + '">').addClass('p-3').attr({
        'id': "mainProductImage",
        'height': '75%',
        'width': '100%',
        'aria-label' : product.productTitle
    });

    let informationContainer = $('<div class="col-md-7">')

    let title = $('<p>').html('Name: ' + product.productTitle).attr({
        'aria-label' : product.productTitle
    });
    let brand = $('<p>').html('Brand: ' + product.productBrand).attr({
        'aria-label' : product.productBrand
    });
    let stockStatus = $('<p>').html('Stock: ' + product.stockAvailability).attr({
        'aria-label' : product.stockAvailability
    });
    let description = $('<p>').html('Description: ' + product.productDescription).attr({
        'aria-label' : product.productDescription
    });
    let price = $('<p>').html('Price: £' + product.productPrice).attr({
        'aria-label' : product.productPrice
    });
    let splitter = $('</hr>').addClass('border-dark');
    let sizeLabel = $('<p id="selectSize">').html('Select size:');

    let dropdown = $('<select>').addClass('form-control').attr({
        'id': 'quantitySelect',
        "aria-label": "Select Size/Weight from dropdown"
    });

    let smallImage = $('<div>').attr({
        "width": "100%",
        "display": "flex",
        "justify-content": "space-between",
        'aria-label' : product.productTitle
    });


    let buyBtn = $('<button>').addClass('btn btn-dark btn-block mt-2').attr({
        'type': 'button',
        'value': 'Add to cart',
        "aria-label": "Add to Cart Button"
    }).html('Add to cart');




    container.append(imageContainer);
    container.append(informationContainer);
    imageContainer.append(image);
    imageContainer.append(smallImage);

    informationContainer.append(title);
    informationContainer.append(brand);
    informationContainer.append(stockStatus);
    informationContainer.append(price);
    informationContainer.append(description);
    informationContainer.append(splitter);

    // if a product has different sizes then show a dropdown which the user
    // can select the size they want
    if (product.sizesAvailable.length > 0) {
        informationContainer.append(sizeLabel);
        informationContainer.append(dropdown);
        product.sizesAvailable.forEach((size) => {

            let dropdownItem = $('<option>').attr({
                'value': size
            }).html(size);
            dropdown.append(dropdownItem);
        });
    }

    // if a product has other images then display them below the main image
    if (product.smallImages.length > 0) {
        // iterate over each small image and append them to a div below the main product image
        product.smallImages.forEach((image) => {

            let thumbImage = $('<img src="' + image + '">').attr({
                'width': '90px',
                'height': 'auto',
                'cursor': 'pointer',
                'class': 'border rounded',
            });

            smallImage.append(thumbImage);

            // replace main image on hover with small image
            // this uses a small image to speed up page loading but actually loads a high resolution image
            // so the user has a clearer image
            thumbImage.hover(() => {
                $('#mainProductImage').attr({
                    'src': thumbImage[0].src.replace('72x', '500x500')
                });
            });
        });
    }
    informationContainer.append(buyBtn);

    // this adds the product to the users cart
    buyBtn.on('click', () => {
        cart.items.push(product);
        swal('success', product.productTitle + ' was added to your basket', 'success');
        updateCart();

    });
    $(container).append(imageContainer);
    $(container).append(informationContainer);
}

// update cart on page to indicate the total price and a nice list of
// each product the user has put into the cart
// this is NOT secure and should not be trusted in a prod environment
function updateCart() {
    let cartCount = 0;
    let cartContainer = $('#cartContainer');

    clearElement(cartContainer);

    cart.items.forEach((cartItem, index) => {
        if (cartItem !== null) {
            cartCount++;
            createCartItem(cartItem, index);
        }
    });

    // display alert to indicate the cart is empty
    if (cartCount === 0) {

        resetCart();
        clearElement(cartContainer);

        let cartRow = $('<div>').addClass('row');
        let cartCol = $('<div>').addClass('col-md-12');
        let cartEmptyAlert = $('<div>').addClass('alert alert-info').html('Your cart is empty');
        cartRow.append(cartCol);
        cartCol.append(cartEmptyAlert);
        cartContainer.prepend(cartRow);

        saveCart(cartCount);
        return;
    }

    setCartTotal();
    saveCart(cartCount);
    setCheckoutAction();
}

//FOOTER Modals
// function createModal(){ 
//     let modHeader = $('.modal-header');
//     let modBody = $('.modal-body');
//     let modPara = $('<p>').addClass('modalText');

//     $('#aboutUs').on('click',() =>{
//         modPara.html("textttttt")
//         modBody.append(modPara)
//     })
// }
// function createCheckout() {
//     const cont = $('#container')
//     const formTitle = $('<h2>').html("Checkout form");
//     const checkInstruction = $('<p>').attr({
//         "class":"lead"
//     }).html("Stay Strong Checkout form.");

//     const row = $('<div>').addClass("col-sm-6");
//     const billing = $('<h4>').addClass('mb-3').html("Billing Address");

//     const lblBilling = $('<label>').attr({
//         "for": "firstName",
//         "class": "form-label",
//         "placeholder":"John"
//     }).html("First Name")

//     const billingInput = $('<input>').attr({
//         "id": "lastName",
//         "class": "form-control",
//         "type": "text"
//     })
// 
//     
// cont.append(checkInstruction)
// }
// createCheckout()
// Modal for Links at the bottom of the screen, price promise delivery etc. 
// Not enough time, 