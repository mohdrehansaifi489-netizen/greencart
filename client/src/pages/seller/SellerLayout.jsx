import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import { Link, NavLink, Outlet } from "react-router-dom";

const SellerLayour = () => {
  const { axios, navigate } = useAppContext();

  const sidebarLinks = [
    { name: "Add Product", path: "/seller/add-product", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
        <Link to="/">
          <img
            src={assets.logo}
            alt="logo"
            className="cursor-pointer w-32 md:w-36"
          />
        </Link>
        <div className="flex items-center gap-5 text-gray-600">
          <p>Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="md:w-64 w-20 border-r border-gray-300 h-[calc(100vh-64px)] pt-4 flex flex-col bg-white">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 gap-3 transition-colors ${
                  isActive
                    ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                    : "hover:bg-gray-100/90 text-gray-600"
                }`
              }
            >
              <img src={item.icon} alt="" className="w-7 h-7" />
              <p className="hidden md:block">{item.name}</p>
            </NavLink>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SellerLayour;
