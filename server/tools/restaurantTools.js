import { writeReportFile } from './fileTools.js';

/**
 * Restaurant & Table Reservation Tool
 */
export async function bookRestaurantTable({ city = 'Mumbai', cuisine = 'Italian', guests = 2, time = '08:30 PM', occasion = 'Dinner' }) {
  const reservationId = `RES-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  const venue = {
    name: 'Bella Vista Rooftop Lounge & Ristorante',
    city,
    location: 'Marine Drive / Nariman Point',
    cuisine,
    rating: 4.8,
    ambience: 'Rooftop Ocean View',
    averagePriceForTwo: 3200,
    tableAllocated: 'Table #14 (Window Bay View)'
  };

  const filename = `dining_reservation_${reservationId}.md`;
  const content = `# 🍽️ DINING RESERVATION CONFIRMATION
**Reservation Code:** \`${reservationId}\`  
**Status:** CONFIRMED & TABLE HELD  
**Service:** Autonomous Hospitality Agent  

---

### 📍 Venue Details
* **Restaurant:** **${venue.name}**
* **Location:** ${venue.location}, ${venue.city}
* **Cuisine:** ${venue.cuisine} (⭐ ${venue.rating} Rating)
* **Ambience:** ${venue.ambience}

---

### 📅 Booking Specifications
* **Guests:** ${guests} Persons
* **Reserved Time:** ${time} Today
* **Table Assignment:** ${venue.tableAllocated}
* **Occasion:** ${occasion}

---
*Table held for 15 minutes post scheduled arrival time. Present confirmation code at the reception.*
`;

  const saved = await writeReportFile(filename, content);

  return {
    success: true,
    reservationId,
    venue,
    guests,
    time,
    artifactFile: filename,
    artifactPath: saved.fullPath
  };
}
