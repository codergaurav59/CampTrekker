if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();

const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const helmet = require('helmet');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bodyParser = require("body-parser");
const expressMongoSanitize = require('express-mongo-sanitize');
const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');

const Campground = require('./models/campgrounds');
const Review = require('./models/reviews');
const User = require('./models/user');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const userRoutes = require('./routes/user');

// DB Connection
// const dbUrl = process.env.DB_URL;
// console.log('Connecting to DB:', dbUrl);

// mongoose.set('strictQuery', true);
// mongoose.connect(dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log(" Database connected ");
// });
// DB Connection

const dbUrl = process.env.DB_URL;
console.log("Connecting to DB:", dbUrl);

mongoose.set("strictQuery", true);

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database connected");
})
.catch((err) => {
  console.error("Database connection error:", err.message);
});


// Session Store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SESSION_SECRET || 'mysecretkey11829'
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

// Session Config
const sessionConfig = {
    store,
    name: "mysession",
    secret: process.env.SESSION_SECRET || "mysecretkey11829",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true, // enable if HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());
app.use(expressMongoSanitize());
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Security (Helmet CSP)
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const fontSrcUrls = [];
// CSP-> To prevent from cross-site scripting (XSS)
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/dwjlajbov/", 
            "https://images.unsplash.com/"
        ],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
}));

// Local variables for templates
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/', userRoutes);

// Root Route
app.get("/", (req, res) => {
    res.render('home');
});

// Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    console.log("❌ Error:", err);
    res.status(statusCode).render('error', { err });
});

// Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Serving on http://localhost:${port}`);
});
