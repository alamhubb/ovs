<script lang="ts">
import { h } from 'vue'

export const Testdoko = {
  renderHeader() {
    return h('div', 'header')
  },
  render() {
    console.log('zhixingle')
    return Testdoko.renderHeader()
    // return h('div', 'header')
  }
}
export default Testdoko
</script>
