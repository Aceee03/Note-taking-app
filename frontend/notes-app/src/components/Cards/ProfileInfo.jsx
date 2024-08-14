import React, { useState } from "react";
import { getInitials } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import { FaSpinner } from "react-icons/fa6";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const location = useLocation()

  if (!userInfo) {
    return <div></div>; // Or a different message/state for when userInfo is not available
  }
  return (
    <div className="flex items-center gap-3 ">
      <div
        className={`bg-slate-100 text-slate-950 font-medium w-12 h-12 flex items-center justify-center rounded-full`}
      >
        {getInitials(userInfo.fullName)}
      </div>

      <div className="flex flex-col justify-center">
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button
          className="text-sm underline text-slate-700 hover:text-red-600"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
