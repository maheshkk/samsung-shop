function guid() {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
    return guid;
}

function processPayment(payload, totalCost) {
    console.log(payload);
    return new Promise(function (resolve, reject) {    
        if (!payload || !payload.details) {
           resolve(false);
        }
        var credentials;
        if(!payload.details.paymentCredential){
            credentials = {
                "type":"S",
                "version":"100",
                "data":"eyJhbGciOiJSU0ExXzUiLCJraWQiOiIyYUpFSUIrZ3Z2MmxEZFA4ZnczNUNvWW1uS0VWeC9UZUV5ODNXT0UxQkRjPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.ghEZgr6KZFa2AJpWOr9Q7Wb3nkHdtHfEUkzzsEeuH_RUBUXIHm363Gye4iqQ8ffZBN19_TAfn4AVLbB7gGLKRIigmjhwAVeU54QZNAmd6w10bK2JuX0FQDPfe0SDKVBi5EGgJE9vfmUDnRNnS_7_s3P9yIn1IclcD7TYUyw4zJPFubE872oaw-cGM-YFHxRceBU3RbaAmWWfWpOiA54KRqofxC9ZC-mWPGUytvB3fxxVH-cw_KiTYYaXUqrM6czmAZWLqg7K7DPeBAJKVWL3KOwq4Bdd4CSj7FXM_0RLOtdH-qFNG8xR8JfPuPjb2x5UY-U8HEIuIRlCIz9FTZcx6g.oMNQMFnRiCQyVDJB.sqPFdYcUjvzsxsa0AhutJgq17pGdQshL2v9ncvxQCjxGxu7LWbvOfnW9HsxTHXe3VirQpvNOlf4QEb46_jjOdwWygmvleg_7bEstf9fqZFgqeg3aC03qk0_jE4DIMNz9Tw-FWCk1xrzee4zLNa8mUJKyEZ4wVI6YIGnrcBbEJNS691O47VUwsnuH41uU9Sniloc-ckgXo0vIZKHxAp_n1FAcRaakzZPigAfkxMh6WGm9O0McyNGnMA.Q7BBY9FY2peHwo2lKSMpxA"
            }
        } else {
            credentials = payload.details.paymentCredential["3DS"];
        }
        
        var server = {};

        var serverSwitch = $('#serverSwitch').val();
        if(serverSwitch === 'staging'){
            server['mid'] = '2cae108f-c342-4a79-b8f9-bb524112ab17';
            server['url'] = '/papi/v1/transactions';
        } else if (serverSwitch === 'production') {
            server['mid'] = '9a75435d-2535-4284-a8c9-cb249860d403';
            server['url'] = '/pcat/v1/transactions';
        } else if(serverSwitch === 'stripe') {
            server['mid'] = '18cb7fde-5321-4dba-b9ee-13a49e172f7c';
	        server['url'] = '/papi/v1/transactions';
        } else {
	    }
        var url = 'https://api.samsungpaydev.us' + server['url'];
        console.log(url);

        var postPayment = { 
            "request_id": guid(),
            "mid": server['mid'],
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
            'Content-Type': 'application/json' 
          },
          url: url,
          data: JSON.stringify(postPayment),
          success: function(response){
            console.log('success');
            console.log(response);
          },
          error: function(xhr, ajaxOptions, thrownError){
            console.log('error: ');
            console.log(xhr.status);
            console.log(thrownError);
          },
          dataType: 'json'
        });
        //alert(postPayment);
        /*
        fetch('https://api.samsungpaydev.us/pcat/v1/transactions', {
            method: 'POST',
            body: JSON.stringify(postPayment),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            console.log(postPayment);
            console.log(response);
            //alert(response);
            if (!response.ok) {
                //handle error
                resolve(false);
            }
            return response.json();
        }).then(function(paymentVerified) {
            console.log(postPayment);
            console.log(paymentVerified);
            //alert(paymentVerified);
            try { 
                if (paymentVerified && paymentVerified.resp_code && paymentVerified.resp_code == "APPROVAL") {
                    console.log("RES: " + paymentVerified);
                    resolve(true);
                }
            } catch(e) {
                console.log("unexpected response")
                reject(false);
            }
        }).catch(function(err) {
            console.log(postPayment);
            console.log("Err: " + err.message);
            reject(false);            
        });
        */
    });        
}
