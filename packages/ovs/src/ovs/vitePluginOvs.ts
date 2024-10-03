// Vite 插件
import {createFilter} from "vite";
import {ovsTransformToTsCode} from "./parser/ovsTransformer";

export default function vitePluginOvs(): Plugin {
    const filter = createFilter(
        /\.ovs$/,
        null,
    )
    return {
        enforce: 'pre',
        transform(code, id) {
            if (!filter(id)) {
                return
            }
            let result = ovsTransformToTsCode(code);

            // 按行分割
            let lines = result.split('\n');

            const lastLengthIndex = lines.length - 2

            lines[lastLengthIndex] = 'return ' + lines[lastLengthIndex]

            result = lines.join('\n')

            return `
<script lang="ts">
import {h} from "vue";
    ${result}
</script>
`
        }
    };
}
