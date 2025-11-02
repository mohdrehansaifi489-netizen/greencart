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

  const [state, setState] = React.useState("login"); // "login" or "register"
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Close modal on ESC key
  React.useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setShowUserLogin(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [setShowUserLogin]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!email || !password || (state === "register" && !name)) {
      return toast.error("Please fill all required fields");
    }

    setLoading(true);
    try {
      const endpoint = `/api/${loginRole}/${state}`;

      const { data } = await axios.post(endpoint, { name, email, password });

      if (data.success) {
        // Reset form fields
        setName("");
        setEmail("");
        setPassword("");

        if (loginRole === "seller") {
          setIsSeller(true);
          navigate("/seller/dashboard");
        } else {
          setUser(data.user);
          navigate("/");
        }

        toast.success(
          `${loginRole === "seller" ? "Seller" : "User"} ${
            state === "register" ? "registration" : "login"
          } successful!`
        );
        setShowUserLogin(false);
      } else {
        toast.error(data.message || "Failed to process request");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm text-sm text-gray-600"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-2xl shadow-xl border border-gray-200 bg-white transition-all"
      >
        <p className="text-2xl font-semibold text-center mb-2">
          <span className="text-primary capitalize">{loginRole}</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {/* Toggle Role */}
        <div className="flex gap-4 justify-center text-sm mb-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="role"
              value="user"
              checked={loginRole === "user"}
              onChange={() => setLoginRole("user")}
              className="mr-1"
            />
            User
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="role"
              value="seller"
              checked={loginRole === "seller"}
              onChange={() => setLoginRole("seller")}
              className="mr-1"
            />
            Seller
          </label>
        </div>

        {state === "register" && (
          <div className="w-full">
            <p className="mb-1">Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 outline-primary"
              type="text"
            />
          </div>
        )}

        <div className="w-full">
          <p className="mb-1">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 outline-primary"
            type="email"
          />
        </div>

        <div className="w-full">
          <p className="mb-1">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 outline-primary"
            type="password"
          />
        </div>

        {state === "register" ? (
          <p className="text-center w-full">
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-center w-full">
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-indigo-500 cursor-pointer"
            >
              Sign up here
            </span>
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`bg-primary text-white w-full py-2 rounded-md transition-all ${
            loading
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-primary-dull cursor-pointer"
          }`}
        >
          {loading
            ? "Please wait..."
            : state === "register"
            ? "Create Account"
            : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
