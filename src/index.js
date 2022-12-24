import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicApiService from './js/PicApiService';
import './css/common.css';

// import LoadMoreBtn from './js/components/load-more-btn';

  const searchForm = document.querySelector('.search-form');
  const gallery = document.querySelector('.gallery');

  searchForm.addEventListener('submit', onSearch);
  window.addEventListener('scroll', infinitiScroll);

  const picApiService = new PicApiService();

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });

// loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();

  picApiService.query = e.target.elements.searchQuery.value;

  if (picApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  // loadMoreBtn.show();
  picApiService.resetPage();
  clearPicsContainer();
  fetchPics();
}

function fetchPics() {
  // loadMoreBtn.disable();
  picApiService.fetchPictures().then(hits => {
    appendPicsMarkup(hits);
    // loadMoreBtn.enable();
  });
}

function appendPicsMarkup(hits) {
  gallery.insertAdjacentHTML('afterbegin', picTpl(hits));
}

function picTpl(hits) {
  return hits.reduce(
    (acc, {webformatURL, likes, views, comments, downloads}) =>
      acc +
      `
      <div class="photo-card">
      <div class="wrapper">
  <img src="${webformatURL}" alt="" loading="lazy" /></div>
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

function infinitiScroll (){
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight +150) {
    picApiService.incrementPage();
    fetchPics();
  }
}