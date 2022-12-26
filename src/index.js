import Notiflix from 'notiflix';
import PicApiService from './js/PicApiService';
import createPicsMarkup from './js/PicTemplates';
import './css/common.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const picApiService = new PicApiService();
let loading = false;

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

async function fetchPics() {
  loading = true;
  try {
    const pictures = await picApiService.fetchPictures();
    const {data: { hits, totalHits }} = pictures;
      
      appendPicsMarkup(hits);
      if (!totalHits) {
      // if (totalHits === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again');} 
      else if (hits.length < picApiService.per_page && document.documentElement.getBoundingClientRect().bottom) {
     // else if (error.response.status === 400) {
      // document.documentElement.scrollHeight === window.pageYOffset + window.innerHeight
          // if (picApiService.page >= Math.ceil(totalHits / picApiService.per_page) {  
        Notiflix.Notify.failure ("We're sorry, but you've reached the end of search results");}  
      // else {
      //   Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      // }
  
      }
  catch (error) {console.log(error.message);}
  finally  {
    searchForm.reset();
    loading = false;
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
    console.log(document.documentElement.clientHeight); 
    if (documentRect.bottom < document.documentElement.clientHeight + 250) {
      picApiService.incrementPage();
      console.log('ntest');   
      fetchPics();
  }
}
}
