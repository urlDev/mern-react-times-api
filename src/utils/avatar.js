const axios = require('axios');

const url = 'https://urldev.fly.dev';

const avatar = async (id) => {
  let image;

  try {
    const response = await axios.get(`${url}/myAvatar/${id}`, {
      responseType: 'arraybuffer',
    });

    return (image = response.data);
  } catch (error) {
    console.log(error);
  }

  return image;
};

module.exports = avatar;
