// import  req  from './api'

// // Get Data
// const getData = (getID) => {
//     if (getID) {
//         return req("get", `/getData/${getID}`);
//     } else {
//         return req("get", "/getData");
//     }
// };

// // Get Url Data
// const getUrl = (getUrl) => {
//     return req("get", `/getUrl/${encodeURIComponent(getUrl)}`);
// };

// // 獲取長Url
// const getLongUrl = (getID) => {
//     return req("get", `/getOriginalUrl/${getID}`);
// };

// // 新增
// const apiUrlPost = (postData) => {
//     return req("post", "/postData", postData);
// };

// // 更新
// const userPut = (putID, putValue) => {
//     return req("put", `/putData/${putID}`, putValue);
// };

// // 刪除
// const userDelete = (deleteID) => {
//     return req("delete", `/deleteData/${deleteID}`);
// };

// export default {
//     getData,
//     getUrl,
//     getLongUrl,
//     apiUrlPost,
//     userPut,
//     userDelete
// };