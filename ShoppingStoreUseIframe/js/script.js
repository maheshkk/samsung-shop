
var listItem = [];
var itemsInCart = getItemsInCartFromSessionStorage();
var isItemInCartAlready = getIsItemInCartAlreadyFromSessionStorage();
var subtotal = getSubtotalFromSessionStorage();
var isLogged = getIsLoggedFromSessionStorage();
var itemSummaryLen;
var iframe = document.getElementById("iframe");

window.onmessage = function (e) {
  let str = "";
  if (e.data === false) {

    str = "<h2>Payment failed</h2>";
  } else {
    str = "<h2>Payment successful</h2>";
    itemsInCart = [];
    isItemInCartAlready = [];
    subtotal = 0;
    sessionStorage.clear();
    sessionStorage.setItem('isLogged', JSON.stringify(true));
  }
  genNoticeMessage(str);
  showPaymentSuccess();
};


function genNoticeMessage(str) {

  document.getElementById("payment-messages").innerHTML = "";

  $("payment-messages").append(str);
}

window.onload = function () {

  initData();
  drawData();
  renderAds();
  generateCart();
  generateCartCount();


  if (isLogged === true) {
    hideLoginButton();
  } else {
    showLoginButton();
  }
}

function onClickLogout() {
  showLoginButton();
  sessionStorage.clear();
}

function reload() {

  generateCart();
  generateCartCount();
  viewMaincontent();

}

function onClickLogin() {
  hideLoginButton();
  isLogged = true;
  sessionStorage.setItem('isLogged', JSON.stringify(isLogged));
  $("#login-modal").modal("hide");
}

function showLoginButton() {
  document.getElementById("login").style.display = 'block';
  document.getElementById("logout").style.display = 'none';
}

function hideLoginButton() {
  document.getElementById("login").style.display = 'none';
  document.getElementById("logout").style.display = 'block';
}

function getIsLoggedFromSessionStorage() {
  let isLogged = false;
  if (sessionStorage.getItem("isLogged") !== null) {
    isLogged = JSON.parse(sessionStorage.getItem("isLogged"));
  }

  return isLogged;
}

function generateCartCount() {
  document.getElementById("cart-count").innerHTML = "";
  let count = 0;

  for (let i = 0; i < itemsInCart.length; i++) {
    count += itemsInCart[i].quantity;
  }
  $("cart-count").append(count);
  // $('#cart-count').text(count);
}


function getSubtotalFromSessionStorage() {

  let total = 0;

  if (sessionStorage.getItem("subtotal") !== null) {
    total = JSON.parse(sessionStorage.getItem("subtotal"));
  }

  return total;
}

function getIsItemInCartAlreadyFromSessionStorage() {

  let arr = [];

  if (sessionStorage.getItem("isItemInCartAlready") !== null) {
    arr = JSON.parse(sessionStorage.getItem("isItemInCartAlready"));
  }

  return arr;
}

function getItemsInCartFromSessionStorage() {

  let arr = [];

  if (sessionStorage.getItem("itemsInCart") !== null) {
    arr = JSON.parse(sessionStorage.getItem("itemsInCart"));
  }

  return arr;
}

function genAndShowCart() {
  generateCart();
  showCart();
}

function showCart() {
  // ads_cover
  document.getElementById("eps").style.display = 'none';
  document.getElementById("main-content").style.display = 'none';
  document.getElementById("foot-image").style.display = 'none';
  document.getElementById("head-image").style.display = 'none';
  document.getElementById("your-cart").style.display = 'block';
  document.getElementById("payment").style.display = 'none';

}

function showPaymentSuccess() {
  document.getElementById("eps").style.display = 'none';
  document.getElementById("payment").style.display = 'block';
  document.getElementById("main-content").style.display = 'none';
  document.getElementById("foot-image").style.display = 'none';
  document.getElementById("head-image").style.display = 'none';
  document.getElementById("your-cart").style.display = 'none';
}

function viewMaincontent() {
  document.getElementById("eps").style.display = 'block';
  document.getElementById("payment").style.display = 'none';
  document.getElementById("your-cart").style.display = 'none';
  document.getElementById("foot-image").style.display = 'block';
  document.getElementById("head-image").style.display = 'block';
  document.getElementById("main-content").style.display = 'block';
}

function removeCartItem(index) {
  subtotal = 0;
  isItemInCartAlready[itemsInCart[index].id] = false;
  itemsInCart.splice(index, 1);
  for (var i = 0; i < itemsInCart.length; i++) {
    subtotal += itemsInCart[i].total;
  }
  sessionStorage.setItem('isItemInCartAlready', JSON.stringify(isItemInCartAlready));
  sessionStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
  generateCart();
  generateCartCount();
}

function genSingleProductModal(i) {
  document.getElementById("single-modal").innerHTML = "";
  let str = '<div class="modal fade" id="single-product-modal" role="dialog" style="margin-top: 100px"> <div class="modal-dialog">';
  str += '<div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal">&times;</button>';
  str += ' </div> <div class="modal-body"> <div class="product-image"> <img src="images/item' + i + '.jpg"> </div> </div> <div class="modal-footer">';
  str += ' <div> <button type="button" class="col-xs-6 btn btn-primary" onclick="addToCart(' + i + ');"> ';
  str += 'Add to cart </button> </div> <div> <button type="button" class="col-xs-6 btn btn-success" onclick="onclickBuyNow(' + i + ');"> Buy now </button> </div> </div> </div> </div> </div> </div>';
  $("single-modal").append(str);

}


function addToCart(index) {

  if (isItemInCartAlready[index] === true) {//increase quantity +1

    for (var i = 0; i < itemsInCart.length; i++) {
      if (index === itemsInCart[i].id) {
        itemsInCart[i].quantity = itemsInCart[i].quantity + 1;
      }
    }
  } else {
    var id = index;
    var sourceImage = listItem[index].sourceImage;
    var price = listItem[index].price;
    var quantity = 1;
    var itemName = listItem[index].itemName;
    var tempItem = new CartItem(id, sourceImage, price, quantity, itemName);
    itemsInCart.push(tempItem);
    isItemInCartAlready[index] = true;
  }

  subtotal = 0;
  for (var i = 0; i < itemsInCart.length; i++) {
    subtotal += itemsInCart[i].total;
  }

  sessionStorage.setItem('isItemInCartAlready', JSON.stringify(isItemInCartAlready));
  sessionStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));
  generateCartCount();
  $("#single-product-modal").modal("hide");
}


function onclickBuyNow(index) {
  console.log(iframe);
  if (isLogged === false) {
    $("#single-product-modal").modal("hide");
    $("#login-modal").modal("show");
  } else {
    $("#single-product-modal").modal("hide");
    itemSummary = [];
    itemSummary.push({
      'label': listItem[index].itemName + ' x ' + 1,
      'value': listItem[index].price
    });

    itemSummaryLen = itemSummary.length;

    // iframe.contentWindow.setup(itemSummary, listItem[index].price.toString());

    let data = {};
    data['itemSummary'] = itemSummary;
    data['totalPrice'] = listItem[index].price.toString();
    iframe.contentWindow.postMessage(data, 'https://maheshkk.github.io/samsung-shop/sdcspay/');
  }
}

function onchangeQuantity(index) {
  var newQuantity = parseInt(document.getElementById("item-quantity" + itemsInCart[index].id).value);

  itemsInCart[index].quantity = newQuantity;
  itemsInCart[index].total = newQuantity * itemsInCart[index].price;

  subtotal = 0;
  for (var i = 0; i < itemsInCart.length; i++) {
    subtotal += itemsInCart[i].total;
  }
  sessionStorage.setItem('itemsInCart', JSON.stringify(itemsInCart));

  generateCart();
  generateCartCount();
}

function renderAds() {

  var text_content = '<div class="ads2" "> <a title="" target="_blank" href="#">';
  text_content += '<img style="width : 100%;" src="ads/tuy1485935553.gif" ></a><a title="Mua banner trên myad.vn"';
  text_content += 'style="padding: 0px;text-align: center;text-decoration : none;font-size:10px;z-index:5;position : absolute;top:0px;right:-118px;"';
  text_content += 'target="_blank" href="#"><img style="min-height:17px;min-width:142px;width:142px;height:17px;max-height:17px;max-width:142px;"';
  text_content += 'src="ads/qmd1374489846.png"></a></div><a  title="" style="position: fixed;bottom: 10px;right: 10px;z-index: 1000;" target="_blank" href="#"><img style=""';
  text_content += 'src="ads/zpd1484017901.gif"></a>';

  var div_ads = document.createElement('div');

  div_ads.innerHTML = text_content;
  div_ads.id = "ads_cover";


  eps.appendChild(div_ads);

}


// function onMouseEnterProductCart(index) {
//   let str = 'product-card-' + index;
//   document.getElementById(str).style.visibility = 'visible';
// }

// function onMouseLeaveProductCart() {
//   let str = 'product-card-' + index;
//   document.getElementById(str).style.visibility = 'hidden';
// }

function generateCart() {

  document.getElementById("itemsInCart").innerHTML = "";

  var str = "<table id='cart' class='table table-hover table-condensed'> <thead> <tr>  ";
  str += "</tr> </thead> <tbody>";

  for (var i = 0; i < itemsInCart.length; i++) {
    str += "<tr style='padding-bottom: 2em;'> <td style='text-align: center'> <div class='card'><img class='card-img-top' src='images/cart" + itemsInCart[i].id;
    str += ".png' alt='' style='max-height: 151px; float: left;margin-bottom: 35px;'> <div class='card-block' style='display: inline-table;'>";
    str += " <h4 class='card-title' style='font-weight: bold'>" + (itemsInCart[i].itemName);
    str += " <i style='font-weight: lighter; color: brown'>x</i><input id='item-quantity" + itemsInCart[i].id;
    str += "' style='width: 25px; font-weight: lighter; border: none; color: brown' type='number' value='" + itemsInCart[i].quantity;
    str += "' min='1' pattern='[1-9]*' onchange='onchangeQuantity(" + i + ")'></input> </h4> <p style='color: red'>$" + itemsInCart[i].total;
    str += "</p> <button type='button' class='btn btn-info' onclick='removeCartItem(" + i + ")'>Remove</button> </div> </div> </td> </tr>";
  }

  str += "</tbody> <tfoot> <tr class='visible-xs'> <td class='text-center'><hr><strong>Total: " + subtotal + "</strong>";
  str += "</td> </tr> <tr> <td><a onclick='viewMaincontent();' class='btn btn-warning'><i class='fa fa-angle-left'></i>";
  str += " Continue Shopping</a></td> <td colspan='2' class='hidden-xs'></td> <td class='hidden-xs text-center'><strong>Total $" + subtotal;
  str += "</strong></td> <td><a onclick='onClickCheckoutButton()' class='btn btn-success btn-block'>";
  str += "Checkout <i class='fa fa-angle-right'></i></a></td> </tr> </tfoot> </table>";
  $("itemsInCart").append(str);
  generateCartCount();
  sessionStorage.setItem('subtotal', JSON.stringify(subtotal));
}

function onClickCheckoutButton() {
  if (isLogged === false) {
    $("#login-modal").modal("show");
  } else {
    onClickPay();
  }
}


function ShopItem(id, sourceImage, price, isChecked, itemName) {
  this.id = id;
  this.sourceImage = sourceImage;
  this.price = price;
  this.isChecked = isChecked;
  this.itemName = itemName;
}

function CartItem(id, sourceImage, price, quantity, itemName) {
  this.id = id;
  this.sourceImage = sourceImage;
  this.price = price;
  this.quantity = quantity;
  this.total = quantity * price;
  this.itemName = itemName;
}

function initData() {

  for (var i = 0; i < 4; i++) {
    var id = i;
    var sourceImage = "images/tshirt" + (i + 1) + ".jpg";
    var price;
    // var price = (i + 1) * (Math.floor(Math.random() * 100) + 1000);
    var isChecked = false;
    var itemName = "";

    if (i === 0) {
      itemName = "Gear 360";
      price = 129.00;
    }
    if (i === 1) {
      itemName = "Gear S2";
      price = 9.99;
    }
    if (i === 2) {
      itemName = "S8 blue see";
      price = 749.11;
    }
    if (i === 3) {
      itemName = "S8 violet";
      price = 745.11;
    }

    var shopItem = new ShopItem(id, sourceImage, price, isChecked, itemName);
    listItem.push(shopItem);
  }

}

function showSingleProduct(index) {
  genSingleProductModal(index);
  $("#single-product-modal").modal("show");
}

function drawData() {
  var str = "<section class='products'> ";
  for (var i = 0; i < listItem.length; i++) {
    str += '<div class="product-card" onclick="showSingleProduct(' + i + ');"> <div class="product-image"> <img src="images/item' + i;
    str += '.jpg"> </div> <div class="product-info"> <h5>' + listItem[i].itemName + '</h5> <h6>$' + listItem[i].price + '</h6> </div> </div>';
  }
  str += "</section>";
  $("listItem").append(str);
  viewMaincontent();
}

function onClickPay() {
  itemSummary = [];

  for (var i = 0; i < itemsInCart.length; i++) {
    itemSummary.push({
      'label': itemsInCart[i].itemName + ' x ' + itemsInCart[i].quantity,
      'value': itemsInCart[i].total
    });
  }

  itemSummaryLen = itemSummary.length;

  // iframe.contentWindow.setup(itemSummary, subtotal.toString());
  let data = {};
  data['itemSummary'] = itemSummary;
  data['totalPrice'] = subtotal.toString()
  iframe.contentWindow.postMessage(data, 'https://maheshkk.github.io/samsung-shop/sdcspay/');
}