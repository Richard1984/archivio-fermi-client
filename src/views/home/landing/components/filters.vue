<template>
  <ul class="filters">
      <li class="selected u-noselect" @click.stop="getRecentProjects($event, 'appunti')">
          <span class="icon"><i class="far fa-file-alt"></i></span>
          <span class="section"> Appunti</span>
      </li>
      <li class="u-noselect" @click.stop="getRecentProjects($event, 'videoLezione')">
          <span class="icon"><i class="fas fa-film"></i></span>
          <span class="section"> Video</span>
      </li>
      <li class="u-noselect" @click.stop="getRecentProjects($event, 'audioLezione')">
          <span class="icon"><i class="fas fa-headphones"></i></span>
          <span class="section"> Audio</span>
      </li>
      <li class="u-noselect" @click.stop="getRecentProjects($event, 'progettiStudenti')">
          <span class="icon"><i class="fas fa-archive"></i></span>
          <span class="section"> Progetti</span>
      </li>
  </ul>
</template>

<script>

import v1 from '@/utils/v1'

export default {
  name: 'filters',
  created () {
    this.getRecentProjects(null, 'appunti')
  },
  methods: {
    async getRecentProjects (event, type) {
      if (event) {
        document.getElementsByClassName('selected')[0].classList.remove('selected')
        event.target.closest('li').classList.add('selected')
      }

      try {
        const response = await v1.get('/documents/recent/1/9/' + type)
        this.$emit('filter', response.data)
      } catch (e) {
        this.$emit('filter', [])
      }
    }
  }
}
</script>

<style scoped lang="scss">
.filters {
    padding: 0;
    margin: 0 auto;
    display: inline-block;
    text-align: center;

    li {
        display: inline-block;
        padding: 0.7rem 1.2rem;
        border-radius: 1.5rem;
        margin: 0 0.7rem;
        transition: all 0.2s ease-in-out;
        color: var(--color-text-tertiary);
        font-size: $font-default-3;
        cursor: pointer;

        &:active {
            transform: scale(1.02);
        }

        .section {

          @include respond(phone) {
            display: none;
          }

        }

        &.selected, &:hover {
          background-color: var(--color-neutral-third);
        }

    }
}
</style>
