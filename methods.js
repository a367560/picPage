var pic;
var mouse_x;
var mouse_y;
var power = 1;
var zooms;

function bigger(e){
    if(e.hasAttribute('style')){
        if (confirm("請問您是否已滿18歲？")) {
            e.removeAttribute('style');
            return;
        } else {
            return;
        }
    }
    locate = document.createElement("div");
    locate.setAttribute("class", "bigger");
    locate.setAttribute("z-index", "2");
    document.body.appendChild(locate);

    photo = document.createElement("img");
    photo.setAttribute("class", "bigger_img");
    photo.setAttribute("src", e.src);
    locate.appendChild(photo);

    x = document.createElement("a");
    x.innerHTML = "<i class='fa-solid fa-x' onclick='close_img(this)'></i>";
    x.setAttribute("class", "bigger_a");
    locate.appendChild(x);

    pic = photo;
    pic.addEventListener('wheel', zoom_in);
    pic.addEventListener('mousemove', mouse_position);
    zooms = 100;
}

function close_img(e){
    e.parentNode.parentNode.remove();
    pic.removeEventListener('wheel', zoom_in);
    pic.removeEventListener('mousemove', mouse_position);
    pic = '';
}

function zoom_in(){
    zooms += event.wheelDelta/3;
    if(zooms > 300 ) zooms = 300;
    else if (zooms < 100) zooms = 100;
    this.style.zoom = zooms + "%";
}

function mouse_position(){
    mouse_x = window.event.clientX;
    mouse_y = window.event.clientY;
}