import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const isAdminRole = (role) =>
  typeof role === "string" &&
  role.trim().toLowerCase() === "admin";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: { pathname: "/admin/dashboard" } }}
      />
    );
  }

  if (!isAdminRole(user.role) || user.status !== "Active") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-10 rounded-xl shadow-lg max-w-md text-center">
          <div className="text-5xl mb-4">Access</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Your account does not have administrator permissions.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Please contact the site administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
