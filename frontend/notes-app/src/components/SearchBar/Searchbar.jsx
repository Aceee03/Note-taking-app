import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const Searchbar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-lg">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
      />
      <div className="flex items-center flex-row gap-2">
        {value && (
          <IoMdClose
            className="text-xl text-slate-500 cursor-pointer hover:text-black"
            onClick={onClearSearch}
          />
        )}
        <FaMagnifyingGlass
          className="text-slate-400 cursor-pointer hover:text-black"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

export default Searchbar;
