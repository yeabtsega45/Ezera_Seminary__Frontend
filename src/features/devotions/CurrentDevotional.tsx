import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { DownloadSimple } from "@phosphor-icons/react";
import { ShareNetwork } from "@phosphor-icons/react";
import type { AppDispatch } from "@/redux/store"; // Import the AppDispatch type
import { FaTrash, FaEdit } from "react-icons/fa";
import {
  selectDevotion,
  deleteDevotion,
  setIsEditing,
} from "../../redux/devotionsSlice";
import { useGetDevotionsQuery } from "../../redux/api-slices/apiSlice";
import { RootState, Devotion } from "@/redux/types";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CurrentDevotionalProps {
  devotionToDisplay: Devotion;
  showControls: boolean;
}

// This line should be placed outside your component
Modal.setAppElement("#root");

interface CurrentDevotionalProps {
  devotionToDisplay: Devotion;
  showControls: boolean;
  toogleForm: () => void; // Add the toogleForm property
}

const CurrentDevotional: React.FC<CurrentDevotionalProps> = ({
  devotionToDisplay,
  showControls,
  toogleForm,
}) => {
  const { refetch } = useGetDevotionsQuery(); // get the authentication token
  const role = useSelector((state: RootState) => state.auth.user?.role); // get the authentication token
  const dispatch = useDispatch<AppDispatch>();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [devotionToDelete, setDevotionToDelete] = useState<string | null>(null); // new state variable

  const handleDelete = async (id: string) => {
    // One typescript error below to fix ❗❗❗
    await dispatch(deleteDevotion(id)); // dispatch delete action
    toast.success("Devotion deleted successfully!");
    refetch(); // refetch the devotions data
    setModalIsOpen(false); // close the modal
  };

  const startEditing = (devotion: Devotion) => {
    dispatch(selectDevotion(devotion)); // dispatch select action
    dispatch(setIsEditing(true)); // dispatch startEditing action
    toogleForm();
  };

  return (
    <>
      <ToastContainer />
      <div className="h-auto border shadow-lg rounded-2xl p-6 md:w-[90%] mx-auto border-accent-6">
        <div>
          <h1 className="text-accent-6 text-xl font-nokia-bold md:text-3xl ">
            Daily Devotional - የዕለቱ ጥቅስ
          </h1>
        </div>
        <div className="flex flex-col justify-center lg:flex-row  lg:space-x-12">
          {/* Replace latestDevotion with devotionToDisplay */}
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="Delete Confirmation"
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.75)", // This will give the overlay a black color with 75% opacity
              },
              content: {
                top: "50%",
                left: "55%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#fff", // This will give the modal a white background
                border: "1px solid #ccc", // This will give the modal a border
                borderRadius: "10px", // This will round the corners of the modal
                padding: "20px", // This will add some padding inside the modal
                width: "30%", // This will set the width of the modal to 30% of the viewport width
                height: "30%", // This will set the height of the modal to 30% of the viewport height
                display: "flex", // This will make the content a flex container
                flexDirection: "column", // This will make the flex items stack vertically
                justifyContent: "center", // This will center the flex items vertically
                alignItems: "center", // This will center the flex items horizontally
              },
            }}
          >
            <h2 className="text-2xl font-Lato-black text-secondary-6 mb-2">
              Are you sure you want to delete this devotion?
            </h2>
            <div>
              <button
                onClick={() => {
                  if (devotionToDelete) {
                    handleDelete(devotionToDelete); // delete the devotion when "Yes" is clicked
                  }
                }}
                style={{
                  backgroundColor: "#ff0000", // red background
                  color: "#ffffff", // white text
                  border: "none", // remove border
                  borderRadius: "5px", // rounded corners
                  padding: "10px 20px", // vertical and horizontal padding
                  marginRight: "10px", // space between the buttons
                  cursor: "pointer", // change cursor on hover
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setModalIsOpen(false)}
                style={{
                  backgroundColor: "#1A2024", // green background
                  color: "#ffffff", // white text
                  border: "none", // remove border
                  borderRadius: "5px", // rounded corners
                  padding: "10px 20px", // vertical and horizontal padding
                  cursor: "pointer", // change cursor on hover
                }}
              >
                No
              </button>
            </div>
          </Modal>
          {devotionToDisplay &&
          (devotionToDisplay.month !== "" || devotionToDisplay.day !== "") ? (
            <div className="rounded-xl md:w-[15%] h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
              <div className="w-[95%] h-[95%] mx-auto  flex flex-col justify-center items-center border-2 bg-secondary-6  rounded-xl my-1 leading-none  py-4">
                <p className=" font-nokia-bold md:text-2xl text-[#fff]">
                  {devotionToDisplay.month}
                </p>
                <p className="md:text-5xl font-nokia-bold text-[#fff] -mt-3">
                  {devotionToDisplay.day}
                </p>
              </div>
            </div>
          ) : (
            <div className="hidden rounded-xl md:w-[20%] h-full border-2 bg-[#fff] border-accent-5 mt-8 text-secondary-6">
              <div className="w-[90%] mx-auto h-[95%] flex flex-col justify-center items-center border-2 bg-secondary-6   rounded-xl my-1 leading-none py-6">
                <p className="font-nokia-bold md:text-2xl text-[#fff]">
                  {devotionToDisplay && devotionToDisplay.month}
                </p>
                <p className="font-nokia-bold md:text-5xl text-[#fff] -mt-3">
                  {devotionToDisplay && devotionToDisplay.day}
                </p>
              </div>
            </div>
          )}

          {/* devotion contents */}
          <div className="font-nokia-bold flex flex-col w-[90%] lg:w-[50%] space-y-2 mt-8 mx-auto">
            {/* devotion titles */}
            <div className="flex width: 100% space-x-12">
              <h1 className="md:text-2xl text-justify text-secondary-6">
                {devotionToDisplay && devotionToDisplay.title}
              </h1>
              {role === "Admin" && showControls && (
                <>
                  <FaTrash
                    className="text-gray-700 text-xl cursor-pointer self-center"
                    onClick={() => {
                      setDevotionToDelete(devotionToDisplay?._id || ""); // set the id to delete
                      setModalIsOpen(true); // open the modal
                    }}
                  />
                  <FaEdit
                    className="text-gray-700 text-xl cursor-pointer self-center "
                    onClick={() => startEditing(devotionToDisplay)}
                  />
                </>
              )}
            </div>

            {/* devotion chapter */}

            <h4 className="flex gap-2 text-1xl text-secondary-6 w-full">
              የዕለቱ የመጽሐፍ ቅዱስ ንባብ ክፍል-
              <span>
                <h2 className=" text-sm text-accent-5">
                  {devotionToDisplay && devotionToDisplay.chapter}
                </h2>
              </span>
            </h4>

            {/* devotion verse */}
            <p className=" text-xs text-accent-5">
              {devotionToDisplay && devotionToDisplay.verse}
            </p>

            {devotionToDisplay && devotionToDisplay.chapter !== "" ? (
              <hr className="border-accent-5" />
            ) : (
              <hr className="hidden border-secondary-6" />
            )}

            {/* devotion paragraphs */}
            {devotionToDisplay &&
              devotionToDisplay.body.map((paragraph, paragraphIndex) => (
                <p
                  className=" font-nokia-bold text-sm text-justify text-secondary-6 space-y-3"
                  key={paragraphIndex}
                >
                  {paragraph}
                </p>
              ))}

            {devotionToDisplay && devotionToDisplay.prayer !== "" ? (
              <p className="font-nokia-bold text-1xl text-center border-2 border-accent-5 p-2 rounded text-accent-5">
                {devotionToDisplay.prayer}
              </p>
            ) : (
              <p className="hidden font-nokia-bold text-1xl text-center border-2 border-accent-5 p-2 rounded text-accent-5">
                {devotionToDisplay && devotionToDisplay.prayer}
              </p>
            )}
          </div>

          {/* devotion image */}
          <div className="w-full md:w-[60%] mx-auto lg:w-[30%] h-full mt-12 border border-accent-5 rounded-xl">
            <img
              src={`https://ezra-seminary.mybese.tech/images/${
                devotionToDisplay && devotionToDisplay.image
              }`}
              alt="Devotion Image"
              className="h-full rounded-xl p-1"
            />
            {devotionToDisplay &&
              typeof devotionToDisplay.previewUrl === "string" && (
                <img src={devotionToDisplay.previewUrl} alt="Preview" />
              )}

            {devotionToDisplay && devotionToDisplay.previewUrl ? (
              <img src="../../assets/Advert-Image.svg" alt="" />
            ) : (
              <img
                src="../../assets/Advert-Image.svg"
                alt=""
                className="hidden"
              />
            )}

            <div className="flex gap-2 justify-center my-2 w-[90%] mx-auto">
              <button
                className="flex text-xs w-auto  items-center gap-2 px-2 py-1 border border-accent-6 bg-secondary-6 rounded-xl font-nokia-bold text-primary-1"
                // onClick={handleDownload}
              >
                ምስሉን አውርድ
                <DownloadSimple
                  size={24}
                  weight="bold"
                  className="text-primary-1"
                />
              </button>
              <button
                className="flex w-auto text-xs items-center gap-2 px-2 py-1 border border-accent-6 bg-secondary-6 rounded-xl font-nokia-bold text-primary-1"
                // onClick={handleShare}>
              >
                ምስሉን አጋራ
                <ShareNetwork
                  size={24}
                  weight="bold"
                  className="text-primary-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

CurrentDevotional.propTypes = {
  showControls: PropTypes.bool.isRequired,
};

export default CurrentDevotional;
