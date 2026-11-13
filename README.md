# 鹈鹕骑行 · 六千年（100% 纯代码音画全片）

> **在线体验（GitHub Pages）**：https://wwh5441.github.io/pelican-6000-pure-code/  
> **离线单文件包下载（1.93 MB ZIP）**：https://github.com/wwh5441/pelican-6000-pure-code/releases/latest

本工程为 **零二进制文件（无 `.mp3` / `.wav` / `.lzpar` / `.png` / `.woff2`）** 的全代码音画融合播放器，直接融合：
- **视觉全片引擎**：`carbon_music_film` 二十幕 WebGL + Canvas 程序化艺术史长卷、`LiveForgeSvgStage` 4K 打铁片头、12 时代风琴开场、7×3 谢幕展墙与动态歌词；印章与羽轮纹章转为纯矢量 `Path2D` 代码（[vector_emblems.js](./src/openings/vector_emblems.js)）；字体直接沿用本地系统通用字族（`serif` / `sans-serif` / `monospace`），不内置任何字体文件。
- **极简零控件舞台**：移除全部底部进度条与按钮控件，仅保留居中 `4:3` 电影画幅；**点击屏幕 / 按 `Space`** 播放或暂停（支持双击/`F` 全屏、`M` 静音、`R` 重播、`←`/`→` 快退快进 5 秒）。
- **音频合成引擎**：`鹈鹕骑行_纯代码合成` 已审批紧凑版四轨 `AudioWorklet` 实时重建引擎（[data/audio](./data/audio) 5 个纯 JS 参数模块，无音频文件）。

## 双击直开单文件版（推荐）

直接双击或用 Chrome 打开 [鹈鹕骑行_纯代码全片_单文件版.html](./鹈鹕骑行_纯代码全片_单文件版.html)（`file://` 协议免服务端直接运行）；若修改模块化源码后需重新打包：

```bash
python3 ./tools/build_single_html.py
```

## 本地模块化启动

```bash
python3 ./server.py --port 8922 --open
```

或双击 [启动纯代码全片.command](./启动纯代码全片.command) 后在浏览器打开 `http://127.0.0.1:8922/`。
