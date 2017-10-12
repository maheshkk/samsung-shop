(function(){
	function setup(item,total) {
		// set product id based on option selected in drop down
		let discount = 5.00;
		 //data to be used alongside spay
		let payData = {		
			//product ID obtained from Samsung onboarding portal		
			'productId': "99599f416a1b4cff88a5b7",	
			'allowedCardNetworks': ['AMEX', 'mastercard', 'visa'],		
			'orderNumber': "1233123",		
			'merchantName': 'Shop Samsung (demo)',		
			'debug': {		
				'APIKey': '6874ad7c7c10403396811780aef9ecf3'
			},
			"merchantGatewayParameter": {"userId": " acct_17irF7F6yPzJ7wOR" },
			"debug": {				
		 		"APIKey": "6874ad7c7c10403396811780aef9ecf3"		
			} 
		}		

		// Supported payment methods
		let supportedInstruments = [
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
		let details = {
			displayItems: [],
			shippingOptions: [
		    {
		      id: 'standard',
		      label: 'Standard shipping',
		      amount: {currency: 'USD', value: '0.00'},
		      selected: true
		    },
		    {
		      id: 'express',
		      label: 'Express shipping',
		      amount: {currency: 'USD', value: '10.00'}
		    }
			]
		};

		//populate display items with items from cart/buy now
		item.forEach( function(element){
			let val = element['value'];
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
		let finalCost = parseFloat(total.replace('$', '')) - discount;
		details['total'] = {
	  		label: 'Total',
	  		amount: { currency: 'USD', value : finalCost},
		};
		if(finalCost < 0.00){
			alert('Your cart is empty');
			return;
		}

		// collect additional information
		let options = {
		  requestPayerEmail: true,
			requestPayerName: true,
		  requestShipping: true,
			shippingType: 'shipping' // "shipping"(default), "delivery" or "pickup"
		};

		let payment = new PaymentRequest(
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
		  	let originalCost = finalCost;
		    let selectedShippingOption;
		    let otherShippingOption;
		    if (shippingOption === 'standard') {
		      selectedShippingOption = details['shippingOptions'][0];
		      otherShippingOption = details['shippingOptions'][1];
		      details['total']['amount']['value'] = originalCost + 0.00;
					details['displayItems'][1]['amount']['value'] = 0.00;
		    } else {
		      selectedShippingOption = details['shippingOptions'][1];
		      otherShippingOption = details['shippingOptions'][0];
		      details['total']['amount']['value'] = originalCost + 10.00;
					details['displayItems'][1]['amount']['value'] = 10.00;
		    }
		    selectedShippingOption.selected = true;
		    otherShippingOption.selected = false;
		      return Promise.resolve(details);
			  })(details, payment.shippingOption));
			});



		// Make PaymentRequest show to display payment sheet 
		payment.show().then(function(paymentResponse) {	
			console.log(paymentResponse);
		  // Process response
		  let paymentData = {
			  // payment method string
			  "method": paymentResponse.methodName,
			  // payment details as you requested
			  "details": JSON.stringify(paymentResponse.details),
			  // shipping address information
			  "address": JSON.stringify(paymentResponse.shippingAddress)
		  };
		  
		  console.log(paymentData);
		  processPayment(paymentResponse, details['total']['amount']['value']).then(function(success) {
		  	console.log(success);
		  	if (success) {
					// Call complete to hide payment sheet
					paymentResponse.complete('success');
					//window.top.location.href = 'https://maheshkk.github.io/samsung-shop/order-confirm.html';
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

	function guid() {
	    let guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {let r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
	    return guid;
	}

	function processPayment(payload, totalCost) {
	    console.log(payload);
	    return new Promise(function (resolve, reject) {    
	        if (!payload || !payload.details) {
	           resolve(false);
	        }

	        //credentials should be from spay app
	        let credentials;
	        if(!payload.details.paymentCredential){
	            //set own credentials incase it empty
	            credentials = {
	                "type":"S",
	                "version":"100",
	                "data":"eyJhbGciOiJSU0ExXzUiLCJraWQiOiIyYUpFSUIrZ3Z2MmxEZFA4ZnczNUNvWW1uS0VWeC9UZUV5ODNXT0UxQkRjPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.ghEZgr6KZFa2AJpWOr9Q7Wb3nkHdtHfEUkzzsEeuH_RUBUXIHm363Gye4iqQ8ffZBN19_TAfn4AVLbB7gGLKRIigmjhwAVeU54QZNAmd6w10bK2JuX0FQDPfe0SDKVBi5EGgJE9vfmUDnRNnS_7_s3P9yIn1IclcD7TYUyw4zJPFubE872oaw-cGM-YFHxRceBU3RbaAmWWfWpOiA54KRqofxC9ZC-mWPGUytvB3fxxVH-cw_KiTYYaXUqrM6czmAZWLqg7K7DPeBAJKVWL3KOwq4Bdd4CSj7FXM_0RLOtdH-qFNG8xR8JfPuPjb2x5UY-U8HEIuIRlCIz9FTZcx6g.oMNQMFnRiCQyVDJB.sqPFdYcUjvzsxsa0AhutJgq17pGdQshL2v9ncvxQCjxGxu7LWbvOfnW9HsxTHXe3VirQpvNOlf4QEb46_jjOdwWygmvleg_7bEstf9fqZFgqeg3aC03qk0_jE4DIMNz9Tw-FWCk1xrzee4zLNa8mUJKyEZ4wVI6YIGnrcBbEJNS691O47VUwsnuH41uU9Sniloc-ckgXo0vIZKHxAp_n1FAcRaakzZPigAfkxMh6WGm9O0McyNGnMA.Q7BBY9FY2peHwo2lKSMpxA"
	            }
	            //credentials = '';
	        } else {
	            credentials = payload.details.paymentCredential["3DS"];
	        }

	        let url = 'https://api.samsungpaydev.us/papi/v1/transactions';
	        console.log(url);

	        //payment data sent to server
	        let postPayment = { 
	            "request_id": guid(),
	            "mid": '2cae108f-c342-4a79-b8f9-bb524112ab17',
	            "txn_type": "PURCHASE",
	            "method": "3ds",
	            "currency": "USD",
	            "amount": totalCost,
	            "3ds" : credentials
	        }
	        console.log(postPayment);
	        $.ajax({
	          type: "POST",
	          headers: { 
	            'Accept': 'application/json',
	            'cache-control': 'no-cache' ,
	            'Content-Type': 'application/json' 
	          },
	          url: url,
	          data: JSON.stringify(postPayment),
	          success: function(response){
	            console.log('success');
	            console.log(response);
	            if(response['resp_code'] && response['resp_code'] === "DECLINE"){
	                resolve(false);
	            } else {
	                resolve(true);
	            }
	          },
	          error: function(xhr, ajaxOptions, thrownError){
	            console.log('error: ');
	            console.log(xhr);
	            console.log(thrownError);
	            resolve(false);
	          },
	          dataType: 'json'
	        });
	    });        
	}
	/*
	let button = document.getElementById('payButton');
	if (!window.PaymentRequest) {
		// PaymentRequest API is not available. Forwarding to
		// legacy form based experience.
		console.warn("PaymentRequest API is not available.");
		button.style.backgroundColor = "#d9534f";
		button.innerHTML = "Payment Request not supported";
	} else {
		button.addEventListener('click', buy);
	}
	function buy(){
		let price = '$100.00';
		let item = [{
		  'label': 'Candy',
		  'value': price
		}];
		setup(item,price);
	}
	*/
})();
