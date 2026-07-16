import React, { useEffect, useState } from "react";
import { FiBell, FiMenu } from "react-icons/fi";
import { apiUrl } from "../../lib/api";

const Navbar = ({
  notifications = [],
  unreadCount = 0,
  clearUnread = () => {},
  toggleSidebar
}) => {

  const [admin, setAdmin] = useState(null);

  const [showNotifications,
    setShowNotifications] =
    useState(false);

  useEffect(() => {

    fetch(
      apiUrl("/current-user"),
      {
        credentials: "include",
      }
    )
      .then(res => res.json())
      .then(data => setAdmin(data.user))
      .catch(() => setAdmin(null));

  }, []);

  const handleBellClick = () => {

    setShowNotifications(
      !showNotifications
    );

    clearUnread();
  };

  return (

    <div className="w-full max-w-full overflow-x-hidden bg-white shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
<button
  onClick={toggleSidebar}
  className="
    md:hidden
    text-2xl
    text-gray-700
    shrink-0
  "
>
  <FiMenu />
</button>
      {/* SEARCH */}

      <div className="hidden md:flex items-center gap-3 flex-1 min-w-0">

        <div className="relative w-full max-w-md min-w-0">

          <input
            type="text"
            placeholder="Quick Search..."
            className="
              bg-gray-100
              rounded-full
              pl-10
              pr-4
              py-2
              text-sm
              focus:outline-none
              w-full
              min-w-0
            "
          />

          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">

        {/* NOTIFICATIONS */}

        <div className="relative">

          <button

            onClick={handleBellClick}

            className="relative"
          >

            <FiBell
              size={24}
              className="
                text-gray-700
                hover:text-blue-600
                transition
              "
            />

            {unreadCount > 0 && (

              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-xs
                  rounded-full
                  min-w-[20px]
                  h-[20px]
                  flex
                  items-center
                  justify-center
                  font-semibold
                "
              >
                {unreadCount}
              </span>
            )}

          </button>

          {/* DROPDOWN */}

          {showNotifications && (

            <div
              className="
                absolute
                right-0
                mt-4
                w-[calc(100vw-2rem)]
                max-w-sm
                bg-white
                shadow-2xl
                rounded-2xl
                border
                z-50
                overflow-hidden
                max-h-[500px]
                overflow-y-auto
              "
            >

              {/* HEADER */}

              <div
                className="
                  px-5
                  py-4
                  border-b
                  bg-gray-50
                  flex
                  justify-between
                  items-center
                "
              >

                <h3 className="font-semibold text-lg">
                  Notifications
                </h3>

                <button

                  onClick={clearUnread}

                  className="
                    text-xs
                    text-blue-600
                    hover:text-blue-800
                  "
                >
                  Mark All Read
                </button>

              </div>

              {/* EMPTY */}

              {notifications.length === 0 ? (

                <div className="p-8 text-center text-gray-500">

                  No Notifications

                </div>

              ) : (

                notifications.map((item) => (

                  <div

                    key={item.id}

                    className="
                      p-4
                      border-b
                      hover:bg-blue-50
                      transition
                      cursor-pointer
                      flex
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-blue-100
                        flex
                        items-center
                        justify-center
                      "
                    >
                      🛒
                    </div>

                    <div className="flex-1">

                      <div
                        className="
                          flex
                          justify-between
                        "
                      >

                        <h4 className="font-semibold">
                          New Order
                        </h4>

                        <span
                          className="
                            text-xs
                            text-gray-400
                          "
                        >
                          {item.time || "Now"}
                        </span>

                      </div>

                      <p
                        className="
                          text-sm
                          text-gray-600
                        "
                      >
                        Customer:
                        {" "}
                        {item.customer}
                      </p>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-green-600
                        "
                      >
                        Rs {item.total}
                      </p>

                    </div>

                  </div>
                ))
              )}

            </div>
          )}

        </div>

        {/* LANGUAGE */}

    

        {/* PROFILE */}

        <div
          className="
            flex
            items-center
            gap-2
            cursor-pointer
          "
        >

          {admin?.image ? (

            <img
              src={admin.image}
              alt="user"
              className="
                w-8
                h-8
                rounded-full
              "
            />

          ) : (

            <div
              className="
                w-8
                h-8
                rounded-full
                bg-blue-500
                text-white
                flex
                items-center
                justify-center
                font-semibold
              "
            >
              {admin?.email
                ? admin.email[0].toUpperCase()
                : "A"}
            </div>
          )}

          <div
            className="
              text-sm
              leading-tight
            "
          >

            <p className="font-medium">
              {admin?.username || "Admin"}
            </p>

            <p
              className="
                text-gray-500
                text-xs
              "
            >
              {admin?.role || "Admin Head"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Navbar;
