import { getcatelist } from "network/goods"
export const mixingetcatelist = {
    data() {
        return {
            //商品分类的数据列表
            catelist: [],


        }
    },
    methods: {
        //获取商品分类数据
        getcatelist() {
            getcatelist().then(resu => {
                const { data: res } = resu;
                if (res.meta.status != 200) {
                    return this.$message.error('获取数据列表失败！')
                }
                //  console.log(res);
                //把数据列表赋值给cateList
                // console.log(res);
                this.catelist = res.data;

            })
        },
    },
    created() {
        this.getcatelist()

    }
}