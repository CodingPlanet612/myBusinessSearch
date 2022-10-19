var data;
var detailData;
var latitude;
var longitude;
var nameFlag = 0;
var rateFlag = 0;
var disFlag = 0;

document.getElementById("submit").addEventListener("click", myBusinessSearch);
document.getElementById("clear").addEventListener("click", myReset);
document.getElementById("autocheck").addEventListener("change", myCheck);

document.getElementById("BN").addEventListener("click", nameSort);
document.getElementById("BR").addEventListener("click", ratingSort);
document.getElementById("Dis").addEventListener("click", disSort);

function myBusinessSearch() {
    let validity = document.getElementById("myForm").reportValidity();
    if (!validity) {
        return;
    }
    console.log("Submit!");
    let auto_detect = document.getElementById("autocheck").checked;
    if (auto_detect) {
        ipinfo();
    } else {
        googlemapApi();
    }
}

function myCheck() {
    let auto_detect = document.getElementById("autocheck").checked;
    if (auto_detect) {
        disableLocationInput();
    } else {
        ableLocationInput();
    }
}

function myReset() {
    document.getElementById("keyword").value = '';
    document.getElementById("location").value = '';
    document.getElementById("distance").value = 10;
    document.getElementById("category").selectedIndex = 0;
    document.getElementById("autocheck").checked = false;
    ableLocationInput();
    document.getElementById("noData").style.display = "none";
    document.getElementById("showData").style.display = "none";
    document.getElementById("details").style.display = "none";
    console.log("Reset!");
}

function disableLocationInput() {
    let locationInput = document.getElementById("location");
    locationInput.value = '';
    console.log("Disabled!");
    locationInput.disabled = true;
}

function ableLocationInput() {
    let locationInput = document.getElementById("location");
    console.log("Abled!");
    locationInput.disabled = false;
}

function ipinfo() {
    let TOKEN = '4edbea65a7baee';
    let ENDPOINT = 'https://ipinfo.io/?token='+TOKEN;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT, true);
    xhr.send();
    xhr.onload = function() {
        let location = JSON.parse(this.responseText).loc;
        //console.log(location);
        let myloc = location.split(",");
        latitude = myloc[0];
        longitude = myloc[1];
        // console.log(latitude);
        // console.log(longitude);
        requestBackend();
    }
    xhr.onerror = function() {
        alert('Error ' + this.status);
    }
}

function googlemapApi() {
    let API_KEY = 'AIzaSyAybiTp5cjajqQ3fYnF3_DAhWK425VlnrI';
    let loc = document.getElementById("location").value;

    loc = loc.replaceAll(' ', '+');
    let ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json?address='+loc+'&key='+API_KEY;    
    // console.log(ENDPOINT);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT, true);
    xhr.send();
    xhr.onload = function() {
        let location = JSON.parse(this.responseText);
        // console.log(location)
        if (location.results.length == 0) {
            noData();
            return;
        }
        latitude = location.results[0].geometry.location.lat;
        longitude = location.results[0].geometry.location.lng;
        //console.log(latitude);
        //console.log(longitude);
        requestBackend();
    }
    xhr.onerror = function() {
        alert('Error ' + this.status);
    }
}

function requestBackend() {
    keyword = document.getElementById("keyword").value;
    distance = document.getElementById("distance").value;
    category = document.getElementById("category").value;

    // console.log(distance);

    if (distance>24) {
        distance = 24;
    } else if (distance <= 0 ) {
        console.log('<0');
        noData();
        return;
    } else if (distance == '') {
        distance = 10
    }

    let ENDPOINT  = 'https://mybusiness-search.wl.r.appspot.com//search?'
    // let ENDPOINT  = 'http://127.0.0.1:5000//search?'
    ENDPOINT += 'keyword=' + keyword 
                + '&category=' + category
                + '&distance=' + distance
                + '&latt=' + latitude
                + '&lngg=' + longitude;

    // console.log(ENDPOINT)
    let xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT, true);
    xhr.send();
    xhr.onload = function() {
        data = JSON.parse(this.responseText);
        console.log(data);
        // console.log(this.responseText);
        // console.log("got it")
        showList();
    }
    xhr.onerror = function() {
        alert('Error ' + this.status);
    }
}

function noData() {
    document.getElementById("noData").style.display = "block";
    document.getElementById("showData").style.display = "none";
    document.getElementById("details").style.display = "none";
}

function delateFormerRows() {
    table = document.getElementById("myTable");
    var rowCount = table.rows.length;
    for (var i = rowCount - 1; i > 0; i--) {
        table.deleteRow(i);
    }
}

function showList() {
    if (data.total == 0) {
        noData();
    } else {
        document.getElementById("showData").style.display = "block";
        document.getElementById("details").style.display = "none";
        document.getElementById("noData").style.display = "none";

        delateFormerRows();

        let i = 1;
        for (const d of data.businesses) {
            table = document.getElementById("myTable");
            row = table.insertRow(i);
            row.className="p2_tableRow";

            cell1 = row.insertCell(0);
            num = document.createElement("div");
            num.className = "p2_bno"
            num.innerHTML = i++;
            cell1.appendChild(num);
            
            cell2 = row.insertCell(1);
            businessImage = document.createElement("IMG");
            businessImage.className = "p2_bimgs";
            businessImage.setAttribute("src", d.image_url);
            cell2.appendChild(businessImage);

            cell3 = row.insertCell(2);
            businessName = document.createElement("div");
            businessName.className = "cursor";
            businessName.innerHTML = d.name;
            businessName.setAttribute('onclick', `requestDetailBackend(${i})`);
            //businessName.onclick = requestDetailBackend(d.id); // wrong 
            cell3.appendChild(businessName);

            cell4 = row.insertCell(3);
            businessRating = document.createElement("div");
            businessRating.innerHTML = d.rating;
            cell4.appendChild(businessRating);

            cell5 = row.insertCell(4);
            Distance = document.createElement("div");
            Distance.innerHTML = (d.distance * 0.00062137).toFixed(2);
            cell5.appendChild(Distance);
        }
        document.getElementById("showData").scrollIntoView();
    }
}

function nameSort() {
    if (nameFlag == 0) {
        data.businesses.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1);
        showList();
        nameFlag = 1;
        rateFlag = 0;
        disFlag = 0;
        console.log("nameSort1");
    } else {
        data.businesses.sort((a, b) => a.name.toUpperCase() > b.name.toUpperCase() ? -1 : 1);
        showList();
        nameFlag = 0;
        rateFlag = 0;
        disFlag = 0;
        console.log("nameSort2");
    }
}

function ratingSort() {
    if (rateFlag == 0) {
        data.businesses.sort((a, b) => a.rating - b.rating);
        showList();
        rateFlag = 1;
        nameFlag = 0;
        disFlag = 0;
        console.log("ratingSort1");
    } else {
        data.businesses.sort((a, b) => b.rating - a.rating);
        showList();
        rateFlag = 0;
        nameFlag = 0;
        disFlag = 0;
        console.log("ratingSort2");
    }
}

function disSort() {
    if (disFlag == 0) {
        data.businesses.sort((a, b) => a.distance - b.distance);
        showList();
        disFlag = 1;
        nameFlag = 0;
        rateFlag = 0;
        console.log("disSort1");
    } else {
        data.businesses.sort((a, b) => b.distance - a.distance);
        showList();
        disFlag = 0;
        nameFlag = 0;
        rateFlag = 0;
        console.log("disSort2");
    }
}

function getAllCategory(item) {
    return [item.title].join("|");
}

function statusCheck(item) {
    if (!("hours" in item) || !("is_open_now" in item.hours[0]) || (item.hours[0].is_open_now == null)) {
        return;
    } else if (item.hours[0].is_open_now) {
        return("Open Now");
    } else {
        return("Closed");
    }
}

function statusButton(item) {
    if (!("hours" in item) || !("is_open_now" in item.hours[0]) || (item.hours[0].is_open_now == null)) {
        return;
    } else if (item.hours[0].is_open_now) {
        return("p3_statusOpen");
    } else {
        return("p3_statusClose");
    }
}

function requestDetailBackend(index) {
    // console.log(index);
    // console.log(data);
    businessId = data.businesses[index-2].id;
    let ENDPOINT  = 'https://mybusiness-search.wl.r.appspot.com/details?'
    // let ENDPOINT  = 'http://127.0.0.1:5000/details?'
    ENDPOINT += 'businessId=' + businessId;

    // console.log(ENDPOINT)
    let xhr = new XMLHttpRequest();
    xhr.open('GET', ENDPOINT, true);
    xhr.send();
    xhr.onload = function() {
        detailData = JSON.parse(this.responseText);
        console.log(detailData);
        showMoreDetail(detailData);
    }
    xhr.onerror = function() {
        alert('Error ' + this.status);
    }

}

function checkItems(d) {
    if (!document.getElementById("status").innerHTML || !("hours" in d) || !("is_open_now" in d.hours[0]) || (d.hours[0].is_open_now == null)) {
        document.getElementById("p3_status").style.display = "none";
    } else {
        document.getElementById("p3_status").style.display = "block";
    }

    if (!document.getElementById("detailCategory").innerHTML || !("categories" in d) || (d.categories.length == 0)) {
        document.getElementById("p3_category").style.display = "none";
    } else {
        document.getElementById("p3_category").style.display = "block";
    }

    if (!document.getElementById("address").innerHTML || !("location" in d) || !("display_address" in d.location) || (d.location.display_address.length == 0)) {
        document.getElementById("p3_address").style.display = "none";
    } else {
        document.getElementById("p3_address").style.display = "block";
    }

    if (!document.getElementById("phone").innerHTML || !("display_phone" in d) || (d.display_phone.length == 0)) {
        document.getElementById("p3_phone").style.display = "none";
    } else {
        document.getElementById("p3_phone").style.display = "block";
    }

    if (!document.getElementById("trans").innerHTML || !("transactions" in d) || (d.transactions.length == 0)) {
        document.getElementById("p3_trans").style.display = "none";
    } else {
        document.getElementById("p3_trans").style.display = "block";
    }

    if (!document.getElementById("price").innerHTML || !("price" in d) || (d.price.length == 0)) {
        document.getElementById("p3_price").style.display = "none";
    } else {
        document.getElementById("p3_price").style.display = "block";
    }

    if (!document.getElementById("more").innerHTML || !("url" in d) || (d.url.length == 0)) {
        document.getElementById("p3_more").style.display = "none";
    } else {
        document.getElementById("p3_more").style.display = "block";
    }
}

function showMoreDetail(d) {

    delateDetails();

    document.getElementById("noData").style.display = "none";
    document.getElementById("details").style.display = "block";

    businessName = document.createElement("div");
    businessName.innerHTML = d.name;
    document.getElementById("businessName").appendChild(businessName);
    
    businessStatus = document.createElement("div");
    businessStatus.innerHTML = statusCheck(d);
    businessStatus.className = statusButton(d);
    document.getElementById("status").appendChild(businessStatus);

    businessCategory = document.createElement("div");
    businessCategory.className="p3_detail";
    kinds = Object.values(d.categories.map(getAllCategory))
    //console.log(kinds)
    businessCategory.innerHTML = kinds.join(" | ");
    //console.log(businessCategory.innerHTML)
    document.getElementById("detailCategory").appendChild(businessCategory);

    businessAddress = document.createElement("div");
    businessAddress.className = "p3_detail";
    //console.log(d.location.display_address)
    businessAddress.innerHTML = d.location.display_address.join(", ");
    document.getElementById("address").appendChild(businessAddress);

    phoneNumber = document.createElement("div");
    phoneNumber.className="p3_detail";
    phoneNumber.innerHTML = d.display_phone;
    //console.log(d.display_phone);
    document.getElementById("phone").appendChild(phoneNumber);

    trans = document.createElement("div");
    trans.className="p3_detail";
    tmp = d.transactions.map(element => element.charAt(0).toUpperCase() + element.slice(1).toLowerCase())
    trans.innerHTML = tmp.join(" | ");
    document.getElementById("trans").appendChild(trans);

    price=document.createElement("div");
    price.className="p3_detail";
    price.innerHTML = d.price;
    document.getElementById("price").appendChild(price);

    more=document.createElement("div");
    more.className="p3_detail";
    more.innerHTML=`<a href="${d.url}" target="_blank">Yelp</a>`;
    document.getElementById("more").appendChild(more);

    if (d.photos.length >= 1) {
        pic1=document.createElement("img");
        pic1.src=d.photos[0];
        pic1.className = "p3_pic";
        document.getElementById("p1").appendChild(pic1);
    }

    if (d.photos.length >= 2) {
        pic2=document.createElement("img");
        pic2.src=d.photos[1];
        pic2.className = "p3_pic";
        document.getElementById("p2").appendChild(pic2);
    }

    if (d.photos.length == 3) {
        pic3=document.createElement("img");
        pic3.src=d.photos[2];
        pic3.className = "p3_pic";
        document.getElementById("p3").appendChild(pic3);
    }

    checkItems(d);

    document.getElementById("details").scrollIntoView();

}

function delateDetails() {
    document.getElementById("businessName").innerHTML="";
    document.getElementById("status").innerHTML ="";
    document.getElementById("detailCategory").innerHTML ="";
    document.getElementById("address").innerHTML ="";
    document.getElementById("phone").innerHTML ="";
    document.getElementById("trans").innerHTML ="";
    document.getElementById("price").innerHTML ="";
    document.getElementById("more").innerHTML ="";
    document.getElementById("p1").innerHTML="";
    document.getElementById("p2").innerHTML="";
    document.getElementById("p3").innerHTML="";
}

