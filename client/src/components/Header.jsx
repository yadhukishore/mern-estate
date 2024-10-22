import {FaSearch} from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Header = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user);
  console.log("Current Useree:",currentUser);
  console.log("Avatar URL:", currentUser?.avathar); // Check if this prints the correct URL


  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap" onClick={() => navigate('/')}>
          <span className="text-slate-500">Yk</span>
          <span className="text-slate-700">Estates</span>
        </h1>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input type="text" placeholder="Search.." className="bg-transparent focus:outline-none w-24 sm:w-64" />
          <FaSearch className='text-slate-600' />
        </form>
        <ul className='flex gap-4'>
          <li className='hidden sm:inline text-slate-700 hover:underline' onClick={() => navigate('/')}>Home</li>
          <li className='hidden sm:inline text-slate-700 hover:underline' onClick={() => navigate('/about')}>About</li>
          <li onClick={() => navigate('/profile')}>
            {currentUser && currentUser.avathar ? (
              <img src={currentUser?.avathar} alt='profile' className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className='sm:inline text-slate-700 hover:underline'>Sign In</span>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header