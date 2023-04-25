export const encodeImage = (base64_string) => {
    fetch("http://3.83.31.113:7080/predictions/sam_vit_h_encode", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            crossOrigin: "anonymous",
        },
        body: JSON.stringify({ "encoded_image": base64_string })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const encodedEmbeddingString = data['image_embedding']
            console.log(encodedEmbeddingString)
        });
};

export const requestDecoderService = (decodePayload) => {
    fetch("http://3.83.31.113:7080/predictions/sam_vit_h_decode", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            crossOrigin: "anonymous",
        },
        body: JSON.stringify(decodePayload)
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
        });
}


