const axios = require('axios')

module.exports = async function(req, res) {
  const rapidApiKeys = [
    '6091df931amshbefde270fdf27b7p1321b6jsn2def092efe1a',
    '84abff527bmshe5db0ab2e935a2fp18c617jsn3d437cd679e9',
    '222ac7fb8bmsh0cb23acb6003932p1bfcadjsne797ba726a04',
    '387331c34amshd9045ca7a95f739p18109ajsndb356a729111',
    '829f39dc21msha6638a2cc181fafp1c2706jsn42a8280a37ac',
    'fad1bfa0dfmsha3fa3e06b80a387p147910jsn9452a840d8bb'
  ]
  const randomApiKey = rapidApiKeys[Math.floor(Math.random() * rapidApiKeys.length)]
  const imageUrl = req.query.url

  if (!imageUrl) {
    return res.errorJson('Kasih dong URL gambarnya, biar bisa dianalisis!', 400)
  }

  try {
    const response = await axios.post(
      'https://nsfw-images-detection-and-classification.p.rapidapi.com/adult-content',
      { url: imageUrl }, {
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'nsfw-images-detection-and-classification.p.rapidapi.com',
          'x-rapidapi-key': randomApiKey
        }
      }
    )
    res.successJson(response.data)
  } catch (e) {
    if (e.response) {
      res.errorJson(`Waduh, ada yang salah nih sama API-nya: ${e.response.status} - ${e.response.statusText}`, e.response.status)
    } else if (e.request) {
      res.errorJson('Permintaan API-nya ga nyampe nih, cek koneksi internetmu atau URL API-nya!', 503)
    } else {
      res.errorJson(`Gagal total! Ada masalah di kode kita: ${e.message}`, 500)
    }
  }
}
