document.querySelector('#menu').addEventListener('click', function onClick() {
    document.querySelector('nav ul').classList.toggle('showmenu');
})

const loadToolPage = () => {
    return window.location.href = "./toolpage.html";
}