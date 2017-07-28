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

	// set product id based on option selected in drop down
	var product = {}; 
	var serverSwitch = $('#serverSwitch').val();
	switch(serverSwitch){
		case 'stripe':
			product['id'] = 'c8e2edebcab74d8bb76658';
			break;
		case 'fd-sim-prd':
			product['id'] = '7c1a34644e774837bc44b1';
			break;
		case 'fd-cat-prd':
			product['id'] = 'd947c71eac094f09b395a4';
			break;
		case 'stripe-prd':
			product['id'] = 'a433362c57254be7b79a08';
			break;
		case 'elmo':
			product['id'] = '99599f416a1b4cff88a5b7';
			break;
		default:
			product['id'] = '7c1a34644e774837bc44b1';
			break;
	}
  //data to be used alongside spay
  var payData = {		
		//product ID obtained from Samsung onboarding portal		
		"version":'1',
		'productId': product['id'],	
		'allowedCardNetworks': ['AMEX', 'mastercard', 'visa'],		
		'orderNumber': "1233123",		
		'merchantName': 'Shop Samsung (demo)',
		"merchantGatewayParameter": {"userId": " acct_17irF7F6yPzJ7wOR" },
		"debug": {				
 			"APIKey": "6874ad7c7c10403396811780aef9ecf3"		
 		}	  
	}		
  console.log(product);
	// Supported payment methods
	var supportedInstruments = [
	{
		supportedMethods: ['amex', 'discover','mastercard','visa']
	},
	{
    supportedMethods: ['basic-card'],
    data: {
      supportedNetworks: ['unionpay', 'visa', 'mastercard', 'amex', 'discover',
        'diners', 'jcb', 'mir'
      ],
      supportedTypes: ['prepaid', 'debit', 'credit']
    }
  },		
 	{		
 		supportedMethods: ['https://spay.samsung.com'], // current url		
 		data: payData
	}
 	];

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
		]
	};

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
 	payment.addEventListener('shippingaddresschange', e => {
		console.log("address change");
		e.updateWith(new Promise( resolve => {
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
	      details['total']['amount']['value'] = finalCost + 10.00;
	    } else {
	      selectedShippingOption = details['shippingOptions'][1];
	      otherShippingOption = details['shippingOptions'][0];
	      details['total']['amount']['value'] = finalCost + 25.00;
	    }
	    selectedShippingOption.selected = true;
	    otherShippingOption.selected = false;
	      return Promise.resolve(details);
		  })(details, payment.shippingOption));
		});

	// Make PaymentRequest show to display payment sheet 
	payment.show().then( paymentResponse => {	
		console.log(paymentResponse);
	  // Process response
	  var paymentData = {
		  // payment method string
		  "method": paymentResponse.methodName,
		  // payment details as you requested
		  "details": JSON.stringify(paymentResponse.details),
		  // shipping address information
		  "address": JSON.stringify(paymentResponse.shippingAddress)
	  };
	  sessionStorage.setItem("samsungPayShopDemoEmail", paymentResponse.payerEmail); 
	  console.log(paymentData);
	  console.log(JSON.stringify(paymentData));
	  processPayment(paymentResponse, finalCost).then( success => {
	  	console.log(success);
	  	console.log(JSON.stringify(success));
	  	if (success) {
				// Call complete to hide payment sheet
				paymentResponse.complete('success');
				window.top.location.href = 'https://maheshkk.github.io/samsung-shop/order-confirm.html';
	   	} else {
		   	// Call complete to hide payment sheet
				paymentResponse.complete('fail');
				console.log("Something went wrong with processing payment");
		  }
	  }).catch(err => {
	      console.error("Uh oh, something bad happened while processing payment", err.message);
	  });
	}).catch(err => {
	  console.error("Uh oh, something bad happened", err);
	});
}
