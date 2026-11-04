// 页面之间的相对链接：首页在根目录，政策页在 /terms/ 等子目录，用相对路径才能部署到任意子路径下
export type PageDepth = 0 | 1

export function links(depth: PageDepth) {
  const root = depth === 0 ? './' : '../'
  return {
    home: root,
    section: (id: string) => (depth === 0 ? `#${id}` : `${root}#${id}`),
    terms: `${root}terms/`,
    privacy: `${root}privacy/`,
    refund: `${root}refund/`,
  }
}
