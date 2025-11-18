### Pili Player Demo

[七牛云直播 WEB 端播放 DEMO](https://live-player-demo.qiniu.com)

#### 安装依赖

```shell
yarn
```

#### 开发

```shell
npm i fec-builder -g
fec-builder -p 8080
open http://localhost:8080
```

#### 发布

将构建好的目标文件上传到 pili-player-demo Bucket 即可

- 方式一：[Jenkins 工作流](https://jenkins.qiniu.io/view/PILI/view/pipeline/job/pili-player-demo-pipeline/)

- 方式二：本地
```shell
fec-builder -e production build
```

### 参考资料

- builder 文档 https://github.com/Front-End-Engineering-Cloud/builder
