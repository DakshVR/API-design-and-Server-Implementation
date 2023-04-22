const { log } = require("console");
const bodyParser = require("body-parser");
const express = require("express");
const app = require("express")();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server connected on http://localhost:${port}`);
});

const businesses = require("./data/businesses.json");
const reviews = require("./data/reviews.json");
const photos = require("./data/photos.json");

// Users who own businesses should be able to add their businesses to the application.
app.post("/business/create", (req, res) => {
  const {
    name,
    address,
    city,
    state,
    zip,
    phone,
    category,
    subcategory,
    website,
    email,
  } = req.body;

  if (
    !name ||
    !address ||
    !city ||
    !state ||
    !zip ||
    !phone ||
    !category ||
    !subcategory
  ) {
    res.status(400).send("Missing Required fields");
  } else {
    const newBusiness = {
      id: businesses.length,
      name,
      address,
      city,
      state,
      zip,
      phone,
      category,
      subcategory,
      website,
      email,
    };
    businesses.push(newBusiness);
    res.status(200).json(newBusiness);
  }
});

// Business owners may modify any of the information listed above for an already-existing business they own.
app.patch("/business/modify/:id", (req, res) => {
  const id = req.params.id;

  const businessIndex = businesses.findIndex(
    (business) => business.id === parseInt(id)
  );
  if (businessIndex === -1) {
    res.status(400).send("Business Not Found");
  } else {
    const business = businesses[businessIndex];
    business.name = req.body.name || business.name;
    business.address = req.body.address || business.address;
    business.city = req.body.city || business.city;
    business.state = req.body.state || business.state;
    business.zip = req.body.zip || business.zip;
    business.phone = req.body.phone || business.phone;
    business.category = req.body.category || business.category;
    business.subcategory = req.body.subcategory || business.subcategory;
    res.status(200).send(business);
  }
});

// Business owners may remove a business listing from the application.
app.delete("/business/delete/:id", (req, res) => {
  const id = req.params.id;

  const businessIndex = businesses.findIndex(
    (business) => business.id === parseInt(id)
  );
  if (businessIndex != -1) {
    businesses.splice(businessIndex, 1);
    res.send(`Business With id ${id} has been deleted.`);
  } else {
    res.status(404).send("No Business Found");
  }
});

// Users may get a list of businesses.
app.get("/businesses", (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const lastPage = Math.ceil(businesses.length / pageSize);
  page = page < 1 ? 1 : page;
  page = page > lastPage ? lastPage : page;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const businessPage = businesses.slice(start, end);

  const links = {};
  if (page < lastPage) {
    links.nextPage = `/businesses?page=${page + 1}`;
    links.lasttPage = `/businesses?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/businesses?page=${page - 1}`;
    links.firstPage = `/businesses?page=1`;
  }

  res.status(200).send({
    business: businessPage,
    page: page,
    pageSize: pageSize,
    lastPage: lastPage,
    total: businesses.length,
    links: links,
  });
});

// Users may fetch detailed information about a business.
app.get("/business/detail/:id", (req, res) => {
  const id = req.params.id;

  const business = businesses.find((business) => business.id === parseInt(id));
  if (!business) {
    res.status(404).send("Business Not Found");
  } else {
    const review = reviews.filter(
      (review) => review.businessid === business.id
    );
    const photo = photos.filter((photo) => photo.businessid === business.id);
    res.send({
      business: business,
      reviews: review,
      photos: photo,
    });
  }
});

// Users may write a review of an existing business.
app.post("/reviews/create", (req, res) => {
  const { businessid, userid, dollars, stars, review } = req.body;

  if (!dollars || !stars) {
    res.status(418).send("One of the Required Fields is Missing.");
  } else {
    const businessIndex = businesses.findIndex(
      (business) => business.id === parseInt(businessid)
    );
    if (businessIndex === -1) {
      res.status(404).send("Business Not Found");
    } else {
      const newReview = {
        id: reviews.length,
        userid,
        businessid,
        dollars,
        stars,
        review,
      };
      reviews.push(newReview);
      res.status(200).json(newReview);
    }
  }
});

// Users may modify any review they've written.
app.patch("/review/modify", (req, res) => {
  const { userid, businessid } = req.body;

  const reviewIndex = reviews.findIndex(
    (review) =>
      review.businessid === parseInt(businessid) &&
      review.userid === parseInt(userid)
  );

  if (reviewIndex === -1) {
    res.status(404).send("Review Not Found");
  } else {
    const review = reviews[reviewIndex];
    review.userid = parseInt(userid);
    review.businessid = parseInt(businessid);
    review.dollars = req.body.dollars || review.dollars;
    review.stars = req.body.stars || review.stars;
    review.review = req.body.review || review.review;
    res.status(200).send(review);
  }
});

// Users may delete any review they've written.
app.delete("/review/delete", (req, res) => {
  const { userid, businessid } = req.body;

  const reviewIndex = reviews.findIndex(
    (review) =>
      review.businessid === parseInt(businessid) &&
      review.userid === parseInt(userid)
  );
  if (reviewIndex != -1) {
    reviews.splice(reviewIndex, 1);
    res.send(
      `Review for business ${businessid} by user ${userid} has been deleted.`
    );
  } else {
    res.status(404).send("No Review Found");
  }
});

// Users may upload image files containing photos of an existing business. Each photo may have an associated caption.
app.post("/photos/upload", (req, res) => {
  const { businessid, userid, caption } = req.body;

  // Check if the business exists
  const businessExists = businesses.some((b) => b.id === businessid);
  if (!businessExists) {
    return res.status(404).json({ message: "Business not found" });
  } else {
    const newPhoto = {
      userid,
      businessid,
      caption,
    };
    photos.push(newPhoto);
    res.status(201).json(newPhoto);
  }
});

// Users may modify the caption of any photo they've uploaded.
app.patch("/photos/modify", (req, res) => {
  const { userid, businessid } = req.body;

  const photoIndex = photos.findIndex(
    (photo) =>
      photo.businessid === parseInt(businessid) &&
      photo.userid === parseInt(userid)
  );

  if (photoIndex === -1) {
    res.status(404).send("Review Not Found");
  } else {
    const photo = photos[photoIndex];
    photo.userid = parseInt(userid);
    photo.businessid = parseInt(businessid);
    photo.caption = req.body.caption || photo.caption;
    res.status(200).send(photo);
  }
});

// Users may remove any photo they've uploaded.
app.delete("/photos/delete", (req, res) => {
  const { userid, businessid } = req.body;

  const photoIndex = photos.findIndex(
    (photo) =>
      photo.businessid === parseInt(businessid) &&
      photo.userid === parseInt(userid)
  );
  if (photoIndex != -1) {
    photos.splice(photoIndex, 1);
    res.send(
      `Photo for business ${businessid} by user ${userid} has been deleted.`
    );
  } else {
    res.status(404).send("No Review Found");
  }
});

// Users may list all of the businesses they own.
app.get("/users/business", (req, res) => {
  let ownerid = parseInt(req.query.ownerid);
  const list = businesses.filter(
    (business) => business.ownerid === parseInt(ownerid)
  );

  if (list.length == 0) {
    res
      .status(404)
      .send(`The Owner with given id ${ownerid} does not own any business`);
  } else {
    res.status(200).send(list);
  }
});

// Users may list all of the reviews they've written.
app.get("/users/reviews", (req, res) => {
  let userid = parseInt(req.query.userid);
  const list = reviews.filter((review) => review.userid === parseInt(userid));
  if (list.length == 0) {
    res
      .status(404)
      .send(`The User with given id ${userid} does not have any reviews.`);
  } else {
    res.status(200).send(list);
  }
});

// Users may list all of the photos they've uploaded.
app.get("/users/photos", (req, res) => {
  let userid = parseInt(req.query.userid);
  const list = photos.filter((photo) => photo.userid === parseInt(userid));
  if (list.length == 0) {
    res
      .status(404)
      .send(
        `The User with given id ${userid} does not have any photos uploaded.`
      );
  } else {
    res.status(200).send(list);
  }
});
