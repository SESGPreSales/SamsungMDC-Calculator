appVersion.innerText = version;

// checkbox.addEventListener("change", function(){
//     let isChecked = false;
//     isChecked = isChecked ? false : true;
//     console.log(isChecked)
//     })

function hover() {
    tr.forEach( e => e.addEventListener('mouseover', changeBg ));
    tr.forEach( e => e.addEventListener('mouseout', changeBg ));
    tr.forEach( e => e.addEventListener('click', changeBgFix ));
};

function changeBg(e) {
    const item = e.target;
    const itemParent = item.parentElement
    itemParent.classList.toggle('over')
}

function changeBgFix(e) {
    const item = e.target;
    tr.forEach( e => e.classList.remove('selected'));
    const itemParent = item.parentElement ;
    itemParent.classList.add('selected');
}
function removePopup () {
    popup.classList.add('hidden')
}
