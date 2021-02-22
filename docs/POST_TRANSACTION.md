# Create a Transaction

    POST /api/make-transaction


## Parameters
### Body Parameters
Field | Required| Type | Description
--- | --- | --- | ---
receiver | Y| String | wallet address of receiver
amount | Y |Number| amount of transaction


## Example
### Request

    POST http://localhost:3000/api/make-transaction
#### Request Body
```json 
{
    "amount":50,
    "receiver":"041b15787c99df052c0b07cd8049dd49762b79f2f80635e39aa76ad26c94079ddfb77cc7100c9df1c0497dd52409f71190b81fe8c839f5a8f3ea2d79b780f59919"
}
```
### Response
``` json
{
    "transaction": {
        "id": "2b158f40-74e8-11eb-ab4c-ed1c196f652d",
        "outputMap": {
            "041b15787c99df052c0b07cd8049dd49762b79f2f80635e39aa76ad26c94079ddfb77cc7100c9df1c0497dd52409f71190b81fe8c839f5a8f3ea2d79b780f59919": 250,
            "04d07b2a37a6dbae641a3b10f1e8d1eb2d72ef3614ad977be1f15ca78b1477f2b4b67d33412b9d29ec67df2c8da03ee25b3a5c1e7ce7be3e33e1f2a47091a58e84": 765
        },
        "input": {
            "timestamp": 1613983628311,
            "amount": 1015,
            "address": "04d07b2a37a6dbae641a3b10f1e8d1eb2d72ef3614ad977be1f15ca78b1477f2b4b67d33412b9d29ec67df2c8da03ee25b3a5c1e7ce7be3e33e1f2a47091a58e84",
            "signature": {
                "r": "e4a731287db5d9a59d823b65cf56ea8a8f3197839e66b106173fd78f5ef5c89f",
                "s": "2c9cd0387e21129a7bf99eaa5f080f8d76e429ced701333a15df38f6e81ada9e",
                "recoveryParam": 1
            }
        }
    }
}
```