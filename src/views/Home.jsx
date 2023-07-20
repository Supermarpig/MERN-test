import { useState, useEffect, useRef, React } from 'react'
import '../style/home.css'
import { getData, getUrl, getLongUrl, apiUrlPost, userPut, userDelete } from '../api/api'
import { generateShortUrl, IsURL } from '../utils/utils'
import { Link, NavLink } from 'react-router-dom'

function Home() {

  //HOOK
  const [item, setItem] = useState([]);
  const [short, setShort] = useState('');
  const [changeUrl, setChangeUrl] = useState('');

  const user_input = useRef();



  //伺服器的port:
  let domainName = 'https://tiny.zeabur.app/';

  useEffect(() => {
    getData().then((result) => {
      console.log(result.data)
      setItem(result.data)
    }).catch(err => {
      console.log(err);
    })
  }, []);

  // console.log(item)


  //獲取 user輸入的Url
  // const shortUrl = () => {
  //   const longUrl = user_input.current.value;

  //   //檢查輸入的是不是URL
  //   if (IsURL(longUrl)) {
  //     //TODO:新增確認是不是有效網址
  //     //把item清空
  //     setItem([]);

  //     //先判斷是否有相同的url---------------------------------------------------------------
  //     getData().then((result) => {
  //       let newArray = [];
  //       newArray = [...result.data];
  //       setItem(newArray);
  //     }).catch(err => {
  //       console.log(err);
  //     })

  //     //將全部的lonUrl丟進這個array
  //     let urlArray = item.map(item => item.longUrl);
  //     let hasUrl = urlArray.includes(longUrl);
  //     //如果有一個url 
  //     if (hasUrl) {
  //       getDataCheck(user_input);
  //     }

  //     //如果沒東西就新增
  //     else if (!hasUrl) {

  //       if (hasUrl) {

  //       } else {
  //         //先將user 輸入的網址 新增資料庫---------------------------------------------------------------
  //         apiUrlPost({
  //           'title': "",
  //           'description': "",
  //           'imageUrl': "",
  //           'longUrl': longUrl ? `${longUrl}` : "",
  //           'shortUrl': ""
  //         })
  //           .then(res => {
  //             // console.log("新增成功");
  //             getData().then((result) => {

  //               let newArray = [];
  //               newArray = [...result.data];
  //               setItem(newArray);
  //             }).catch(err => {
  //               console.log(err);
  //             })
  //             alert('新增成功')
  //           })
  //           .catch(error => {
  //             // response攔截器會先執行，除非你漏接了，才會進到catch
  //             console.log("新增失敗");
  //           })

  //         //然後傳 _ID回來---------------------------------------------------------------

  //         setTimeout(() => {
  //           getUrl(longUrl).then((result) => {
  //             // console.log(result)
  //             setChangeUrl(result.data._id);
  //             let oldUrl = result.data._id

  //             //將獲取的ID 弄成短網址
  //             // 生成固定的、加密的短網址（例如，長度為 6 位）
  //             oldUrl && generateShortUrl(oldUrl, 6)
  //               .then(shortUrlTest => {
  //                 // console.log(shortUrlTest);
  //                 setShort(shortUrlTest);

  //                 //新增短網址到資料庫內---------------------
  //                 userPut(oldUrl,

  //                   {
  //                     'shortUrl': `${shortUrlTest}`
  //                   })

  //                 //一分鐘後刪除這筆資料
  //                 setTimeout(() => {
  //                   userDelete(oldUrl);
  //                   alert(`刪除一筆${oldUrl}`);
  //                   setShort('');
  //                   // console.log(`刪除一筆${oldUrl}`)
  //                 }, 30000)


  //               })
  //               .catch(error => {
  //                 console.error(error);
  //               });
  //           }).catch(err => {
  //             console.log(err);
  //           })
  //         }, 500);
  //       }
  //     }
  //     // } else {
  //     // console.log("URL is valid but not accessible.");
  //     // alert('你輸入的網址 好像不能連線唷')
  //     // }
  //     // })
  //     // .catch(error => {
  //     // console.log("Error occurred while checking URL validity.");
  //     // });

  //   } else {
  //     alert('請輸入正確的格式')
  //   }
  // }
  const shortUrl = async () => {
    const longUrl = user_input.current.value;

    // 檢查輸入的是否為URL
    if (!IsURL(longUrl)) {
      alert('請輸入正確的格式');
      return;
    }

    try {
      // 先判斷是否有相同的URL
      const result = await getData();
      const newArray = [...result.data];
      setItem(newArray);

      // 檢查是否存在相同的URL
      const hasUrl = newArray.some(item => item.longUrl === longUrl);

      if (hasUrl) {
        getDataCheck(user_input);
      } else {
        // 新增資料到資料庫
        const postData = {
          title: "",
          description: "",
          imageUrl: "",
          longUrl: longUrl,
          shortUrl: ""
        };
        const res = await apiUrlPost(postData);

        // 更新資料
        const updatedData = await getData();
        setItem(updatedData.data);
        alert('新增成功');

        // 取得短網址
        const result = await getUrl(longUrl);
        setChangeUrl(result.data._id);
        const oldUrl = result.data._id;

        // 生成固定的、加密的短網址（例如，長度為 6 位）
        const shortUrlTest = await generateShortUrl(oldUrl, 6);
        setShort(shortUrlTest);

        // 更新短網址到資料庫
        await userPut(oldUrl, { shortUrl: shortUrlTest });

        // 一分鐘後刪除這筆資料
        setTimeout(async () => {
          await userDelete(oldUrl);
          alert(`刪除一筆${oldUrl}`);
          setShort('');
        }, 30000);
      }
    } catch (error) {
      console.error(error);
      alert('操作失敗');
    }
  };

  // 確認Url 是否存在
  function getDataCheck(user_input) {

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

  // console.log(short)

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
            <Link to={`/${short}`}>{`${domainName}${short}`}</Link>
          </div>

        )}
      </div>
    </div>
  )
}

export default Home