// ./app.js

const NYTBaseUrl = "https://api.nytimes.com/svc/topstories/v2/";
const ApiKey = "f463d910dfa24adb9f7e17a2d2ce0e08";

function buildUrl (url) {
  return NYTBaseUrl + url + ".json?api-key=" + ApiKey
}

Vue.component('news-list', {
  props: ['results'],
  template: `
  <section>
   	<div class="columns is-multiline" v-for="posts in processedPosts">
			<div class="column is-3" v-for="post in posts">
					<div class="card">
						<div class="card-image">
								<figure class="image">
									<img :src="post.image_url">
								</figure>
							</div>
						<header class="card-header">
							<p class="card-header-title">
								{{ post.title }}
							</p>
						</header>
						<div class="card-content">
							<div class="content">
								{{ post.abstract }}
							</div>
						</div>
					</div>
				</div>
			</div>
			</section>	
  `,
  computed: {
    processedPosts() {
      let posts = this.results;

      // Add image_url attribute
      posts.map(post => {
        let imgObj = post.multimedia.find(media => media.format === "superJumbo");
        post.image_url = imgObj ? imgObj.url : "http://placehold.it/300x200?text=N/A";
      });

      // Put Array into Chunks
      let i, j, chunkedArray = [], chunk = 4;
      for (i=0, j=0; i < posts.length; i += chunk, j++) {
        chunkedArray[j] = posts.slice(i,i+chunk);
      }
      return chunkedArray;
    }
  }
});

const SECTIONS = "home, arts, automobiles, books, business, fashion, food, health, insider, magazine, movies, national, nyregion, obituaries, opinion, politics, realestate, science, sports, sundayreview, technology, theater, tmagazine, travel, upshot, world"; // From NYTimes

const vm = new Vue({
  el: '#app',
  data: {
    results: [],
    sections: SECTIONS.split(', '), // create an array of the sections
    section: 'home', // set default section to 'home'
  },
  mounted () {
    this.getPosts(this.section);
  },
  methods: {
    getPosts(section) {
      let url = buildUrl(section);
      axios.get(url).then((response) => {
        this.results = response.data.results;
      }).catch( error => { console.log(error); });
    }
  }
});