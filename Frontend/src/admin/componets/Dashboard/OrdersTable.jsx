export default function OrdersTable({
  orders = []
}) {

  return (

    <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">

      <div className="flex justify-between items-center mb-4">

        <h2 className="font-semibold text-lg">
          Recent Orders
        </h2>

        <span className="text-sm text-gray-400">
          {orders.length} Orders
        </span>

      </div>

      <div className="grid grid-cols-4 text-gray-400 text-sm border-b pb-3">

        <span>Customer</span>

        <span>Date</span>

        <span>Total</span>

        <span>Status</span>

      </div>

      {orders.length === 0 ? (

        <div className="py-8 text-center text-gray-400">

          No Orders Found

        </div>

      ) : (

        orders.map((order) => (

          <div
            key={order._id}
            className="
              grid
              grid-cols-4
              py-3
              border-b
              text-sm
              hover:bg-gray-50
            "
          >

            <span className="font-medium">

              {order.shippingAddress?.firstName ||
                "Customer"}

            </span>

            <span>

              {new Date(
                order.createdAt
              ).toLocaleDateString()}

            </span>

            <span className="font-semibold">

              Rs {order.total}

            </span>

            <span>

              <span
                className={

                  order.orderStatus ===
                  "Delivered"

                    ? `
                      bg-green-100
                      text-green-600
                      px-2
                      py-1
                      rounded-full
                      text-xs
                    `

                    : `
                      bg-yellow-100
                      text-yellow-600
                      px-2
                      py-1
                      rounded-full
                      text-xs
                    `
                }
              >

                {order.orderStatus}

              </span>

            </span>

          </div>
        ))
      )}

    </div>
  );
}