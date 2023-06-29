
//依照 資料庫的ID 生成加密亂碼
// --------------------------------------------------------------------------------------

export function generateShortUrl(id, length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortUrl = '';

    // 將 ID 轉換為 Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(id);

    // 使用 SubtleCrypto 加密算法計算 ID 的摘要
    return crypto.subtle.digest('SHA-256', data)
        .then(hashBuffer => {
            // 將摘要轉換為 Uint8Array
            const hashArray = Array.from(new Uint8Array(hashBuffer));

            // 將字串數組映射到短網址的字符集合
            for (let i = 0; i < length; i++) {
                const index = hashArray[i] % characters.length;
                shortUrl += characters.charAt(index);
            }

            return shortUrl;
        });
}

// 檢查是不是URL
export function IsURL(strUrl) {
    var regular = /^(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]{2,}(\/[\w\/:\-@&?=+,.!~%$]*)?)$/i;
    if (regular.test(strUrl)) {
        return true;
    } else {
        return false;
    }
}