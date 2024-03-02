// 請於等於後方填入您的Google Apps Scripts連結
var GAS = 'https://script.google.com/macros/s/AKfycbycksWpzNyKFxugBD4rk7s_BXVULxpCT0ISJXnxWLGe5Whi1eQazdl-ydY_RorLN7mF/exec';

function toggle_vis(e){
    if(e.innerHTML.includes('隱藏')){
        e.innerHTML = '<span class="invisible">顯示</span>';
        e.parentNode.parentNode.getElementsByTagName('div')[0].style.display = 'none';
    } else {
        e.innerHTML = '<span class="invisible">隱藏</span>';
        e.parentNode.parentNode.getElementsByTagName('div')[0].removeAttribute('style');
    }
}
function input_method(e){
    var parent = e.parentNode;
    var btn = parent.getElementsByClassName('upload_method_btn');
    var input_type = '';
    for(let i = 0; i < btn.length;i++){
        btn[i].removeAttribute('style');
        if(i == 0 && btn[i] === e) {
            input_type = 'url';
        }else if(btn[i] === e){
            input_type = 'file';
        }
    }
    e.setAttribute('style', 'background:bisque');

    var inpt = parent.parentNode.getElementsByTagName('input');
    if(inpt.length) {
        inpt[0].remove();
    }
    var new_inpt = document.createElement('input');
    new_inpt.setAttribute('type', input_type);
    if(input_type == 'url'){
        new_inpt.setAttribute('onchange', 'readurl(this)');
    }else if(input_type == 'file'){
        new_inpt.setAttribute('onchange', 'readfile(this)');
    }
    parent.parentNode.appendChild(new_inpt);
    parent.parentNode.getElementsByTagName('img')[0].removeAttribute('src');
}
function readfile(input){
    let reader = new FileReader();
    if(input.files[0]){
        reader.onload = function(e){
            input.parentNode.getElementsByTagName('img')[0].setAttribute('src', e.target.result);
        };
    }else{
        input.parentNode.getElementsByTagName('img')[0].removeAttribute('src');
    }
    try{
        reader.readAsDataURL(input.files[0]);
    } catch(err){
        console.log(err);
    }
}
function readurl(input){
    var url = input.value;
    let arr = url.split('/');
    if(url.includes('https://drive.google.com/file/d/') && arr.length >= 5){
        input.parentNode.getElementsByTagName('img')[0].setAttribute('src','https://drive.google.com/thumbnail?id=' + arr[5]);
    }else{
        input.parentNode.getElementsByTagName('img')[0].removeAttribute('src');
    }
}
function adding_section(){
    var ad = document.createElement('div');
    ad.setAttribute('class', 'adder_div');
    ad.innerHTML = `      
        <div>
            <p>圖片</p>
            <div class="upload_method_div">
                <button onclick="input_method(this)" class="upload_method_btn" style="background-color: bisque;">Google連結</button>
                <button onclick="input_method(this)" class="upload_method_btn">上傳本機檔案</button>
            </div>
            <input type="url" onchange="readurl(this)">
            <img>
        </div>
        <div>
            <p>名稱</p>
            <input class="txt" type="text" placeholder="請輸入您的圖片名稱">
        </div>
        <div class="r18">
            <input type="checkbox" id="R18" name="R18" />
            <label for="R18">R18</label>
        </div>
        <a class='cancel_add' onclick='cancel_adding(this)'><i class='fa-solid fa-x'></i></a>
    `

    document.getElementsByClassName('adder')[0].appendChild(ad);
}
function cancel_adding(e){
    e.parentNode.remove();
}
function first_section_send(input){
    let inpt = document.getElementsByClassName('link')[0].getElementsByTagName('input');

    let data_log = input.parentNode;
    let data_div = data_log.children;
    let data = {};
    for(let i = 0; i < data_div.length-1; i++){
        if(data_div[i].getElementsByTagName('input').length){
            if(data_div[i].getElementsByTagName('input')[0].getAttribute('type') == 'url' || data_div[i].getElementsByTagName('input')[0].getAttribute('type') == 'text'){
                if(i == 0) Object.assign(data, {'logo': 'https://drive.google.com/thumbnail?id=' + data_div[i].getElementsByTagName('input')[0].value.split('/')[5] + '&sz=s4096'});
                else if(i == 1) Object.assign(data, {'avatar': 'https://drive.google.com/thumbnail?id=' + data_div[i].getElementsByTagName('input')[0].value.split('/')[5] + '&sz=s4096'});
                else if(i == 2) Object.assign(data, {'name': data_div[i].getElementsByTagName('input')[0].value});
            }else if(data_div[i].getElementsByTagName('input')[0].getAttribute('type') == 'file'){
                if(i == 0){
                    Object.assign(data, {'logo': data_div[i].getElementsByTagName('img')[0].src});
                }else if(i == 1){
                    Object.assign(data, {'avatar': data_div[i].getElementsByTagName('img')[0].src});
                }
            }
        }
    }
    intro = document.getElementsByTagName('textarea')[0].value;
    Object.assign(data, {'intro': intro});
    let fetch_data = {'fet': 0, 'folder_id': inpt[0].value, 'sheet_url': inpt[1].value};
    Object.assign(fetch_data, {'data': data});

    if((data['logo'].includes('base64') || data['avatar'].includes('base64')) && (inpt[0].value == '' || inpt[0].value.includes('https://drive.google.com/drive/folders/') == false)){
        alert("Google雲端資料夾連結有誤");
        inpt[0].focus();
        return;
    }
    if (inpt[1].value == '' || inpt[1].value.includes('https://docs.google.com/spreadsheets/d/') == false){
        alert("Google表單連結有誤");
        inpt[1].focus();
        return;
    }

    fetch(GAS, {
        method: 'POST',
        body: JSON.stringify(fetch_data),
    }).then(response => {
        console.log("success:", response);
        alert("添加成功！");
    }).catch(err => {
        console.log("Error:" + err);
        alert("添加失敗，請確認資料是否完整，並稍待片刻再嘗試！");
    });
}

function second_section_send(){
    let sect_data = document.getElementsByClassName("adder_div");
    let inpt = document.getElementsByClassName('link')[0].getElementsByTagName('input');
    if (inpt[1].value == '' || inpt[1].value.includes('https://docs.google.com/spreadsheets/d/') == false){
        alert("Google表單連結有誤");
        inpt[1].focus();
        return;
    }
    var file = [];
    for(let i = 0; i < sect_data.length; i++){
        let img_url = sect_data[i].getElementsByTagName('img')[0].src;
        if(img_url == ""){
            alert("照片不可為空");
            return;
        }
        if(img_url.includes("base64") && (inpt[0].value == '' || inpt[0].value.includes('https://drive.google.com/drive/folders/') == false)){
            alert("Google雲端資料夾連結有誤");
            inpt[0].focus();
            return;
        }
        if(img_url.includes('https://drive.google.com/thumbnail?id=')) img_url += '&sz=s4096';
        let inpt_data = sect_data[i].getElementsByTagName('input');
        let tmp = {
            "photo": img_url,
            "title": inpt_data[1].value,
            "R18": (inpt_data[2].checked)?1:0
        }
        file.push(tmp);
    }
    let fetch_data = {'fet': 1, 'folder_id': inpt[0].value, 'sheet_url': inpt[1].value};
    Object.assign(fetch_data, {'data': file});

    fetch(GAS, {
        method: 'POST',
        body: JSON.stringify(fetch_data),
    }).then(response => {
        console.log("success:", response);
        alert("添加成功！");
    }).catch(err => {
        console.log("Error:" + err);
        alert("添加失敗，請確認資料是否完整，並稍待片刻再嘗試！");
    });
}