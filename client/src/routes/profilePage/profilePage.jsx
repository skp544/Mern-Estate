import { logout } from "../../api/auth";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import { profilePosts } from "../../api/user";

function ProfilePage() {
  const navigate = useNavigate();
  const { updateUser, currentUser } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await profilePosts();

    setLoading(false);

    if (!response.success) {
      return toast.error(response.message);
    }

    setUserPosts([...response.userPosts]);
    setSavedPosts([...response.savedPosts]);
    console.log(response);
  };

  const handleLogout = async () => {
    const response = await logout();

    if (!response.success) {
      return toast.error(response.message);
    }

    toast.success(response.message);

    updateUser(null);

    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <button onClick={() => navigate("/profile/update")}>
              Update Profile
            </button>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser?.avatar || "/noavatar.jpg"} alt="user" />
            </span>
            <span>
              Username: <b>{currentUser?.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser?.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My List</h1>
            <button onClick={() => navigate("/add")}>Create New Post</button>
          </div>

          {loading ? (
            <h2>Loading...</h2>
          ) : userPosts.length > 0 ? (
            <List data={userPosts} />
          ) : (
            <h2>No posts found</h2>
          )}

          <div className="title">
            <h1>Saved List</h1>
          </div>
          {loading ? (
            <h2>Loading...</h2>
          ) : savedPosts.length > 0 ? (
            <List data={savedPosts} />
          ) : (
            <h2>No posts saved</h2>
          )}
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
