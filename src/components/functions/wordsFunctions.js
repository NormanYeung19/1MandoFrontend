import axios from "../../utils/axiosConfig";

export const putWord = async (id, word) => {
  // id =12412412asf     word={isKnown: "known"}
  try {
    const response = await axios.put(`api/words/${id}`, word);
    return response.data;
  } catch (error) {
    console.error("Error updating word:", error);
  }
};
