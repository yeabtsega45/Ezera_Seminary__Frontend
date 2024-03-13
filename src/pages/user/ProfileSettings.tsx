import { useState, useEffect, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "@/redux/api-slices/apiSlice";
import { updateUser } from "@/redux/authSlice";
import { ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react";
import { RootState } from "@/redux/store";
import mehari from "@/assets/mehari.jpg";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Fetch the current user details (assuming the useGetUserQuery hook is available)
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Local state for form fields initialized with current user details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [updateUserMutation] = useUpdateUserMutation();
  const [selectedFile, setSelectedFile] = useState(null);

  const avatarPreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : currentUser?.avatar
    ? currentUser?.avatar
    : mehari;

  // Effect to set the form fields with current user details when they are available
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setEmail(currentUser.email || "");
      setPassword(currentUser.password || "");
    }
  }, [currentUser]);

  const handleAvatarUpload = (event: {
    target: { files: SetStateAction<null>[] };
  }) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      console.log(event.target.files[0]); // log the file directly from the event
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // ProfileSettings
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (currentUser) {
      if (
        firstName !== currentUser.firstName ||
        lastName !== currentUser.lastName ||
        email !== currentUser.email ||
        password ||
        selectedFile
      ) {
        try {
          const formData = new FormData();
          formData.append("firstName", firstName);
          formData.append("lastName", lastName);
          formData.append("email", email);
          if (password) {
            formData.append("password", password);
          }
          if (selectedFile) {
            formData.append("avatar", selectedFile);
          }

          console.log(selectedFile);
          console.log(formData.get("avatar"));

          const updatedUser = await updateUserMutation(formData).unwrap();

          // Update the avatar in the currentUser object
          if (selectedFile) {
            updatedUser.avatar = URL.createObjectURL(selectedFile);
          }
          console.log(updatedUser, formData);
          dispatch(updateUser(updatedUser));
          // console.log(updatedUser, formData);

          setSuccessMessage("Profile updated successfully!");
          setErrorMessage("");
        } catch (error) {
          setErrorMessage("Failed to update profile. Please try again.");
          setSuccessMessage("");
        }
      }
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-8 my-20 p-10 bg-accent-1 rounded-lg shadow-lg">
      <button
        onClick={goBack}
        className="mb-4 bg-accent-6 hover:bg-accent-7 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
      >
        <ArrowLeft size={25} />
        Back
      </button>
      <div className="md:flex md:items-start md:space-x-10">
        <div className="md:w-1/3 text-center mb-6 md:mb-0">
          <img
            src={avatarPreview}
            alt="User Avatar"
            className="w-[25vmin] rounded-full mx-auto"
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{`${firstName} ${lastName}`}</h3>
            <label className="mt-2 inline-block bg-accent-6 text-white py-1 px-4 rounded cursor-pointer hover:bg-accent-7">
              <span>Upload New Photo</span>
              <input
                type="file"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              {/* Implement handleAvatarUpload */}
            </label>
          </div>
          {successMessage && <div>{successMessage}</div>}
          {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-secondary-10 mb-6">
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                First Name:
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                Last Name:
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6 relative">
              <label className="block text-secondary-10 text-sm font-bold mb-2">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-secondary-10 leading-tight focus:outline-none focus:shadow-outline pr-10"
              />
              <div
                className="absolute inset-y-0 right-0 pt-8 pr-3 flex items-center cursor-pointer text-accent-8"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeSlash size={18} weight="fill" />
                ) : (
                  <Eye size={18} weight="fill" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-accent-6 hover:bg-accent-7 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Info
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
