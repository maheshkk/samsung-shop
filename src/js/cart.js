$().ready(function() {
	var cart = JSON.parse(sessionStorage.getItem('samsungPayShopDemo'));

	//populate cart with all items
	var cartItems = document.getElementById('cart-items');
	var itemContainer, itemInfoLeft, itemImage, itemName, itemInfoRight, itemQuantityLabel,itemQuantity, itemPrice;
	var fragment = document.createDocumentFragment();
	for(var k in cart){
		console.log(cart[k]);
		//should probably change this to mustache templating, if allowed on github pages
		itemContainer = document.createElement('div'); 
		itemContainer.className = 'item-container';
		itemInfoLeft = document.createElement('div');
		itemInfoLeft.className = 'item-info-left';
		itemImage = document.createElement('img');
		itemImage.src = cart[k]['image'];
		itemImage.className = 'cart-item-image';
		itemName = document.createElement('h3');
		itemName.innerText = cart[k]['name'];
		itemName.className = 'cart-item-pad-top';
		itemInfoRight = document.createElement('div'); 
		itemInfoRight.className = 'item-info-right';
		itemQuantityLabel = document.createElement('h3');
		itemQuantityLabel.className = 'cart-item-pad-top';
		itemQuantityLabel.innerText = 'Quantity: ';
		itemQuantity = document.createElement('input');
		itemQuantity.value = cart[k]['count'];
		itemQuantity.className = 'item-quantity';
		itemPrice = document.createElement('h4');
		itemPrice.className = 'cart-item-pad-top';
		itemPrice.innerText = cart[k]['price'];
		itemInfoLeft.appendChild(itemImage);
		itemInfoLeft.appendChild(itemName);
		itemInfoRight.appendChild(itemQuantityLabel);
		itemInfoRight.appendChild(itemQuantity);
		itemInfoRight.appendChild(itemPrice);
		itemContainer.appendChild(itemInfoLeft);
		itemContainer.appendChild(itemInfoRight);
		cartItems.appendChild(itemContainer);
	}
	//calculate total cost

	//set up web payment
});