let table = document.getElementById('bagua-table');
let selectedTd;
const openModal = document.querySelector('.doModal')
const modal = document.querySelector('.modal')
const read = document.querySelector('.read')
const remove = document.querySelector('.remove')
const update = document.querySelector('.update')
const create = document.querySelector('.create')
let div = document.querySelector('.threejs');
let tjs = document.querySelector('.for3js');
tjs.hidden=true;

let mesh;
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
                
                jsonData=data;
                console.log(jsonData);
                
                document.getElementById('mname').value=jsonData.name;
                
                document.getElementById('modelname').value=jsonData.modelname;
                let color = "#" + ("000000" + jsonData.object.materials[0].color.toString(16)).slice(-6);
                document.getElementById('color').value=color;
                colorold=color;
                document.getElementById('material').value=jsonData.object.materials[0].type;
                materialold=jsonData.object.materials[0].type;
                document.getElementById('overview').value=jsonData.overview;
                document.getElementById('comment').value=jsonData.comment;
                
                if(jsonData.type=="cube"){
                    typeold="cube";
                    document.getElementById('cube').checked=true
                    document.getElementById('size').value=jsonData.object.geometries[0].width;
                    sizeold=jsonData.object.geometries[0].width;
                    let object = createbox(sizeold,materialold,colorold);
                    scene.add(object);
                    
                }
                else if(jsonData.type=="sphera"){
                    typeold="sphera";
                    document.getElementById('sphera').checked=true
                    document.getElementById('size').value=jsonData.object.geometries[0].radius;
                    sizeold=jsonData.object.geometries[0].radius;
                    scene.add(createSphere(sizeold,materialold,colorold));
                }
                
                
                
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
//-----------------------------------------------------------------------------
let sizeold;
let materialold;
let colorold;
let typeold="sphera";
document.getElementById('cube').addEventListener('change', (e) => {
    typeold=e.target.value;
    let object = createbox(sizeold,materialold,colorold);
    scene.add(object);
    console.log(e.target.value);
    
})
document.getElementById('sphera').addEventListener('change', (e) => {
    typeold=e.target.value;
    let object = createSphere(sizeold,materialold,colorold);
    scene.add(object);
    console.log(e.target.value);
    
})
const forsize = document.getElementById('size');
forsize.addEventListener('blur', (e) => {
    sizeold=e.target.value;
    if(typeold=="cube"){
        console.log(e.target.value);
        let object = createbox(e.target.value,materialold,colorold);
        scene.add(object);
    };
    if(typeold=="sphera"){
        console.log(e.target.value);
        let object = createSphere(e.target.value,materialold,colorold);
        scene.add(object);
    };
    
});
const formaterial = document.getElementById('material');
formaterial.addEventListener('blur', (e) => {
    materialold=e.target.value;
    if(typeold=="cube"){
        console.log(e.target.value);
        let object = createbox(sizeold,e.target.value,colorold);
        scene.add(object);
    };
    if(typeold=="sphere"){
        console.log(e.target.value);
        let object = createSphere(sizeold,e.target.value,colorold);
        scene.add(object);
    };
});
const forcolor = document.getElementById('color');
forcolor.addEventListener('blur', (e) => {
    colorold=e.target.value;
    if(typeold=="cube"){
        console.log(e.target.value);
        let object = createbox(sizeold,materialold,e.target.value);
        scene.add(object);
    };
    if(typeold=="sphere"){
        console.log(e.target.value);
        let object = createSphere(sizeold,materialold,e.target.value);
        scene.add(object);
    };
});




document.getElementById('for3js').addEventListener('submit', submitForm1);
function submitForm1(event) {
    // Отменяем стандартное поведение браузера с отправкой формы
    event.preventDefault();

    // event.target — это HTML-элемент form
    let formData = new FormData(event.target);

    // Собираем данные формы в объект
    let obj = {};
    formData.forEach((value, key) => obj[key] = value);
    
    if(obj.type=="cube"){
        obj.object=createbox(obj.size,obj.material,obj.color).toJSON();
        scene.add(createbox(obj.size,obj.material,obj.color));
    }
    if(obj.type=="sphera"){
        obj.object=createSphere(obj.size,obj.material,obj.color).toJSON();
        scene.add(createSphere(obj.size,obj.material,obj.color));
    }
    let objtoSend={name:obj.name, modelname:obj.modelname, type:obj.type, object:obj.object, overview:obj.overview, comment:obj.comment};
    console.log(objtoSend);
    id=allData.find(obj1 => obj1.name === objtoSend.name);
    if(id==undefined){
        
        let request = new Request(`http://127.0.0.1:5002/CRUD/models/?apiKey=${ApiKey}`, {
            method: 'POST',
            body: JSON.stringify(objtoSend),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        sendRequest("POST",request)
            .then(data=>{
                
                console.log(data);
            })
            .catch(err=>console.log(error))
        console.log('Запрос отправляется');
    }
    else{
        id=allData.find(obj1 => obj1.name === objtoSend.name)._id;
        let request = new Request(`http://127.0.0.1:5002/CRUD/models/${id}/?apiKey=${ApiKey}`, {
            method: 'PUT',
            body: JSON.stringify(objtoSend),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        sendRequest("PUT",request)
            .then(data=>{
                
                console.log(data);
            })
            .catch(err=>console.log(error))
        console.log('Запрос отправляется');
    }
    tjs.hidden=true;
}

create.onclick = function(event) {
    tjs.hidden=false;
}
const objloader = new THREE.ObjectLoader();
window.addEventListener('resize', onWindowResize);

function onWindowResize() {

    camera.aspect = div.clientWidth / div.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(div.clientWidth, div.clientHeight);

}

//-----------------------------------------------------------------------------------------------

const clock = new THREE.Clock();
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(70, div.clientWidth / div.clientHeight, 0.1, 100);
camera.position.set(0, 0.7, 3);
cameraTarget = new THREE.Vector3(0, 0.4, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, div });
renderer.setSize(div.clientWidth, div.clientHeight);

div.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

scene.background = new THREE.Color('black');
scene.fog = new THREE.Fog('black', 1, 5);
let hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);
function createscene(){




    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(25, 25, 10);
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2000; // default
    directionalLight.shadow.mapSize.height = 2000; // default
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = - 10;
    directionalLight.shadow.camera.left = - 10;
    directionalLight.shadow.camera.right = 10;
    scene.add(directionalLight);
    let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight1.position.set(-15, -30, 40);
    directionalLight1.castShadow = true;

    directionalLight1.shadow.mapSize.width = 2000; // default
    directionalLight1.shadow.mapSize.height = 2000; // default
    directionalLight1.shadow.camera.top = 10;
    directionalLight1.shadow.camera.bottom = - 10;
    directionalLight1.shadow.camera.left = - 10;
    directionalLight1.shadow.camera.right = 10;
    scene.add(directionalLight1);

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(4000, 4000),
        new THREE.MeshPhongMaterial({ color: 0x808080, dithering: true })
);
plane.rotation.x = - Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);
}
//-----------------------------------------------------------------------------------------------



camera.position.z = 2;
function createbox(size, material,boxcolor){
    scene.children.forEach(function(object){
        scene.remove(object);});
    createscene();
    const boxWidth = size;
    const boxHeight = size;
    const boxDepth = size;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    let material1;
    if(material == "MeshPhongMaterial"){
        material1 = new THREE.MeshPhongMaterial({ color: boxcolor });  // greenish blue
    }
    if(material=="MeshBasicMaterial"){
        material1 = new THREE.MeshBasicMaterial({ color: boxcolor });  // greenish blue
    }
    const cube = new THREE.Mesh(geometry, material1);
    cube.castShadow = true;
    
    cube.position.y = 0.5;
    cube.position.x = -0.5;
    
    return cube;
}
function createSphere(size, material,boxcolor)
{
    scene.children.forEach(function(object){
        scene.remove(object);
    });
    createscene();
    const geometry = new THREE.SphereGeometry(size, 32, 16);
    let material1;
    if(material == "MeshPhongMaterial"){
        material1 = new THREE.MeshPhongMaterial({ color: boxcolor });  // greenish blue
    }
    if(material=="MeshBasicMaterial"){
        material1 = new THREE.MeshBasicMaterial({ color: boxcolor });  // greenish blue
    }
    const sphere = new THREE.Mesh(geometry, material1);
    sphere.castShadow = true;
    
    sphere.position.y = 0.5;
    sphere.position.x = -0.5;
    
    return sphere;
}

function render(time) {
    time *= 0.001;  // конвертировать время в секунды

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);