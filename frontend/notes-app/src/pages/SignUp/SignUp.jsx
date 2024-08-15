import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { useState } from "react";
import { validateEmail } from "../../utils/helper";
import { axiosInstance } from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    } else {
      setError(null);
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError("");
    const lowerCaseEmail = email.toLowerCase()

    //Sign Up API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: lowerCaseEmail,
        password,
      })
      // HANDLE SUCCESSFULL SIGNUP CALL
      if(response.data && response.data.error){
        setError(response.data.message)
        return 
      }

      if(response.data && response.data.accessToken){
        localStorage.setItem('token', response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {

    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">Sign Up</h4>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Full Name"
              className="input-box"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className="input-box"
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <button type="submit" className="btn-primary">
              Create account
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account ?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
