<script lang="ts">
import { h } from 'vue'

export const testDokoVue = {
  renderHeader() {
    return h('div', 'header')
  },
  render() {
    console.log('zhixingle')
    // return this.renderHeader()
    return h('div', 'header')
  }
}
</script>
