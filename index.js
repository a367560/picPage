// 請於等於後方填入您的Google Apps Scripts連結
var GAS = 'https://script.google.com/macros/s/AKfycbycksWpzNyKFxugBD4rk7s_BXVULxpCT0ISJXnxWLGe5Whi1eQazdl-ydY_RorLN7mF/exec';

let datas = fetch(GAS, {
    redirect: "follow",
    method: "GET",
    headers: {
        "Content-Type": "text/plain;charset=utf-8",
    },
}).then((response) => {
    console.log(response);
    return response.json();
})
.then((json) => {
    console.log(json);
    document.getElementsByClassName('header_img')[0].setAttribute('src',json[0]['logo']);
    document.getElementsByClassName('intro_img_avatar')[0].setAttribute('src',json[0]['avatar']);
    document.getElementsByClassName('intro_div')[0].getElementsByTagName('div')[0].getElementsByTagName('h2')[0].innerHTML = json[0]['name'] + '的頁面';
    document.getElementsByClassName('intro_div')[0].getElementsByTagName('div')[0].getElementsByTagName('p')[0].innerHTML = json[0]['intro'];

    for(let i = 0; i < json[1].length;i++){
        pic_create = document.createElement('div');
        pic_create.setAttribute('class', 'work_div_div');
        document.getElementsByClassName('work_div')[0].appendChild(pic_create);

        pic_create.innerHTML = `
            <img class="work_img_pic" onclick="bigger(this)" src="${json[1][i]['photo']}">
            <p>${json[1][i]['title']}</p>
        `;
        if(json[1][i]['R18']){
            pic_create.getElementsByClassName('work_img_pic')[0].setAttribute('style', 'filter: blur(10px);')
        }
    }
    document.getElementsByClassName('hide')[0].removeAttribute('class');
})
.catch(err => {
    console.log('Error: ', err)
    document.getElementsByClassName('hide')[0].innerHTML = `
        <h1>ERROR</h1>
        <p>${err.message}</p>
    `;
    document.getElementsByClassName('hide')[0].removeAttribute('class');
});