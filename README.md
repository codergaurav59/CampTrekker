
# 🌄 CampTrekker

**CampTrekker** is a full-stack web application that allows users to create, view, review, and manage campgrounds around the world. It offers rich features like interactive maps using Mapbox, secure authentication with Passport.js, image uploads via Cloudinary, and seamless CRUD operations—all powered by Node.js, Express, MongoDB, and EJS templating.

---

## 🚀 Project Overview

CampTrekker serves as an online platform for camping enthusiasts to explore new campgrounds, post their own, and engage in community feedback through reviews and ratings. It emphasizes security, user experience, and modern web practices.

---

## 🧠 Features

- 📝 **User Authentication** – Register/Login with Passport.js (Local Strategy)
- 🗺️ **Interactive Maps** – Mapbox integration for geolocation & markers
- 📸 **Image Uploads** – Cloudinary storage & management
- ⭐ **Ratings & Reviews** – Submit and delete reviews (with ratings)
- 🛡️ **Security Measures** – Helmet, MongoSanitize, and CSP
- ⚙️ **RESTful APIs** – Clean and modular route architecture
- 📂 **Responsive UI** – Bootstrap-based styling
- 🔁 **Flash Messaging** – Using connect-flash + express-session
- 🧾 **Form Validation** – Both client and server-side (with Joi and HTML5)

---

## 🏗️ Tech Stack

| Layer              | Technology                            |
|--------------------|----------------------------------------|
| **Frontend**        | HTML5, CSS3, Bootstrap, EJS Templates  |
| **Backend**         | Node.js, Express.js                   |
| **Database**        | MongoDB + Mongoose ORM                |
| **Authentication**  | Passport.js (LocalStrategy)           |
| **Maps**            | Mapbox GL JS                          |
| **Image Hosting**   | Cloudinary                            |
| **Security**        | Helmet, express-mongo-sanitize        |
| **Templating**      | EJS with ejs-mate                     |

---

## 📂 Project Structure

```
CampTrekker/
│
├── controllers/           # Route logic (campgrounds, reviews, auth)
├── models/                # Mongoose schemas for Campground, Review, User
├── routes/                # Modular routes (campgrounds, reviews, users)
├── public/                # Static files (CSS, JS)
│   └── javascripts/
│       ├── showMap.js
│       └── clusterMap.js
├── views/                 # EJS templates
│   └── Campgrounds/
│   └── Partials/
├── utils/                 # ExpressError, catchAsync etc.
├── app.js                 # Express app config and setup
├── package.json
└── .env                   # Environment variables (not committed)
```

---

## 🔒 Security Highlights

- `Helmet.js`: Sets secure HTTP headers
- `express-mongo-sanitize`: Prevents NoSQL injections
- `connect-flash + express-session`: Manages sessions & flash alerts
- `Joi`: Validates input schema at the backend

---

## 🧪 Validation

- **Client-side**: HTML5 + Bootstrap classes for instant feedback
- **Server-side**: Joi schemas for data integrity and error handling

---

## 🌍 Deployment Instructions

1. Clone the repo  
   ```bash
   git clone https://github.com/your-username/CampTrekker.git
   cd campify-main
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Setup your `.env` file  
   ```
   MAPBOX_TOKEN=your_mapbox_token
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_KEY=your_key
   CLOUDINARY_SECRET=your_secret
   DB_URL=mongodb://localhost:27017/campify
   SECRET=any-random-secret
   ```

4. Start the server  
   ```bash
   node app.js
   ```
---

## Live Website:

### Discover Your Next Adventure on Campify’s Home Page->
<img width="1912" height="818" alt="image" src="https://github.com/user-attachments/assets/4bacbad1-4c60-43b1-84c5-9d3ffb3e9b1b" />

### Explore Campsites Across Locations Using the Map Interface->
<img width="1889" height="1019" alt="image" src="https://github.com/user-attachments/assets/071d0177-5a09-44b2-8592-de4af4fd1774" />

### Browse Through a Collection of Featured Campgrounds→
<img width="1885" height="1024" alt="image" src="https://github.com/user-attachments/assets/611d52c2-ff4c-4dfe-96a1-cd58feb3cabe" />

### Explore Detailed Information About Each Campground→
<img width="1919" height="1077" alt="image" src="https://github.com/user-attachments/assets/65dbe9bf-da56-4856-9ee6-f67eb2d01c2c" />

### List a New Campground and Help the Campify Community Grow→
<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/12d6bb5d-9cbd-49c2-a648-9aa7d54e08a7" />

### You can review the Campsites by rating and writing Reviews→
<img width="1874" height="800" alt="image" src="https://github.com/user-attachments/assets/839bbfff-e386-40bd-afdf-0cb629784279" />

### You can update the campground Details you added prior→
<img width="1899" height="1064" alt="image" src="https://github.com/user-attachments/assets/a972e87b-9584-4b32-878e-bfb0275d5c80" />

### Create an Account on Campify and Engage with the Camping Community→
<img width="1892" height="967" alt="image" src="https://github.com/user-attachments/assets/d6f7ed15-a044-4a11-ad6f-9f7824bc3dd6" />


