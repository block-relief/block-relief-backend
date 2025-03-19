const axios = require('axios')

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_BASE_URL = process.env.PAYSTACK_BASE_URL || "https://api.paystack.co"

async function initiatePayment({ amount, email, metadata }) {
    try {
        const numericAmount = parseFloat(amount); 
        if (isNaN(numericAmount)) {
            throw new Error("Invalid amount provided");
        }

        const amountInInt = Math.round(numericAmount * 100);

        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                amount: amountInInt,
                email,
                metadata,
            },
            { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
        )
        return response.data.data
    } catch (error) {
        throw new Error("Paystack initiation failed: " + error.message)
    }
}


async function verifyPayment(reference) {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
        )
        return response.data.data
    } catch (error) {
       throw new Error("Paystack verification failed: " + error.message) 
    }
}

module.exports = {
    initiatePayment,
    verifyPayment,
}