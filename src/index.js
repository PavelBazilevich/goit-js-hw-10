import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
const DEBOUNCE_DELAY = 300;
// githab please bild my project
const refs = {
  inputEl: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  clearCountry();
  const trimSearch = e.target.value.trim();

  if (!trimSearch) {
    return;
  }
  fetchCountries(trimSearch)
    .then(countries => {
      if (countries.length === 1) {
        renderCountryInfo(countries[0]);
        return;
      }

      if (countries.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      renderCountryList(countries);
    })
    .catch(() => Notify.failure('Oops, there is no country with that name'));
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
        <div class="flag-country">
          <img src="${country.flags.svg}" width="75">
        </div>
        <p class="country-name">${country.name.official}</p>
      </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  const markup = `<div class="flag-country">
        <img src="${country.flags.svg}" width="240">
      </div>
      <p class="country-name">${country.name.official}</p>
      <p><b>Capital</b>: ${country.capital}</p>
      <p><b>Languages</b>: ${Object.values(country.languages).join(', ')}</p>
      <p><b>Population</b>: ${country.population} people</p>`;
  refs.countryInfo.innerHTML = markup;
}

function clearCountry() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
