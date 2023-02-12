
  const id = location.href.split('=')[1];

    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$filter=contains(ScenicSpotID, '${id}')&format=JSON`,
     {
        headers: getAuthorizationHeader()
    }).then(function(response){
        const thisData = response.data[0];   
        let str = [];
        str[0] += thisData.Picture.PictureUrl1;
        if (thisData.Picture.PictureUrl2) {
            str[1] += thisData.Picture.PictureUrl2;
        } else if (thisData.Picture.PictureUrl3) {
            str[2] += thisData.Picture.PictureUrl3;
        };
   

  
        $('title').text(thisData.ScenicSpotName + '-台灣旅遊'); 
        $('.title').text(thisData.ScenicSpotName);
        // $('.banner_carousel').attr('src', thisData.Picture.PictureUrl1);
        $('.page_description').text(thisData.DescriptionDetail);
        $('.page_attraction .Phone').text(thisData.Phone);
        $('.page_attraction .Address').text(thisData.Address);
        $('.page_attraction .OpenTime').text(thisData.OpenTime);
        $('.page_attraction .TicketInfo').text(thisData.TicketInfo);
        $('.page_attraction .TravelInfo').text(thisData.TravelInfo);
        $('.swiper-banner').each(function () {
            str.forEach(item => {                
                const aaaa = item.split('undefined');         
                $('.swiper-wrapper').append(`
                <div class="swiper-slide">
                    <img src="${aaaa[1]}" alt="${item.ScenicSpotName}">
                </div>
                `)
            });

        });

        var swiper = new Swiper(".banner_Swiper", {
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
        
       
    });

function getNearByTour(lat,lon) {
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?&$spatialFilter=nearby(25.047675, 121.517055, 10000)&$format=JSON`, {
        headers: getAuthorizationHeader()
    }).then(function (response) {
        let lat = 22.633939743041992;
        let lon = 121.49990844726562;
        const thisData = response.data;
        console.log(thisData);
    });
}
//https://ithelp.ithome.com.tw/articles/10208169

function getLocation(){
  navigator.geolocation.getCurrentPosition(function (position) {
    getNearByTour(position.coords.latitude, position.coords.longitude);
  });
}

getLocation();

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