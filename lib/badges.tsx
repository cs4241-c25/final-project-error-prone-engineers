import axios from "axios";

const badgeImageMap: Record<string, string> = {
    "Boston Common": "/badge_images/BostonCommon.jpg",
    "Massachusetts State House": "/badge_images/Massachusetts State House.jpg",
    "Park Street Church": "/badge_images/Park Street Church.jpg",
    "Granary Burying Ground": "/badge_images/Granary Burying Ground.jpg",
    "King's Chapel & King's Chapel Burying Ground": "/badge_images/King's Chapel.jpg",
    "Boston Latin School Site/Benjamin Franklin Statue": "/badge_images/Statue of Benjamin Franklin.jpg",
    "Old Corner Bookstore": "/badge_images/Old Corner Bookstore.jpg",
    "Old South Meeting House": "/badge_images/Old South Meeting House.jpg",
    "Old State House": "/badge_images/Old State House.jpg",
    "Boston Massacre Site": "/badge_images/Boston Massacre Site.jpg",
    "Paul Revere House": "/badge_images/Paul Revere House.jpg",
    "Old North Church": "/badge_images/Old North Church.jpg",
    "USS Constitution": "/badge_images/USS Constitution.jpg",
    "Faneuil Hall": "/badge_images/Faneuil Hall.jpg",
    "Bunker Hill Monument": "/badge_images/Bunker Hill Monument.jpg",
    "Copp's Hill Burying Ground": "/badge_images/Copp's Hill Burying Ground.jpg"
};

const badgeDescMap: Record<string, string> = {
    "Boston Common": "Earned for reaching Boston Common",
    "Massachusetts State House": "Earned for reaching Massachusetts State House",
    "Park Street Church": "Earned for reaching Park Street Church",
    "Granary Burying Ground": "Earned for reaching Granary Burying Ground",
    "King's Chapel & King's Chapel Burying Ground": "Earned for reaching King's Chapel & King's Chapel Burying Ground",
    "Boston Latin School Site/Benjamin Franklin Statue": "Earned for reaching Boston Latin School Site/Benjamin Franklin Statue",
    "Old Corner Bookstore": "Earned for reaching Old Corner Bookstore",
    "Old South Meeting House": "Earned for reaching Old South Meeting House",
    "Old State House": "Earned for reaching Old State House",
    "Boston Massacre Site": "Earned for reaching Boston Massacre Site",
    "Paul Revere House": "Earned for reaching Paul Revere House",
    "Old North Church": "Earned for reaching Old North Church",
    "USS Constitution": "Earned for reaching USS Constitution",
    "Faneuil Hall": "Earned for reaching Faneuil Hall",
    "Bunker Hill Monument": "Earned for reaching Bunker Hill Monument",
    "Copp's Hill Burying Ground": "Earned for reaching Copp's Hill Burying Ground"
};

const badgeNameMap: Record<string, string> = {
    "Boston Common": "Boston Common Explorer",
    "Massachusetts State House": "State House Visitor",
    "Park Street Church": "Park Street Pilgrim",
    "Granary Burying Ground": "Granary Guardian",
    "King's Chapel & King's Chapel Burying Ground": "King's Chapel Historian",
    "Boston Latin School Site/Benjamin Franklin Statue": "Franklin's Scholar",
    "Old Corner Bookstore": "Literary Enthusiast",
    "Old South Meeting House": "Revolutionary Thinker",
    "Old State House": "Colonial Leader",
    "Boston Massacre Site": "History Witness",
    "Paul Revere House": "Midnight Rider",
    "Old North Church": "One if by Land, Two if by Sea",
    "USS Constitution": "Old Ironsides Explorer",
    "Faneuil Hall": "Marketplace Maverick",
    "Bunker Hill Monument": "Patriot Defender",
    "Copp's Hill Burying Ground": "Copp's Hill Historian"
};



export async function createBadgeObject(locationName: string) {
    try {
        const badgeName = badgeNameMap[locationName]
        const description = badgeDescMap[locationName]
        await axios.post("/api/badges", {
            badgeName,
            locationName,
            description,
        }, {
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Badge creation failed: " + (error.response?.data?.error || error.message));
        } else {
            console.error("An unexpected error occurred.");
        }
    }
}


export async function getBadges() {
    try {

        const response = await axios.get("/api/badges",{
            headers: { "Content-Type": "application/json" }
        });
        console.log(response.data.badges);
        let badges = response.data.badges.map((badge: any) => ({
            ...badge,
            image: badgeImageMap[badge.locationName]
        }));
        console.log(badges);
        return badges;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Badge collection failed: " + (error.response?.data?.error || error.message));
        } else {
            console.error("An unexpected error occurred.");
        }
    }
}