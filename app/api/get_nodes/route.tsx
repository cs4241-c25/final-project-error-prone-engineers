import axios from "axios";

export async function getNodeInformation(nodeName: string) {
    try {
        const response = await axios.get(`/api/nodes?name=${encodeURIComponent(nodeName)}`);
        console.log("Node Information:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching node:", error.response?.data || error.message);
        return null;
    }
}
