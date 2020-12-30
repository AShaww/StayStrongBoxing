var cart = {
  items: [],
  total: 0
}
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem('cart') !== null) {
    cart = JSON.parse(localStorage.getItem('cart'));
  }
  $('#checkoutBtn').on('click', () => {
    Swal.fire({
      icon: 'success',
      title: 'Thank you for your Purchase',
      showConfirmButton: false,
      timer: 1500
    })
  })
  checkCartCount();
  setCartTotal();
  goBack()
})

function goBack() {
  const goBack = $('<button>').addClass('btn btn-danger my-2 btn-success col text-center my-3 col-md-12').attr({
    "id": "loadCategories",
    "type": "button"
  }).html('Go Back');

  goBack.on('click', () => {
    Swal.fire({
      title: "Are you sure you want to leave?",
      text: "Leaving will reset the Form",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Continue"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          window.location.href = "index.html"
        )
      }
    })
  })
  $('#cartContainer').prepend(goBack)
}
function checkCartCount() {
  const container = $('#cartContainer');

  if (cart.items.length === 0) {
    $('#checkoutForm').hide();
    $('#cartProducts').hide();
    const emptyAlert = $('<div>').attr({
      "class": "alert alert-info",
      "role": "alert"
    }).html("Cart is EMPTY, go back and add a product to the cart and try again...");

    const goBack = $('<button>').addClass('btn btn-danger my-2 btn-success col text-center').attr({
      "id": "loadCategories",
      "type": "button"
    }).html('Go to Categories');

    goBack.on('click', function () {
      window.location.href = "index.html";
    })

    container.prepend(goBack)
    container.prepend(emptyAlert);
    return;
  }
  container.removeClass("mb-2")
  listCartItems()
}

function listCartItems() {
  let cartCount = 0;
  let cartContainer = $('#cartList');


  cart.items.forEach((cartItem, index) => {   //product called cartItem, with a positional index of where item is
    if (cartItem !== null) {
      cartCount++;
      createCartItem(cartItem, index);
    }
  })
}
function clearElement(element) { //function argument passing into a function() variable.html('')
  $(element).html('');
}
function createCartItem(cartItem, index) {

  let cartContainer = $('#cartList');
  let information = $('<div>').addClass('col-md-7');
  let cartimageContainer = $('<div>').addClass('col-md-3');
  let cartImage = $('<img src="' + cartItem.productImg + '">').attr({
    'width': "75px",
    'height': "auto"
  });

  let cartRow = $('<div>').addClass('row mt-1');
  let infoTitle = $('<h6>').html(cartItem.productTitle);
  let infoPrice = $('<span>').html(cartItem.productPrice);
  let actions = $('<div>').addClass('col-md-2');
  let deleteAction = $('<div>').addClass('float-right h3 text-dark pt-1').html('&#215;').data('dataindex', index); //&#215; represents the "x"


  cartContainer.append(cartRow)
  cartRow.append(cartimageContainer)
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
function resetCart() {
  cart = {
    items: [],
    total: 0
  }
  saveCart();
}
function saveCart(cartCount) {
  $('#cartCount').html(cartCount);
  $('#cartTotalPrice').html('£' + cart.total.toFixed(2));
  localStorage.setItem('cart', JSON.stringify(cart));
}
function setCartTotal() {
  cart.total = 0;
  for (var i = 0; i < cart.items.length; i++) {
    if (cart.items[i] !== null) cart.total += cart.items[i].productPrice;
  }
}
function updateCart() {
  let cartCount = 0;
  let cartContainer = $('#cartList');

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
    checkCartCount();
    saveCart(cartCount);
    return;
  }
  setCartTotal();
  saveCart(cartCount);
}

