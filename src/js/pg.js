function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});
}

function processPayment(payload) {
    return new Promise(function (resolve, reject) {    
        if (!payload || !payload.details || !payload.details.paymentCredential) {
            resolve(false);
        }

        var credentials = payload.details.paymentCredential["3DS"];

        var postPayment = { 
            "request_id": guid(),
            "mid": "2cae108f-c342-4a79-b8f9-bb524112ab17",
            "txn_type": "PURCHASE",
            "method": "3ds",
            "currency": "USD",
            "amount": 500,
            "3ds" : credentials
        }

        fetch('https://api.samsungpaydev.us/papi/v1/transactions', {
            method: 'post',
            body: JSON.stringify(postPayment),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            if (!response.ok) {
                //handle error
                resolve(false);
            }
            return response.json();
        }).then(function(paymentVerified) {
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
            console.log("Err: " + err.message);
            reject(false);            
        });
    });        
}
