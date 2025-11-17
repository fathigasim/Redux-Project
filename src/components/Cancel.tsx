
import { XCircle } from 'lucide-react';
const Cancel = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderRef = urlParams.get('order_ref');

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-lg">
      <XCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-center mb-4">Payment Cancelled</h2>
      
      <p className="text-center text-gray-600 mb-6">
        Your payment was cancelled. Your order has not been processed.
      </p>

      {orderRef && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="text-sm text-gray-600">Order Reference</p>
          <p className="font-mono font-bold">{orderRef}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={() => window.location.href = '/cart'}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Cancel
