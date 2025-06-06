const axios = require('axios');

module.exports = async function(rq, rs) {
    const { urlTarget, indexFile } = rq.query;

    if (!urlTarget || !indexFile) {
        return rs.errorJson("Woy, parameter 'urlTarget' sama 'indexFile' jangan sampe kosong dong!", 400);
    }

    let u1;
    try {
        const parsedUrlTarget = new URL(urlTarget);
        u1 = new URL(indexFile, parsedUrlTarget).toString();
    } catch (e) {
        return rs.errorJson("Bro, 'urlTarget' kayaknya gak valid deh. Cek lagi coba.", 400);
    }
    
    const u2 = `${u1}?i=1`;


    function toNumbers(d) {
        var e = [];
        d.replace(/(..)/g, function(dd) {
            e.push(parseInt(dd, 16));
        });
        return e;
    }

    function toHex() {
        for (var d = [], d = arguments.length === 1 && arguments[0].constructor === Array ? arguments[0] : arguments, e = "", f = 0; f < d.length; f++) e += (d[f] < 16 ? "0" : "") + d[f].toString(16);
        return e.toLowerCase();
    }

    const slowAES = {
        aes: {
            keySize: { SIZE_128: 16, SIZE_192: 24, SIZE_256: 32 },
            sbox: [99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22],
            rsbox: [82,9,106,213,48,54,165,56,191,64,163,158,129,243,215,251,124,227,57,130,155,47,255,135,52,142,67,68,196,222,233,203,84,123,148,50,166,194,35,61,238,76,149,11,66,250,195,78,8,46,161,102,40,217,36,178,118,91,162,73,109,139,209,37,114,248,246,100,134,104,152,22,212,164,92,204,93,101,182,146,108,112,72,80,253,237,185,218,94,21,70,87,167,141,157,132,144,216,171,0,140,188,211,10,247,228,88,5,184,179,69,6,208,44,30,143,202,63,15,2,193,175,189,3,1,19,138,107,58,145,17,65,79,103,220,234,151,242,207,206,240,180,230,115,150,172,116,34,231,173,53,133,226,249,55,232,28,117,223,110,71,241,26,113,29,41,197,137,111,183,98,14,170,24,190,27,252,86,62,75,198,210,121,32,154,219,192,254,120,205,90,244,31,221,168,51,136,7,199,49,177,18,16,89,39,128,236,95,96,81,127,169,25,181,74,13,45,229,122,159,147,201,156,239,160,224,59,77,174,42,245,176,200,235,187,60,131,83,153,97,23,43,4,126,186,119,214,38,225,105,20,99,85,33,12,125],
            rotate:function(i){for(var t=i[0],r=0;r<3;r++)i[r]=i[r+1];return i[3]=t,i},
            Rcon:[141,1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145,57,114,228,211,189,97,194,159,37,74,148,51,102,204,131,29,58,116,232,203,141,1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145,57,114,228,211,189,97,194,159,37,74,148,51,102,204,131,29,58,116,232,203,141,1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145,57,114,228,211,189,97,194,159,37,74,148,51,102,204,131,29,58,116,232,203,141,1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145,57,114,228,211,189,97,194,159,37,74,148,51,102,204,131,29,58,116,232,203,141,1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145,57,114,228,211,189,97,194,159,37,74,148,51,102,204,131,29,58,116,232,203,141,1,2,4,8,16,32,64,128,27,54,108,216,171,77,154,47,94,188,99,198,151,53,106,212,179,125,250,239,197,145,57,114,228,211,189,97,194,159,37,74,148,51,102,204,131,29,58,116,232,203],
            core:function(i,t){i=this.rotate(i);for(var r=0;r<4;++r)i[r]=this.sbox[i[r]];return i[0]=i[0]^this.Rcon[t],i},
            expandKey:function(i,t){for(var r=16*(this.numberOfRounds(t)+1),o=0,n=1,s=[],e=[],a=0;a<r;a++)e[a]=0;for(var h=0;h<t;h++)e[h]=i[h];for(o+=t;o<r;){for(var u=0;u<4;u++)s[u]=e[o-4+u];if(o%t==0&&(s=this.core(s,n++)),t==this.keySize.SIZE_256&&o%t==16)for(var f=0;f<4;f++)s[f]=this.sbox[s[f]];for(var l=0;l<4;l++)e[o]=e[o-t]^s[l],o++}return e},
            addRoundKey:function(i,t){for(var r=0;r<16;r++)i[r]^=t[r];return i},
            createRoundKey:function(i,t){for(var r=[],o=0;o<4;o++)for(var n=0;n<4;n++)r[4*n+o]=i[t+4*o+n];return r},
            subBytes:function(i,t){for(var r=0;r<16;r++)i[r]=(t?this.rsbox:this.sbox)[i[r]];return i},
            shiftRows:function(i,t){for(var r=0;r<4;r++)i=this.shiftRow(i,4*r,r,t);return i},
            shiftRow:function(i,t,r,o){for(var n=0;n<r;n++)if(o){for(var s=i[t+3],e=3;0<e;e--)i[t+e]=i[t+e-1];i[t]=s}else{for(s=i[t],e=0;e<3;e++)i[t+e]=i[t+e+1];i[t+3]=s}return i},
            galois_multiplication: function(a, b) {
                var p = 0;
                for (var counter = 0; counter < 8; counter++) {
                    if ((b & 1) !== 0) {
                        p ^= a;
                    }
                    var hi_bit_set = (a & 0x80) !== 0;
                    a <<= 1;
                    if (a > 0xFF) a ^= 0x100; 
                    if (hi_bit_set) {
                        a ^= 0x1b; 
                    }
                    b >>= 1;
                     if (b > 0xFF) b ^= 0x100;
                }
                return p;
            },
            mixColumns:function(i,t){for(var r=[],o=0;o<4;o++){for(var n=0;n<4;n++)r[n]=i[4*n+o];r=this.mixColumn(r,t);for(var s=0;s<4;s++)i[4*s+o]=r[s]}return i},
            mixColumn:function(i,t){for(var r=[],r=t?[14,9,13,11]:[2,1,1,3],o=[],n=0;n<4;n++)o[n]=i[n];return i[0]=this.galois_multiplication(o[0],r[0])^this.galois_multiplication(o[3],r[1])^this.galois_multiplication(o[2],r[2])^this.galois_multiplication(o[1],r[3]),i[1]=this.galois_multiplication(o[1],r[0])^this.galois_multiplication(o[0],r[1])^this.galois_multiplication(o[3],r[2])^this.galois_multiplication(o[2],r[3]),i[2]=this.galois_multiplication(o[2],r[0])^this.galois_multiplication(o[1],r[1])^this.galois_multiplication(o[0],r[2])^this.galois_multiplication(o[3],r[3]),i[3]=this.galois_multiplication(o[3],r[0])^this.galois_multiplication(o[2],r[1])^this.galois_multiplication(o[1],r[2])^this.galois_multiplication(o[0],r[3]),i},
            round:function(i,t){return i=this.subBytes(i,!1),i=this.shiftRows(i,!1),i=this.mixColumns(i,!1),i=this.addRoundKey(i,t)},
            invRound:function(i,t){return i=this.shiftRows(i,!0),i=this.subBytes(i,!0),i=this.addRoundKey(i,t),i=this.mixColumns(i,!0)},
            main:function(i,t,r){i=this.addRoundKey(i,this.createRoundKey(t,0));for(var o=1;o<r;o++)i=this.round(i,this.createRoundKey(t,16*o));return i=this.subBytes(i,!1),i=this.shiftRows(i,!1),i=this.addRoundKey(i,this.createRoundKey(t,16*r))},
            invMain:function(i,t,r){i=this.addRoundKey(i,this.createRoundKey(t,16*r));for(var o=r-1;0<o;o--)i=this.invRound(i,this.createRoundKey(t,16*o));return i=this.shiftRows(i,!0),i=this.subBytes(i,!0),i=this.addRoundKey(i,this.createRoundKey(t,0))},
            numberOfRounds:function(i){var t;switch(i){case this.keySize.SIZE_128:t=10;break;case this.keySize.SIZE_192:t=12;break;case this.keySize.SIZE_256:t=14;break;default:return null}return t},
            encrypt:function(i,t,r){for(var o=[],n=[],s=this.numberOfRounds(r),e=0;e<4;e++)for(var a=0;a<4;a++)n[e+4*a]=i[4*e+a];for(var r_exp=this.expandKey(t,r),n=this.main(n,r_exp,s),h=0;h<4;h++)for(var u=0;u<4;u++)o[4*h+u]=n[h+4*u];return o},
            decrypt:function(i,t,r){for(var o=[],n=[],s=this.numberOfRounds(r),e=0;e<4;e++)for(var a=0;a<4;a++)n[e+4*a]=i[4*e+a];for(var r_exp=this.expandKey(t,r),n=this.invMain(n,r_exp,s),h=0;h<4;h++)for(var u=0;u<4;u++)o[4*h+u]=n[h+4*u];return o}
        },
        modeOfOperation:{
            OFB:0,CFB:1,CBC:2,
            getBlock:function(i,t,r,o){return 16<r-t&&(r=t+16),i.slice(t,r)},
            encrypt:function(i,t_mode,r_key,o_iv){var n_keylen=r_key.length;if(o_iv.length%16)throw new Error("Bro, panjang IV kudu 128 bit (16 byte) nih.");var s_block,e_cipherTextBlock=[],a_prevCipherTextBlock=[],h_XORed=[],u_cipherText=[],f_firstBlock=!0;if(t_mode==slowAES.modeOfOperation.CBC&&this.padBytesIn(i),null!==i)for(var l=0;l<Math.ceil(i.length/16);l++){var c_start=16*l,d_end=16*l+16;if(16*l+16>i.length&&(d_end=i.length),s_block=this.getBlock(i,c_start,d_end,t_mode),t_mode==slowAES.modeOfOperation.CFB){f_firstBlock?(a_prevCipherTextBlock=slowAES.aes.encrypt(o_iv,r_key,n_keylen),f_firstBlock=!1):a_prevCipherTextBlock=slowAES.aes.encrypt(e_cipherTextBlock,r_key,n_keylen);for(var p=0;p<s_block.length;p++)h_XORed[p]=s_block[p]^a_prevCipherTextBlock[p];for(var v=0;v<d_end-c_start;v++)u_cipherText.push(h_XORed[v]);e_cipherTextBlock=h_XORed.slice(0, d_end-c_start);}else if(t_mode==slowAES.modeOfOperation.OFB){f_firstBlock?(a_prevCipherTextBlock=slowAES.aes.encrypt(o_iv,r_key,n_keylen),f_firstBlock=!1):a_prevCipherTextBlock=slowAES.aes.encrypt(a_prevCipherTextBlock,r_key,n_keylen);for(p=0;p<s_block.length;p++)h_XORed[p]=s_block[p]^a_prevCipherTextBlock[p];for(v=0;v<d_end-c_start;v++)u_cipherText.push(h_XORed[v]);e_cipherTextBlock=a_prevCipherTextBlock.slice(0, d_end-c_start);}else if(t_mode==slowAES.modeOfOperation.CBC){for(p=0;p<16;p++)e_cipherTextBlock[p]=s_block[p]^(f_firstBlock?o_iv:h_XORed)[p];f_firstBlock=!1,h_XORed=slowAES.aes.encrypt(e_cipherTextBlock,r_key,n_keylen);for(v=0;v<16;v++)u_cipherText.push(h_XORed[v])}}return u_cipherText},
            decrypt:function(t_cipherText,r_mode,o_key,n_iv){var s_keylen=o_key.length;if(n_iv.length%16)throw new Error("Bro, panjang IV kudu 128 bit (16 byte) nih.");var e_block,a_prevCipherBlock=[],h_decryptedBlock=[],u_tmp=[],f_plainText=[],l_firstBlock=!0;if(null!==t_cipherText){for(var c_idx=0;c_idx<Math.ceil(t_cipherText.length/16);c_idx++){var d_start=16*c_idx,p_end=16*c_idx+16;if(16*c_idx+16>t_cipherText.length&&(p_end=t_cipherText.length),e_block=this.getBlock(t_cipherText,d_start,p_end,r_mode),r_mode==slowAES.modeOfOperation.CFB){for(l_firstBlock?(h_decryptedBlock=slowAES.aes.encrypt(n_iv,o_key,s_keylen),l_firstBlock=!1):h_decryptedBlock=slowAES.aes.encrypt(a_prevCipherBlock,o_key,s_keylen),i_iter=0;i_iter<e_block.length;i_iter++)u_tmp[i_iter]=h_decryptedBlock[i_iter]^e_block[i_iter];for(var v=0;v<p_end-d_start;v++)f_plainText.push(u_tmp[v]);a_prevCipherBlock=e_block.slice(0);}else if(r_mode==slowAES.modeOfOperation.OFB){for(l_firstBlock?(h_decryptedBlock=slowAES.aes.encrypt(n_iv,o_key,s_keylen),l_firstBlock=!1):h_decryptedBlock=slowAES.aes.encrypt(a_prevCipherBlock,o_key,s_keylen),i_iter=0;i_iter<e_block.length;i_iter++)u_tmp[i_iter]=h_decryptedBlock[i_iter]^e_block[i_iter];for(v=0;v<p_end-d_start;v++)f_plainText.push(u_tmp[v]);a_prevCipherBlock=h_decryptedBlock.slice(0);}else if(r_mode==slowAES.modeOfOperation.CBC){h_decryptedBlock=slowAES.aes.decrypt(e_block,o_key,s_keylen);for(i_iter=0;i_iter<e_block.length;i_iter++)u_tmp[i_iter]=(l_firstBlock?n_iv:a_prevCipherBlock)[i_iter]^h_decryptedBlock[i_iter];l_firstBlock=!1;for(v=0;v<p_end-d_start;v++)f_plainText.push(u_tmp[v]);a_prevCipherBlock=e_block.slice(0);}}r_mode==slowAES.modeOfOperation.CBC&&this.unpadBytesOut(f_plainText)}return f_plainText},
            padBytesIn:function(i){for(var t=16-i.length%16,r=0;r<t;r++)i.push(t)},
            unpadBytesOut:function(i){var t=0;if(0<i.length){var padVal=i[i.length-1];if(padVal>0&&padVal<=16&&i.length>=padVal){var isPadding=!0;for(var k=1;k<=padVal;k++){if(i[i.length-k]!==padVal){isPadding=!1;break}}if(isPadding)t=padVal}0<t&&i.splice(i.length-t,t)}}}
    };
    
    const h_init = {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.125 Mobile Safari/537.36',
        'Referer': urlTarget,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
        'Cache-Control': 'max-age=0',
        'Origin': new URL(urlTarget).origin,
        'Sec-Ch-Ua': '"Not/A)Brand";v="99", "Google Chrome";v="136", "Chromium";v="136"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
    };

    try {
        const r1 = await axios.post(u1, null, { 
            headers: h_init,
            timeout: 20000, 
            responseType: 'text',
        }); 
        
        let ht_original = r1.data;

        if (typeof ht_original !== 'string') {
             return rs.errorJson("Aduh, data dari server bukan teks nih. Aneh...", 400);
        }
        if (ht_original.length < 200) {
             return rs.errorJson(`Data dari server kependekan bro (cuma ${ht_original.length} karakter). Kayaknya halaman error atau proteksi nih. Cekidot: ${ht_original.substring(0,200)}`, 400);
        }
        
        let ht_processed = ht_original.normalize('NFKC');
        ht_processed = ht_processed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/g, "");

        const ra = /var\s*a\s*=\s*toNumbers\s*\(\s*"([a-f0-9]{32})"\s*\)/;
        const rb = /,\s*b\s*=\s*toNumbers\s*\(\s*"([a-f0-9]{32})"\s*\)/;
        const rc = /,\s*c\s*=\s*toNumbers\s*\(\s*"([a-f0-9]{32})"\s*\)/;

        let ma, mb, mc;
        let ah, bh, ch_val;
        
        ma = ht_processed.match(ra);
        if (ma && ma[1]) {
            ah = ma[1];
        } else {
            const snippet_a_debug = ht_processed.length > 700 ? ht_processed.substring(0, 700) + `... (total ${ht_processed.length} chars)` : ht_processed;
            return rs.errorJson(`Gagal dapetin parameter 'a' nih bro. Ini datanya (panjang ${ht_processed.length}): ${snippet_a_debug}`, 400);
        }

        mb = ht_processed.match(rb); 
        if (mb && mb[1]) {
            bh = mb[1];
        } else {
            let debug_message = `Gagal dapetin parameter 'b' nih (nyari format ',b=...'). `;
            const commaBEqualsIndex = ht_processed.indexOf(",b=");
            debug_message += `indexOf(",b="): ${commaBEqualsIndex}. `;
            const full_ht_for_error = ht_processed.length > 700 ? ht_processed.substring(0,700) + "\n...\n" + ht_processed.substring(ht_processed.length - 200) : ht_processed;
            debug_message += `Isi datanya (panjang ${ht_processed.length}): ${full_ht_for_error}`;
            return rs.errorJson(debug_message, 400);
        }
        
        mc = ht_processed.match(rc);
        if (mc && mc[1]) {
            ch_val = mc[1];
        } else {
             let debug_message_c = `Gagal dapetin parameter 'c' nih (nyari format ',c=...'). `;
            const commaCEqualsIndex = ht_processed.indexOf(",c=");
            debug_message_c += `indexOf(",c="): ${commaCEqualsIndex}. `;
            const full_ht_for_error_c = ht_processed.length > 700 ? ht_processed.substring(0,700) + "\n...\n" + ht_processed.substring(ht_processed.length - 200) : ht_processed;
            debug_message_c += `Isi datanya (panjang ${ht_processed.length}): ${full_ht_for_error_c}`;
            return rs.errorJson(debug_message_c, 400);
        }

        const an = toNumbers(ah);
        const bn = toNumbers(bh);
        const cn = toNumbers(ch_val);
        
        if (an.length !== 16 || bn.length !== 16 || cn.length !== 16) {
            return rs.errorJson(`Panjang angkanya gak pas bro setelah diubah: a(${an.length}), b(${bn.length}), c(${cn.length}). Harusnya semua 16. Nilai mentahnya: a='${ah}', b='${bh}', c='${ch_val}'`, 400);
        }

        let dv;
        try {
            dv = slowAES.modeOfOperation.decrypt(cn, slowAES.modeOfOperation.CBC, an, bn);
        } catch (decErr) {
            return rs.errorJson(`Waduh, gagal pas dekripsi AES nih: ${decErr.message}. Input c (hex): ${ch_val}, key (hex): ${ah}, iv (hex): ${bh}. Detail errornya: ${decErr.stack ? decErr.stack.substring(0,300) : 'Gak ada stacktrace'}`, 500);
        }
        
        const cv = toHex(dv);

        if (!cv && dv.length > 0 && cn.length > 0) { // Hanya error jika input c ada tapi output cv kosong
            return rs.errorJson("Gagal ubah hasil dekripsi ke hex. Hasil array angkanya: " + dv.slice(0,10).join(','), 500);
        }
        // Jika cv kosong karena memang hasil dekripsinya kosong (misal karena padding), itu oke.

        const ck = `__test=${cv}`;
        
        const h_verify = { ...h_init };
        delete h_verify['Origin'];   
        delete h_verify['Content-Length']; 
        h_verify['Cookie'] = ck;     
        h_verify['Accept-Encoding'] = 'gzip, deflate, br';

        const r2 = await axios.get(u2, { 
            headers: h_verify, 
            timeout: 15000
        });

        if (r2.status === 200) {
            rs.successJson({ 
                cookieGenerated: ck, 
                verificationStatus: r2.status, 
                verificationUrl: u2,
                pageTitleAttempt: (r2.data && typeof r2.data === 'string' ? (r2.data.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || "Judul gak ketemu" : "Respon bukan teks") 
            });
        } else {
            rs.errorJson(`Cookie udah jadi, tapi pas verifikasi gagal euy. Status dari server: ${r2.status} buat URL ${u2}. Responnya: ${r2.data ? String(r2.data).substring(0,200) : 'Gak ada data'}`, 502);
        }

    } catch (er) {
        let em = "Busett, ada error internal nih pas mau generate token.";
        if (er.code === 'ECONNABORTED' || (er.message && er.message.toLowerCase().includes('timeout'))) {
            em = `Kelamaan nungguin server ${er.config && er.config.url ? er.config.url : ''} nih (timeout setelah ${er.config && er.config.timeout ? er.config.timeout : 'N/A'} ms). Servernya lagi ngopi kali ya?`;
        } else if (er.response) {
            const responseDataSnippet = (er.response.data && typeof er.response.data === 'string') ? er.response.data.substring(0, 200) : (er.response.data ? `Tipe datanya: ${typeof er.response.data}` : 'Gak ada data respons');
            em = `Gagal request ke server bro: Status ${er.response.status}. URL: ${er.config.url}. Pesan errornya: ${er.message}. Intip responsnya: ${responseDataSnippet}`;
        } else if (er.request) {
            em = `Gak ada jawaban dari server pas request ke ${er.config && er.config.url ? er.config.url : 'URL gak jelas'}. Servernya online gak tuh? Pesan error internal: ${er.message}`;
        } else {
            em = `Error gak jelas nih pas lagi proses: ${er.message}. Detailnya: ${er.stack ? er.stack.substring(0,300) : 'Gak ada stacktrace'}`;
        }
        rs.errorJson(em, 500);
    }
};