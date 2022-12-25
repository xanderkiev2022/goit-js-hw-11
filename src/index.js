import Notiflix from 'notiflix';
import PicApiService from './js/PicApiService';
import './css/common.css';

// import LoadMoreBtn from './js/components/load-more-btn';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', infinitiScroll);

const picApiService = new PicApiService();

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
  picApiService.fetchPictures().then(hits => {
    // if (hits === 0) {
    //   Notiflix.Notify.failure('agwgtwtaPlease, enter something to start searching');
    // }
    appendPicsMarkup(hits);
  });
}

function appendPicsMarkup(hits) {
  gallery.insertAdjacentHTML('beforeend', picTpl(hits));
}

function picTpl(hits) {
  return hits.reduce(
    (acc, { webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
      acc +
      `
      <div class="photo-card">
      <div class="wrapper">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${likes}
    </p>
    <p class="info-item">
      <b>Views: </b> ${views}
    </p>
    <p class="info-item">
      <b>Comments: </b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b> ${downloads}
    </p>
  </div>
</div>`,
    ''
  );
}

function clearPicsContainer() {
  gallery.innerHTML = '';
}

function infinitiScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 150) {
    // picApiService.incrementPage();
    fetchPics();
  }
}
