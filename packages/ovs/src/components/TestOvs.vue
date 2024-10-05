<script lang="ts">
import {h} from "vue";
import toVueComponent from "@/components/ToVueComponent";

class Testsyntax11 {
  static render() {
    return h('div', 123456)
  }
}

export default toVueComponent(Testsyntax11)
</script>
