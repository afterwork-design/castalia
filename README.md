# Castalia

最全的设计导航资源网站。

## 添加资源

目前网站上的资源都采用 json 文件数据进行配置。


### Pull Request 方式

**做任何修改前，请先 fork 一份代码到自己的账号下，然后对自己的仓库文件进行修改，修改后提交 pull request**。

打开 `src/server/resource.json` 文件，这个文件的内容结构如下：
```json
[
    {
        "name": "分类一名称",
        // 图片路径，图片都放在 public 文件夹下
        "icon": "/images/menu/icon.svg",
        "site": [
            {
                "name": "资源一名称",
                "description": "资源描述",
                // 资源url
                "url": "https://www.baidu.com",
                // 资源图片，图片放在 public 文件夹下
                "image": "/avatar.svg"
            }
            ...
        ]
    },
    ...
]
```

例如，添加 **Icon** 分类，**Icon** 分类下有 **IconFont** 和 **IconPark** 两个资源。在源文件 `src/server/resource.json` 的基础上，添加内容：

```json
[
    ...

    {
        "name": "Icon",
        "icon": "/images/menu/icon.svg",
        "site": [
            {
                "name": "IconFont",
                "description": "IconFont 的描述",
                "url": "https://www.iconfont.cn/",
                "image": "/iconfont.svg"
            },
            {
                "name": "IconPark",
                "description": "IconPark 的描述",
                "url": "https://iconpark.oceanengine.com/home",
                "image": "/iconpark.svg"
            }
        ]
    }
]
```

### 其他方式

提交 [issue](https://github.com/afterwork-design/castalia/issues)，详细说明需求，然后由负责人去处理 issue。
