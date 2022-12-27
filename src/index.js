import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PicApiServiceClass from './js/PicApiService';
import createPicsMarkup from './js/PicTemplates';
import './css/common.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
let loading = false;

const picApiService = new PicApiServiceClass('', 1, 40);
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  animationSpeed: 250,
  overlay: true,
  close: true,
  showCounter: true,
  fadeSpeed: 250,
  loop: false,
});

searchForm.addEventListener('submit', onSearch);
window.addEventListener('scroll', infinitiScroll);

function onSearch(e) {
  e.preventDefault();
  picApiService.query = e.target.elements.searchQuery.value;

  picApiService.resetPage();
  clearPicsContainer();
  fetchPics();
}

async function fetchPics() {
  loading = true;

  try {
    const pictures = await picApiService.fetchPictures();
    const {data: { hits, totalHits },} = pictures;
    appendPicsMarkup(hits, totalHits);

    lightbox.refresh();
    // smoothScroll();
  } 
  catch (error) {console.log(error.message);} 
  finally {
    searchForm.reset();
    loading = false;
  }
}

function infinitiScrollEnd(e) {
  const { scrollTop, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight + 100 >=document.documentElement.getBoundingClientRect().height) {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results");
    window.removeEventListener('scroll', infinitiScrollEnd);}
}

function appendPicsMarkup(hits, totalHits) {
  if (picApiService.query === '') {
    Notiflix.Notify.warning('Please, type the searching parameters');}
  if (!totalHits) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');}
  if (picApiService.page===1 && totalHits>=1 && picApiService.query !== ''){
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);}
  if (hits.length < picApiService.per_page) {
    window.removeEventListener('scroll', infinitiScroll);
    window.addEventListener('scroll', infinitiScrollEnd);    }

  gallery.insertAdjacentHTML('beforeend', createPicsMarkup(hits));}

function clearPicsContainer() {
  gallery.innerHTML = '';}

function infinitiScroll() {
  if (!loading) {
    const documentRect = document.documentElement.getBoundingClientRect();
    if (documentRect.bottom < document.documentElement.clientHeight + 250) {
      picApiService.incrementPage();
      fetchPics();
    }
  }
}

function smoothScroll (){
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 3,
    behavior: "smooth",
  });
}