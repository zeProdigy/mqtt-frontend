const express = require("express");
const path = require("path");
const fs = require("fs");


const app = express();

app.use("/static", express.static(path.resolve(__dirname, "static")));

app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "static/index.html"));
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on localhost:${port}`));
