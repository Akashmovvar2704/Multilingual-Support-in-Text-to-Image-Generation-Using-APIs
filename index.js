async function translateText(inputText, targetLanguage = "en") {
  const apiKey = "";
  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: inputText,
        target: targetLanguage,
      }),
    }
  );

  const data = await response.json();
  console.log(data);
  return data.data.translations[0].translatedText;
}

async function fetchImageFromAPI(description) {
  const apiKey = "";
  const apiUrl = "https://api.limewire.com/api/image/generation";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Api-Version": "v1",
      },
      body: JSON.stringify({
        prompt: description,
        aspect_ratio: "1:1",
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data.images[0].asset_url; // URL of the generated image
  } catch (error) {
    console.error("Error fetching image:", error);
    return "https://via.placeholder.com/600x400.png?text=Image+Unavailable"; // Fallback image
  }
}

async function searchImages(query) {
  const apiKey = "";
  const searchEngineId = "75d473a3365854a76";
  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent( query )}&searchType=image`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data.items[0].link; // This will contain the search results, including image URLs
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

async function generateImage() {
  // Get the description from the id
  const description = document.getElementById("descriptionText").value;
  // Get the selected language
  const selectedLanguage = document.getElementById("languageSelect").value;
  // If the selected language is not english, translate the description
  const translatedDescription =
    selectedLanguage !== "en"
      ? await translateText(description, "en")
      : description;
  // Pass the translated description to search for image
  const imageUrl = await searchImages(translatedDescription);
  displayImage(imageUrl);
}

function displayImage(imageUrl) {
  // Create an img tag
  var img = new Image();
  // assign the image url to the scr attribute
  img.src = imageUrl;
  // Set the alternate text attribute
  img.alt = "Generated Image";
  // set the width of the image
  img.style.width = "100%";
  // get the div to display the image
  document.getElementById("imageDisplay").innerHTML = " ";
  // append the img to the div
  document.getElementById("imageDisplay").appendChild(img);
}
