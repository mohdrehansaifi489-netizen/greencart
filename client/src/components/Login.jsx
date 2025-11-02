import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const {
    setShowUserLogin,
    axios,
    navigate,
    setUser,
    setIsSeller,
    loginRole,
    setLoginRole
  } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const endpoint =
      loginRole === "seller"
        ? `/api/seller/${state}`
        : `/api/user/${state}`;

    try {
      const { data } = await axios.post(
        endpoint,
        { name, email, password },
        { withCredentials: true }
      );

      if (!data.success) return toast.error(data.message);

      setShowUserLogin(false);

      if (loginRole === "seller") {
        setIsSeller(true);
        navigate("/seller");
      } else {
        setUser(data.user);
        navigate("/");
      }

      toast.success("✅ Login Successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/50"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 bg-white w-80 sm:w-96 p-8 rounded-xl shadow-lg"
      >
        {/* Toggle User / Seller */}
        <div className="flex gap-4 m-auto">
          <button
            type="button"
            className={`px-3 py-1 rounded ${loginRole === "user" ? "bg-primary text-white" : "bg-gray-300"}`}
            onClick={() => setLoginRole("user")}
          >
            User
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded ${loginRole === "seller" ? "bg-primary text-white" : "bg-gray-300"}`}
            onClick={() => setLoginRole("seller")}
          >
            Seller
          </button>
        </div>

        <p className="text-2xl font-medium text-center">
          {loginRole === "seller" ? "Seller" : "User"}{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && loginRole === "user" && (
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="border p-2 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="text-center">
          {state === "login" ? (
            <>
              Need an account?{" "}
              <span
                onClick={() => setState("register")}
                className="text-primary cursor-pointer"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already registered?{" "}
              <span
                onClick={() => setState("login")}
                className="text-primary cursor-pointer"
              >
                Login
              </span>
            </>
          )}
        </p>

        <button className="bg-primary text-white w-full py-2 rounded-md">
          Continue
        </button>
      </form>
    </div>
  );
};

export default Login;
