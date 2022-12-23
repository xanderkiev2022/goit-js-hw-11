import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PicApiService from './js/PicApiService';
// import picTpl from './templates/picTpl';

// import LoadMoreBtn from './js/components/load-more-btn';


  const searchForm = document.querySelector('.search-form');

// const loadMoreBtn = new LoadMoreBtn({
//   selector: '[data-action="load-more"]',
//   hidden: true,
// });

const picApiService = new PicApiService();

searchForm.addEventListener('input', onSearch);
// loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();

  console.log(e.target.value)
  picApiService.query = e.target.value;

  if (picApiService.query === '') {
    return alert('Введи что-то нормальное');
  }

  // loadMoreBtn.show();
  picApiService.resetPage();
  // clearPicContainer();
  fetchArticles();
}

function fetchArticles() {
  // loadMoreBtn.disable();
  picApiService.fetchPictures().then(hits => {
    appendPicMarkup(hits);
    // loadMoreBtn.enable();
  });
}

function appendPicMarkup(hits) {
  searchForm.insertAdjacentHTML('beforeend', picTpl(hits));
}

function picTpl(hits) {
  return hits.reduce(
    (acc, {webformatURL, likes, views, comments, downloads}) =>
      acc +
      `
      <div class="photo-card">
  <img src="${webformatURL}" alt="" loading="lazy" />
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


// function clearPicContainer() {
//   refs.articlesContainer.innerHTML = '';
// }