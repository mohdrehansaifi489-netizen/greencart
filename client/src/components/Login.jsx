import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const {
    setShowUserLogin,
    setUser,
    setIsSeller,
    axios,
    navigate,
    loginRole,
    setLoginRole,
  } = useAppContext();

  const [state, setState] = React.useState("login");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      // dynamic API route based on login role (user or seller)
      const endpoint = loginRole === "seller" ? "/api/seller" : "/api/user";

      const { data } = await axios.post(`${endpoint}/${state}`, {
        name,
        email,
        password,
      });

      if (data.success) {
        if (loginRole === "seller") {
          setIsSeller(true);
          navigate("/seller/dashboard");
        } else {
          setUser(data.user);
          navigate("/");
        }
        toast.success(`${loginRole === "seller" ? "Seller" : "User"} ${state} successful!`);
        setShowUserLogin(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-30 flex items-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary capitalize">{loginRole}</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Toggle Role */}
        <div className="flex gap-4 mb-3 text-sm">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={loginRole === "user"}
              onChange={() => setLoginRole("user")}
            />{" "}
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="seller"
              checked={loginRole === "seller"}
              onChange={() => setLoginRole("seller")}
            />{" "}
            Seller
          </label>
        </div>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required
          />
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button className="bg-primary hover:bg-primary-dull transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
