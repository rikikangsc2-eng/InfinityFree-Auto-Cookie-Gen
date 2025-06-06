const axios = require('axios')
const cheerio = require('cheerio')

module.exports = async function(req, res) {
  const rapidApiKeys = [
    '222ac7fb8bmsh0cb23acb6003932p1bfcadjsne797ba726a04',
    '84abff527bmshe5db0ab2e935a2fp18c617jsn3d437cd679e9',
    '6091df931amshbefde270fdf27b7p1321b6jsn2def092efe1a'
  ]
  const rapidApiHost = 'tiktok-scraper7.p.rapidapi.com'
  const baseUrl = `https://${rapidApiHost}/feed/search`
  const keywords = req.query.query
  const params = {
    keywords: keywords,
    region: 'id',
    count: 5,
    cursor: 0,
    publish_time: 0,
    sort_type: 0
  }

  for (let i = 0; i < 3; i++) {
    const randomKey = rapidApiKeys[Math.floor(Math.random() * rapidApiKeys.length)]
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          'x-rapidapi-host': rapidApiHost,
          'x-rapidapi-key': randomKey
        },
        params: params
      })
      const datannya = response.data.data.videos
      const randomIndex = Math.floor(Math.random() * datannya.length);
      const dataAcak = datannya[randomIndex];
      const {title, cover, play, music} = dataAcak
      return res.json({title, thumbnail: cover, video:play, music})
    } catch (e) {
      if (i === 2) {
        return res.status(e.response ? e.response.status : 500).json({ error: 'Gagal mengambil data TikTok setelah beberapa percobaan' })
      }
    }
  }
}

