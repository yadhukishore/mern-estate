import { getAuth, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { app } from '../firebase/firebase';
import { useDispatch } from 'react-redux';
import { signInSucess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async() =>{

        try {
            const providerr = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth,providerr);

            const res = await fetch('/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL}),

            });
            const data = await res.json();
            dispatch(signInSucess(data));
            // console.log(result);
            navigate('/');
        } catch (error) {
            console.log("Cant signin to Google Auth",error)
        }
    }
    
  return (
    <button onClick={handleGoogleClick} type="button" className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90">Continue with google</button>
  )
}

export default OAuth