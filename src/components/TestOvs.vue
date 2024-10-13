<script lang="ts">
import {h} from "vue";
import toVueComponent from "@/components/ToVueComponent";

class Testsyntax11 {
  static render() {
    return h('div', 123456)
  }
}

export default toVueComponent(Testsyntax11)


//问题是，对象不支持装饰器
// const ab {
//   av:string = '100'
//   av:string
// }
//
// 语法和类一样。
//
// 编译后什么样子呢。
</script>
