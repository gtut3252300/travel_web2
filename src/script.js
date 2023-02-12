

let sightseeing = document.querySelector('.row_sightseeing');  
// let fiterData = [];
let addressList = $('#inputGroup').val(); //選擇地點
let thisData = [];
let str = "";



function page (){
  const id = location.href.split('=')[1];
  console.log(id);
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?$filter=contains(ActivityID, '${id}')&format=JSON`,
     {
        headers: getAuthorizationHeader()
    }).then(function(response){
       const thisData = response.data[0];
       console.log("12123", id);
    //    let str ="";
    const title = document.querySelector('title');
    const h1_page = document.querySelector('.h1_page');
    const img_page = document.querySelector('.img_page');
    const page_descriptionDetail = document.querySelector('.page_descriptionDetail');
    // title.textContent = thisData.ActivityName;
    // h1_page.textContent = thisData.ActivityName;
    img_page.setAttribute('src',thisData.Picture.PictureUrl1);
    page_descriptionDetail.textContent = thisData.DescriptionDetail;
    });
}
//全部搜尋
// $('.btn_fliter').on('click', function () {
// const searchInput = document.querySelector('.searchInput');
// let txt = searchInput.value;  
// let txtdetail = `$filter=contains(ActivityName,'${txt}')`; 
  
//   axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?${txtdetail}&format=JSON`, {
//   headers: getAuthorizationHeader()
//   }).then(function (response) {
//     thisData = response.data;     
//     randerToData(thisData);    
//     return;
//   });
// });

let content = document.querySelector('.row_sightseeing');
let categoly = document.querySelector(".searchInput");
$('.btn_fliter').on('click', function () {  
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24top=30&%24format=JSON`,
    {
      headers: getAuthorizationHeader()
      }).then(function (response) {
        thisData = response.data;
        // console.log(thisData);
        randerToData(thisData);
        let filterData = [];
        filterData = thisData.filter(function (e) {
          console.log(e);
          return e.ActivityName.match(categoly.value);
          
        });
        randerToData(filterData); 
        // if( filterData.length === 0){
        //   let str1 = `查詢不到交易資訊`;
        //   content.innerHTML = str1;
        // } else {
        //   randerToData(filterData); 
        // }
         
    });
});






function msnryList() {
    var msnry = new Masonry( '.grid', {
    columnWidth: '.grid-sizer',
    itemSelector: '.grid-item'
});
}

//https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=contains%28Class1%2C%27%E6%96%87%E5%8C%96%27%29&%24top=30&%24format=JSON


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
$(sightseeing).find("div").empty();
let categoly = $(this).data('categoly');
  
  axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?&$filter=contains(Class1,'${categoly}')&$top=30&%24format=JSON`, {
    headers: getAuthorizationHeader()
  }).then(function (response) {
    thisData = response.data;
  
    if (categoly == Classification.a) {      
      categoly = Classification.a; 
      randerToData(thisData);

   
    } else if (categoly == Classification.b) {
      categoly = Classification.b;     
      randerToData(thisData);

    } else if(categoly == Classification.c){
      categoly = Classification.c;      
      randerToData(thisData); 
    
    }else if(categoly == Classification.d){
      categoly = Classification.d;      
      randerToData(thisData); 
    
    }else if(categoly == Classification.e){
      categoly = Classification.e;      
      randerToData(thisData); 
    
    }
   
  
 

   
    console.log(thisData);
    // categoly = Classification.a;
    // console.log(categoly);
    
    // thisData.forEach(item => {
     
    //   if (item.Class1 === '文化類') {
    //   console.log(item.Class1 === '文化類');
    //   }
      
    // });
    
    
  });
});

//地點分類篩選
$('.btn_search').on('click', function () {     
    $(sightseeing).find("div").empty();
  const inputValueTime = $('#date').val(); //取直日期  
  
    let addressList = $('#inputGroup').val();  
    addressList = `/${addressList}`; 
    let thisData = [];
    // https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/Taipei?%24format=JSON
    // https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/${addressList}${txtdetail}&format=JSON
  
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
              rabderStyle(item);            
              sightseeing.innerHTML = str; 
              $('.card-img').each(function () {
              let a = $(this).attr('src');    
              if (a == "undefined") {        
                $(this).siblings().addClass('no-cardimg');
                $(this).remove();  
              }      
              });
              msnryList();
            }
            
            
          });
            if (thisData === undefined) { 
              str = "無資料";
            }
           
            
        });   
    });


//時間格式
function checkTime(thisTime, startTime, endTime) {
  if (thisTime > startTime && thisTime < endTime) { 
    return true;
  }
}




function rander(response, item) {
  const thisData = response.data;    
  const inputValue = $('#date').val();
    // let str = "";
    
    thisData.forEach(function (item) {
      const startTime = +new Date(item.StartTime);
      const endTime = +new Date(item.EndTime);
      const selectTime = +new Date(inputValue);
      
      // let obj = {
      //   name: item.ActivityName,
      //   picture: item.Picture.PictureUrl1,
      //   description: item.Description,
      //    id : item.ActivityID
      // }
      if (checkTime(selectTime, startTime, endTime)) {
        strItem(item, response)
        // str += `
        // <div class="col-md-4">
        //   <div class="card mb-4 shadow-sm">    
        //       <img src="${obj.picture}" alt="">
        //     <div class="card-body">
        //     <h4>${obj.name}</h4>
        //       <p class="card-text">${obj.description}</p>
        //       <div class="d-flex justify-content-between align-items-center">
        //         <div class="btn-group">
        //           <button type="button" class="btn btn-sm btn-outline-secondary">
        //           <a class="btn_view" href="page.html?id=${obj.id}">View</a>
        //           </button>
        //           <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
        //         </div>
        //         <small class="text-muted">9 mins</small>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        // `;
       
     
        return
      }
    });
     str += "無資料";
    sightseeing.innerHTML = str;
}


function strItem(item) {
  let obj = {
        name: item.ActivityName,
        picture: item.Picture.PictureUrl1,
        description: item.Description,
         id : item.ActivityID
  }

}
function rabderStyle(itemstyle) {
  $(sightseeing).find("div").empty();
  $('.card-img').each(function () {
      let a = $(this).attr('src');    
      if (a == "undefined") {        
        $(this).siblings().addClass('no-cardimg');
        $(this).remove();  
      }      
    });
  let dt = new Date(itemstyle.StartTime);//起始日期
  let dend = new Date(itemstyle.EndTime);//結束日期
      str += `
    <div class="col-lg-4 col-6 grid-item grid-sizer">
      <div class="in_block_card card mb-4 shadow-sm">
          <img class="card-img" src="${itemstyle.Picture.PictureUrl1}" alt="">
            <div class="card-body">
              <div class="card-landscape">
                <span>${itemstyle.Class1}</span></div>
                <h4 class="card-text">${itemstyle.ActivityName}</h4>
                <p class="card-time">
                  <i class="fa-solid fa-calendar-days"></i>
                   ${dt.getFullYear()} / ${dt.getMonth() + 1} / ${dt.getDate()} - 
                   ${dend.getFullYear()} / ${dend.getMonth() + 1} / ${dend.getDate()}
                  
                  </p>
                <p class="card-address">
                <i class="fa-solid fa-location-dot"></i>
                  ${itemstyle.Location}
                </p>
                 <div class="description">
                     ${itemstyle.Description}
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <a class="btn_view" href="page.html?id=${itemstyle.ActivityID}">View</a>
                 </div>
              </div>
             </div>
        </div>
    `;
   msnryList();
}

function randerToData(itemStyle) {
   
    itemStyle.forEach(function (item) {
      rabderStyle(item);
    });
 
    sightseeing.innerHTML = str;
   
}

function init(){
  // itemphoto();
  // page ();
  searchBlock();

}

document.addEventListener('load', function() {
  init();


})

  msnryList();


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