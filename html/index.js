
// consts
const req = new XMLHttpRequest;

//selectors
const table = document.querySelector('.main_table');

//eventlisteners
table.addEventListener('click', selectItem )


function getData() {
    req.open('get','../data/mdc.commands.json')
    req.onload = () => {
        let res = JSON.parse(req.response);
        console.log(res)
    res.forEach(e => createTable(e))
    }
    req.send();
}

function createTable(e){ 

    const newTr = document.createElement('tr');
    
    const command = document.createElement('td');
    const newTd1 = document.createElement('td');
    const newTd2 = document.createElement('td');
    command.innerText= e.command;
    newTd1.innerText= e.name;
    newTd2.innerText= e.Description;

    newTr.classList.add('table_item')
    command.classList.add('hidden')


    // const useButton = document.createElement('button')
    // useButton.innerHTML= '<i class="fa-regular fa-hand-pointer"></i>';
    // useButton.classList.add('use-btn')

    newTr.appendChild(command);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd2);


    table.appendChild(newTr);
}

function selectItem(e) {
    
    // const tableItem = document.querySelector('.table_item');
    // const usebtn = document.querySelectorAll('.use-btn')
    // console.log(tableItem)

    const item = e.target.parentElement;

    console.log(item)
}

getData();