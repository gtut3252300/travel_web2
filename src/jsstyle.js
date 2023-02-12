let content = document.querySelector('.content');
let categoly = document.querySelector(".input_search");
let thisData = [];




axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24top=100&%24format=JSON`, {
   headers: getAuthorizationHeader()
}).then(function (response) {
  thisData = response.data;

  ScenicSpotRanderData(thisData);
  // 初始取得資料渲染第一頁     

 });





//搜尋關鍵字
$(".btn_filter").on('click', function (e) {
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24top=100&%24format=JSON`,
    {
      headers: getAuthorizationHeader()
      }).then(function (response) {
        thisData = response.data; 
       
        filter(thisData, categoly); 
        
         
    });
});
let str = '';
  



//地點分類&時間篩選
$('.btn_search').on('click', function () {     
  const inputValueTime = $('#date').val(); //取直日期    
    let addressList = $('#inputGroup').val();  
    addressList = `/${addressList}`;    
    // https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/Taipei?%24format=JSON
    // https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/${addressList}${txtdetail}&format=JSON
  
//未輸入日期跳錯訊息  
  if (inputValueTime.trim() === "") {
    alert('請輸入日期');
  }
        axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/${addressList}?%24format=JSON`,{
            headers: getAuthorizationHeader()
        }).then(function (response) {             
          thisData = response.data; 
            
          
          thisData.forEach(function (item) {  
            const thisTime = +new Date(inputValueTime);
            const startTime = +new Date(item.StartTime);
            const endTime = +new Date(item.EndTime);  
          
            if (checkTime(thisTime, startTime, endTime)) {  
              ActivityRanderData(thisData);
             
            }            
          });
          addressList = "";//清除篩選項目
         
            
        });   
    });



const Classification = {
  a: '文化類',
  b: '生態類',
  c: '自然風景類',
  d: '遊憩類',
  e: '其他'
}

//分類篩選
$('a[data-categoly]').on('click', function () {  
  // console.log(Classification.a);
  // console.log($(this).data('categoly') == '文化類');

let categoly = $(this).data('categoly');  
  axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?&$filter=contains(Class1,'${categoly}')&$top=100&%24format=JSON`, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    thisData = response.data;
    
    if (categoly == Classification.a) {      
      categoly = Classification.a; 
      ScenicSpotRanderData(thisData);//景點相關api
      
      console.log(thisData);
    } else if (categoly == Classification.b) {
      categoly = Classification.b;     
      ScenicSpotRanderData(thisData);//景點相關api

    } else if(categoly == Classification.c){
      categoly = Classification.c;      
      ScenicSpotRanderData(thisData); //景點相關api
    
    }else if(categoly == Classification.d){
      categoly = Classification.d;      
      ScenicSpotRanderData(thisData);//景點相關api
    
    }else if(categoly == Classification.e){
      categoly = Classification.e;      
      ScenicSpotRanderData(thisData);//景點相關api
    
    }  
    categoly = '';
    
  });
});


//美食篩選
$('.btn_food').on('click', function () {
  axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24top=100&%24format=JSON`, {
      headers: getAuthorizationHeader()
  }).then(function (response) {
    thisData = response.data; 
    RestaurantRanderData(thisData);
 
  });
});

//住宿篩選
$('.btn_hotel').on('click', function () {
  axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24top=100&%24format=JSON`, {
      headers: getAuthorizationHeader()
  }).then(function (response) {
    thisData = response.data;    
    HotelRanderData(thisData);
   
  });
});



//卡面樣式
function nameAA(Picture, Class1, Name, Location, Description, ID) {
  str += `
    <div class="col-lg-4 col-md-4 col-6 grid-item grid-sizer" data-Class>
      <div class="in_block_card card mb-4 shadow-sm">
          <img class="card-img" src="${Picture}" alt="">
            <div class="card-body">
              <div class="card-landscape">
                <span>${Class1}</span></div>
                <h4 class="card-text">${Name}</h4>
                <p class="card-time">
                  <i class="fa-solid fa-calendar-days"></i>
                  </p>
                <p class="card-address">
                <i class="fa-solid fa-location-dot"></i>
                  ${Location}
                </p>
                 <div class="description"> ${Description}</div>
                <div class="d-flex justify-content-between align-items-center">
                    <a class="btn_view" href="page_ScenicSpot.html?id=${ID}">View</a>
                 </div>
              </div>
             </div>
        </div>
    `; 

}

//tdx api活動分類名稱
function ActivityRanderData(itemData) {
  str = '';
  itemData.forEach(itemstyle => { 
    let Picture = itemstyle.Picture.PictureUrl1;
    let Class1 = itemstyle.Class1;
    let Name = itemstyle.ActivityName;
    let Location = itemstyle.Location;
    let Description = itemstyle.Description;
    let ID = itemstyle.ActivityID;
    nameAA(Picture, Class1, Name, Location, Description, ID);
    
  });
  content.innerHTML = str;
  underDelet();//去除undefined的圖片跟文字  
}

//tdx api景點分類名稱
function ScenicSpotRanderData(itemData) {
  str = '';
  itemData.forEach(itemstyle => { 
    let Picture = itemstyle.Picture.PictureUrl1;
    let Class1 = itemstyle.Class1;
    let Name = itemstyle.ScenicSpotName;
    let Location = itemstyle.Address;
    let Description = itemstyle.Description;
    let ID = itemstyle.ScenicSpotID;
    nameAA(Picture, Class1, Name, Location, Description, ID);
    
  });
  content.innerHTML = str;
  underDelet();//去除undefined的圖片跟文字  
}

//tdx api餐飲分類名稱
function RestaurantRanderData(itemData) {
  str = '';
  itemData.forEach(itemstyle => { 
    let Picture = itemstyle.Picture.PictureUrl1;
    let Class1 = itemstyle.Class1;
    let Name = itemstyle.RestaurantName;
    let Location = itemstyle.Address;
    let Description = itemstyle.Description;
    let ID = itemstyle.RestaurantID;
    nameAA(Picture, Class1, Name, Location, Description, ID);
    
  });
  content.innerHTML = str;
  underDelet();//去除undefined的圖片跟文字  
}


//tdx api住宿分類名稱
function HotelRanderData(itemData) {
  str = '';
  itemData.forEach(itemstyle => { 
    let Picture = itemstyle.Picture.PictureUrl1;
    let Class1 = itemstyle.Class1;
    let Name = itemstyle.HotelName;
    let Location = itemstyle.Address;
    let Description = itemstyle.Description;
    let ID = itemstyle.HotelID;
    nameAA(Picture, Class1, Name, Location, Description, ID);
    
  });
  content.innerHTML = str;
  underDelet();//去除undefined的圖片跟文字  
}

//去除undefined的圖片跟文字
function underDelet() {
  $('[data-Class]').each(function () {
    const findSelet = $(this).find('.card-img');
    const cardImg = findSelet.attr('src');  
    const Class1 = $(this).find('.card-landscape span');  
    const description = $(this).find('.description');
   
    if (cardImg.trim() === "undefined") {
      //如果圖片是undefined圖片刪除
      findSelet.siblings().addClass('no-cardimg');
      findSelet.remove();           
    }
    if (Class1.text().trim() === "undefined") {
      Class1.remove();
    } else if (description.text().trim() === "undefined") {
      description.remove();
    }

    msnryList();//瀑布流

  });
}
//過濾篩選
function filter(item, select) {
  
  let filterData = [];
        //篩選關鍵字
        filterData = item.filter(function (e) {  
          // let aaa = e.ActivityName.match(select.value); 
         
          return e.ActivityName.match(select.value);
        });

        //查詢不到交易資訊   

        if( filterData.length === 0){
          let str1 = `查詢不到交易資訊`;
          content.innerHTML = str1;
        } else {
          ActivityRanderData(filterData);
          
        }
}

//時間格式
function checkTime(thisTime, startTime, endTime) {
  if (thisTime > startTime && thisTime < endTime) { 
    return true;
  }
}

function msnryList() {
    var msnry = new Masonry( '.grid', {
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item'
});
}


const pages = document.querySelector('.pages');
// 點選按鈕切換頁面
pages.addEventListener('click', function(e){
  e.preventDefault;
  // console.log('click!',e.target.nodeName);
  if(e.target.nodeName != 'A'){
    return;
  }
  
  let clickPage = e.target.dataset.page;
  // console.log(clickPage);
  
  renderPage(clickPage);
})

// 整體分頁功能
function renderPage(nowPage){
  // 假設一頁 12 筆
  let dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~
  let totalPages = Math.ceil(thisData.length/dataPerPage); // 需要的頁數（無條件進位）
  
  let minData = dataPerPage*nowPage - dataPerPage + 1;  
  let maxData = dataPerPage*nowPage;
  // console.log('minData', minData, 'maxData', maxData);
  
  // 取出當前頁數的資料
  let currentData = [];
  thisData.forEach((item, index) => {
    if(index+1 >= minData && index+1 <= maxData){
      currentData.push(item);
    }
  })

  
  // 頁數資訊
  let pageInfo = {
    totalPages,                     // 總頁數
    nowPage,                        // 當前頁數
    isFirst: nowPage == 1,          // 是否為第一頁
    isLast: nowPage == totalPages,  // 是否為最後一頁
  }
  
  // 呈現出該頁資料
  RestaurantRanderData(currentData);
  ActivityRanderData(currentData);
  ScenicSpotRanderData(currentData);
  HotelRanderData(currentData);
  // 呈現分頁按鈕
  renderPageBtn(pageInfo);
}


// 渲染分頁按鈕
function renderPageBtn(pageInfo){
  let str = "";
  
  let totalPages = pageInfo.totalPages;
  
  // 是不是第一頁
  if(pageInfo.isFirst){
    str += `
      <li class="page-item disabled">
        <a class="page-link" href="#">
          &laquo;
        </a>
      </li>
    `;
  }else{
    str += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" data-page="${Number(pageInfo.nowPage) - 1}">
          &laquo;
        </a>
      </li>
    `;
  }
  
  // 第 2 ~
  for(let i=1; i<=totalPages; i++){
    if(Number(pageInfo.nowPage) == i){
      str += `
        <li class="page-item active" aria-current="page">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }else{
      str += `
        <li class="page-item" aria-current="page">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
  }
  
  // 是不是最後一頁
  if(pageInfo.isLast){
    str += `
      <li class="page-item disabled">
        <a class="page-link" href="#">
          &raquo;
        </a>
      </li>
    `;
  }else{
    str += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" data-page="${Number(pageInfo.nowPage) + 1}">
          &raquo;
        </a>
      </li>
    `;
  }
  
  pages.innerHTML = str;
}


function getAuthorizationHeader() {
    //  填入自己 ID、KEY 開始
    let AppID = 'b32523-bc1a72b3-d0f5-4a88';
    let AppKey = 'a7d83c84-3605-4fc8-98a2-c1351e9fd93e';
    //  填入自己 ID、KEY 結束
        let GMTString = new Date().toGMTString();
        let ShaObj = new jsSHA('SHA-1', 'TEXT');
        ShaObj.setHMACKey(AppKey, 'TEXT');
        ShaObj.update('x-date: ' + GMTString);
        let HMAC = ShaObj.getHMAC('B64');
        let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
        return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}