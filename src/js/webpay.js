var webpay = function (){
	//init
}

webpay.prototype.setup = function(itemSummary, total){
	var discount = 0.00;//-10.00;
	if (!window.PaymentRequest) {
		// PaymentRequest API is not available. Forwarding to
		// legacy form based experience.
		window.top.location.href = 'https://maheshkk.github.io/samsung-shop/checkout.html';
		return;
	}
	var product = {}; 
	var serverSwitch = $('#serverSwitch').val();
 	if(serverSwitch === 'staging'){
    product['id'] = '99599f416a1b4cff88a5b7';
  } else if (serverSwitch === 'production') {
    product['id'] = '847bcee98502428c9a9ade';
  } else {
          
  }
  console.log(product);
	// Supported payment methods
	var supportedInstruments = [
	{
		supportedMethods: ['amex', 'discover','mastercard','visa']
	},		
 	{		
 		supportedMethods: ['https://spay.samsung.com'], //'https://samsung.com/pay' 		
 		data: {		
 			//product ID obtained from Samsung onboarding portal		
 			'productId': product['id'], //'2bc3e6da781e4e458b18bc', //a6bea2455a6749c6945ee7		
 			'allowedCardNetworks': ['AMEX', 'mastercard', 'visa'],		
 			'orderNumber': "1233123",		
 			'merchantName': 'Shop Samsung (demo)',		
 			'debug': {		
 				'APIKey': '6874ad7c7c10403396811780aef9ecf3'		
 			}		
		}
	},
	{
		supportedMethods: ['https://samsung.com/pay'],  		
 		data: {		
 			//product ID obtained from Samsung onboarding portal		
 			'productId': 'a6bea2455a6749c6945ee7', 		
 			'allowedCardNetworks': ['AMEX', 'mastercard', 'visa'],		
 			'orderNumber': "1233123",		
 			'merchantName': 'Shop Samsung (demo)',		
 			'debug': {		
 				'APIKey': '6874ad7c7c10403396811780aef9ecf3'		
 			}		
		}
 	}];

 	// details contain info about the transaction
	var details = {
		displayItems: [],
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
		],
		paymentCredential:{}
	};

	details['paymentCredential']['3DS'] = {
	"type":"S",
	"version":"100",
	"data":"eyJhbGciOiJSU0ExXzUiLCJraWQiOiIyYUpFSUIrZ3Z2MmxEZFA4ZnczNUNvWW1uS0VWeC9UZUV5ODNXT0UxQkRjPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.ghEZgr6KZFa2AJpWOr9Q7Wb3nkHdtHfEUkzzsEeuH_RUBUXIHm363Gye4iqQ8ffZBN19_TAfn4AVLbB7gGLKRIigmjhwAVeU54QZNAmd6w10bK2JuX0FQDPfe0SDKVBi5EGgJE9vfmUDnRNnS_7_s3P9yIn1IclcD7TYUyw4zJPFubE872oaw-cGM-YFHxRceBU3RbaAmWWfWpOiA54KRqofxC9ZC-mWPGUytvB3fxxVH-cw_KiTYYaXUqrM6czmAZWLqg7K7DPeBAJKVWL3KOwq4Bdd4CSj7FXM_0RLOtdH-qFNG8xR8JfPuPjb2x5UY-U8HEIuIRlCIz9FTZcx6g.oMNQMFnRiCQyVDJB.sqPFdYcUjvzsxsa0AhutJgq17pGdQshL2v9ncvxQCjxGxu7LWbvOfnW9HsxTHXe3VirQpvNOlf4QEb46_jjOdwWygmvleg_7bEstf9fqZFgqeg3aC03qk0_jE4DIMNz9Tw-FWCk1xrzee4zLNa8mUJKyEZ4wVI6YIGnrcBbEJNS691O47VUwsnuH41uU9Sniloc-ckgXo0vIZKHxAp_n1FAcRaakzZPigAfkxMh6WGm9O0McyNGnMA.Q7BBY9FY2peHwo2lKSMpxA"
	}

	//populate display items with items from cart/buy now
	itemSummary.forEach( function(element){
		var val = element['value'];
		if( (typeof val) === 'string' ) val = val.replace('$', '');
		details['displayItems'].push({
			label: element['label'],
	  	amount: { currency: 'USD', value : val }
		});
	});

	//shipping 
	details['displayItems'].push(
	{
		label: 'Loyal customer discount',
		amount: { currency: 'USD', value : discount }, // -US$10.00
		pending: true 																 // The price is not determined yet
	});

	//total
	var finalCost = parseFloat(total.replace('$', '')) + discount;
	details['total'] = {
  		label: 'Total',
  		amount: { currency: 'USD', value : finalCost},
	};
	if(finalCost < 0.00){
		alert('Your cart is empty');
		return;
	}

	// collect additional information
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

	//detect when shipping address changes
 	payment.addEventListener('shippingaddresschange', function(e) {
		console.log("address change");
		e.updateWith(new Promise(function(resolve) {
			resolve(details);
		}));
	});
	 
 	//detect shipping option changes
 	payment.addEventListener('shippingoptionchange', e => {
	  e.updateWith(((details, shippingOption) => {
	    var selectedShippingOption;
	    var otherShippingOption;
	    if (shippingOption === 'standard') {
	      selectedShippingOption = details['shippingOptions'][0];
	      otherShippingOption = details['shippingOptions'][1];
	      //details['total']['amount']['value'] = (parseFloat(details['total']['amount']['value']) + 10.00).toFixed(2);
	    } else {
	      selectedShippingOption = details['shippingOptions'][1];
	      otherShippingOption = details['shippingOptions'][0];
	      //details['total']['amount']['value'] = (parseFloat(details['total']['amount']['value']) + 25.00).toFixed(2);
	    }
	    selectedShippingOption.selected = true;
	    otherShippingOption.selected = false;
	      return Promise.resolve(details);
		  })(details, payment.shippingOption));
		});



	// Make PaymentRequest show to display payment sheet 
	payment.show().then(function(paymentResponse) {	
	  // Process response
	  var paymentData = {
		  // payment method string
		  method: paymentResponse.methodName,
		  // payment details as you requested
		  details: JSON.stringify(paymentResponse.details),
		  // shipping address information
		  address: JSON.stringify(paymentResponse.shippingAddress)
	  };

	  console.log(paymentData);
	  processPayment(paymentResponse, finalCost).then(function(success) {
	  	console.log(success);
	  	if (success) {
				// Call complete to hide payment sheet
				paymentResponse.complete('success');
				window.top.location.href = 'https://maheshkk.github.io/samsung-shop/order-confirm.html'
	   	} else {
		   	// Call complete to hide payment sheet
				paymentResponse.complete('fail');
				console.log("Something went wrong with processing payment");
		  }
	  }).catch(err => {
	      console.error("Uh oh, something bad happened while processing payment", err.message);
	  });
	}).catch(err => {
	  console.error("Uh oh, something bad happened", err.message);
	});
}

