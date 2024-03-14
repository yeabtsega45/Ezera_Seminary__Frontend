import { useState } from "react";
import { GoogleLogo, FacebookLogo } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "@/redux/api-slices/apiSlice";
import { login as loginAction } from "@/redux/authSlice";
import LoadingAnimation from "../../features/login/LoadingAnimation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation(); // use the hook
  const navigate = useNavigate();
  const dispatch = useDispatch(); // get the dispatch function from Redux

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap(); // call the mutation
      if (result) {
        // save the user to local storage
        localStorage.setItem("user", JSON.stringify(result));

        // update the auth context
        dispatch(loginAction(result)); // dispatch the login action from authSlice

        if (result.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
   <div className="flex h-screen items-center justify-center">
   <div className="flex w-[90%] md:w-[80%] lg:w-[75%] xl:w-[70%] h-[80%]  rounded-xl md:border-2 md:border-accent-6 mx-auto   md:shadow-xl ">
      <div
        className="md:flex flex-col coming-soon bg-cover hidden lg:w-[58%] font-nokia-bold p-7 justify-between text-white rounded-xl gap-64"
        style={{ backgroundPositionX: "-80px" }}
      >
        <div className="flex space-x-3 cursor-pointer text-white ">
          <img src="/assets/ezra-logo.svg" alt="" />
          <h3 className=" text-2xl font-Lato-Regular">
            <span className="font-Lato-Bold">EZRA</span> Seminary
          </h3>
        </div>
        <p className="text-xl lg:text-3xl w-max">
          መጽሃፍ ቅዱስ እግዚአብሔርን
          <br />
          <span className="text-3xl lg:text-4xl text-accent-6">በግላችን የምናውቅበት</span>
          <br />
          ዋነኛው መንገድ ነው።
          <br />
        </p>
      </div>
      <form
        className="flex flex-col font-nokia-bold px-7 justify-center items-center  lg:items-start py-16 text-accent-6 w-[90%] mx-auto  md:w-[20em] lg:w-[50%] border border-accent-5 md:border-none rounded-lg shadow-2xl md:shadow-none "
        onSubmit={handleSubmit}
      >
        <h3 className="text-3xl xl:text-4xl">
          <span className="text-secondary-6">Log</span>in
        </h3>
        <div className="mt-4 flex flex-col gap-2 text-xs  w-max lg:w-full xl:text-xl ">
          <label>Email</label>
          <input
            type="email"
            className="border rounded-lg border-accent-6 placeholder:text-accent-3 text-xs1  p-2 mb-2  outline-accent-6 xl:text-sm"
            placeholder="abc@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type={showPassword ? "text" : "password"} // change type based on showPassword state
            className="border rounded-lg border-accent-6  placeholder:text-accent-3 text-xs1 p-2 outline-accent-6 xl:text-sm"
            placeholder="********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mt-4 flex justify-between gap-7">
            <div className=" flex gap-2">
              <input
                type="checkbox"
                className="appearance-none border-2 border-accent-6 rounded-md w-5 h-5 checked:bg-accent-6 checked:border-transparent text-white"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)} // toggle showPassword state when checkbox is clicked
              />
              <label>Show Password</label>
            </div>
            <p className="self-end">Forgot Password?</p>
          </div>
          <div className="flex mt-4 gap-2">
            <input
              type="checkbox"
              className="appearance-none border-2 border-accent-6 rounded-md w-5 h-5 checked:bg-accent-6 checked:border-transparent text-white"
            />
            <label className="text-xs  xl:text-xl">Remember me</label>
          </div>
        </div>
        <div className="w-full  mt-4 flex justify-center md:justify-between lg:items-start  lg:justify-start gap-2  xl:text-xl">
          <button
            disabled={isLoading}
            className="w-[30%] lg:w-[55%] xl:w-[65%] bg-accent-6 text-primary-1 px-4 py-[1%] lg:py-[1.4%] xl:py-[1%] rounded-sm hover:bg-accent-7 hover:cursor-pointer transition-all"
          >
            {isLoading ? <LoadingAnimation /> : "Login"}
            {/* Render loading spinner if isLoading is true, otherwise show "Login" */}
          </button>
          <Link
            className="w-max border border-accent-6 rounded-sm px-4 lg:px-8 flex justify-center py-1 lg:py-[1%] xl:py-1 items-center hover:bg-secondary-6 hover:text-primary-1 hover:border-secondary-6 transition-all"
            to="/signup"
          >
            <p>Sign Up</p>
          </Link>
        </div>
        {error && <>{error}</>}
        <div className="text-xs mt-4  xl:text-xl">
          <p>Or signup with</p>
          <div className="flex mt-2 text-2xl text-white gap-2  xl:text-3xl ">
            <GoogleLogo className="bg-accent-6 rounded-full hover:bg-accent-7 hover:cursor-pointer  transition-all"></GoogleLogo>
            <FacebookLogo className="bg-accent-6 rounded-full  hover:bg-accent-7  hover:cursor-pointer  transition-all"></FacebookLogo>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default Login;
