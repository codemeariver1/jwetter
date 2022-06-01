<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newJweetContent"
            class="new-jweet"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewJweet"
            :disable="!newJweetContent"
            class="q-mb-lg"
            rounded
            no-caps
            color="primary"
            label="Jweet"
          />
        </div>
      </div>

      <q-separator class="divider" size="10px" color="grey-2" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="jweet in jweets" :key="jweet.id" class="jweet q-py-md">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Steven Joseph</strong>
                <span class="text-grey-7">
                  @codemeariver <br class="lt-md" />&bull;
                  {{ relativeDate(jweet.date) }}</span
                >
              </q-item-label>
              <q-item-label class="jweet-content text-body1">
                {{ jweet.content }}
              </q-item-label>
              <div class="jweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                />
                <q-btn
                  @click="toggleLiked(jweet)"
                  :color="jweet.liked ? 'pink' : 'grey'"
                  :icon="jweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  flat
                  round
                  size="sm"
                />
                <q-btn
                  @click="deleteJweet(jweet)"
                  flat
                  round
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";
import db from "src/boot/firebase";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newJweetContent: "",
      jweets: [
        /*{
          id: "ID1",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus consequatur ducimus dolorem veniam consectetur deserunt velit, perferendis temporibus quaerat est, suscipit sequi iusto, ipsa consequuntur soluta ratione blanditiis tempore debitis!",
          date: 1652920878205,
          liked: false,
        },
        {
          id: "ID2",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus consequatur ducimus dolorem veniam consectetur deserunt velit, perferendis temporibus quaerat est, suscipit sequi iusto, ipsa consequuntur soluta ratione blanditiis tempore debitis!",
          date: 1652920895173,
          liked: true,
        },*/
      ],
    };
  },
  methods: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
    addNewJweet() {
      let newJweet = {
        content: this.newJweetContent,
        date: Date.now(),
        liked: false,
      };
      //this.jweets.unshift(newJweet);
      db.collection("jweets")
        .add(newJweet)
        .then(() => {
          console.log("Document successfully written!");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      this.newJweetContent = "";
    },
    deleteJweet(jweet) {
      db.collection("jweets")
        .doc(jweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
    toggleLiked(jweet) {
      db.collection("jweets")
        .doc(jweet.id)
        .update({
          liked: !jweet.liked,
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
  },
  mounted() {
    db.collection("jweets")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let jweetChange = change.doc.data();
          jweetChange.id = change.doc.id;
          if (change.type === "added") {
            console.log("New jweet: ", jweetChange);
            this.jweets.unshift(jweetChange);
          }
          if (change.type === "modified") {
            console.log("Modified jweet: ", jweetChange);
            let index = this.jweets.findIndex(
              (jweet) => jweet.id === jweetChange.id
            );
            Object.assign(this.jweets[index], jweetChange);
          }
          if (change.type === "removed") {
            console.log("Removed jweet: ", jweetChange);
            let index = this.jweets.findIndex(
              (jweet) => jweet.id === jweetChange.id
            );
            this.jweets.splice(index, 1);
          }
        });
      });
  },
});
</script>

<style lang="sass">
.new-jweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.jweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.jweet-content
  white-space: pre-line
.jweet-icons
  margin-left: -5px
</style>
