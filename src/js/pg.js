function guid() {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
    return guid;
}

function processPayment(payload, totalCost) {
    console.log(payload);
    console.log(JSON.stringify(payload));
    return new Promise( (resolve, reject) => {
        if (!payload || !payload.details) {
           resolve(false);
        }
        // auto approve all manual cards - for now
        if(payload.methodName !== 'https://samsung.com/pay'){
            console.log('detected non spay');
            resolve(true);
        }    
        //credentials should be from spay app
        var credentials;
        if(!payload.details.paymentCredential){
            //set own credentials incase it empty
            credentials = {
                "type":"S",
                "version":"100",
                "data":"eyJhbGciOiJSU0ExXzUiLCJraWQiOiIyYUpFSUIrZ3Z2MmxEZFA4ZnczNUNvWW1uS0VWeC9UZUV5ODNXT0UxQkRjPSIsInR5cCI6IkpPU0UiLCJjaGFubmVsU2VjdXJpdHlDb250ZXh0IjoiUlNBX1BLSSIsImVuYyI6IkExMjhHQ00ifQ.ghEZgr6KZFa2AJpWOr9Q7Wb3nkHdtHfEUkzzsEeuH_RUBUXIHm363Gye4iqQ8ffZBN19_TAfn4AVLbB7gGLKRIigmjhwAVeU54QZNAmd6w10bK2JuX0FQDPfe0SDKVBi5EGgJE9vfmUDnRNnS_7_s3P9yIn1IclcD7TYUyw4zJPFubE872oaw-cGM-YFHxRceBU3RbaAmWWfWpOiA54KRqofxC9ZC-mWPGUytvB3fxxVH-cw_KiTYYaXUqrM6czmAZWLqg7K7DPeBAJKVWL3KOwq4Bdd4CSj7FXM_0RLOtdH-qFNG8xR8JfPuPjb2x5UY-U8HEIuIRlCIz9FTZcx6g.oMNQMFnRiCQyVDJB.sqPFdYcUjvzsxsa0AhutJgq17pGdQshL2v9ncvxQCjxGxu7LWbvOfnW9HsxTHXe3VirQpvNOlf4QEb46_jjOdwWygmvleg_7bEstf9fqZFgqeg3aC03qk0_jE4DIMNz9Tw-FWCk1xrzee4zLNa8mUJKyEZ4wVI6YIGnrcBbEJNS691O47VUwsnuH41uU9Sniloc-ckgXo0vIZKHxAp_n1FAcRaakzZPigAfkxMh6WGm9O0McyNGnMA.Q7BBY9FY2peHwo2lKSMpxA"
            }
            //credentials = '';
        } else {
            console.log('creds from spay');
            credentials = payload.details.paymentCredential["3DS"];
        }
        
        //setup correct url and mid for specific values of dropdown
        var server = {};
        var serverSwitch = $('#serverSwitch').val();
        switch(serverSwitch){
            case 'elmo':
            case 'fd-sim-prd':
            case 'stg-sim-prd':
                server['mid'] = '2cae108f-c342-4a79-b8f9-bb524112ab17';
                server['url'] = '/papi/v1/transactions';
                break;
            case 'fd-cat-prd':
            case 'stg-cat-prd':
                server['mid'] = '9a75435d-2535-4284-a8c9-cb249860d403';
                server['url'] = '/pcat/v1/transactions';
                break;
            case 'stripe':
            case 'stripe-prd':
                server['mid'] = '18cb7fde-5321-4dba-b9ee-13a49e172f7c';
    	        server['url'] = '/papi/v1/transactions';
            default:
                break;
        }
        var url = 'https://api.samsungpaydev.us' + server['url'];
        console.log(url);

        //payment data sent to server
        var postPayment = { 
            "request_id": guid(),
            "mid": server['mid'],
            "txn_type": "PURCHASE",
            "method": "3ds",
            "currency": "USD",
            "amount": totalCost,
            "3ds" : credentials
        }
        console.log(JSON.stringify(postPayment));
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
            console.log(JSON.stringify(response));
            if(response['resp_code'] && response['resp_code'] === "APPROVAL"){
                alert('Card accepted');
                resolve(true);
            } else {
                resolve(false);
            }
          },
          error: function(xhr, ajaxOptions, thrownError){
            console.log('error: ');
            console.log(JSON.stringify(xhr));
            console.log(thrownError);
            resolve(false);
          },
          dataType: 'json'
        });
    });        
}
