"use strict"

//<Массив с данными об фильмах
const movieData = getFromLocalStorage() || [
    {
        id: 0,
        poster: "https://st.kp.yandex.net/images/film_iphone/iphone360_1199596.jpg",
        name: "Гори, гори ясно",
        originalName: "Brightburn",
        year: "2019",
        country: "США",
        tagline: "«Imagine What He Could Become»",
        director: "Дэвид Яровески",
        screenwriter: "Брайан Ганн, Марк Ганн",
        producer: "Джеймс Ганн, Брайан Ганн, Марк Ганн",
        operator: "Майкл Даллаторре",
        additionalPositions: [{композитор: "Тим Уильямс"}],
        description: "Что, если потерпевший крушение на Земле инопланетный ребенок со сверхспособностями вместо того, чтобы стать героем для человечества, окажется чем-то гораздо более зловещим?",
        IMDb: "6.60 (6688)",
        actors: ["Элизабет Бэнкс", "Дэвид Денман", "Джексон А. Данн", "Абрахам Клинкскейлз", "Кристиан Финлейсон", "Дженнифер Холлэнд", "Эмми Хантер", "Мэтт Джонс", "Мередит Хагнер", "Бекки Уолстром"]
    },
    {
        id: 1,
        poster: "http://filmix.cc/uploads/posters/big/pokemon-detektiv-pikachu-2019_132023_0.jpg",
        name: "Детектив Пикачу",
        originalName: "Detective Pikachu",
        year: "2019",
        country: "Япония, США",
        tagline: "-",
        director: "Роб Леттерман",
        screenwriter: "Дэн Эрнандез,  Бенжи Самит,  Роб Леттерман",
        producer: " Мэри Пэрент,  Грег Бакстер,  Кейл Бойтер",
        operator: " Джон Мэтисон",
        additionalPositions: [],
        description: "Действие полнометражного фантастического фильма «Покемон. Детектив Пикачу» начинается в тот момент, когда частный детектив высокого уровня по имени Гарри Гудман внезапно исчезает.",
        IMDb: "6.80 (58733)",
        actors: ["Райан Рейнольдс", "Сьюки Уотерхаус", "Кэтрин Ньютон", "Билл Найи", "Каран Сони", "Роб Делани", "Джастис Смит", "Кэн Ватанабэ", "Рита Ора", "Крис Гир"]
    }
];
//Массив с данными об фильмах>

//<Модалка
document.querySelector('#add-new').addEventListener("click", () => addModal());

async function addModal() {
    const res = await fetch("./add-new.html");
    const data = await res.text();
    $(".container").append(data);

    $("#myModal").modal("show");
    $("#myModal").on("hidden.bs.modal", () => {
        $("#myModal").remove();
    });

    addFilds();
    saveModalData();
    saveToLocalStorage(movieData);
};
//Модалка>

//<Функция для шаблонизации
function printCard(data) {
    const template = _.template(data);
    const compile = template(movieData);
    document.querySelector("#content").innerHTML = compile;
};
function printMovie(data, obj) {
    const template = _.template(data);
    const compile = template(obj);
    document.querySelector("#content").innerHTML = compile;
};
//Функция для шаблонизации>

//<Все фильмы
function routing() {
    if(location.hash === "#list") {
        showMovieCards();
    };
    if(location.hash.length > 6){
        const id = location.hash.slice(6);
        showMoviePage(id);
    };
};

window.addEventListener("hashchange", routing);
routing();

async function showMovieCards() {
    const res = await fetch("./card.html");
    const data = await res.text();
    printCard(data);

    await document.querySelectorAll(".card").forEach(e => {
        e.addEventListener("click", async function ({target: elem}) {
            const thisId = this.querySelector(".more").hash.slice(6);
            if(elem.className === "more"){
                showMoviePage(thisId);
            };
            if(elem.closest(".btn-edit")){
                await editMovieCard(thisId);
            };
            if(elem.closest(".btn-delete")){
                let ask = confirm('Вы действительно хотите удалить этот фильм?');
                if(ask){
                    deleteMovieCard(thisId);
                    this.remove();
                };
            };
        });
    });
};

document.querySelector(".nav-link").addEventListener("click", () => {
    showMovieCards();
});
//Все фильмы>

//<Подробней
async function showMoviePage(thisId){
    const res = await fetch("./movie.html");
    const data = await res.text();
    const obj = movieData.find(x => x.id == thisId);
    printMovie(data, obj);

    let countIncrease = 0;
    let countDecrease = 0;
    await document.querySelector(".movie-details").addEventListener("click",({target: elem}) => {
        if(elem.closest(".countIncrease")) {
            elem.closest(".countIncrease").setAttribute("data-count", ++countIncrease);
            obj.like = countIncrease;
        };
        if(elem.closest(".countDecrease")) {
            elem.closest(".countDecrease").setAttribute("data-count", ++countDecrease);
            obj.dislike = countDecrease;
        };
    saveToLocalStorage(movieData);
    });
};
//Подробней>

//<Удаление карточки
async function deleteMovieCard(thisId){
    const obj = movieData.find(x => x.id == thisId);
    const index = movieData.indexOf(obj);
    movieData.splice(index, 1);
    saveToLocalStorage(movieData);
};
//Удаление карточки>

//<Поиск
document.querySelector("#search").addEventListener("submit", e => {
    e.preventDefault();
    showMoviesPage();
});

async function showMoviesPage() {
    let searchQuery = document.querySelector("input[name=query]");
    movieData.forEach(e => {
        if(!(e.name.toLowerCase().indexOf(searchQuery.value.toLowerCase()) + 1)){
            document.getElementById(`${e.id}`).classList.toggle("hide");
        };
    });
};
//Поиск>

//<Функция конструктор
function MOVIE(poster, name, originalName, year, country, tagline, director, actors, IMDb, description, additionalPositions, like, dislike) {
    this.id = Date.now(),
    this.poster = poster,
    this.name = name,
    this.originalName = originalName,
    this.year = year, 
    this.country = country, 
    this.tagline = tagline, 
    this.director = director,
    this.actors = actors,
    this.IMDb = IMDb, 
    this.description = description,
    this.additionalPositions = additionalPositions
};
//Функция конструктор>

//<Собираем данные с модалки
async function getModalData(){
    let name = document.querySelector("input[name=name]").value;
    let originalName = document.querySelector("input[name=originalName]").value;
    let year = document.querySelector("input[name=year]").value;
    let country = document.querySelector("input[name=country]").value;
    let tagline = document.querySelector("input[name=tagline]").value;
    let director = document.querySelector("input[name=director]").value;
    let actors = document.querySelector("textarea[name=actors]").value.split(",");
    let IMDb = document.querySelector("input[name=IMDb]").value;
    let description = document.querySelector("textarea[name=description]").value;
    let poster = document.querySelector("input[name=poster]");
    let transform = transformPoster64(poster.files[0]);
    let poster64 = await transform;
    let additionalPositions = [];

    if(document.querySelector("input[name=newPos]") && document.querySelector("input[name=newName]")) {
        document.querySelectorAll(".addNewFields").forEach(e => {
            let newPos = e.querySelector("input[name=newPos").value;
            let newName = e.querySelector("input[name=newName").value;
            let newMovieCard = {};
            newMovieCard[newPos] = newName;
            additionalPositions.push(newMovieCard);
        });
    };

    let newMovie = new MOVIE(poster64, name, originalName, year, country, tagline, director, actors, IMDb, description, additionalPositions);
    movieData.push(newMovie);
    $("#myModal").modal("hide");
    location.hash = "#list";
    saveToLocalStorage(movieData);
    showMovieCards();
};
//Собираем данные с модалки>

//<Преобразование в Base64
function transformPoster64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        if(file) {
            reader.readAsDataURL(file);
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = error => reject(error);
        };
    });
};
//Преобразование в Base64>

//<Создание дополнительных полей в модалке
async function addFilds() {
    await document.querySelector("#addField").addEventListener("click", ({target: e}) => {
        if (e.closest(".btn-add-field")) {
            let addField = document.createElement("div");
            addField.className = "form-group row addNewFields";
            addField.innerHTML = `<div class="col-sm-5">
                                        <input required type="text" class="form-control" placeholder="Должность" name="newPos">
                                    </div>
                                    <div class="col-sm-5">
                                        <input required type="text" class="form-control" placeholder="Имя" name="newName">
                                    </div>
                                    <div class="col-sm-2">
                                        <button class="btn btn-danger btn-sm btn-remove-field" type="button"><svg class="octicon octicon-x" viewBox="0 0 14 18" version="1.1" width="14" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg></button>
                                    </div>`;
            document.querySelector("#addField").appendChild(addField);
        };
        if (e.closest(".btn-remove-field")) {
            e.closest(".addNewFields").remove();
        };
    });
};
//Создание дополнительных полей в модалке>

//<Сохранение данных с модалки
async function saveModalData() {
    await document.querySelector("#modalData").addEventListener("submit", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        getModalData();
    });
};
//Сохранение данных с модалки>

//<Редактирование
async function editMovieCard(thisId) {
    const obj = movieData.find(x => x.id == thisId);
    const index = movieData.indexOf(obj);
    
    const res = await fetch("./add-new.html");
    const data = await res.text();
    $(".container").append(data);
    $("#myModal").modal("show");
    $("#myModal").on("hidden.bs.modal", () => {
        $("#myModal").remove();
    });
    addFilds();
    if(obj.additionalPositions.length){
        for(let i = 0; i <obj.additionalPositions.length; i++){
            let addField = document.createElement("div");
            addField.className = "form-group row addNewFields";
            addField.innerHTML = `<div class="col-sm-5">
                                    <input required type="text" class="form-control" placeholder="Должность" name="newPos">
                                </div>
                                <div class="col-sm-5">
                                    <input required type="text" class="form-control" placeholder="Имя" name="newName">
                                </div>
                                <div class="col-sm-2">
                                    <button class="btn btn-danger btn-sm btn-remove-field" type="button"><svg class="octicon octicon-x" viewBox="0 0 14 18" version="1.1" width="14" height="18" aria-hidden="true"><path fill-rule="evenodd" d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48L7.48 8z"></path></svg></button>
                                </div>`;
            document.querySelector("#addField").appendChild(addField);
        };
    };

    document.querySelector("input[name=name]").value = obj.name;
    document.querySelector("input[name=originalName]").value = obj.originalName;
    document.querySelector("input[name=year]").value = obj.year;
    document.querySelector("input[name=country]").value = obj.country;
    document.querySelector("input[name=tagline]").value = obj.tagline;
    document.querySelector("input[name=director]").value = obj.director;
    document.querySelector("textarea[name=actors]").value = obj.actors;
    document.querySelector("input[name=IMDb]").value = obj.IMDb;
    document.querySelector("textarea[name=description]").value = obj.description;

    if(document.querySelector("input[name=newPos]") && document.querySelector("input[name=newName]")) {
        let newPos = obj.additionalPositions;
        let keys = [];
        let value = [];
        newPos.forEach(pos => {
            keys.push(Object.keys(pos))
            value.push(Object.values(pos))
        });
        keys = keys.join().split(",");
        value = value.join().split(",");
        document.querySelectorAll('.addNewFields').forEach((field, i) => {
            field.querySelector("input[name=newPos]").value = keys[i];
            field.querySelector("input[name=newName]").value = value[i];
        });  
    };
    
    await document.querySelector("#modalData").addEventListener("submit", async e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        let name = document.querySelector("input[name=name]").value;
        let originalName = document.querySelector("input[name=originalName]").value;
        let year = document.querySelector("input[name=year]").value;
        let country = document.querySelector("input[name=country]").value;
        let tagline = document.querySelector("input[name=tagline]").value;
        let director = document.querySelector("input[name=director]").value;
        let actors = document.querySelector("textarea[name=actors]").value.split(",");
        let IMDb = document.querySelector("input[name=IMDb]").value;
        let description = document.querySelector("textarea[name=description]").value;
        let poster = document.querySelector("input[name=poster]");
        let transform = transformPoster64(poster.files[0]);
        let poster64 = await transform;
        let additionalPositions = [];

        if(document.querySelector("input[name=newPos]") && document.querySelector("input[name=newName]")) {
            document.querySelectorAll(".addNewFields").forEach(e => {
                let newPos = e.querySelector("input[name=newPos").value;
                let newName = e.querySelector("input[name=newName").value;
                let newMovieCard = {};
                newMovieCard[newPos] = newName;
                additionalPositions.push(newMovieCard);
            });
        };

        let newMovie = new MOVIE(poster64, name, originalName, year, country, tagline, director, actors, IMDb, description, additionalPositions);
        movieData[index] = newMovie;
        saveToLocalStorage(movieData);
        $("#myModal").modal("hide");
        showMovieCards();
        location.hash = "#list";
    });
};
//Редактирование>


//<LocalStorage
function getFromLocalStorage() {
    if(localStorage.movieData) {
        return JSON.parse(localStorage.movieData)
    };
};
function saveToLocalStorage(e) {
    localStorage.setItem("movieData", JSON.stringify(e));
};
//LocalStorage>