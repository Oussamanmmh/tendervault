import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { RiSearchLine } from 'react-icons/ri';
import { AccountCircleOutlined } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = ({ searchTerm, onSearchChange, handleSearch, user }) => {
  return (
    <div className='flex flex-col bg-blue-950 w-full sticky top-0 z-50'>
      <div className="container mx-auto flex flex-wrap p-3 flex-col md:flex-row items-center justify-between">
        <Link to="/">
          <div>
            <span className='font-mont text-blue-300 text-4xl font-bold'>Tender</span>
            <span className='font-mont text-gray-50 text-xl font-bold'>Vault</span>
          </div>
        </Link>
        <div className="relative flex-1 px-4">
          <div className="absolute color-gray-900 inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
            <AiOutlineSearch />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            className="w-full py-2 text-sm text-gray-700 bg-gray-50 rounded-md pl-10 pr-10 focus:outline-none focus:bg-white focus:text-gray-900"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 h-full bg-blue-400 px-3 flex items-center justify-center hover:bg-blue-600"
          >
            <RiSearchLine className="text-white" />
          </button>
        </div>
        <nav className="md:ml-auto flex flex-wrap pl-3 items-center text-base justify-center">
          <Link to="/home">
            <span className="font-mont text-gray-50 text-xl font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">Home</span>
          </Link>
          {user && user.role === "company" && (
            <Link to="/createtender">
              <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
                Create
              </span>
            </Link>
          )}
          <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
            Hello, {user?.name}
          </span>
          <span className="font-mont text-gray-50 text-lg font-bold mr-10 hover:text-blue-300 hover:cursor-pointer">
            <Link
              onClick={() => {
                localStorage.removeItem("token");
              }}
              to="/login"
            >
              <LogoutIcon style={{ color: "white", fontSize: 32 }} />
            </Link>
          </span>
        </nav>
        <div className='flex mt-4 md:mt-0'>
          <Link to="/myprofile">
            <AccountCircleOutlined style={{ color: "white", fontSize: 32 }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
