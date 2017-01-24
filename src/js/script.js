$().ready(function() {
	var cart = {}; //cart that gets passed to next page 
	$('.product-page-hide').on('click', function(e){
		$('#single-product').hide();
		e.stopPropagation();
	});


	$('.product-card').click(function(){
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

			 if (!window.PaymentRequest) {
   				// PaymentRequest API is not available. Forwarding to
    			// legacy form based experience.
    			location.href = '/samsung-shop/checkout.html';
    			return;
  			}

  			// Supported payment methods
  			var supportedInstruments = [
				{
    				supportedMethods: ['amex', 'discover','mastercard','visa']
  				},
  				{
    				supportedMethods: ['https://android.com/pay'],
    				data: {
      					//product ID obtained from Samsung onboarding portal
      					'productId': '02510116604241796260',
      					'allowedCardNetworks': ['AMEX', 'mastercard', 'visa'],
      					'paymentProtocol': 'PROTOCOL_3DS',
      					'merchantName': 'Shop Samsung (demo)',
      					'isReccurring': false,
      					'orderNumber': 1000,
      					'billingAddressRequired': 'zipOnly'
					}
			}];

			var details = {
				displayItems: [
			    	{
			      		label: prod_name,
			      		amount: { currency: 'USD', value : prod_price.replace('$', '') }, // US$65.00
			    	},
			    	{
			      		label: 'Loyal customer discount',
			      		amount: { currency: 'USD', value : '-10.00' }, // -US$10.00
			      		pending: true // The price is not determined yet
			    	}
			  	],
			  	
			  	total:  {
			    	label: 'Total',
			    	amount: { currency: 'USD', value : prod_price.replace('$', '') }, // US$55.00
			  	},

			  	shippingOptions: [
				    {
				      id: 'standard',
				      label: 'Standard shipping',
				      amount: {currency: 'USD', value: '10.00'},
				      selected: true
				    },
				    {
				      id: 'express',
				      label: 'Express shipping',
				      amount: {currency: 'USD', value: '25.00'}
				    }
				]
			};

			var options = {
  		    	requestPayerEmail: true,
    			requestPayerName: true,
			    requestShipping: true,
  				shippingType: 'shipping' // "shipping"(default), "delivery" or "pickup"
			};

			var payment = new PaymentRequest(
				supportedInstruments, // required payment method data
  				details,              // required information about transaction
  				options               // optional parameter for things like shipping, etc.
			);

			// Make PaymentRequest show to display payment sheet 
			payment.show().then(function(paymentResponse) {
				
			  // Process response
			  var paymentData = {
				  // payment method string
				  method: paymentResponse.methodName,
				  // payment details as you requested
				  details: paymentResponse.details.toJSON(),
				  // shipping address information
				  address: paymentResponse.shippingAddress.toJSON()
			  };

			  // Call complete to hide payment sheet
			  paymentResponse.complete('success');

			  console.log(JSON.stringify(paymentData));

			  location.href = '/samsung-shop/order-confirm.html';

			}).catch(function(err) {
			  console.error('Uh oh, something bad happened', err.message);
			});
		});
		//add to cart
		$('#addToCart').one('click', function(){
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
			return addToCart(image_source, prod_name, prod_price);
		});
		//cart button
		$('#shopping-cart').on('click', function(){
			//use session storage to pass info, since theres no server side logic handling this
			sessionStorage.setItem('samsungPayShopDemo', JSON.stringify(cart));
			location.href = '/samsung-shop/cart.html';
		});

	});
	// 
});