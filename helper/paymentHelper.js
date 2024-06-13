const crypto = require('crypto');

function generateSignature(merchantTxnId, request) {
    const secret_key = "***YourSecretKey***"; // Replace with your actual secret key
    const accesskey = "***YourAccessKey***"; // Replace with your actual access key
    const txn_id = merchantTxnId; // Unique transaction ID
    const amount = "1.00"; // Transaction amount

    const data = `merchantAccessKey=${accesskey}&transactionId=${txn_id}&amount=${amount}`;

    const hmac = crypto.createHmac('sha1', secret_key);
    hmac.update(data);
    return hmac.digest('hex');
}

module.exports = generateSignature