// src/data/eventsApi.js
import axios from "axios";

const API_URL = "https://meetup-application-h68v.vercel.app/events";

export const fetchEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // Adjust if your API wraps data differently
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
};
