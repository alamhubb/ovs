<script lang="ts">
import {h} from "vue";

export default {
  render() {
    return h('div', [
      '123',
        h('button',{style: { color: 'red' }},'click me')
    ]);
  }
}
</script>
