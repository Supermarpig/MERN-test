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

    console.log("測試是否有取道資料:")
  }, []);
  
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