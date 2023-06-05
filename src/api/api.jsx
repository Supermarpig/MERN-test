import axios from 'axios';

const urlRequest = axios.create({
  baseURL: 'http://localhost:3001/api/'
});

const shortUrlRequest = axios.create({
  baseURL: 'http://localhost:3001/'
});

// 此處的urlRequest為我們create的實體
export function sendRequest(method, url, data = null, config) {
    method = method.toLowerCase(); //轉成全部小寫
    switch (method) {
      case "post":
        return urlRequest.post(url, data, config);
      case "get":
        return urlRequest.get(url, { params: data });
      case "delete":
        return urlRequest.delete(url, { params: data });
      case "put":
        return urlRequest.put(url, data);
      case "patch":
        return urlRequest.patch(url, data);
      default:
        console.log(`未知的 method: ${method}`);
        return false;
    }
  }

  export function sendShortUrlRequest(method, url, data = null, config) {
    method = method.toLowerCase(); //轉成全部小寫
    return shortUrlRequest.get(url, data, config);
  }

  
