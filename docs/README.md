# 文档目录

## 功能与设计

| 文档 | 内容 |
|---|---|
| [spec-functional.zh-cn.md](spec-functional.zh-cn.md) | 功能规格：通用能力定义 + 项目举例（F-*）|
| [design-ui.zh-cn.md](design-ui.zh-cn.md) | UI/交互设计：布局、组件结构、交互流程、主题 |

> 两份中文文档均以**通用模板能力**为主，用本案例（JuliaLang/julia）举例说明，
> 便于接入其他项目时理解与复用。文件以 `.zh-cn.md` 标注语言。

## 设计决策（ADR）

| 文档 | 内容 |
|---|---|
| [adr/0001-branch-listing-and-sorting.md](adr/0001-branch-listing-and-sorting.md) | 分支列表与排序的取舍 |

## 用途

- **重写/重构**：以 `spec-functional.zh-cn.md` 的功能清单（F-*）作为验收基准。
- **接入新项目**：替换 `spec-functional.zh-cn.md` 末节的"接入差异点"与 `design-ui.zh-cn.md` 的"UI 差异"。
- **UI 调整**：以 `design-ui.zh-cn.md` 为现状基线，改动需同步此文档。
- **后续演进**：涉及"取舍/备选方案/后果"的决策，按 `AGENTS.md` 规范新增 ADR。
