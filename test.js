const axios = require("axios");

axios.get("https://graduation-project-hvey.onrender.com/plant/viewall", {
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3N2ViZDQxNzBiODRjNjkxNWIxMzgyOCIsImlhdCI6MTczNjQ0MzA1OSwiZXhwIjoxNzM5MDM1MDU5fQ.aB7_8GvziI7EyHQWWckTg27vcA-GYUi4ikvRgjCYL2Y" 
  }
})
.then(response => console.log(response.data)).catch(error=>console.log("error",error.message));
