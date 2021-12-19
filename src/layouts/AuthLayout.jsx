import React from "react";
import { Outlet } from "react-router";
import { ToastContainer } from "react-toastify";

const AuthLayout = () => {
  return (
    <div className="flex flex-col md:flex-row flex-no-wrap h-screen bg-dark-custom bg-gd-custom">
      <div className="flex w-full h-full">
        <div className="w-full h-full  overflow-y-scroll">
          <Outlet />
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
