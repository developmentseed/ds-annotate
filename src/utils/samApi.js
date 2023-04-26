export async function getPrediction(base64_string, decodePayload) {
    const apiURL = "http://3.83.31.113:7080/predictions"
    console.log(`Fetching to ${apiURL}...`)
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        crossOrigin: "anonymous",
    }
    return fetch(`${apiURL}/sam_vit_h_encode`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({ "encoded_image": base64_string })
        }
    )
        .then(response1 => response1.json())
        .then(data1 => {
            decodePayload["image_embeddings"] = data1["image_embedding"]
            return fetch(`${apiURL}/sam_vit_h_decode`, {
                method: "POST",
                headers,
                body: JSON.stringify(decodePayload)
            })
                .then(response2 => response2.json())
                .then(data2 => {
                    return { image_embedding: data1, masks: data2 };
                })
        })
        .catch(error => {
            console.log(error);
        });
}


