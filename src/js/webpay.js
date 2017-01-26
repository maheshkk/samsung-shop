var webpay = function (itemSummary, total){
	'use strict';
	console.log(itemSummary);
	console.log(total);
	return {
		setup: function(itemSummary, total){
			var discount = -10.00;
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
				supportedMethods: ['https://samsung.com/pay'], 
				data: {
					//product ID obtained from Samsung onboarding portal
					'productId': 'a6bea2455a6749c6945ee7',
					'merchantRefId': 'MerchantIDOptional',
					'allowedCardNetworks': ['AMEX', 'mastercard', 'visa'],
					'paymentProtocol': 'PROTOCOL_3DS',
					'orderNumber': "1233123",
					'isRecurring': false,
					'merchantName': 'Shop Samsung (demo)',
					'billingAddressRequired': 'zipOnly',
					'isDebugMode': false,
					'APIKey': '12345'
				}
			}];

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
				console.log(typeof val);
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
				pending: true // The price is not determined yet
			});
			//total
			details['total'] = {
		  		label: 'Total',
		  		amount: { currency: 'USD', value : total.replace('$', '')},
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
		}
	}
}

