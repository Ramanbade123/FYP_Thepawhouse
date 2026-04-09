# The Paw House - Complete System Flow & Viva Guide
This document contains the user flow, technical breakdown, complex functions, and viva questions for your final project.

---

## PART 1: The Complete Project Flow (User Journeys)
*If they ask: "Walk me through how the system works for each user", use these steps.*

### 1. The Rehomer Flow (Listing a dog)
1.  **Registration:** Register as a "Rehomer" (uses `register` in `authController.js`).
2.  **Listing:** Submit a new dog (uses `createPet` in `petController.js`).
    *   **Anti-Spam:** Code checks if you've already listed a dog with the same Name and Breed.
    *   **Images:** Photos are uploaded to the server folder via **Multer**.
3.  **Manage:** Review applications from their dashboard and "Approve/Reject" them.

### 2. The Adopter Flow (Finding a dog)
1.  **Registration:** Register as an "Adopter".
2.  **Search:** Browse available dogs (uses `getPets`). Uses **Pagination** (6 per page) to stay fast.
3.  **Chat:** Message a Rehomer to ask questions about a dog (uses `messageController.js`).
4.  **Apply:** Submit an adoption form. Once approved, the dog's status automatically changes to "Adopted".

### 3. The Donor Flow (Supporting the cause)
1.  **Donate:** Fill out a donation form.
2.  **Payment:** Pay securely via **Khalti Payment Gateway**.
3.  **Verification:** The system automatically verifies the payment with Khalti's servers before marking it as "Completed" in our database.

---

## PART 2: Complex Code Functions (The "Deep" Technicals)
*If they ask: "Show me a complex part of your code", talk about these functions!*

### 1. Payment Integration (`initiateKhaltiDonation` & `verifyKhaltiDonation`)
**File:** `donationController.js`
**Why it's complex:** This isn't just internal code; it talks to an **External API**.
*   **How it works:** We bundle the donation details into a JSON payload and send it to Khalti using `axios.post`. 
*   **The Logic:** We receive a `pidx` (payment ID) from Khalti, redirect the user, and then run a "Verification" step where our server asks Khalti: "Did this specific `pidx` actually pay?" Only then do we save it as a success.

### 2. Secure OTP Logic (`forgotPassword` & `resetPassword`)
**File:** `authController.js`
**Why it's complex:** It uses **Cryptography (SHA-256)** and **Expiries**.
*   **The Logic:** We don't save the 6-digit OTP in plain text. We hash it first (making it unreadable even if the database is leaked) and set a 10-minute "window". If the user enters the OTP at minute 11, the `resetPassword` function will reject it automatically.

### 3. Smart Search & Pagination (`getPets`)
**File:** `petController.js`
**Why it's complex:** It builds a **Dynamic MongoDB Query**.
*   **The Logic:** Instead of searching for exact words, it uses `new RegExp(searchString, 'i')`. This allows "partial matches" (finding "Husky" if you just search "Hus"). It also calculates `skip` and `limit` to ensure we don't load too many results at once.

### 4. Real-time Messaging Logic (`sendMessage`)
**File:** `messageController.js`
**Why it's complex:** It handles **Inter-User Synchronization**.
*   **The Logic:** When a user sends a message, the code does three things: 
    1. Saves the message. 
    2. Updates the "Last Message" preview on the list. 
    3. Increments an **Unread Counter** for the *other* person. 
    It also verifies that the person sending the message is actually part of that conversation (`isParticipant`).

### 5. Smart Location Logic ("Nearby / Kathmandu Valley")
**File:** `BrowseDogsTab.jsx` & `Pets.jsx`
**Why it's smart:** It uses **Personalized Filtering** and **Keyword-Grouped Searches**.
*   **User-Specific "Nearby":** When an Adopter logs in, the React code pulls their current City from `localStorage`. If they live in "Pokhara", it dynamically creates a button: "Nearby (Pokhara)". Clicking this button tells the server to only show dogs where `location.city === 'Pokhara'`.
*   **Regional Grouping (isKathmandu):** For the "Kathmandu Valley" filter, we don't just search for one word. We created a custom function that checks if the dog's location contains **any** of these: "Kathmandu", "Lalitpur", "Bhaktapur", or "KTM". This allows us to group multiple cities into one "Valley Area" filter effortlessly.

### 6. Geolocation & Veterinary Finder (`NearbyClinics.jsx`)
**File:** `NearbyClinics.jsx`
**Why it's complex:** It uses **Real-Time Browser APIs** and **Mathematical Formulas**.
*   **Browser Geolocation:** The app asks for the user's real-world location using `navigator.geolocation`. 
*   **Fallback Strategy:** If the user denies permission, the code is smart enough to "Fallback" to the coordinates of Kathmandu automatically, so the page never stays blank.
*   **The Haversine Formula:** To show which clinic is closest, we implemented a complex mathematical formula called the **Haversine Formula**. It takes the user's Lat/Lon and the clinic's Lat/Lon and calculates the exact distance in Kilometers across the surface of the Earth.
*   **Dynamic Mapping:** It automatically generates a "Live Map" for each clinic using an `iframe` that performs a Google Maps query based on the clinic's specific name and address.



---

## PART 3: Top 5 Viva "Killer" Questions & Answers
*Memorize these!*

**Q1: Why did you choose NoSQL (MongoDB) instead of SQL (MySQL)?**
**Answer:** "Because pet data is flexible. MongoDB allows us to store unstructured data easily without complex table joins, and it is much faster for scaling applications."

**Q2: How do you handle image uploads?**
**Answer:** "We use **Multer**. It saves the photo into our server's `/uploads` folder and we store just the *file path* in the database, which keeps the database small and fast."

**Q3: What is a JWT?**
**Answer:** "JWT (JSON Web Token) is a secure way to verify users. Once a user logs in, they get a token. They send this 'digital badge' with every request so the server knows who they are instantly."

**Q4: How did you make the app feel fast?**
**Answer:** "I used **Optimistic UI** for the Favorites button. The heart icon turns red instantly when clicked, while the actual save happens in the background. This prevents any loading lag for the user."

**Q5: How do you protect Admin routes?**
**Answer:** "I created a **Custom Middleware** called `authorize('admin')`. It decodes the user's JWT token, checks their 'Role' field, and if it's not 'admin', it blocks the request before it even reaches the database."
