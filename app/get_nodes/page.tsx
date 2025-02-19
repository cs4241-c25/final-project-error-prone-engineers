import axios from "axios";

export async function getNodeInformation(nodeName: string) {
    try {
        const response = await axios.get("/api/nodes", {
            headers: {
                "Content-Type": "application/json",
                "name": nodeName,
            },
        });

        console.log("Node Information:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching a node:", error);
        return null;
    }
}
