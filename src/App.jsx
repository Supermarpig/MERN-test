import { useState, useEffect, useRef } from 'react'
import './style/app.css'
import req from './api/api'

function App() {

  //HOOK
  const [item, setItem] = useState('');
  const [short, setShort] = useState('');
  const [changeUrl, setChangeUrl] = useState('');

  const user_input = useRef();





  //獲取 user輸入的Url
  const shortUrl = () => {
    const longUrl = user_input.current.value;

    //先判斷是否有相同的url---------------------------------------------------------------

    //將全部的lonUrl丟進這個array
    const urlArray = item.map(item => item.longUrl);


    let hasUrl = urlArray.includes(longUrl);
    //如果有一個url 
    if (hasUrl) {
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

    //如果沒東西就新增
    if (!hasUrl) {

      console.log("object")
      // //先將user 輸入的網址 新增資料庫---------------------------------------------------------------
      // apiUrlPost({
      //   'title': "",
      //   'description': "",
      //   'imageUrl': "",
      //   'longUrl': longUrl ? `${longUrl}` : "",
      //   'shortUrl': ""
      // })
      //   .then(res => {
      //     // console.log("新增成功");
      //     alert('新增成功')
      //   })
      //   .catch(error => {
      //     // response攔截器會先執行，除非你漏接了，才會進到catch
      //     console.log("新增失敗");
      //   })

      // //然後傳 _ID回來---------------------------------------------------------------

      // getUrl(longUrl).then((result) => {
      //   console.log(result.data._id)
      //   setChangeUrl(result.data._id);

      //   //將獲取的ID 弄成短網址
      //   // 生成固定的、加密的短網址（例如，長度為 6 位）
      //   generateShortUrl(changeUrl, 6)
      //     .then(shortUrlTest => {
      //       console.log(shortUrlTest);
      //     })
      //     .catch(error => {
      //       console.error(error);
      //     });
      // }).catch(err => {
      //   console.log(err);
      // })
      // //然後在將短網址寫入剛剛那格資料庫後面---------------------------------------------------------------
    }

  }




  useEffect(() => {
    getData().then((result) => {
      setItem(result.data)
    }).catch(err => {
      console.log(err);
    })


  }, []);

  // console.log(item)


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



  // --------------------------------------------------------------------------------------

  //Get Data
  const getData = (getID) => {
    if (getID) {
      return req("get", `/getData/${getID}`)
    } else {
      return req("get", "/getData")
    }
  }

  //Get Url Data
  const getUrl = (getUrl) => {

    return req("get", `/getUrl/${encodeURIComponent(getUrl)}`)

  }


  //新增

  const apiUrlPost = (postData) => {
    return req("post", "/postData", postData)
  }

  //更新
  const userPut = (putID, putValue) => {
    return req("put", `/putData/${putID}`, putValue)
  }

  //刪除   ------>目前是刪ID
  const userDelete = (deleteID) => {
    return req("delete", `/deleteData/${deleteID}`)
  }


  // const addUrl = () => {

  //   const Starsign = addStarsign.current.value;
  //   const Property = addProperty.current.value;
  //   const StartDate = addStartDate.current.value;
  //   const EndDate = addEndDate.current.value;


  //   apiUrlPost( {
  //     'starsign': Starsign?`${Starsign}`:"",
  //     'property': Property?`${Property}`:"",
  //     'startDate': StartDate?`${StartDate}`:"",
  //     'endDate': EndDate?`${EndDate}`:""
  //   })
  //     .then(res => { 
  //       console.log("新增成功"); 
  //       alert('新增成功')
  //     })
  //     .catch(error => {
  //       // response攔截器會先執行，除非你漏接了，才會進到catch
  //       console.log("新增失敗");
  //     })


  // }



  // const putUrl = () => {
  //   console.log(putUserID)
  //   const putID = putUserID.current.value;
  //   const Starsign = putStarsign.current.value;
  //   const Property = putProperty.current.value;
  //   const StartDate = putStartDate.current.value;
  //   const EndDate = putEndDate.current.value;


  //   userPut(putID, {
  //     'starsign': `${Starsign}`,
  //     'property': `${Property}`,
  //     'startDate': `${StartDate}`,
  //     'endDate': `${EndDate}`
  //   })
  //     .then(res => { console.log("更新成功"); })
  //     .catch(error => {
  //       // response攔截器會先執行，除非你漏接了，才會進到catch
  //       console.log("更新失敗");
  //     })

  // }





  // const deleteULR = () => {
  //   const DeleteValue = DeleteRef.current.value;
  //   // console.log(DeleteValue)


  //   userDelete(DeleteValue)
  //     .then(res => { console.log("刪除成功"); alert("刪除成功")})
  //     .catch(error => {
  //       // response攔截器會先執行，除非你漏接了，才會進到catch
  //       console.log("刪除失敗");
  //     })
  // }



  return (
    <div className='contain'>
      <div className='user'>
        <input className='user_input' type="text" ref={user_input}></input>
        <button className='user_check' onClick={shortUrl}>click</button>
      </div>

      {short && (
        <div className='output'>
          <a href={`http://127.0.0.1:5173/${short}`}>{`http://127.0.0.1:5173/${short}`}</a>
        </div>
      )}

    </div>
  )
}

export default App
