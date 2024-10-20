import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';

const SignUp = () => {
  const [formData,setFormData] = useState({});
  const [error,setError] = useState(null);
  const [loading,setLoading] = useState(false);
  const navigate =useNavigate();
  const handleChange = (e) =>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    setLoading(true);
    setError(null);
    try{
    const res = await fetch('/api/auth/signup',
      {
        method:'POST',
        headers:{
          'Content-type': 'application/json',
        },
        body:JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.sucess === false){
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in")
      console.log(data);
    }catch(err){
      setLoading(false);
      setError(err.message);
    }
    };
  console.log(formData)
  return (
    <div className="p-3 max-w-lg mx-auto" >
      <h1 className="text-3xl text-center font-bold my-7" >Sign Up</h1>
        {/* Show error message if exists */}
        {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" onChange={handleChange}/>
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" onChange={handleChange} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}/>
      <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75">{loading ? 'Loading...' : 'Sign Up'}</button>
      <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
        <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp