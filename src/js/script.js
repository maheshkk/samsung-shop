$().ready(function() {
	var cart = {}; //cart that gets passed to next page 
	$('.product-page-hide').on('click', function(e){
		//detach button event handlers
		$('#buyNow').off('click');
		$('#addToCart').off('click');
		$('#single-product').hide();
		e.stopPropagation();
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
			/*
			var info = {
				"request_id": "771149d2-caec-4a18-8328-80c7d3659fdd", 
				"mid": "9a75435d-2535-4284-a8c9-cb249860d403", 
				"txn_type": "PURCHASE", 
				"method": "3ds", 
				"currency": "USD", 
				"amount": 1700, 
				"3ds": { "type": "S", "version": "100", "data": "eyJhbGciOiJSU0ExXzUiLCJraWQiOiIyYUpFSUIrZ3Z2MmxEZFA4ZnczNUNvWW1uS0VWeC9UZUV5ODNXT0UxQkRjPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.ghEZgr6KZFa2AJpWOr9Q7Wb3nkHdtHfEUkzzsEeuH_RUBUXIHm363Gye4iqQ8ffZBN19_TAfn4AVLbB7gGLKRIigmjhwAVeU54QZNAmd6w10bK2JuX0FQDPfe0SDKVBi5EGgJE9vfmUDnRNnS_7_s3P9yIn1IclcD7TYUyw4zJPFubE872oaw-cGM-YFHxRceBU3RbaAmWWfWpOiA54KRqofxC9ZC-mWPGUytvB3fxxVH-cw_KiTYYaXUqrM6czmAZWLqg7K7DPeBAJKVWL3KOwq4Bdd4CSj7FXM_0RLOtdH-qFNG8xR8JfPuPjb2x5UY-U8HEIuIRlCIz9FTZcx6g.oMNQMFnRiCQyVDJB.sqPFdYcUjvzsxsa0AhutJgq17pGdQshL2v9ncvxQCjxGxu7LWbvOfnW9HsxTHXe3VirQpvNOlf4QEb46_jjOdwWygmvleg_7bEstf9fqZFgqeg3aC03qk0_jE4DIMNz9Tw-FWCk1xrzee4zLNa8mUJKyEZ4wVI6YIGnrcBbEJNS691O47VUwsnuH41uU9Sniloc-ckgXo0vIZKHxAp_n1FAcRaakzZPigAfkxMh6WGm9O0McyNGnMA.Q7BBY9FY2peHwo2lKSMpxA" }
			};
		  	var url = 'https://api.samsungpaydev.us/pcat/v1/transactions';
		  	
		    $.ajax({
			  type: "POST",
			  headers: { 
		 	    'Accept': 'application/json',
			    'Content-Type': 'application/json' 
			  },
			  url: url,
			  data: JSON.stringify(info),
			  success: function(response){
			  	console.log(response);
			  },
			  dataType: 'json'
			});
			*/
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
			location.href = '/samsung-shop/cart.html';
		});

	});
	// 
});
