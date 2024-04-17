import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

import toast from "react-hot-toast";
import { savePost } from "../../api/user";

function SinglePage() {
  const postData = useLoaderData();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(postData.isSaved);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const handleSave = async () => {
    setSaved((prev) => !prev);
    if (!currentUser) {
      return navigate("/login");
    }

    setLoading(true);
    const response = await savePost(postData.id);

    setLoading(false);

    if (!response.success) {
      setSaved((prev) => !prev);
      return toast.error(response.message);
    }

    toast.success(response.message);
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          {postData.images.length > 0 ? (
            <Slider images={postData.images} />
          ) : (
            <h1>No Images</h1>
          )}

          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{postData.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{postData.address}</span>
                </div>
                <div className="price">₹ {postData.price}</div>
              </div>
              <div className="user">
                <img src={postData.user.avatar} alt="" />
                <span>{postData.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(postData.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>

                {postData.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {postData.postDetail.utilities === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{postData.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{postData.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{postData.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{postData.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {postData.postDetail.school > 999
                    ? postData.postDetail.school / 1000 + "km"
                    : postData.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>
                  {postData.postDetail.bus > 999
                    ? postData.postDetail.bus / 1000 + "km"
                    : postData.postDetail.bus + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>
                  {postData.postDetail.restaurant > 999
                    ? postData.postDetail.restaurant / 1000 + "km"
                    : postData.postDetail.restaurant + "m"}{" "}
                  away
                </p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[postData]} />
          </div>
          <div className="buttons">
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {loading ? "Saving..." : saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
