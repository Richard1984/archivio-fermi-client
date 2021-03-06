<template>
<main class="main">
  <keep-alive>
    <app-notifications></app-notifications>
  </keep-alive>
  <div class="signup-box module module--padded" v-if="!signedUp">
    <!-- Nome, Cognome, Email, Password, Materie -->
    <div class="row">
      <div class="col-1-of-1">
        <a href="/home/">
          <img src="/logo/itisFermi.svg" class="logo" alt="ITIS Enrico Fermi">
        </a>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <input type="text" class="textfield" placeholder="Nome" autocomplete="off" v-model="user.firstname" @keyup.enter="signup">
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <input type="text" class="textfield" placeholder="Cognome" autocomplete="off" v-model="user.lastname" @keyup.enter="signup">
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <input type="email" class="textfield" placeholder="Email" autocomplete="off" v-model="user.email" @keyup.enter="signup">
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <input type="password" class="textfield" placeholder="Password" autocomplete="off" v-model="user.password" @keyup.enter="signup">
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <app-multiple-select :placeholder="'Autorizzazioni'" :selected.sync="user.accesses" :dbElements="['subject']" :url="'/subjects/search/partial/'" @update:selected="user.accesses = $event"></app-multiple-select>
      </div>
    </div>
    <div class="row" v-if="user.accesses.length !== 0">
      <div class="col-1-of-1">
        <app-multiple-select-results :selected.sync="user.accesses" :dbElements="['subject']" @update:selected="user.accesses = $event"></app-multiple-select-results>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <button class="button button--green" @click="signup">
          <span>Registrati</span>
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <p class="legal">Iscrivendoti, accetti le nostre
          <span class="terms" @click="openPopUp">
            Condizioni.
          </span>
        </p>
      </div>
    </div>
  </div>

  <div class="success-box module module--padded" v-else>
    <div class="row">
      <a href="/home/">
        <img src="/logo/itisFermi.svg" class="logo" alt="ITIS Enrico Fermi">
      </a>
    </div>
    <div class="row">
      <div class="col-1-of-1">
        <p class="success-box__title">Registrato con successo!</p>
        <p class="success-box__paragraph">L'amministratore dovrà confermare la tua iscrizione.</p>
      </div>
    </div>
  </div>
  <app-footer-light></app-footer-light>
  <transition name="fade" mode="out-in">
    <app-popup v-if="popup.component" :width="popup.width + '%'">
      <component v-if="popup.component" :is="popup.component" :entity="popup.entity">
      </component>
    </app-popup>
  </transition>
</main>
</template>

<script>
import eventBus from '@/utils/eventBus'
import v1 from '@/utils/v1'

import FooterLight from '@/components/footer/light.footer'
import MultipleSelect from '@/components/multipleSelect/multipleSelect'
import MultipleSelectResults from '@/components/multipleSelect/multipleSelectResults'
import Notifications from '@/components/notifications/notifications'
import PopUp from '@/components/popup/popup'
import LegalTerms from '@/components/legalTerms/legalTerms'

export default {
  data () {
    return {
      signedUp: false,
      user: {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        accesses: []
      },
      popup: {
        entity: undefined,
        component: undefined,
        width: 80
      }
    }
  },
  computed: {
    computedAccesses () {
      return {
        accesses: this.user.accesses.map(el => el._id)
      }
    }
  },
  created () {
    eventBus.$on('openPopUp', (entity, component, width) => {
      this.popup.entity = entity
      this.popup.component = component
      this.popup.width = width
    })

    eventBus.$on('closePopUp', () => {
      this.popup = {
        entity: undefined,
        component: undefined,
        width: undefined
      }
    })
  },
  methods: {
    async signup () {
      if (!this.user.firstname && !this.user.lastname && !this.user.email && !this.user.password && !this.user.accesses) {
        return false
      }

      try {
        await v1.post('/signup/', {
          ...this.user,
          ...this.computedAccesses
        })
        this.$socket.emit('newUser')
        this.signedUp = true

        // if (user) {
        //   this.$socket.emit('newUser')
        //   this.signedUp = true
        // }
      } catch (e) {
        eventBus.notification({
          title: e.response.data.messages[0],
          temporary: true
        })
      }
    },
    openPopUp () {
      eventBus.openPopUp(undefined, 'appLegalTerms', 80)
    }
  },
  components: {
    appMultipleSelect: MultipleSelect,
    appMultipleSelectResults: MultipleSelectResults,
    appFooterLight: FooterLight,
    appNotifications: Notifications,
    appPopup: PopUp,
    appLegalTerms: LegalTerms
  }
}
</script>

<style scoped lang="scss">
.main {
    position: relative;
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
    min-height: 100vh;

    .signup-box {
        position: absolute;
        @include absCenter;
        width: 20vw!important;

        @include respond(big-desktop) {
            width: 15vw!important;
        }

        @include respond(tab-lan) {
            width: 40vw!important;
        }

        @include respond(tab-por) {
            width: 60vw!important;
        }

        @include respond(phone) {
            width: 80vw!important;
        }

        .multiple-select-results {
            overflow-y: scroll;
            max-height: 25vh;
        }
    }

    .success-box {
        position: absolute;
        @include absCenter;
        width: 20vw!important;

        @include respond(tab-por) {
            width: 60vw!important;
        }

        @include respond(phone) {
            width: 80vw!important;
        }

        &__title {
            font-weight: bold;
        }

        &__paragraph {
            font-size: $font-default-3;
            margin: 1rem;
        }
    }

    .logo {
        width: 50%;

        @include respond(big-desktop) {
            width: 45%;
            margin-bottom: 1rem;
        }

        @include respond(tab-lan) {
            width: 40%;
        }

    }

    .legal {
      font-size: 1.2rem;

      .terms {
        font-weight: bold;
        color: var(--color-text-secondary);
        text-decoration: none;
        cursor: pointer;
      }

    }

}
</style>
