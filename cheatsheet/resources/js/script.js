let left = document.querySelector('body');
let content = document.querySelector('.titlecontent');
let protos = document.querySelectorAll('.proto');
let protos1 = document.querySelectorAll('.proto1');



left.addEventListener('mousemove', (event) => {
    let move = (event.clientX * 0.05);
    let move2 = (event.clientX * 0.003);
    let move3 = (event.clientY * 0.02);

    content.style.transform = `translateX(-${move2}%)`;

    protos.forEach((proto) => {
        proto.style.transform = `translateX(${move}%)`;
    })

    protos1.forEach((proto1) => {
        proto1.style.transform = `translateY(${move3}%)`;
    })
})



    