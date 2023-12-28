import React, { useState, useEffect, Fragment } from "react";
import {
  generateTemporaryURL,
  obfuscateFileName,
} from "./../firebase-functions"; // Import the Firebase functions
import CryptoJS from "crypto-js";
import { getRandomJSONObjectsByGender } from "./../firebase-functions";
import { updateScores } from "./../firebase-functions";

import ImageLike from "./../assets/images/misc/like.png";
import ImageSuperLike from "./../assets/images/misc/superlike.png";
import ImageDislike from "./../assets/images/misc/dislike.png";
import ImagePlaceHolderMen from "./../assets/images/misc/Loading.jpg";
import ImagePlaceHolderWomen from "./../assets/images/misc/Loading_Women.jpg";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

const MainComponent = ({ gender }) => {
  const [people, setPeople] = useState([]);
  const [likedUsers, setLikedUsers] = useState([]);
  const [superLikedUsers, setSuperLikedUsers] = useState([]);
  const [dislikedUsers, setDislikedUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(0);
  const [randomObjects, setRandomObjects] = useState([]);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track if images are loaded
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false); // Set loading to false when the image is fully loaded
  };
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const expirationDurationInSeconds = 3600; // URL will expire in 1 hour
        const objects = await getRandomJSONObjectsByGender(gender);

        // Define a function to generate temporary image URLs
        const generateTemporaryImageURLs = async (objects) => {
          const imagePromises = objects.map(async (originalObject, index) => {
            const imagePath = `Images/${gender}/${CryptoJS.MD5(
              originalObject.name + ".png"
            ).toString()}.png`;

            try {
              const { temporaryURL } = await generateTemporaryURL(
                imagePath,
                expirationDurationInSeconds
              );

              return temporaryURL;
            } catch (error) {
              console.error("Error fetching image:", error);
              return null;
            }
          });

          return Promise.all(imagePromises);
        };

        // Retrieve temporary image URLs for all objects
        const imageUrls = await generateTemporaryImageURLs(objects);

        // Transform the retrieved objects into the goal format
        const transformedObjects = objects.map((originalObject, index) => ({
          id: index, // Incrementing ID
          name: originalObject.name,
          desc: "",
          image: imageUrls[index] || "", // Use the preloaded image or an empty string if there was an error
        }));

        setPeople(transformedObjects);
        setImagesLoaded(true); // Set imagePreloaded to true when all images are preloaded
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const modifySuperficialChoices = (action) => {
    const newPeople = [...people];
    const newLikedUsers = [...likedUsers];
    const newSuperLikedUsers = [...superLikedUsers];
    const newDislikedUsers = [...dislikedUsers];

    switch (action) {
      case "ADD_TO_LIKED_USERS": {
        newLikedUsers.push(people[activeUser]);
        setLikedUsers(newLikedUsers);
        break;
      }
      case "ADD_TO_DISLIKED_USERS": {
        newDislikedUsers.push(people[activeUser]);

        setDislikedUsers(newDislikedUsers);
        break;
      }
      case "ADD_TO_SUPERLIKED_USERS": {
        newSuperLikedUsers.push(people[activeUser]);

        setSuperLikedUsers(newSuperLikedUsers);
        break;
      }
      default:
        return people;
    }
    const newActiveUser = activeUser + 1;
    setActiveUser(newActiveUser);
    setIsLoading(true);
  };
  const [startX, setStartX] = useState(null);
  const [startY, setStartY] = useState(null);

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [, setSwipeDirection] = useState(null);

  const [boxShadowColor, setBoxShadowColor] = useState("");
  const [initialX, setInitialX] = useState(0); // Store initial X position
  const [initialY, setInitialY] = useState(0); // Store initial Y position

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setInitialX(translateX); // Store initial X position
    setInitialY(translateY); // Store initial Y position
  };

  const handleTouchMove = (e) => {
    if (startX !== null && startY !== null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      setTranslateX(initialX + diffX); // Update using initial position
      setTranslateY(initialY + diffY); // Update using initial position

      // Set box shadow color based on drag direction
      if (diffX > 10) {
        setBoxShadowColor("#4fe8ca");
        setSwipeDirection("right");
      } else if (diffX < -10) {
        setBoxShadowColor("#fe5775");
        setSwipeDirection("left");
      } else if (diffY < -20) {
        setBoxShadowColor("#25c5f9");
        setSwipeDirection("up");
      } else {
        setBoxShadowColor("");
        setSwipeDirection(null);
      }
    }
  };

  const handleTouchEnd = (e) => {
    if (startX !== null && startY !== null) {
      const endX = startX - e.changedTouches[0].clientX;
      const endY = startY - e.changedTouches[0].clientY;

      // Check if it's a vertical swipe and long enough for a super like
      if (Math.abs(endY) > 30 && Math.abs(endY) > Math.abs(endX)) {
        // Swiped up (super like)
        modifySuperficialChoices("ADD_TO_SUPERLIKED_USERS");
      } else if (Math.abs(endX) > 30 && Math.abs(endX) > Math.abs(endY)) {
        if (endX > 0) {
          // Swiped left (dislike)
          modifySuperficialChoices("ADD_TO_DISLIKED_USERS");
        } else {
          // Swiped right (like)
          modifySuperficialChoices("ADD_TO_LIKED_USERS");
        }
      }

      setStartX(null);
      setStartY(null);
      setTranslateX(0);
      setBoxShadowColor("");
      setRotation(0);
      setSwipeDirection(null);

      setTranslateX(0); // Reset to 0
      setTranslateY(0); // Reset to 0
    }
  };

  /*useEffect(() => {
    // Call the updateScores function when the component mounts
    async function updateScoresAsync() {
      try {
        const likedList = likedUsers.map((liked) => liked.name);
        const superLikedList = superLikedUsers.map(
          (superliked) => superliked.name
        );
        const dislikedList = dislikedUsers.map((disliked) => disliked.name);

        await updateScores(likedList, superLikedList, dislikedList);
      } catch (error) {
        console.error("Error updating scores:", error);
      }
    }

    if (!(activeUser >= 0 && activeUser <= 2)) {
      // Only call updateScores when the condition is met
      updateScoresAsync();
    }
  }, [activeUser, likedUsers, superLikedUsers, dislikedUsers]);*/

  const imageStyle = {
    transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg)`,
    boxShadow: `0 0 15px ${boxShadowColor}`,
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };
  return imagesLoaded ? (
    activeUser >= 0 && activeUser <= 49 ? (
      people[activeUser] && (
        <div
          className="person"
          onTouchStart={!isLoading && handleTouchStart}
          onTouchMove={!isLoading && handleTouchMove}
          onTouchEnd={!isLoading && handleTouchEnd}
        >
          <div className="person-photo" style={imageStyle}>
            {people[activeUser].image ? (
              <React.Fragment>
                <img
                  src={people[activeUser].image}
                  alt={people[activeUser].name}
                  onLoad={handleImageLoad}
                  style={{ display: isLoading ? "none" : "block" }}
                />
                {isLoading && (
                  <div>
                    <img
                      src={
                        gender == "MEN"
                          ? ImagePlaceHolderMen
                          : ImagePlaceHolderWomen
                      } // Replace with your placeholder image source
                      alt="Loading..."
                    />
                  </div>
                )}
              </React.Fragment>
            ) : (
              navigate(0)
            )}
          </div>

          <div className="person-description">
            <p className="person-name-age">{people[activeUser]?.name}</p>
          </div>

          {!isLoading ? (
            <div id="actions">
              <button
                type="button"
                onClick={() =>
                  modifySuperficialChoices("ADD_TO_DISLIKED_USERS")
                }
              >
                <img src={ImageDislike} alt="Dislike User" />
              </button>
              <button
                type="button"
                onClick={() =>
                  modifySuperficialChoices("ADD_TO_SUPERLIKED_USERS")
                }
              >
                <img src={ImageSuperLike} alt="Superlike User" />
              </button>
              <button
                type="button"
                onClick={() => modifySuperficialChoices("ADD_TO_LIKED_USERS")}
              >
                <img src={ImageLike} alt="Like User" />
              </button>
            </div>
          ) : (
            <div id="actions">
              <Skeleton className="button" circle width={50} height={50} />
              <Skeleton className="button" circle width={50} height={50} />
              <Skeleton className="button" circle width={50} height={50} />
            </div>
          )}
        </div>
      )
    ) : (
      <div id="lonely">
        <div id="liked-people">
          <p>
            {likedUsers.length > 0
              ? "People you liked...let's hope they like you too!"
              : ""}
          </p>

          {likedUsers.map((item) => (
            <div key={item.id} className="liked-person">
              <div className="liked-person-image">
                <img src={item.image} alt={`You liked ${item.name}`} />
                <h6 className="liked-person-name">{item.name}</h6>
              </div>
            </div>
          ))}

          <p>{superLikedUsers.length > 0 ? "People you super liked!" : ""}</p>

          {superLikedUsers.map((item) => (
            <div key={item.id} className="liked-person">
              <div className="liked-person-image">
                <img src={item.image} alt={`You liked ${item.name}`} />
                <h6 className="liked-person-name">{item.name}</h6>
              </div>
            </div>
          ))}
        </div>
        {localStorage.setItem("lastAccessTimestamp", Date.now().toString())}
      </div>
    )
  ) : (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <Skeleton height={450} />
        <Skeleton width={400} />
        <div id="actions">
          <Skeleton className="button" circle width={50} height={50} />
          <Skeleton className="button" circle width={50} height={50} />
          <Skeleton className="button" circle width={50} height={50} />
        </div>
      </div>
    </Fragment>
  );
};

export default MainComponent;
