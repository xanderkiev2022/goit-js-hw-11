import Notiflix from 'notiflix';
import PicApiServiceClass from './js/PicApiService';
import createPicsMarkup from './js/PicTemplates';
import './css/common.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const picApiService = new PicApiServiceClass('', 1, 40);
let loading = false;

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', infinitiScroll);

function onSearch(e) {
  e.preventDefault();
  picApiService.query = e.target.elements.searchQuery.value;

  if (picApiService.query === '') {
    Notiflix.Notify.failure('Please, enter something to start searching');
  }

  // picApiService.resetPage();
  clearPicsContainer();
  fetchPics();
}

async function fetchPics() {
  loading = true;
  try {
    const pictures = await picApiService.fetchPictures();
    const {
      data: { hits, totalHits },
    } = pictures;

    appendPicsMarkup(hits);
    if (!totalHits) {
      // if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again'
      );
    }
    // else if (numberOfPics >= totalHits && totalHits != 0) {
    // else if (error.response.status === 400) {
    // else if (!totalHits && !document.documentElement.getBoundingClientRect().bottom <= document.documentElement.clientHeight) {
    // else if (document.documentElement.scrollHeight === window.pageYOffset + window.innerHeight) {
    // else if (picApiService.page >= Math.ceil(totalHits / picApiService.per_page) {
    else if (hits.length < picApiService.per_page) {
      window.removeEventListener('scroll', infinitiScroll);
      window.addEventListener('scroll', infinitiScrollEnd);
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    searchForm.reset();
    loading = false;
  }
}

function infinitiScrollEnd(e) {
  const { scrollTop, clientHeight } = document.documentElement;
  if (
    scrollTop + clientHeight + 100 >=
    document.documentElement.getBoundingClientRect().height
  ) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results"
    );
    window.removeEventListener('scroll', infinitiScrollEnd);
  }
}

function appendPicsMarkup(hits) {
  gallery.insertAdjacentHTML('beforeend', createPicsMarkup(hits));
}

function clearPicsContainer() {
  gallery.innerHTML = '';
}

function infinitiScroll() {
  if (!loading) {
    const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 250) {
      picApiService.incrementPage();
      fetchPics();
    }
  }
}

// _________________
// else {
//   Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
// }
