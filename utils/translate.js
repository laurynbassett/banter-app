import { GOOGLE_API_KEY } from "react-native-dotenv";
import languages from "../languages.json";

// TRANSLATE TEXT
export const translateText = async (text, lang) => {
  try {
    const uri = `https://translation.googleapis.com/language/translate/v2?q=${text}&target=${lang}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(uri);
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error("Error translating text: ", err);
  }
};

export const getLangKey = (lang) => {
  return Object.keys(languages).find(
    (key) => languages[key] === lang.toLowerCase()
  );
};

export const getLangValue = (langKey) => {
  return languages[langKey];
};
