import Notiflix from 'notiflix';
import PicApiService from './js/PicApiService';
import createPicsMarkup from './js/PicTemplates';
import './css/common.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const picApiService = new PicApiService();

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', infinitiScroll);

function onSearch(e) {
  e.preventDefault();
  picApiService.query = e.target.elements.searchQuery.value;

  if (picApiService.query === '') {
    Notiflix.Notify.failure('Please, enter something to start searching');
  }

  picApiService.resetPage();
  clearPicsContainer();
  fetchPics();
}

function fetchPics() {
  picApiService
    .fetchPictures()
    .then(({ data: { hits, totalHits } }) => {
      if (totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');
      } else if (picApiService.page >= Math.ceil(totalHits / 40)) {
        // console.log(picApiService.page === Math.ceil(totalHits / picApiService.per_page))
        Notiflix.Notify.failure("We're sorry, but you've reached the end of search results");
      } else {
        appendPicsMarkup(hits);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {searchForm.reset();});
}

function appendPicsMarkup(hits) {
  gallery.insertAdjacentHTML('beforeend', createPicsMarkup(hits));
}

function clearPicsContainer() {
  gallery.innerHTML = '';
}

function infinitiScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 250) {
    picApiService.incrementPage();
    fetchPics();
  }
}
