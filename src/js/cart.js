$().ready(function() {
	var cart = JSON.parse(sessionStorage.getItem('samsungPayShopDemo'));
	var cost = 0;
	var cartCount = 0;
	var itemSummary = [];
	//populate cart with all items
	var cartItems = document.getElementById('cart-items');
	var itemContainer, itemInfoLeft, itemImage, itemName, itemInfoRight, itemQuantityLabel,itemQuantity, itemPrice;
	var fragment = document.createDocumentFragment();
	for(var k in cart){
		var name = cart[k]['name'];
		var count = parseInt(cart[k]['count']);
		cartCount += count;
		var price = cart[k]['price'];
		//should probably change this to mustache templating, if allowed on github pages
		itemContainer = document.createElement('div'); 
		itemContainer.className = 'item-container';
		itemInfoLeft = document.createElement('div');
		itemInfoLeft.className = 'item-info-left';
		itemImage = document.createElement('img');
		itemImage.src = cart[k]['image'];
		itemImage.className = 'cart-item-image';
		itemName = document.createElement('h3');
		itemName.innerText = name;
		itemName.className = 'cart-item-pad-top';
		itemInfoRight = document.createElement('div'); 
		itemInfoRight.className = 'item-info-right';
		itemQuantityLabel = document.createElement('h3');
		itemQuantityLabel.className = 'cart-item-pad-top';
		itemQuantityLabel.innerText = 'Quantity: ';
		itemQuantity = document.createElement('input');
		itemQuantity.value = count;
		itemQuantity.className = 'item-quantity';
		itemPrice = document.createElement('h4');
		itemPrice.className = 'cart-item-pad-top';
		itemPrice.innerText = price;
		itemInfoLeft.appendChild(itemImage);
		itemInfoLeft.appendChild(itemName);
		itemInfoRight.appendChild(itemQuantityLabel);
		itemInfoRight.appendChild(itemQuantity);
		itemInfoRight.appendChild(itemPrice);
		itemContainer.appendChild(itemInfoLeft);
		itemContainer.appendChild(itemInfoRight);
		cartItems.appendChild(itemContainer);
		//cost total for each item
		var currentCost = (count * (parseFloat(price.replace('$', ''))));
		cost += currentCost;
		//label for webpay summary
		var itemLabel = count + ' X ' + name;
		itemSummary.push({
			'label':  itemLabel,
			'value': currentCost
		});
	}
	$('#total-cost').text(cost.toFixed(2));
	$('#shopping-cart-count').text(cartCount);
	//auto calculate total cost with input event listener
	var inputs = $('.item-quantity');
	$('.item-quantity').on('input', function(){
		var total = 0;
		$.each(inputs, function(){
			var qnt = $(this).val();
			var price = parseFloat($(this).parent().find('h4').text().replace('$', ''));
			total += (qnt * price);
		});
		$('#total-cost').text(total.toFixed(2));
	});
	//set up web payment
	$('#checkout-button').on('click', function(){
		var price = $('#total-cost').text();
		webpay( itemSummary ,price);
	});
});