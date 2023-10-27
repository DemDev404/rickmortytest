<template>
  <div>
    <input v-model="searchQuery" class="searchBar" placeholder="🔎 Search ..." />
    <div v-for="character in filteredCharacters" :key="character.id" class="character-card">
      <img :src="character.image" :alt="character.name" :class="{ 'animated-image': character.new }" />
      <div class="card-info">
        <h5 class="card-title">{{ character.name }}</h5>
        <h5 class="card-title">{{ character.origin.name }}</h5>
        <p class="card-text">Last location: {{ character.location.name }}</p>
        <p class="card-text">Episodes: {{ character.episode.length }}</p>
        <p class="card-text">Status: {{ character.status }}</p>
        <p class="card-text">Specie: {{ character.species }}</p>
      </div>
    </div>
    <div v-if="loading" class="loading-indicator">
      <span>Loading more characters...</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      characters: [],
      searchQuery: '',
      charactersPerPage: 10,
      currentPage: 1,
      loading: false,
    };
  },
  computed: {
    filteredCharacters() {
      return this.characters.filter(character => {
        const searchLower = this.searchQuery.toLowerCase()
        const nameLower = character.name.toLowerCase()
        const locationLower = character.location.name.toLowerCase()
        const episodeLower = character.episode.join(',').toLowerCase()

        return (
          nameLower.includes(searchLower) ||
          locationLower.includes(searchLower) ||
          episodeLower.includes(searchLower)
        );
      });
    },
  },
  methods: {
    async loadCharacters() {
      this.loading = true
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${this.currentPage}`)
        const newCharacters = response.data.results
        newCharacters.forEach(character => {
          character.new = true
        })
        this.characters.push(...newCharacters)
        this.currentPage++
        this.loading = false
      } catch (error) {
        console.error('Error loading characters:', error)
        this.loading = false
      }
    },
    handleScroll() {
  const scrollThreshold = 100
  const windowBottom = window.innerHeight + window.scrollY
  const documentHeight = document.documentElement.offsetHeight

  if (documentHeight - windowBottom < scrollThreshold && !this.loading) {
    this.loadCharacters()
  }
}
  },
  watch: {
    filteredCharacters() {
      const animatedImages = document.querySelectorAll('.animated-image');
      animatedImages.forEach(image => {
        if (image.classList.contains('new')) {
          image.classList.add('slide-up')
          image.classList.remove('new')
        }
      });
    },
  },
  created() {
    this.loadCharacters();
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },
};
</script>
<style scoped>
.character-card {
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 30px ;
  padding: 2rem;
  margin-top: 2rem;
  margin-bottom: 10px;
  background-color: #0080ff33;

  
}

.card-info {
  margin-left: 20px;
}

.animated-image {
  border-radius: 20px;
  opacity: 0;
  animation: slide-up 0.6s forwards;
}
.searchBar{
  min-width: 40vw;
  min-height: 2rem;
  padding: 1rem;
  outline: none;
  border-radius: 10px;
  border: none;
  font-size: 1.5rem;
}

@keyframes slide-up {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.loading-indicator {
  text-align: center;
  margin: 20px 0;
}
</style>
