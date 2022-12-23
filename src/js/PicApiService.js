import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '32292890-abfc4b14e22aeb7e2001180a2';

export default class PicApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
    return axios
    .get(url)
    .then(res => res.data.hits)
    .catch(error => console.error(error));
    //   try {
    //     const {data : {hits}} = await axios.get(url);
    //     this.incrementPage();
    //     return hits;
    //   }
    //   catch {(error => console.error(error))};
    }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}