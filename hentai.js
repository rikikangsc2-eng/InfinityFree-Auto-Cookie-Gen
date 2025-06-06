const axios = require('axios');
const cheerio = require('cheerio');

module.exports = async function(req, res) {
  const ajaxUrl = 'https://aihentai.co/wp-admin/admin-ajax.php';
  const postData = 'action=get_random_image_url';
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.7049.111 Mobile Safari/537.36',
    'Referer': 'https://aihentai.co/random/'
  };

  let imageUrl = null;
  const maxAttempts = 10;
  let attempts = 0;

  while (!imageUrl && attempts < maxAttempts) {
    attempts++;
    try {
      const ajaxResponse = await axios.post(ajaxUrl, postData, { headers });
      const responseData = ajaxResponse.data;

      if (typeof responseData === 'string') {
         if (responseData.startsWith('http')) {
             imageUrl = responseData.trim();
         }
      } else if (typeof responseData === 'object') {
          if (responseData.url && typeof responseData.url === 'string' && responseData.url.startsWith('http')) {
              imageUrl = responseData.url.trim();
          } else if (responseData.data && typeof responseData.data.url === 'string' && responseData.data.url.startsWith('http')) {
              imageUrl = responseData.data.url.trim();
          }
      }

      if (!imageUrl) {
          await new Promise(resolve => setTimeout(resolve, 500));
      }

    } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  if (!imageUrl) {
    return res.status(500).json({ error: 'Failed to obtain image URL after multiple attempts.' });
  }

  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });

    if (!imageResponse.headers['content-type'] || !imageResponse.headers['content-type'].startsWith('image/')) {
         imageResponse.data.destroy();
         return res.status(500).json({ error: 'URL did not provide an image stream.' });
    }

    res.setHeader('Content-Type', imageResponse.headers['content-type']);
    imageResponse.data.pipe(res);

    imageResponse.data.on('error', (err) => {
        if (!res.headersSent) {
             res.status(500).json({ error: 'Image streaming failed.' });
        }
    });

    req.on('close', () => {
        imageResponse.data.destroy();
    });


  } catch (error) {
    if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream image.' });
    }
  }
};
