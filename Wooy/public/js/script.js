const navbarToggle = document.querySelector(".navbar-toggle");
const navbarToggle2 = document.querySelectorAll(".navbar-links a, .navbar-links button");

const navbarLinks = document.querySelector(".navbar-links");

navbarToggle.addEventListener("click", () => {
    navbarLinks.classList.toggle("navbar-links-active");
});

navbarToggle2.forEach(function (link) {
    link.addEventListener('click', function () {
        // Cambiar la clase del elemento navbar-links para cerrar el menú hamburguesa
        document.querySelector('.navbar-links').classList.remove('navbar-links-active');
    });
});

function scrollToElement(id) {
    var el = document.getElementById(id);
    var top = el.offsetTop;
    var height = el.offsetHeight;
    var offset = Math.floor(height / 2);
    var totalOffset = top - offset;

    window.scrollTo(0, totalOffset);
}




function scrollToId() {
    document.querySelector('#whatIs').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToId() {
    document.querySelector('#whatAre').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToId() {
    document.querySelector('#webB').scrollIntoView({
        behavior: 'smooth'
    });
}

function scrollToId() {
    document.querySelector('#partners').scrollIntoView({
        behavior: 'smooth'
    });
}


