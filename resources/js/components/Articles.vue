<template>
     <div>
          <h2>Articles</h2>
          <form @submit.prevent="addArticle" class="mb-3">
               <div class="form-group">
                    <input type="text" class="form-control" placeholder="Title" v-model="article.title">
               </div>
               <div class="form-group">
                    <textarea type="text" class="form-control mb-2" placeholder="Body" v-model="article.body"></textarea>
               </div>
               <button type="submit" class="btn btn-light btn-block">Save</button>
          </form>
          <nav aria-label="Page navigation example">
          <ul class="pagination">
               <li class="page-item" :class="[{disabled: !pagination.prev_page_url}]"><a class="page-link" href="#" @click="fetchArticles(pagination.prev_page_url)">Previous</a></li>
               <li class="page-item disabled"><a class="page-link text-dark" href="#">{{pagination.current_page}} of {{pagination.last_page}}</a></li>
               <li class="page-item" :class="[{disabled: !pagination.next_page_url}]"><a class="page-link" href="#" @click="fetchArticles(pagination.next_page_url)">Next</a></li>
          </ul>
</nav>
          <div class="card card-body mb-2" v-for="article in articles" :key="article.id">
               <h3>{{article.title}}</h3>
               <p>{{article.body}}</p>
               <hr>
               <button @click="editArticle(article)" class="btn btn-info mb-2">Edit</button>
               <button @click="deleteArticle(article.id)" class="btn btn-danger">Delete</button>
          </div>
     </div>
</template>

<script>
export default {
     data() {
          return {
               articles: [],
               article: {
                    id: '',
                    title: '',
                    body: ''
               },
               article_id: '',
               pagination: {},
               edit: false
          }
     },
     methods: {
          fetchArticles(page_url) {
               let vm = this
               page_url = page_url || 'api/articles'
               fetch(page_url)
                    .then(res => res.json())
                    .then(res => {
                         this.articles = res.data
                         vm.makePagination(res.meta, res.links)
                    })
                    .catch(err => console.log(err))
          },
          makePagination(meta, links) {
               let pagination = {
                    current_page: meta.current_page,
                    last_page: meta.last_page,
                    next_page_url: links.next,
                    prev_page_url: links.prev
               }

               this.pagination = pagination
          },
          deleteArticle(id) {
               if(confirm('Are You Sure?')){
                    fetch(`api/article/${id}`, {
                         method: 'delete'
                    })
                    .then(res => res.json())
                    .then(data => {
                         alert('Article has been removed')
                         this.fetchArticles()
                    })
                    .catch(err => console.log(err))
               }
          },
          addArticle() {
               if(this.edit === false) {
                    // Add
                    console.log(this.article)
                    fetch('api/article', {
                         method: 'post',
                         body: JSON.stringify(this.article),
                         headers: {
                              'content-type': 'application/json'
                         }
                    })
                    .then(res => res.json())
                    .then(data => {
                         this.article.title = ''
                         this.article.body = ''
                         alert('Article Added')
                         this.fetchArticles();
                    })
                    .catch(err => console.log(err))
               } else {
                    // Update
                    fetch('api/article', {
                         method: 'put',
                         body: JSON.stringify(this.article),
                         headers: {
                              'content-type': 'application/json'
                         }
                    })
                    .then(res => res.json())
                    .then(data => {
                    this.clearForm();
                    alert('Article Updated');
                    this.fetchArticles();
                    })
                    .catch(err => console.log(err));
               }
          },
          editArticle(article) {
               this.edit = true;
               this.article.id = article.id;
               this.article.article_id = article.id;
               this.article.title = article.title;
               this.article.body = article.body;
          },
          clearForm() {
               this.edit = false;
               this.article.id = null;
               this.article.article_id = null;
               this.article.title = '';
               this.article.body = '';
          }
     },
     created() {
          this.fetchArticles();
     }
}
</script>