import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../axiosinterceptor";
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingData, amount } = location.state || {};

  // Redirect if accessed directly without state
  useEffect(() => {
    if (!bookingData || !amount) {
      navigate("/");
    }
  }, [bookingData, amount, navigate]);

  const handlePayment = async () => {
    try {
      // 1️⃣ Create Razorpay order
      const { data: order } = await API.post("/payments/create-order", { amount });

      // 2️⃣ Razorpay checkout options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "MindBloom",
        order_id: order.id,
        handler: async (response) => {
          // 3️⃣ Verify payment on backend
          const result = await API.post("/payments/verify", {
            ...response,
            bookingData,
          });

          if (result.data.status === "ok") {
            alert("Booking Successful!");
            navigate("/dashboard");
          } else {
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#C9847A",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Complete Payment</h2>
      <p>Amount: ₹{amount}</p>
      <button
        onClick={handlePayment}
        style={{
          padding: "1rem 2rem",
          backgroundColor: "#C9847A",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;