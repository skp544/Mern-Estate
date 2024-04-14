import { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import { update } from "../../api/user";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    setIsLoading(true);
    console.log(avatar);

    const response = await update(currentUser.id, {
      username,
      email,
      password,
      avatar: avatar[0],
    });

    setIsLoading(false);
    if (!response.success) {
      return toast.error(response.message);
    }

    toast.success(response.message);
    updateUser(response.user);
    navigate("/profile");
  };

  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button disabled={isLoading}>
            {isLoading ? "Updating" : "Update"}
          </button>
        </form>
      </div>
      <div className="sideContainer">
        <img
          src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
          alt="user"
          className="avatar"
        />
        <UploadWidget
          uwConfig={{
            cloudName: "dhdikvy2r",
            uploadPreset: "esatet",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
