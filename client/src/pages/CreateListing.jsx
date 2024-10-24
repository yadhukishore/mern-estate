import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase/firebase";


const CreateListing = () => {
    const [files,setFiles] =useState([]);
    const [formData,setFormData] = useState({
        imageUrls:[],
    });
    const [imageUploadError,setImageUploadError]=useState(false);
    const [uploading,setUploading] = useState(false);
    console.log("FoemData: ",formData);

   const handleImageSubmit = (e) => {
  e.preventDefault(); 
  if (files.length > 0 && files.length +formData.imageUrls.length < 7) {
    setUploading(true);
    setImageUploadError(false);
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      promises.push(storeImage(files[i]));
    }
    Promise.all(promises)
      .then((urls) => {
        console.log("Uploaded URLs: ", urls);
        setFormData((prevState) => ({
          ...prevState,
          imageUrls: [...prevState.imageUrls, ...urls],
        }));
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((error) =>{
        setImageUploadError("Image upload failed (2 mb max per image!)");
        console.error("Error uploading images: ", error);
        setUploading(false);
      } )
  } else {
    setImageUploadError("You can only upload 6 images perlisting");
    setUploading(false);
    console.log("Please select between 1 and 6 images.");
  }
};

   const storeImage = async(file)=>{
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime()+file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress =
                (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                console.log(`Upload is ${progress}% done..`)
            },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL);
                });
            }
        )
    })
   }

   const handleDelete = (indexToDelete) => {
    const updatedImageUrls = formData.imageUrls.filter((_, index) => index !== indexToDelete);
    setFormData({ ...formData, imageUrls: updatedImageUrls });
  };
  
  return (
    <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>
      Create a Listing
    </h1>
    <form  className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1'>
            <input type="text" placeholder="Name" className="border p-3 rounded-lg"
            id="name" maxLength="62" minLength="10" required/>
            <textarea type="text" placeholder="Desctiption" className="border p-3 rounded-lg"
            id="description" required/>
             <input type="text" placeholder="Address" className="border p-3 rounded-lg"
            id="address"  required/>
            <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
                <input type="checkbox" id="sale" className=" w-5" />
                <span>Sell</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="rent" className=" w-5" />
                <span>Rent</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="parking" className=" w-5" />
                <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="frunished" className=" w-5" />
                <span>Furninshed</span>
            </div>
            <div className="flex gap-2">
                <input type="checkbox" id="offer" className=" w-5" />
                <span>Offer</span>
            </div>
            </div>
        <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
                <input type="number" id="bedrooms" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" id="bathrooms" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" id="regularPrice" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span id="text-xs">($/month)</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input type="number" id="discountPrice" min='1' max='10' required className="p-3 border border-gray-300 rounded-lg"/>
                <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span id="text-xs">($/month)</span>
                </div>
            </div>
        </div>
            
        </div>
        <div className="flex flex-col flex-1 gap-4" >
    <p className="font-semibold" >Images:
        <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
    </p>
    <div className="flex gap-4" >
        <input  onChange={(e) => setFiles(Array.from(e.target.files))}  className="p-3 border border-gray-500 rounded w-full" 
        type="file" id="images" accept="image/*" multiple/>
        <button disabled={uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80" >{uploading?"Uploading...":"UPLOAD"}</button>
    </div>
    <p className="text-red-700" >{imageUploadError && imageUploadError}</p>
    {
  formData.imageUrls.length > 0 ? (
    formData.imageUrls.map((url, index) => (
      <div key={index} className="flex justify-between p-3 border items-center">
        <img src={url} alt="listing" className="w-20 h-20 object-contain rounded-lg" />
        <button 
          onClick={() => handleDelete(index)} // Delete handler
          className="p-3 text-red-700 rounded-lg hover:opacity-95">
          Delete
        </button>
      </div>
    ))
  ) : (
    <p>No images uploaded yet.</p> // Optional: Display this message when no images are uploaded
  )
}


    <button className="p-3 bg-slate-700 text-white rounded-lg uppercase" >Create Listing</button>
        </div>
    </form>
    </main>
  )
}

export default CreateListing;