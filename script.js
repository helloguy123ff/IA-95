const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");
const OPENAI_API_KEY = "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"; // Sua chave de API OpenAI aqui
let isImageGenerating = false;
const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".download-btn");

        // Defina a fonte da imagem para os dados de imagem gerados por IA
        const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImage;

        // Quando a imagem for carregada, remova a classe de carregamento e defina os atributos de download
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImage);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        // Envie uma solicitação à API OpenAI para gerar imagens com base nas entradas do usuário
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: userImgQuantity,
                size: "512x512",
                response_format: "b64_json"
            }),
        });
        // Lança uma mensagem de erro se a resposta da API não for bem-sucedida
        if (!response.ok) throw new Error("Falha na geração de imagens. Verifique sua chave OPENAI Api.");
        const { data } = await response.json(); // Get data from the response
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        isImageGenerating = false;
    }
}
const handleImageGeneration = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;
    // Get user input and image quantity values
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = parseInt(e.srcElement[1].value);

    // Disable the generate button, update its text, and set the flag
    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating";
    isImageGenerating = true;

    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
        `<div class="img-card loading">
     <img src="img/loader.svg" alt="AI generated image">
      <a class="download-btn" href="#">
      <img src="img/download.svg" alt="download icon">
     </a>
  </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}
generateForm.addEventListener("submit", handleImageGeneration);
