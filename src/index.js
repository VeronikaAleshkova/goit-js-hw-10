import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {fetchCountries} from './fetchCountries';
import debounce from 'lodash.debounce';


const DEBOUNCE_DELAY = 500;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info')
}

refs.searchBox.addEventListener('input', debounce(onSearchBox, DEBOUNCE_DELAY));

function onSearchBox(evt) {
  evt.preventDefault();

  let searchValue = evt.target.value.trim().toLowerCase();
  // console.log(searchValue);

  if(searchValue.length === 0) {
    Notify.failure('Please enter a country')
    return;
  }; 

  fetchCountries(searchValue).then(countries => {
    clearMarkup();
    if(countries.length === 1) {
      renderCountryItem(countries)
    } else if(countries.length >= 2 && countries.length <= 10) {
      renderCountryList(countries)
    } else {
      Notify.info('Too many matches found. Please enter a more specific name.')
    } 
  }).catch(onFetchError);
 };

function renderCountryItem([{ name, capital, population, flags, languages}]) {
  const markupItem = `<li class="country-item">
  <img class="flag" src="${flags.svg}" alt="flag" height=20 width=30>
  <h2 class="country-header"> ${name.official} </h2></li>
  <p><b>Capital</b>: ${capital}</p>
  <p><b>Population</b>: ${population}</p>
  <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p></div>`;

  refs.countryInfo.innerHTML = markupItem;
};

function renderCountryList(countries) {
  console.log(countries);
  const markup = countries.map(({name, flags}) => `<li class="country-item">
  <img class="flag" src="${flags.svg}" alt="flag" height=20 width=30 border-color=gray>
  <p class="country-name"> ${name.common} </p></li>`)
  .join('');

  refs.countryList.innerHTML = markup;
};

function clearMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
};

function onFetchError(error) {
  Notify.failure('Oops, there is no country with that name')
}
