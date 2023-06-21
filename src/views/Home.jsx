import { useState, useEffect, useRef, React } from 'react'
import '../style/home.css'
import { sendRequest, sendShortUrlRequest } from '../api/api'

function Home() {

  //HOOK
  const [item, setItem] = useState('');
  const [short, setShort] = useState('');
  const [changeUrl, setChangeUrl] = useState('');

  const user_input = useRef();

  //伺服器的port:
  let domainName = 'http://127.0.0.1:3001/';



  useEffect(() => {
    getData().then((result) => {
      setItem(result.data)
    }).catch(err => {
      console.log(err);
    })
  }, []);



  //獲取 user輸入的Url
  const shortUrl = () => {
    const longUrl = user_input.current.value;

    //檢查輸入的是不是URL
    if (IsURL(longUrl)) {
      //TODO:新增確認是不是有效網址
      // IsURLValid(longUrl)//測試網路是否能連線
      // .then(valid => {
      // if (valid) {
      // console.log("URL is valid and accessible.");
      //把item清空
      setItem([]);

      //先判斷是否有相同的url---------------------------------------------------------------
      getData().then((result) => {
        let newArray = [];
        newArray = [...result.data];
        setItem(newArray);
      }).catch(err => {
        console.log(err);
      })


      // console.log(item)
      //將全部的lonUrl丟進這個array

      let urlArray = item.map(item => item.longUrl);
      let hasUrl = urlArray.includes(longUrl);


      // console.log(hasUrl, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

      //如果有一個url 
      if (hasUrl) {
        getDataCheck();

      }

      //如果沒東西就新增
      else if (!hasUrl) {

        if (hasUrl) {

        } else {
          //先將user 輸入的網址 新增資料庫---------------------------------------------------------------
          apiUrlPost({
            'title': "",
            'description': "",
            'imageUrl': "",
            'longUrl': longUrl ? `${longUrl}` : "",
            'shortUrl': ""
          })
            .then(res => {
              // console.log("新增成功");
              getData().then((result) => {

                let newArray = [];
                newArray = [...result.data];
                setItem(newArray);
              }).catch(err => {
                console.log(err);
              })
              alert('新增成功')
            })
            .catch(error => {
              // response攔截器會先執行，除非你漏接了，才會進到catch
              console.log("新增失敗");
            })

          //然後傳 _ID回來---------------------------------------------------------------

          setTimeout(() => {
            getUrl(longUrl).then((result) => {
              // console.log(result)
              setChangeUrl(result.data._id);
              let oldUrl = result.data._id

              //將獲取的ID 弄成短網址
              // 生成固定的、加密的短網址（例如，長度為 6 位）
              oldUrl && generateShortUrl(oldUrl, 6)
                .then(shortUrlTest => {
                  // console.log(shortUrlTest);
                  setShort(shortUrlTest);

                  //新增短網址到資料庫內---------------------
                  userPut(oldUrl,

                    {
                      'shortUrl': `${shortUrlTest}`
                    })

                  //一分鐘後刪除這筆資料
                  setTimeout(() => {
                    userDelete(oldUrl);
                    alert(`刪除一筆${oldUrl}`);
                    setShort('');
                    // console.log(`刪除一筆${oldUrl}`)
                  }, 30000)


                })
                .catch(error => {
                  console.error(error);
                });
            }).catch(err => {
              console.log(err);
            })
          }, 500);

        }





      }
      // } else {
      // console.log("URL is valid but not accessible.");
      // alert('你輸入的網址 好像不能連線唷')
      // }
      // })
      // .catch(error => {
      // console.log("Error occurred while checking URL validity.");
      // });

    } else {

      alert('請輸入正確的格式')

    }



  }



  // 檢查是不是URL
  function IsURL(strUrl) {
    var regular = /^(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]{2,}(\/[\w\/:\-@&?=+,.!~%$]*)?)$/i;
    if (regular.test(strUrl)) {
      return true;
    } else {
      return false;
    }
  }
  async function IsURLValid(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      // console.log(response)
      return response.ok;
    } catch (error) {
      return false;
    }
  }




  // 確認Url 是否存在
  function getDataCheck() {

    const longUrl = user_input.current.value;

    getUrl(longUrl).then((result) => {
      // console.log(result.data._id)
      setChangeUrl(result.data._id);
      alert('已有相同Url');
      let oldUrl = result.data._id


      //將獲取的ID 弄成短網址
      // 生成固定的、加密的短網址（例如，長度為 6 位）
      oldUrl && generateShortUrl(oldUrl, 6)
        .then(shortUrlTest => {
          // console.log(shortUrlTest);
          setShort(shortUrlTest);
        })
        .catch(error => {
          console.error(error);
        });

    }).catch(err => {
      console.log(err);
    })
  }

  //依照 資料庫的ID 生成加密亂碼
  // --------------------------------------------------------------------------------------

  function generateShortUrl(id, length) {
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


  // //點擊短網址的function 
  // const longUrl = () => {

  //   getLLongUrl(changeUrl).then((result) => {
  //     // console.log(result.data)
  //     window.location.href = result.data;
  //   }).catch(err => {
  //     console.log(err);
  //   })


  // }

  // --------------------------------------------------------------------------------------



  // --------------------------------------------------------------------------------------

  //Get Data
  const getData = (getID) => {
    if (getID) {
      return sendRequest("get", `/getData/${getID}`)
    } else {
      return sendRequest("get", "/getData")
    }
  }

  //Get Url Data
  const getUrl = (getUrl) => {
    return sendRequest("get", `/getUrl/${encodeURIComponent(getUrl)}`)
  }

  //獲取長Url
  const getLLongUrl = (getID) => {
    return sendRequest("get", `/getOriginalUrl/${getID}`)
  }


  //新增
  const apiUrlPost = (postData) => {
    return sendRequest("post", "/postData", postData)
  }

  //更新
  const userPut = (putID, putValue) => {
    return sendRequest("put", `/putData/${putID}`, putValue)
  }

  //刪除   ------>目前是刪ID
  const userDelete = (deleteID) => {
    return sendRequest("delete", `/deleteData/${deleteID}`)
  }

  return (
    <div className='contain'>
      <div className='user'>
        <input className='user_input' type="text" ref={user_input}></input>
        <button className='user_check' onClick={shortUrl}>Change</button>


      </div>
      <div className='user_output'>
        {short && (
          <div className='user_output_div'>
            <a href={`${domainName}${short}`} >{`${domainName}${short}`}</a>
            {/* <div onClick={longUrl}>{`${domainName}${short}`}</div> */}
          </div>
        )}
        
      </div>
    </div>
  )
}

export default Home
