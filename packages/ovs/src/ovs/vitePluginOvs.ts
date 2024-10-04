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

            return `
<script lang="ts">
import {h} from "vue";
    ${result}
</script>
`
        }
    };
}
