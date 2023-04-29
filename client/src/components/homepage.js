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
  const [isLoading, setIsLoading] = useState(false)

  const handleModal = (imageId) => {
    const clickedImage = allImages.find((img) => img._id === imageId);
    setSelectedImage(clickedImage);
    console.log(clickedImage);
    setShowModal(!showModal);
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(`http://localhost:4000/upload/${id}`);
    const newImageList = allImages.filter((img) => img._id !== id);
    setAllImages(newImageList);
    setShowModal(false);
    console.log("deleted", res.data);
  };

  console.log(showModal);
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
    // const formData = new FormData();
    // formData.append("base64", images);
    // formData.append("imgTitle", title);
    axios
      .post(
        "http://localhost:4000/upload",
        // formData,
        { base64: images, imgTitle: title },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },

          transformRequest: [
            (data, headers) => {
              console.log("Request body size:", headers["Content-Length"]);
              return JSON.stringify(data);
            },
          ],
        }
      )
      .then((response) => {
        fetchImages();
        console.log(response.data);
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
    setIsLoading(true)
    const res = await axios.get("http://localhost:4000/upload");
    setAllImages(res.data);
    setIsLoading(false)
    console.log("image here", allImages);
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
            className="appearance-none border-2 rounded w-[30%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
            className="appearance-none border-2 rounded w-[50%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            onClick={uploadImage}
            className="bg-gray-500 w-[50%] hover:bg-gray-700 text-white mr-3 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            submit
          </button>
          <p className="text-gray-500">file size not more than 50kb*</p>
          {isLoading && <h1> Image Loading.... Please Wait....</h1> }
        </div>
      </form>

      <div
        id="image-preview"
        className="mt-4 py-4 border grid grid-cols-3 grid-rows-3 justify-items-center items-center"
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
            className="cursor-pointer"
            key={Uimage._id}
            onClick={(e) => handleModal(Uimage._id)}
          >
            <img src={Uimage.image} width={200} height={120} alt="gg" />
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
