import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./imageModal.module.css";
axios.defaults.maxContentLength = 20 * 1024 * 1024; // set maximum allowed size to 20 MB

const Homepage = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [progressPercent, setProgressPercent] = useState(0);

  const handleModal = (imageId) => {
    const clickedImage = allImages.find((img) => img._id === imageId);
    setSelectedImage(clickedImage);
    setShowModal(!showModal);
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(`https://gallery-app-5iz4.onrender.com/upload/${id}`);
    const newImageList = allImages.filter((img) => img._id !== id);
    setAllImages(newImageList);
    setShowModal(false);
    console.log("deleted", res.data);
  };

  // console.log(showModal);
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result); // base64encoded string
      setImages(reader.result);
    };
    reader.onerror = (error) => {
      console.log("error", error);
    };
  }

  function uploadImage(e) {
    e.preventDefault();

    axios
      .post(
        "https://gallery-app-5iz4.onrender.com/upload",
        { base64: images, imgTitle: title },

        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "https://silvergallery.netlify.app",
          },
          onUploadProgress: function(progressEvent) {
            var percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(percentCompleted);
            // setProgressPercent(percentCompleted)
            // You can update the UI here to show the percentage
          },
          
        }
      )
      .then((response) => {
        fetchImages();
      })
      .catch((error) => {
        if (error.response.status === 413) {
          alert("File size is too large, please upload a smaller file");
        } else {
          console.error("upload failed", error);
        }
      });
  }

  const fetchImages = async () => {
    setIsLoading(true);
    const res = await axios.get("https://gallery-app-5iz4.onrender.com/upload");
    setAllImages(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="p-8 border">
      <form>
        <div className="mb-4 flex items-center flex-col space-y-4 ">
          <label className="block text-lg text-gray-700 font-bold mb-2">
            Upload Image
          </label>
          <input
            className="appearance-none border-2 rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-4/5 lg:w-2/5"
            type="text"
            placeholder="Input Image Title Here"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <input
            accept="image/*"
            type="file"
            name="image"
            onChange={convertToBase64}
            className="appearance-none border-2 rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full sm:w-4/5 lg:w-2/5"
          />
          <button
            onClick={uploadImage}
            className="  bg-blue-500  hover:bg-blue-700 text-white mr-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-4/5 lg:w-2/5"
          >
            submit
          </button>
          <p className="text-gray-500">file size not more than 2mb*</p>
          {isLoading && (
            <div className="flex flex-col  items-center justify-center">
              <div className="w-20 h-20  rounded-full border-blue-500 border-b-4 animate-spin"></div>{" "}
              {/* <h1>{progressPercent}%</h1> */}
              <h1> Image Loading.... Please Wait....</h1>
            </div>
          )}
        </div>
      </form>

      <div
        id="image-preview"
        //
        className="mt-4 py-4 border grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-3   justify-items-center items-center"
      >
        {/* {images === "" || images == null ? (
          ""
        ) : (
          <img src={images} width={200} height={120} alt="gg" />
        )} */}
        {/* {allImages === "" || allImages == null ? (
          ""
        ) : (
          <img src={allImages} width={200} height={120} alt="gg" />
        )} */}

        {allImages.map((Uimage) => (
          <div
            className=" flex items-center flex-col justify-center cursor-pointer mx-1 px-1 my-3 border min-h-[130px] "
            key={Uimage._id}
            onClick={(e) => handleModal(Uimage._id)}
          >
            <img src={Uimage.image}  alt="gg" className="object-contain w-[200px] h-[120px]" />
            <h3 className="text-center text-lg py-2">{Uimage.title}</h3>
          </div>
        ))}
        {showModal && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className={styles["modal-image"]}
              />
              <div className={styles["btn-con"]}>
                <button
                  className={styles["close-btn"]}
                  onClick={() => setShowModal(false)}
                >
                  close
                </button>
                <button
                  className={styles["delete-btn"]}
                  onClick={(_id) => handleDelete(selectedImage._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
