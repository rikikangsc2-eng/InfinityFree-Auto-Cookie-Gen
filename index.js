const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.succesJson = (data, statusCode = 200) => res.status(statusCode).json({ author: "NirKyy", success: true, data: data });
    res.successJson = (data, statusCode = 200) => res.status(statusCode).json({ published_By: "NirKyy", success: true, data: data });
    res.errorJson = (message, statusCode = 500) => res.status(statusCode).json({ published_By: "NirKyy", success: false, status: statusCode, error: message });
    next();
});

app.get("/", require('./apaantuh.js'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
