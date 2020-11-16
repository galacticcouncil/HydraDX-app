import Vue, { VueConstructor } from "vue";
import { Store } from "vuex";

abstract class VueTypedClass extends Vue {
  public $store!: Store<State>;
}
const VueTyped = Vue as VueConstructor<VueTypedClass>;

export default VueTyped;
