import { Link } from '@remix-run/react';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center border-b border-black">
      <h1 className="m-4 text-xl">SNAP!</h1>
      <Link
        to="/"
        className="px-4 py-2 hover:bg-blue-500  bg-blue-400 active:bg-blue-700 text-white text-xl"
      >
        Get a new deck
      </Link>
      <div className="flex space-x-4 m-4">
        <div className="w-10 h-10 rounded-full border border-black"></div>
        <div className="w-10 h-10 rounded-full border border-green-900"></div>
        <div className="w-10 h-10 rounded-full border border-blue-700"></div>
      </div>
    </div>
  );
};

export default Navbar;
