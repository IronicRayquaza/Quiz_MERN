// import { Link } from "react-router-dom";

// const Navbar = () => {
//   return (
//     <nav className="bg-blue-600 text-white p-4 flex justify-between">
//       <h1 className="text-xl font-bold">MERN Firebase Auth</h1>
//       <div className="space-x-4">
//         <Link to="/" className="hover:underline">Home</Link>
//         <Link to="/login" className="hover:underline">Login</Link>
//         <Link to="/register" className="hover:underline">Register</Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../pages/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if the user is on a dashboard route
  const isDashboard = location.pathname.includes("dashboard");

  // Track authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">MERN Firebase Auth</h1>
      <div className="space-x-4">
        {!isDashboard ? (
          <>
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="hover:underline"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
