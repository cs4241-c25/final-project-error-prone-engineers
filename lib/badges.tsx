import axios from "axios";

const badgeImageMap: Record<string, string> = {
    "Boston Common": "/badge_images/BostonCommonBadge.png",
    "Massachusetts State House": "/badge_images/MassachusettsStateHouseBadge.png",
    "Park Street Church": "/badge_images/ParkStreetChurchBadge.png",
    "Granary Burying Ground": "/badge_images/GranaryBuryingGroundBadge.png",
    "King's Chapel & King's Chapel Burying Ground": "/badge_images/KingsChapelBadge.png",
    "Boston Latin School Site/Benjamin Franklin Statue": "/badge_images/BostonLatinSchoolBenjaminFranklinStatueBadge.png",
    "Old Corner Bookstore": "/badge_images/OldCornerBookstoreBadge.png",
    "Old South Meeting House": "/badge_images/OldSouthMeetingHouseBadge.png",
    "Old State House": "/badge_images/OldStateHouseBadge.png",
    "Boston Massacre Site": "/badge_images/BostonMassacreSiteBadge.png",
    "Paul Revere House": "/badge_images/PaulRevereHouseBadge.png",
    "Old North Church": "/badge_images/OldNorthChurchBadge.png",
    "USS Constitution": "/badge_images/USSConstitutionBadge.png",
    "Faneuil Hall": "/badge_images/FaneuilHallBadge.png",
    "Bunker Hill Monument": "/badge_images/BunkerHillMonumentBadge.png",
    "Copp's Hill Burying Ground": "/badge_images/CoppsHillBuryingGroundBadge.png"
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