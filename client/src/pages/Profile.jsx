import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { app } from "../firebase/firebase";
import { updateUserStart,updateUserSucess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSucess } from "../redux/user/userSlice";

const Profile = () => {
  const { currentUser ,loading , error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSucess,setUpdateSucess] = useState(false);
  const dispatch = useDispatch();
  console.log("formData: ",formData)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      () => {
        setFileUploadError(true); 
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>
          setFormData({ ...formData, avathar: downloadUrl })
        );
      }
    );
  };
  const handleChange =(e)=>{
    setFormData({...formData,[e.target.id]: e.target.value});
  };
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res= await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.sucess === false){
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSucess(data));
      setUpdateSucess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser = async()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.sucess === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSucess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-center my-7 cursor-none">My Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avathar || currentUser.avathar}
          alt="profile!"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload!!</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Successfully Uploaded!!!</span>
          ) : (
            ""
          )}
        </p>

        <input type="text" placeholder="username" defaultValue={currentUser.username} id="username" className="border p-3 rounded-md" onChange={handleChange} />
        <input type="email" placeholder="email" defaultValue={currentUser.email} id="email" className="border p-3 rounded-md" onChange={handleChange} />
        <input type="password" placeholder="password" defaultValue={currentUser.password} id="password" className="border p-3 rounded-md" onChange={handleChange} />
        <button  disabled={loading}
         className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-85">
          {loading? "Loading...." :"Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer" onClick={handleDeleteUser}>Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign Out?</span>
      </div>
      <p className="text-red-700 mt-5">{error?error:""}</p>
      <p className="text-green-600 mt-5" >{updateSucess ? "Your profile is updated!!!":""}</p>
    </div>
  );
};

export default Profile;
