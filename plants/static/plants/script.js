document.addEventListener("DOMContentLoaded", function() {

    // if loads plant_form page
    if (document.getElementById('id_last_watered')){
        // disable future date   
        const datepInput = document.getElementById('id_last_watered');
        max_today(datepInput);
    }

    // if loads all_plants page
    if (document.getElementById("yesBtn")){
        
        document.querySelectorAll(".plant").forEach(plantDiv => {
            const plant_id = plantDiv.dataset.plant;
            const deleteBtn = plantDiv.querySelector('.deleteBtn');
            const plant_name = deleteBtn.dataset.name;
            //  plant todos 
            const waterCheckbox = plantDiv.querySelector('.water_checkbox');
            const fCheckbox = plantDiv.querySelector('.f_checkbox');
            const rCheckbox = plantDiv.querySelector('.r_checkbox');

            if (waterCheckbox) {
                const toWater = plantDiv.querySelector('.towater');
                const waterInfo = plantDiv.querySelector('.waterinfo');
                waterCheckbox.onclick = () => {
                    if (waterCheckbox.checked == true) {
                        waterCheckbox.disabled = true;
                        // change css 
                        toWater.classList.toggle('completed');

                        // fetch - PUT 
                        const date = new Date();
                        today = convertDate(date);
                        console.log("today: ", today);
                        update_last_watered(plant_id, today, waterInfo);
                    }
                }
            }

            if (fCheckbox){
                fCheckbox.onclick = () => {
                    if (fCheckbox.checked == true) {
                        fCheckbox.disabled = true;
                        // change css 
                        plantDiv.querySelector('.to_f').classList.toggle('completed');
                        const fInfo = plantDiv.querySelector('.finfo');
                        // fetch - PUT 
                        const date = new Date();
                        today = convertDate(date);
                        console.log("today: ", today);
                        update_last_fertilized(plant_id, today, fInfo);
                    }
                }
            }

            if (rCheckbox) {
                rCheckbox.onclick = () => {
                    if (rCheckbox.checked == true) {
                        rCheckbox.disabled = true;
                        // change css 
                        plantDiv.querySelector('.to_r').classList.toggle('completed');
                        const rInfo = plantDiv.querySelector('.rinfo');
                        // fetch - PUT 
                        const date = new Date();
                        today = convertDate(date);
                        console.log("today: ", today);
                        update_last_repotted(plant_id, today, rInfo);
                    }
                }
            }



            // to delete plant   
            deleteBtn.addEventListener("click", () => {
                document.querySelector('.popup-container').style.display = 'flex';
                document.getElementById('plant_name').innerHTML = plant_name;
                // pass plant.id to yes(delete) Btn 
                document.getElementById("yesBtn").dataset.plant = plant_id;
            })


        });

        // confirm or quit deleting plant
        document.getElementById("noBtn").addEventListener('click', () => {
            console.log('click-no');
            document.querySelector('.popup-container').style.display = 'none';
        })

        document.getElementById("yesBtn").addEventListener('click', (e) => {
            console.log('click-yes');
            console.log(e.target);
            console.log(e.target.dataset.plant);
            deletePlant(e.target.dataset.plant);
            document.querySelector('.popup-container').style.display = 'none';
        })

    }
    ///////////////////// SINGLE PLANT PAGE /////////////////////////
    // single plant page && the plant has a scname 
    if (document.getElementById('scNameDiv')){
        const scName = document.getElementById('scNameDiv').dataset.scname;
        wiki_search(scName);
        // in case fetch error, click to fetch
        document.getElementById('refresh').addEventListener('click', (e)=>{
            e.preventDefault()
            wiki_search(scName);
        })
    }


    // single plant page - add scientific name Btn
    if (document.getElementById('addNameBtn')){ 
        const addNameBtn = document.getElementById('addNameBtn');
        const addNameInput = document.getElementById('addNameInput');
        // const wikiDiv = document.querySelector('.div-container2');
        
        addNameBtn.addEventListener('click', ()=> {
            addScientificName(addNameBtn.dataset.plant, addNameInput.value);
            // render div-container2 info
        });
    }

    // single plant page - edit water activity
    if (document.getElementById('editWBtn')) {
        const wateringDiv = document.getElementById('wateringDiv');
        const plant_id = wateringDiv.dataset.plant;
        document.getElementById('editWBtn').addEventListener('click', () => {
            console.log('click edit w');
            // render update f form
            document.getElementById("w_general").style.display = "none";
            document.getElementById('wFormDiv').style.display = "block";

            // quit editing
            document.getElementById('quitWBtn').addEventListener('click', ()=>{
                document.getElementById("w_general").style.display = "block";
                document.getElementById('wFormDiv').style.display = "none";
            });


            // set dateinput max value to today
            const w_Form_date = document.getElementById("w_Form_date");
            max_today(w_Form_date);
            document.getElementById('wFormDiv').addEventListener('submit', (e)=>{
                e.preventDefault()
                const w_date = w_Form_date.value;
                const w_period = document.getElementById('w_Form_period').value;
                update_watering(plant_id, w_date, w_period);
            })
                     
        })
    }







    // single plant page - add fertilize activity
    if (document.getElementById('addFBtn')){

        const fertilizingDiv = document.getElementById('fertilizingDiv');
        const plant_id = fertilizingDiv.dataset.plant;

        // click to show a f_form
        document.getElementById('addFBtn').addEventListener('click', ()=>{
            console.log('click');
            document.getElementById('fDiv').style.display = "none";
            document.getElementById('fFormDiv').style.display = "block";
            // quit adding
            document.getElementById('quitAddFBtn').addEventListener('click', () => {
                document.getElementById("fDiv").style.display = "block";
                document.getElementById('fFormDiv').style.display = "none";
            });
            create_fertilizing(plant_id);
        });

        // submit the f_form
        document.getElementById("f_form").onsubmit = event => {
            event.preventDefault()
            console.log("submit f");
            // test();
            submit_fertilizing(plant_id);
        }

    }



    // single plant page - edit fertilize activity
    if (document.getElementById('editFBtn')){
        const fertilizingDiv = document.getElementById('fertilizingDiv');
        const plant_id = fertilizingDiv.dataset.plant;
        document.getElementById('editFBtn').addEventListener('click', ()=>{
            console.log('click edit');
            // render update f form
            document.getElementById("f_general").style.display = "none";
            document.getElementById('fFormEditDiv').style.display="block";

            // quit editing
            document.getElementById('quitFBtn').addEventListener('click', () => {
                document.getElementById("f_general").style.display = "flex";
                document.getElementById('fFormEditDiv').style.display = "none";
            });


            update_fertilizing(plant_id);
        })
    }

    // single plant page - delete fertilize activity
    if (document.getElementById('deleteFBtn')) {
        const fertilizingDiv = document.getElementById('fertilizingDiv');
        const plant_id = fertilizingDiv.dataset.plant;
        document.getElementById('deleteFBtn').addEventListener('click', () => {
            console.log('click delete');
            document.querySelector('.popup-container').style.display = 'flex';
            document.getElementById('act_name').innerHTML = "Fertilizing";
            // pass plant.id and activity to yes(delete) Btn 
            document.getElementById("act_yesBtn").dataset.plant = plant_id;
            document.getElementById("act_yesBtn").dataset.activity = "fertilizing";
            // delete_activity(plant_id, activity="fertilizing");
        })

        
    }


    // single plant page - add repotting activity
    if (document.getElementById('addRBtn')) {
        // console.log("r");
        const repottingDiv = document.getElementById('repottingDiv');
        const plant_id = repottingDiv.dataset.plant;

        // click to show a r_form
        document.getElementById('addRBtn').addEventListener('click', () => {
            console.log('click addR');
            document.getElementById('rDiv').style.display = "none";
            document.getElementById('rFormDiv').style.display = "block";
            // quit adding
            document.getElementById('quitAddRBtn').addEventListener('click', () => {
                document.getElementById("rDiv").style.display = "block";
                document.getElementById('rFormDiv').style.display = "none";
            });
            create_repotting(plant_id);
        });

        // submit the r_form
        document.getElementById("r_form").onsubmit = event => {
            event.preventDefault()
            console.log("submit r");
            // test();
            submit_repotting(plant_id);
        }

    }


    // single plant page - edit repotting activity
    if (document.getElementById('editRBtn')) {
        const repottingDiv = document.getElementById('repottingDiv');
        const plant_id = repottingDiv.dataset.plant;
        document.getElementById('editRBtn').addEventListener('click', () => {
            console.log('click edit r');
            // render update r form
            document.getElementById("r_general").style.display = "none";
            document.getElementById('rFormEditDiv').style.display = "block";

            // quit editing
            document.getElementById('quitRBtn').addEventListener('click', () => {
                document.getElementById("r_general").style.display = "flex";
                document.getElementById('rFormEditDiv').style.display = "none";
            });
            update_repotting(plant_id);
        })
    }

    // single plant page - delete repotting activity
    if (document.getElementById('deleteRBtn')) {
        const repottingDiv = document.getElementById('repottingDiv');
        const plant_id = repottingDiv.dataset.plant;
        document.getElementById('deleteRBtn').addEventListener('click', () => {
            console.log('click delete r');
            document.querySelector('.popup-container').style.display = 'flex';
            document.getElementById('act_name').innerHTML = "Repotting";
            // pass plant.id and activity to yes(delete) Btn 
            document.getElementById("act_yesBtn").dataset.plant = plant_id;
            document.getElementById("act_yesBtn").dataset.activity = "repotting";
        })


    }



    // if it is single plant page
    if (document.getElementById("act_noBtn")){
        // confirm or quit deleting plant
        document.getElementById("act_noBtn").addEventListener('click', () => {
            console.log('click-no');
            document.querySelector('.popup-container').style.display = 'none';
        })

        document.getElementById("act_yesBtn").addEventListener('click', (e) => {
            console.log('click-yes');
            console.log(e.target);
            console.log(e.target.dataset.plant);
            console.log(e.target.dataset.activity);
            delete_activity(e.target.dataset.plant, e.target.dataset.activity);
            document.querySelector('.popup-container').style.display = 'none';
        })
    }


})


function update_last_watered(plant_id, date, waterInfo){
    fetch(`/plant/${plant_id}/update`, {
        method: "PUT",
        body: JSON.stringify({
            last_watered: date
        })
    })
    .then(response => response.json())
    .then(data => {
        // console.log("data", data);
        new_last_watered = data['last_watered'];
        const converted = convertDateBack(new_last_watered);
        console.log("new converted", converted);
        
        waterInfo.innerHTML = `Last watered on: ${converted}`;
    })
    .catch(error => {
        console.log("Error", error);
    })
}

function update_last_fertilized(plant_id, date, fInfo){
    fetch(`/plant/${plant_id}/fertilizing`, {
        method: "PUT",
        body: JSON.stringify({
            last_fertilized: date
        })
    })
    .then(response => response.json())
    .then(data => {
        // console.log("data", data);
        new_last_fertilized = data['last_fertilized'];
        const converted = convertDateBack(new_last_fertilized);
        fInfo.innerHTML = `Last fertilized on: ${converted}`;
    })
    .catch(error => {
        console.log("Error", error);
    })
}


function update_last_repotted(plant_id, date, rInfo) {
    fetch(`/plant/${plant_id}/repotting`, {
        method: "PUT",
        body: JSON.stringify({
            last_repotted: date
        })
    })
        .then(response => response.json())
        .then(data => {
            // console.log("data", data);
            new_last_repotted = data['last_repotted'];
            const converted = convertDateBack(new_last_repotted);
            rInfo.innerHTML = `Last repotted on: ${converted}`;
        })
        .catch(error => {
            console.log("Error", error);
        })
}

// to YYYY-mm-dd
function convertDate(date){
    const offset = date.getTimezoneOffset()
    myDate = new Date(date.getTime() - (offset * 60 * 1000))
    return myDate.toISOString().split('T')[0]
}

// from YYYY-mm-dd to Mon. day, YYYY
function convertDateBack(date){
    const newDate = new Date(date); 
    const converted = newDate.toLocaleDateString("en-US", { month: 'short' }) +
        '. ' + newDate.toLocaleDateString("en-US", { day: 'numeric' }) + ', ' +
        newDate.toLocaleDateString("en-US", { year: 'numeric' });
    return converted
}


function deletePlant(plant_id){
    fetch(`/plant/${plant_id}/delete`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log('removed');
        // refresh the page
        window.location.reload();
    })
    .catch(error => {
        console.log("Error", error);
    })
}


function addScientificName(plant_id, scname){
    fetch(`/plant/${plant_id}/update`, {
        method: "PUT",
        body: JSON.stringify({
            scientific_name: scname
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("data", data);
        new_scname = data['scientific_name'];
        console.log("new_scname", new_scname);
        // render wikiDiv
        wiki_search(new_scname);
        // also render the added scName in plant card
        document.getElementById('scNameAdded').style.display = 'block';
        document.getElementById('scNameAdded').innerHTML = new_scname;

    })
    .catch(error => {
        console.log("Error", error);
    })
}


// search wiki and render Container II 
function wiki_search(title){
    const mylink = `https://en.wikipedia.org/w/api.php?
            format=json&origin=*&action=query&prop=extracts&exintro&explaintext&redirects=1
            &titles=${title}`;

    fetch(mylink)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        var obj = data.query.pages;
        // console.log(obj);
        var ob = Object.keys(obj);
        // console.log(obj[ob]);
        const extract = obj[ob].extract;
        const title = obj[ob].title;
        // console.log(obj[ob].fullurl);
        document.querySelector('.div-container2').innerHTML=`
            <h1>${title}</h1>
            <div class="wikiSum">${extract}</div>
            <div><a target="_blank" class="wiki_link" href="https://en.wikipedia.org/w/index.php?title=${title}">Learn more on wiki</a>  <i class="fab fa-pagelines"></i></div>
        `;

    })
    .catch(error => {
        console.log("Error", error);
    })
}

// wiki_search("Schefflera arboricola");


function create_fertilizing(plant_id){
    fetch(`/plant/${plant_id}/create_fertilizing`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);
        document.querySelector('#f_form_render').innerHTML = data;
        // disable future date in dateinput
        const datepInput = document.getElementById("id_last_fertilized");
        max_today(datepInput);

    })   
}

function submit_fertilizing(plant_id){
    const fertilizer = document.getElementById('id_fertilizer').value;
    const period = document.getElementById('id_period').value;
    const last_fertilized = document.getElementById('id_last_fertilized').value;
    fetch(`/plant/${plant_id}/create_fertilizing`, {
        method: "POST",
        body: JSON.stringify({
            fertilizer: fertilizer,
            period: period,
            last_fertilized: last_fertilized
        }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        window.location.reload();
    })
    .catch(error => {
        console.log("Error", error);
    })
}


function update_fertilizing(plant_id){
    fetch(`/plant/${plant_id}/fertilizing`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // render f_form 
        document.querySelector('#f_form_edit_render').innerHTML = data;
        // disable future date in dateinput
        const datepInput = document.getElementById("id_last_fertilized");
        max_today(datepInput);

        // update the form
        document.getElementById('f_form_edit_btn').addEventListener('click', (e)=>{
            e.preventDefault()
 
            const fertilizer = document.getElementById('id_fertilizer').value;
            const period = document.getElementById('id_period').value;
            const last_fertilized = document.getElementById('id_last_fertilized').value;

            // PUT 
            fetch(`/plant/${plant_id}/fertilizing`, {
                method: "PUT",
                body: JSON.stringify({
                    fertilizer: fertilizer,
                    period: period,
                    last_fertilized: last_fertilized
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                window.location.reload();

            })
            .catch(error => {
                console.log("Error", error);
            })
        })
    })
    .catch(error => {
        console.log("Error", error);
    })
}


function update_watering(plant_id, w_date, w_period){
    console.log("updating watering - submiting the form");


    fetch(`/plant/${plant_id}/update`, {
        method: "PUT",
        body: JSON.stringify({
            last_watered: w_date,
            watering_period: w_period
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("data", data);
        window.location.reload();
        
    })
    .catch(error => {
        console.log("Error", error);
    })
}



// for both fertilizing and repotting
function delete_activity(plant_id, activity){

    fetch(`/plant/${plant_id}/${activity}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log('removed');
        // refresh the page
        window.location.reload();
    })
    .catch(error => {
        console.log("Error", error);
    })
} 





function create_repotting(plant_id) {
    fetch(`/plant/${plant_id}/create_repotting`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            document.querySelector('#r_form_render').innerHTML = data;
            // disable future date in dateinput
            const datepInput = document.getElementById("id_last_repotted");
            max_today(datepInput);
        })
}

function submit_repotting(plant_id) {
    console.log("will submit :)", plant_id);
    const period = document.getElementById('r_period').value;
    const last_repotted = document.getElementById('id_last_repotted').value;
    fetch(`/plant/${plant_id}/create_repotting`, {
        method: "POST",
        body: JSON.stringify({
            period: period,
            last_repotted: last_repotted
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(error => {
            console.log("Error", error);
        })
}



function update_repotting(plant_id) {
    fetch(`/plant/${plant_id}/repotting`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // render r_form 
            document.querySelector('#r_form_edit_render').innerHTML = data;
            // disable future date
            const datepInput = document.getElementById("id_last_repotted");
            max_today(datepInput);

            // update the form
            document.getElementById('r_form_edit_btn').addEventListener('click', (e) => {
                e.preventDefault()

                const period = document.getElementById('r_period').value;
                const last_repotted = document.getElementById('id_last_repotted').value;

                // PUT 
                fetch(`/plant/${plant_id}/repotting`, {
                    method: "PUT",
                    body: JSON.stringify({
                      
                        period: period,
                        last_repotted: last_repotted
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        window.location.reload();

                    })
                    .catch(error => {
                        console.log("Error", error);
                    })
            })
        })
        .catch(error => {
            console.log("Error", error);
        })
}

// disable future date
function max_today(my_dateinput){
    // set dateinput max value to today
    const today = new Date();
    c_today = convertDate(today);
    my_dateinput.setAttribute("max", c_today);
}