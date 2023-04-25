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

// export const requestDecoderService = (encoded_embedding_string) => {
//     decode_payload = {
//         "image_embeddings": encoded_embedding_string,
//         "image_shape": img_shape,
//         "input_label": input_label,
//         "input_point": input_point_on_slick
//     }
// }


