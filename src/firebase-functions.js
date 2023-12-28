import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, ref as refDB, get, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase-config"; // Import your Firebase configuration

// Initialize Firebase using the imported configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);
// Function to generate temporary URLs for images
export async function generateTemporaryURL(
  imagePath,
  expirationDurationInSeconds
) {
  try {
    const imageRef = ref(storage, imagePath);

    // Generate a download URL with an expiration time
    const temporaryURL = await getDownloadURL(imageRef);
    // Calculate the expiration time
    const expirationTime =
      new Date().getTime() + expirationDurationInSeconds * 1000;

    // Return the temporary URL and expiration time

    return { temporaryURL, expirationTime };
  } catch (error) {
    console.error("Error generating temporary URL 1:", error);
    throw error;
  }
}

// Function to obfuscate file names (you can implement your logic here)
export function obfuscateFileName(fileName) {
  // Implement your logic to generate obfuscated file names here
  // For example, you can generate a random name or use a hash function
  const obfuscatedName = "your_obfuscated_name_here";
  return obfuscatedName;
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray(array) {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
async function getRandomJSONObjectsByGender(gender) {
  try {
    const database = getDatabase();
    const databaseRef = refDB(database, "names"); // Replace 'names' with the actual path to your collection

    const snapshot = await get(databaseRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const allObjects = Object.values(data); // Assuming your data is an object of objects

      // Filter objects based on the 'gender' parameter
      const filteredObjects = allObjects.filter((obj) => obj.gender === gender);

      // Shuffle the array to get random objects
      const shuffledObjects = shuffleArray(filteredObjects);

      // Get the first 25 objects (or less if there are fewer than 25)
      const randomObjects = shuffledObjects.slice(0, 50);

      return randomObjects;
    } else {
      return []; // Collection does not exist or is empty
    }
  } catch (error) {
    console.error("Error retrieving random JSON objects:", error);
    throw error;
  }
}
async function updateScores(likedList, superLikedList, dislikedList) {
  try {
    const database = getDatabase();
    const databaseRef = refDB(database, "names"); // Replace 'names' with the actual path to your collection

    const snapshot = await get(databaseRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const updates = {};
      console.log(data);
      // Loop through the liked list and update scores
      likedList.forEach((name) => {
        if (data[name]) {
          data[name].score = Math.min(data[name].score + 0.5, 10);
          updates[`/${name}/Score`] = data[name].score;
        }
      });

      // Loop through the super-liked list and update scores
      superLikedList.forEach((name) => {
        if (data[name]) {
          data[name].score = Math.min(data[name].score + 1, 10);
          updates[`/${name}/Score`] = data[name].score;
        }
      });

      // Loop through the disliked list and update scores
      dislikedList.forEach((name) => {
        if (data[name]) {
          data[name].score = Math.max(data[name].score - 0.5, 0);
          updates[`/${name}/Score`] = data[name].score;
        }
      });
      console.log(updates);
      // Check if there are updates to apply
      if (Object.keys(updates).length > 0) {
        // Update the database with the modifications
        await update(databaseRef, updates);
        console.log("Scores updated successfully");
      } else {
        console.log("No scores to update");
      }
    } else {
      console.log("Collection does not exist or is empty");
    }
  } catch (error) {
    console.error("Error updating scores:", error);
  }
}
export { getRandomJSONObjectsByGender, updateScores };
