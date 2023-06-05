import apis from "./../static/apis.json";
export async function getPrediction(base64_string, decodePayload) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        crossOrigin: "anonymous",
    }
    return fetch(`${apis.gpuEncodeAPI}/predictions/sam_vit_h_encode`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({ "encoded_image": base64_string })
        }
    )
        .then(response1 => response1.json())
        .then(data1 => {
            decodePayload["image_embeddings"] = data1["image_embedding"]
            return fetch(`${apis.cpuDecodeAPI}/predictions/sam_vit_h_decode`, {
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
