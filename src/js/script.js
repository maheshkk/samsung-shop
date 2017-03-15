$().ready(function() {
	var cart = {}; //cart that gets passed to next page 
	$('.product-page-hide').on('click', function(e){
		//detach button event handlers
		$('#buyNow').off('click');
		$('#addToCart').off('click');
		$('#single-product').hide();
		e.stopPropagation();
	});

	// event listener for custom pricing
	$('#customInput').on('input', function(){
		$('#customValue').html($('#customInput').val());
	});

	sessionStorage.setItem('samsungPayShopDemoDropDown', $('#serverSwitch').val());
	// event listener for drop down
	$('#serverSwitch').change(function(){
		sessionStorage.setItem('samsungPayShopDemoDropDown', $('#serverSwitch').val());
	});
	/*
	var cartTotal = sessionStorage.getItem('samsungPayShopDemoCount');
	if(cartTotal){
		$('#shopping-cart-count').text(cartTotal);
	}
	*/
	$('.product-card').click(function(){
		//get info about selected item
		var prod_page = $('#single-product');
		var image_source = $(this).find('img').attr('src');
		var prod_name = $(this).find('h5').text();
		var prod_price = $(this).find('h6').text();

		$(prod_page).find('img').attr('src', image_source);
		$(prod_page).find('h2').text(prod_name);
		$(prod_page).find('h1').text(prod_price);

		$(prod_page).show('slow');
		//buy now
		$('#buyNow').on('click', function(){
			var itemSummary = [{
				'label': prod_name,
				'value': prod_price
			}];
			console.log(itemSummary);
			var webpayment = new webpay();
			webpayment.setup(itemSummary, prod_price);
		});
		//add to cart
		$('#addToCart').on('click', function(){
			//extra scope
			function addToCart(image_source, prod_name, prod_price){
				var cartCount = parseInt($('#shopping-cart-count').text());
				$('#shopping-cart-count').text(++cartCount);
				var count;
				//don't want duplicate items in cart- just increment
				if(cart[prod_name]){
					console.log(cart[prod_name]['name']);
					count = parseInt(cart[prod_name]['count']) + 1; 
				} else {
					count = 1;
					cart[prod_name];
				}
				var item = {
					'image': image_source,
					'name': prod_name,
					'price': prod_price,
					'count': count
				};
				//$.extend(cart, item);
				cart[prod_name] = item;
			}
			$('#single-product').hide('slow');
			$('#addToCart').off('click');
			return addToCart(image_source, prod_name, prod_price);
		});
		//cart button
		$('#shopping-cart').on('click', function(){
			//use session storage to pass info, since theres no server side logic handling this
			sessionStorage.setItem('samsungPayShopDemo', JSON.stringify(cart));
			sessionStorage.setItem('samsungPayShopDemoCount', $('#shopping-cart-count').text());
			sessionStorage.setItem('samsungPayShopDemoDropDown', $('#serverSwitch').val());
			location.href = '/samsung-shop/cart.html';
		});

	});
	// service worker
	if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
    }
});
