const axios = require('axios');

const TARGET_API_URL = 'https://api.deepinfra.com/v1/openai/chat/completions';

function generateRandomUserAgent() {
  const browsers = ['Chrome', 'Firefox', 'Edge', 'Safari'];
  const osList = [
    { name: 'Windows NT', versions: ['10.0', '6.3', '6.1'] },
    { name: 'Macintosh; Intel Mac OS X', versions: ['10_15_7', '11_6', '12_3'] },
    { name: 'X11; Linux x86_64', versions: [''] },
    { name: 'Android', versions: ['10', '11', '12'] },
    { name: 'iPhone; CPU iPhone OS', versions: ['14_4', '15_3', '16_1'] }
  ];
  const browser = browsers[Math.floor(Math.random() * browsers.length)];
  const os = osList[Math.floor(Math.random() * osList.length)];
  const osVersion = os.versions[Math.floor(Math.random() * os.versions.length)];
  const major = Math.floor(Math.random() * 30) + 70;
  const minor = Math.floor(Math.random() * 4000) + 1000;
  const patch = Math.floor(Math.random() * 100) + 1;
  
  if (browser === 'Chrome') {
    return `Mozilla/5.0 (${os.name} ${osVersion}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.${minor}.${patch} Safari/537.36`;
  } else if (browser === 'Firefox') {
    return `Mozilla/5.0 (${os.name} ${osVersion}; rv:${major}) Gecko/20100101 Firefox/${major}.0`;
  } else if (browser === 'Edge') {
    return `Mozilla/5.0 (${os.name} ${osVersion}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.${minor}.${patch} Safari/537.36 Edg/${major}.0.${minor}.${patch}`;
  } else if (browser === 'Safari') {
    return `Mozilla/5.0 (${os.name} ${osVersion}) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${major}.0 Safari/605.1.15`;
  }
  return `Mozilla/5.0 (${os.name} ${osVersion})`;
}

module.exports = async (req, res) => {
  try {
    const requestPayload = req.body;
    const requestQuery = req.query;
    const requestHeaders = req.headers;
    
    const headersToSend = {
      'Content-Type': requestHeaders['content-type'] || 'application/json',
      'Accept': requestHeaders['accept'] || '*/*',
      'User-Agent': generateRandomUserAgent(),
      'Referer': requestHeaders['referer'],
      'X-Deepinfra-Source': requestHeaders['x-deepinfra-source']
    };
    
    if (requestHeaders['authorization']) {
      headersToSend['Authorization'] = requestHeaders['authorization'];
    }
    
    Object.keys(headersToSend).forEach(key => headersToSend[key] === undefined && delete headersToSend[key]);
    
    const apiResponse = await axios({
      method: req.method,
      url: TARGET_API_URL,
      headers: headersToSend,
      params: requestQuery,
      data: requestPayload,
      responseType: 'stream'
    });
    
    res.status(apiResponse.status);
    
    for (const header in apiResponse.headers) {
      if (header.toLowerCase() !== 'transfer-encoding' && header.toLowerCase() !== 'connection') {
        res.setHeader(header, apiResponse.headers[header]);
      }
    }
    
    apiResponse.data.pipe(res);
    
    apiResponse.data.on('end', () => {
      res.end();
    });
    
    apiResponse.data.on('error', (err) => {
      console.error('Stream error from target API:', err);
      if (!res.headersSent) {
        res.status(500).send('Error processing response stream from target API');
      } else {
        res.end();
      }
    });
    
  } catch (error) {
    console.error('Error in proxy module:', error.message);
    
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send('No response received from target API');
    } else {
      res.status(500).send('Error setting up request to target API');
    }
  }
};