let table = document.getElementById('bagua-table');
let selectedTd;
const openModal = document.querySelector('.doModal')
const modal = document.querySelector('.modal')
const read = document.querySelector('.read')
const remove = document.querySelector('.remove')
const update = document.querySelector('.update')
let allData;
let id;
let ApiKey;
//-----------------------------------------------------------------------------
allData=GetAllModels();
//-----------------------------------------------------------------------------
table.onclick = function(event) {
    let target = event.target;
    while (target != this) {
        if (target.tagName == 'TD') {
            highlight(target);
            id=allData.find(obj => obj.name === target.textContent)._id
            return;
        }
        target = target.parentNode;
    }
}
//-----------------------------------------------------------------------------
read.onclick = function(event) {
    jsonData=sendRequest("GET",`http://127.0.0.1:5002/CRUD/models/${id}`)
            .then(data=>{
                jsonData=data
                tosee(jsonData);
            })
            .catch(err=>console.log(error));
}
//-----------------------------------------------------------------------------
update.onclick = function(event) {
    let rows = table.rows;
    for (let i = rows.length-1; i >= 0; i--) {
        table.deleteRow(i);
    }
    setTimeout(GetAllModels, 100);
}
//-----------------------------------------------------------------------------
remove.onclick = function(){
    sendRequestText("DELETE",`http://127.0.0.1:5002/CRUD/models/${id}/?apiKey=${ApiKey}`)
        .then(data=>{})
        .catch(err=>console.log(err))
    
    let rows = table.rows;
    for (let i = rows.length-1; i >= 0; i--) {
        table.deleteRow(i);
    }
    setTimeout(GetAllModels, 100);
}
//-----------------------------------------------------------------------------
document.getElementById('forma').addEventListener('submit', submitForm);
function submitForm(event) {
    // Отменяем стандартное поведение браузера с отправкой формы
    event.preventDefault();

    // event.target — это HTML-элемент form
    let formData = new FormData(event.target);

    // Собираем данные формы в объект
    let obj = {};
    formData.forEach((value, key) => obj[key] = value);
    console.log(event.target.action);
    let request = new Request(event.target.action, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    ApiKey= sendRequest("POST",request)
        .then(data=>{
            ApiKey=data._id
            console.log(data._id);
        })
        .catch(err=>console.log(error))
    console.log('Запрос отправляется');
}
//-----------------------------------------------------------------------------
function highlight(node) {
    if (selectedTd) {
        selectedTd.classList.remove('highlight');
    }
    selectedTd = node;
    selectedTd.classList.add('highlight');
    
}
//-----------------------------------------------------------------------------

function sendRequest(method, url, body=null){
    return fetch(url,{method:method}).then(response => {
        return response.json()
    });
}
//-----------------------------------------------------------------------------
function sendRequestText(method, url, body=null){
    return fetch(url,{method:method}).then(response => {
        return response.text()
    });
}
//-----------------------------------------------------------------------------
function GetAllModels(){
    sendRequest("GET","http://127.0.0.1:5002/CRUD/models/")
    .then(data=>{
        allData=data;
        if(data.length==0){
            tosee("models not found");
        }
        for (let i = 0; i < data.length; i++) {
            let tr = document.createElement('tr');
            
            for (let j = 0; j < 1; j++) {
                let td = document.createElement('td');
                
                tr.appendChild(td);
                
                
            }
            

            table.appendChild(tr);
        }
        tableFill(data);
    })
    .catch(err=>console.log(err))
}
//-----------------------------------------------------------------------------
function tableFill(data) {
    let td = table.querySelectorAll('td');
    console.log(td.length);
    for( let i = 0; i < td.length; i++ ) {
        td[i].textContent = data[i].name;
    }
}
//-----------------------------------------------------------------------------
function tosee(data){
    let formattedJson = JSON.stringify(data, null, 4);
    modal.textContent=formattedJson;
    modal.showModal()
    modal.addEventListener('click', (event) =>{
        if(event.target === modal) {
            modal.close()
        }
    })
}