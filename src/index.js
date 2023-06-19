import { fetchBreeds, fetchCatByBreed, fetchInfoById } from "./js/cat-api";
import SlimSelect from 'slim-select'
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const API_KEY = "live_I9MmbfLfWHUfPtPXLNkdj861OU2YvqZQ9CcuzKMdHBbjXCmyNhSrmVyqHD8872Rh";

//елементи ДОМ
const refs = {
    select: document.querySelector(".breed-select"), 
    catInfo: document.querySelector(".cat-info"), 
    loader: document.querySelector(".loader"),
}
const textErroeEl = refs.loader.nextElementSibling;


fetchBreeds(); // виклик функції, що додає в select елементи option

// if (fetchBreeds().promiseState === "pending") {
//       refs.loader.classList.remove("is-hidden");
// }

// запит на масив об'єктів всіх порід
// передирання та рендер розмітки до select
fetchBreeds().then(response => {

    const arrayOptions = response.map(element =>
        `<option value=${element.id}> ${element.name} </option>`).join(); //перший метод рендеру

    refs.select.innerHTML = arrayOptions;

    const customSelect = new SlimSelect({ select: '#single' });

    refs.loader.classList.add("is-hidden");
    refs.select.classList.remove("is-hidden");
    textErroeEl.classList.add("is-hidden");
    // response.forEach(element => { //другий метод рендеру
    // //    console.log(element)
    //    refs.select.insertAdjacentHTML("beforeend",
    //         `<option value=${element.id}> ${element.name} </option>`)
    // });

}).catch(err => console.warn(err));



//Відстежування події зміни select
// в константу breedId записуємо значення 

refs.select.addEventListener('change', function () {
    textErroeEl.classList.add("is-hidden"); //приховуємо сповіщеня, якщо раніше була помилка

    const breedId = this.value;
    refs.catInfo.innerHTML = ""; // якщо є вже розмітка видаляємо 

    refs.loader.classList.remove("is-hidden");// видаляємо селектор, щоб відзначити завантаження
  
    fetchCatByBreed(breedId).then(res => {

        res.forEach(element => {
            refs.catInfo.insertAdjacentHTML("beforeend", `<img class="photo-cat" src=${element.url}>`) //рендер фото

            fetchInfoById(element.id).then(resp => { // по ід знаходимо інформацію про кота + додаємо розмітку
                
                console.log(resp)//повертається масив з одним об'єктом
                
                refs.catInfo.insertAdjacentHTML("beforeend", `<h1>${resp.breeds[0].name}</h1> 
                <p>${resp.breeds[0].description}</p>
                <p><b>Temperament: </b>${resp.breeds[0].temperament}</p>`)
            }).catch(err => console.log(err));
            
        });
    }).catch(err => {
        console.warn(err);
        textErroeEl.classList.remove("is-hidden");
        Notiflix.Notify.failure("Oops! Something went wrong! Try reloading the page!")
     })
        .finally(() => {
            refs.loader.classList.add("is-hidden");
        });//в будь якому разі видаляємо позначення завантаження
})











