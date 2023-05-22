import { useState, useEffect, useRef } from 'react'
import './style/app.css'
import req from './api/api'

function App() {

  //HOOK
  const [item, setItem] = useState([]);
  const DeleteRef = useRef();
  const putUserID = useRef();
  const putStarsign = useRef();
  const putProperty = useRef();
  const putStartDate = useRef();
  const putEndDate = useRef();




  // //Get Data
  const getData = () => {
    return req("get", "/getData")
  }

  useEffect(() => {
    getData().then((result) => {
      setItem(result.data)
    }).catch(err => {
      console.log(err);
    })
  }, []);

  // console.log(item)


  //新增

  const apiUrlPost = (postData) => {
    return req("post", "/postData", postData)
  }

  // useEffect(() => {
  //   apiUrlPost(
  //     {
  //       "starsign": "321321321",
  //       "property": "嘿嘿嘿嘿",
  //       "startDate": "2023年6月22日",
  //       "endDate": "2023年8月22日------------------------------------",
  //     }
  //   )
  //     .then(res => {
  //       console.log("輸入成功");
  //     })
  //     .catch(error => {
  //       // response攔截器會先執行，除非你漏接了，才會進到catch
  //     })
  // }, [])


  //更新
  const userPut = (putID, putValue) => {
    return req("put", `/putData/${putID}`, putValue)
  }

  const putUrl = () => {
    console.log(putUserID)
    const putID = putUserID.current.value;
    const Starsign = putStarsign.current.value;
    const Property = putProperty.current.value;
    const StartDate = putStartDate.current.value;
    const EndDate = putEndDate.current.value;


    userPut(putID, {
      'starsign': `${Starsign}`,
      'property': `${Property}`,
      'startDate': `${StartDate}`,
      'endDate': `${EndDate}`
    })
      .then(res => { console.log("更新成功"); })
      .catch(error => {
        // response攔截器會先執行，除非你漏接了，才會進到catch
        console.log("更新失敗");
      })

  }


  //刪除   ------>目前是刪ID
  const userDelete = (deleteID) => {
    return req("delete", `/deleteData/${deleteID}`)
  }


  const deleteULR = () => {
    const DeleteValue = DeleteRef.current.value;
    // console.log(DeleteValue)


    userDelete(DeleteValue)
      .then(res => { console.log("刪除成功"); })
      .catch(error => {
        // response攔截器會先執行，除非你漏接了，才會進到catch
        console.log("刪除失敗");
      })
  }

  return (
    <div className='contain'>
      <div className='outside'>
        <input type="text" />
        <button onClick={apiUrlPost}>ADD</button>
      </div>
      <div className='outside'>
        <input type="text" ref={DeleteRef} />
        <button onClick={deleteULR}>DELETE</button>
      </div>
      <div className='outside'>
        <div>ID<input type="text" ref={putUserID} /></div>
        <div>starsign<input type="text" ref={putStarsign} /></div>
        <div>property<input type="text" ref={putProperty} /></div>
        <div>startDate<input type="text" ref={putStartDate} /></div>
        <div>endDate<input type="text" ref={putEndDate} /></div>
        <button onClick={putUrl} >Update</button>
      </div>
    </div>
  )
}

export default App
