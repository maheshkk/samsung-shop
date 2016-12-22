$().ready(function() {
		
	$(".product-page-hide").on("click", function(e){
		$("#single-product").hide();
		e.stopPropagation();
	});


	$(".product-card").click(function(){
		var prod_page = $("#single-product")
		var image_source = $(this).find("img").attr("src")
		var prod_name = $(this).find("h5").text();
		var prod_price = $(this).find("h6").text();
		
		$(prod_page).find("img").attr("src", image_source);
		$(prod_page).find("h2").text(prod_name);
		$(prod_page).find("h1").text(prod_price);

		$(prod_page).show("slow");

		$("#buyNow").on("click", function(){

			 if (!window.PaymentRequest) {
   				// PaymentRequest API is not available. Forwarding to
    			// legacy form based experience.
    			location.href = '/checkout.html';
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
      					'allowedCardNetworks': ['AMEX', 'mastercard', "visa"],
      					'paymentProtocol': "PROTOCOL_3DS",
      					'merchantName': "Shop Samsung (demo)",
      					'isReccurring': false,
      					'orderNumber': 1000,
      					'billingAddressRequired': "zipOnly"
					}
			}];

			var details = {
				displayItems: [
			    	{
			      		label: prod_name,
			      		amount: { currency: "USD", value : prod_price.replace("$", "") }, // US$65.00
			    	},
			    	{
			      		label: "Loyal customer discount",
			      		amount: { currency: "USD", value : "-10.00" }, // -US$10.00
			      		pending: true // The price is not determined yet
			    	}
			  	],
			  	
			  	total:  {
			    	label: "Total",
			    	amount: { currency: "USD", value : prod_price.replace("$", "") }, // US$55.00
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
  				shippingType: "shipping" // "shipping"(default), "delivery" or "pickup"
			};

			var payment = new PaymentRequest(
				supportedInstruments, // required payment method data
  				details,              // required information about transaction
  				options               // optional parameter for things like shipping, etc.
			);

			// Make PaymentRequest show to display payment sheet 
			payment.show().then(function(paymentResponse) {
				
				try {
				    console.log(JSON.stringify(paymentResponse));
				} catch(e) {
					console.error("JSON stringify failed");
				}

			    // Call complete to hide payment sheet
 			    paymentResponse.complete("success");

			    location.href = 'order-confirm.html';

			}).catch(function(err) {
			    console.error("Uh oh, something bad happened", err.message);
			});
		});
	});

});
