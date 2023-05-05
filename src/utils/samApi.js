export async function getPrediction(base64_string, decodePayload) {
    // const apiURL = "http://192.168.0.103:7080/predictions"
    // https://segme-gpuel-ekfao79wi98g-617785108.us-east-1.elb.amazonaws.com/ping
    const apiURL = "https://segme-gpuel-ekfao79wi98g-617785108.us-east-1.elb.amazonaws.com/predictions"
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



