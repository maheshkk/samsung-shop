function guid() {
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
    console.log(guid);
    return guid;
}

function processPayment(payload, totalCost) {
    console.log(payload);
    console.log(totalCost);
    return new Promise(function (resolve, reject) {    
        if (!payload || !payload.details || !payload.details.paymentCredential) {
            resolve(false);
        }
        /*
        var server = {};

        var serverSwitch = $('#serverSwitch').val();
        if(serverSwitch === 'staging'){
            server['mid'] = '2cae108f-c342-4a79-b8f9-bb524112ab17';
            server['url'] = '/papi/v1/transactions';
        } else if (serverSwitch === 'production') {
            server['mid'] = '9a75435d-2535-4284-a8c9-cb249860d403';
            server['url'] = '/pcat/v1/transactions';
        } else {
            
        }
        */
        var credentials = payload.details.paymentCredential["3DS"];

        var postPayment = { 
            "request_id": guid(),
            "mid": '9a75435d-2535-4284-a8c9-cb249860d403', //server['mid'],
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
          url: 'https://api.samsungpaydev.us/pcat/v1/transactions',
          data: JSON.stringify(postPayment),
          success: function(response){
            console.log(response);
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
