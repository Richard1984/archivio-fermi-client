<template>
<main>
  <div class="module module--padded">
    <div class="row">
      <div class="col-1-of-1">
        <input type="text" class="textfield" placeholder="Titolo" autocomplete="off" v-model="document.name" @keyup.enter="upload">
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <textarea class="textarea" placeholder="Descrizione" v-model="document.description"></textarea>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-3">
        <select class="select" v-model="document.type" required>
            <option class="module-input-option" value=undefined disabled selected>Tipo</option>
            <option class="module-input-option" :value="type._id" v-for="(type, index) in types" :key="index" >
              {{ type.type }}
            </option>
          </select>
      </div>
      <div class="col-1-of-3">
        <select class="select" v-model="document.faculty">
            <option class="module-input-option" value=undefined disabled selected>Specializzazione</option>
            <option class="module-input-option" :value="faculty._id" v-for="(faculty, index) in faculties" :key="index" >
              {{ faculty.faculty }}
            </option>
          </select>
      </div>
      <div class="col-1-of-3">
        <select class="select" v-model="document.subject" required>
            <option class="module-input-option" value=undefined disabled selected>Materia</option>
            <optgroup :label="faculty.faculty" v-for="(faculty, index) in faculties" :key="index" >
              <option class="module-input-option" :value="subject._id" v-for="(subject, index) in faculty.subjects" :key="index" >
                {{ subject.subject }}
              </option>
            </optgroup>
          </select>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-3">
        <select class="select" v-model="document.grade">
            <option class="module-input-option" value="0" selected>Classe</option>
            <option class="module-input-option" :value="grade._id" v-for="(grade, index) in grades" :key="index" >
              {{ grade.grade }}
            </option>
          </select>
      </div>
      <div class="col-1-of-3">
        <select class="select" v-model="document.section">
            <option class="module-input-option" value=undefined selected>Sezione</option>
            <option class="module-input-option" v-for="(section, index) in sections" :key="index" :value="section._id">
              {{ section.section }}
            </option>
          </select>
      </div>
      <div class="col-1-of-3">
        <select class="select" v-model="document.visibility">
            <option class="module-input-option" value="pubblico" disabled selected>Visibilità</option>
            <option class="module-input-option" v-for="(visibility, index) in visibilities" :key="index" :value="visibility._id">{{visibility.visibility}}</option>
          </select>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <app-file-loader @file="fileDrop($event)" :file="file" dragMessage="Trascina un file per caricarlo" dropMessage="Rilascia il file per caricarlo"></app-file-loader>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <button class="button button--green" @click="upload">
          <span class="icon"><i class="fas fa-edit"></i></span>
          <span class="crop">Crea documento</span>
        </button>
      </div>
    </div>
  </div>
  <app-progress v-if="progress" :value="progress" :isStripped="true" :isAnimated="true"></app-progress>
</main>
</template>

<script>
import eventBus from '@/utils/eventBus'
import v1 from '@/utils/v1'
import { mapGetters } from 'vuex'

import Progress from '@/components/progress/progress'
import FileLoader from '@/components/fileLoader/fileLoader'

export default {
  data () {
    return {
      document: {
        name: '',
        type: undefined,
        faculty: undefined,
        subject: undefined,
        grade: '0',
        section: undefined,
        visibility: 'pubblico',
        description: ''
      },
      file: undefined,
      progress: 0
    }
  },
  computed: {
    ...mapGetters({
      types: 'getTypes',
      faculties: 'getFaculties',
      visibilities: 'getVisibilities',
      sections: 'getSections',
      grades: 'getGrades'
    })
  },
  methods: {
    fileDrop (file) {
      this.file = file
      if (!this.document.name) {
        this.document.name = this.file.name
      }
    },
    async upload () {
      const self = this
      const formData = new FormData()
      const config = {
        onUploadProgress (progressEvent) {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          if (progress === 100) {
            progress = 0
          }
          self.progress = progress
        }
      }

      Object.keys(this.document).forEach(key => {
        formData.append(key, this.document[key])
      })

      formData.append('file', this.file)

      try {
        const response = await v1.post('/documents/', formData, config)
        this.document.name = ''
        this.document.type = undefined
        this.document.faculty = undefined
        this.document.subject = undefined
        this.document.grade = '0'
        this.document.section = undefined
        this.document.visibility = 'pubblico'
        this.document.description = ''
        this.file = undefined

        this.$socket.emit('newDocument')

        eventBus.notification({
          title: 'Documento caricato con successo.',
          temporary: true
        })

        eventBus.push('Documento caricato con successo.', response.data.name)
      } catch (e) {
        eventBus.notification({
          title: e.response.data.messages[0],
          temporary: true
        })
      }
    }
  },
  components: {
    appProgress: Progress,
    appFileLoader: FileLoader
  }
}
</script>

<style scoped lang="scss">
</style>
