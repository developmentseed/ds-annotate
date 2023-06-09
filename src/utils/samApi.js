import apis from "./../static/apis.json";
import { NotificationManager } from 'react-notifications';

export async function getPrediction(base64_string, decodePayload) {
    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        crossOrigin: "anonymous",
    };
    const encodeURL = `${apis.gpuEncodeAPI}/predictions/sam_vit_h_encode`;
    const decodeURL = `${apis.cpuDecodeAPI}/predictions/sam_vit_h_decode`;
    try {
        // Encode
        const encodeResponse = await fetch(encodeURL, {
            method: "POST",
            headers,
            body: JSON.stringify({ encoded_image: base64_string }),
        });
        if (!encodeResponse.ok) {
            NotificationManager.error(`${encodeURL}`, `Encode server error ${encodeResponse.status}`, 30000);
            throw new Error(`Error: ${encodeResponse.status}`);
        }

        const encodeRespJson = await encodeResponse.json();
        decodePayload.image_embeddings = encodeRespJson.image_embedding;

        // Encode
        const decodeResponse = await fetch(decodeURL, {
            method: "POST",
            headers,
            body: JSON.stringify(decodePayload),
        });
        if (!decodeResponse.ok) {
            NotificationManager.error(`${decodeURL} `, `Decode server error ${decodeResponse.status}`, 30000);
            console.log(decodeResponse)
            throw new Error(`Error: ${decodeResponse.status}`);
        }

        const decodeRespJson = await decodeResponse.json();
        return { image_embedding: encodeRespJson, masks: decodeRespJson };
    } catch (error) {
        console.log(error);
    }
}
