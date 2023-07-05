import axios from 'axios';

const urlRequest = axios.create({
  baseURL: '172.67.160.57:3001/api/'
});

const shortUrlRequest = axios.create({
  baseURL: '172.67.160.57:3001/'
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

  

//Get Data
export const getData = (getID) => {
  if (getID) {
    return sendRequest("get", `/getData/${getID}`);
  } else {
    return sendRequest("get", "/getData");
  }
};

//Get Url Data
export const getUrl = (getUrl) => {
  return sendRequest("get", `/getUrl/${encodeURIComponent(getUrl)}`);
};

//獲取長Url
export const getLongUrl = (getID) => {
  return sendRequest("get", `/getOriginalUrl/${getID}`);
};

//新增
export const apiUrlPost = (postData) => {
  return sendRequest("post", "/postData", postData);
};

//更新
export const userPut = (putID, putValue) => {
  return sendRequest("put", `/putData/${putID}`, putValue);
};

//刪除   ------>目前是刪ID
export const userDelete = (deleteID) => {
  return sendRequest("delete", `/deleteData/${deleteID}`);
};