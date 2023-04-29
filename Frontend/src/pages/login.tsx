import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios, { AxiosError, AxiosResponse } from "axios";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import UserAccount from "./UserAcoount";

export default function Logaccount() {
  const [UserData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    City: "",
    email: "",
    password: "",
    PhoneNumber: "",
    AddressLine: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signinmsg, setsigninmsg] = useState("");
  const [loginmsg, setloginmsg] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationMessaget, setVerificationMessagett] = useState("");
  const navigate = useNavigate();
  function HandleChange(event: any) {
    const { name, value } = event.target;
    setUserData((prevFormdata) => ({
      ...prevFormdata,
      [name]: value,
    }));
  }

  async function registerform(e: any) {
    e.preventDefault();

    try {
      const response: AxiosResponse = await axios.post(
        "https://alakifekbackend.onrender.com/api/ath/register",
        UserData
      );
      setsigninmsg(response.data);
      console.log(response.data);
      const timeoutId = setTimeout(() => {
        setsigninmsg("");
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    } catch (error) {
      console.log(error);
      setVerificationMessage("Email already exists.");
      const timeoutId = setTimeout(() => {
        setVerificationMessage("");
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }

  const loginform = async (e: any) => {
    e.preventDefault();
    const loginform = {
      email: UserData.email,
      password: UserData.password,
    };
    try {
      const response = await axios.post(
        "https://alakifekbackend.onrender.com/api/ath/login",
        loginform
      );
      Cookies.set("token", response.data.token);
      if (response.status == 200) {
        setloginmsg("Welcome Back");
      }

      navigate("/profile");
    } catch (error) {
      setVerificationMessagett("Email OR Password Not Correct");
      const timeoutId = setTimeout(() => {
        setVerificationMessagett("");
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  };
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <UserAccount />
      ) : (
        <div className="container my-3">
          <div className="main mx-auto ">
            <input type="checkbox" id="chk" aria-hidden="true" />
            <div className="signup">
              <form onSubmit={registerform}>
                <label htmlFor="chk" aria-hidden="true">
                  Sign up
                </label>

                <input
                  type="text"
                  name="FirstName"
                  placeholder="FirstName"
                  value={UserData.FirstName}
                  onChange={HandleChange}
                  required={true}
                />
                <input
                  type="text"
                  name="LastName"
                  placeholder="LastName"
                  value={UserData.LastName}
                  onChange={HandleChange}
                  required={true}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={UserData.email}
                  onChange={HandleChange}
                  required={true}
                />
                <input
                  type="password"
                  name="password"
                  value={UserData.password}
                  onChange={HandleChange}
                  placeholder="Password"
                  required={true}
                />

                <input
                  type="number"
                  name="PhoneNumber"
                  value={UserData.PhoneNumber}
                  onChange={HandleChange}
                  placeholder="Phone Number"
                  required={true}
                />
                <input
                  type="text"
                  name="City"
                  placeholder="City"
                  value={UserData.City}
                  onChange={HandleChange}
                  required={true}
                />
                <input
                  type="text"
                  name="AddressLine"
                  value={UserData.AddressLine}
                  onChange={HandleChange}
                  placeholder="Location"
                  required={true}
                />
                {signinmsg && (
                  <div
                    className="alert success-danger w-50 mx-auto"
                    role="alert"
                  >
                    {signinmsg}
                  </div>
                )}
                {verificationMessage && (
                  <div className="alert alert-danger w-50 mx-auto" role="alert">
                    {verificationMessage}
                  </div>
                )}
                <button
                  className="btn btn-warning d-block mx-auto w-50 text-white fw-bold"
                  type="submit"
                >
                  Sign up
                </button>
              </form>
            </div>
            <div className="login">
              <form onSubmit={loginform}>
                <label htmlFor="chk" aria-hidden="true">
                  Login
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={UserData.email}
                  onChange={HandleChange}
                  required={true}
                />
                <input
                  type="password"
                  name="password"
                  value={UserData.password}
                  onChange={HandleChange}
                  placeholder="Password"
                  required={true}
                />

                <button
                  className="btn btn-warning d-block mx-auto w-50 text-white fw-bold"
                  type="submit"
                >
                  Login
                </button>
                {verificationMessaget && (
                  <div
                    className={`alert alert-danger w-50 mx-auto my-3 alert-verification ${verificationMessaget &&
                      "alertfadeup"}`}
                    role="alert"
                  >
                    {verificationMessaget}
                  </div>
                )}
                {loginmsg && (
                  <div
                    className={`alert alert-success w-50 mx-auto my-3  ${loginmsg &&
                      "alertfadeup"}`}
                    role="alert"
                  >
                    {loginmsg}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
