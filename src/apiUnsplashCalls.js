import axios from "axios";

const unsplashToken = import.meta.env.VITE_UNSPLASH_API_KEY
const baseUrl = 'https://api.unsplash.com/'
const collectionId = 'KE2MAB3gm4k'

const fetchUnsplashCollection = async () => {
  try {
    const response = await axios.get(`${baseUrl}collections/${collectionId}/photos`, {
      params :{
        page: 1,
        per_page: 20
      },
      headers: {
          Authorization: `Client-ID ${unsplashToken}`
      }
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching images", error)
    throw error
  }
};

export {fetchUnsplashCollection}