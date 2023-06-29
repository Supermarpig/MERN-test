import { useState, useEffect, useRef, React } from 'react'
import '../style/home.css'
import { getData, getUrl, getLongUrl, apiUrlPost, userPut, userDelete } from '../api/api'
import { generateShortUrl, getDataCheck, IsURL } from '../utils/utils'

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

      //將全部的lonUrl丟進這個array
      let urlArray = item.map(item => item.longUrl);
      let hasUrl = urlArray.includes(longUrl);
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
  // --------------------------------------------------------------------------------------

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
