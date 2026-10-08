export interface TreeNode {
  name: string
  /** Full path; folders have no trailing slash. */
  path: string
  children?: TreeNode[]
}

/** Builds a folders-first, alphabetical tree from flat file paths. */
export function buildFileTree(paths: string[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', children: [] }
  for (const path of paths) {
    const parts = path.split('/')
    let node = root
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1
      const childPath = parts.slice(0, index + 1).join('/')
      let child = node.children!.find((entry) => entry.name === part)
      if (!child) {
        child = isFile
          ? { name: part, path: childPath }
          : { name: part, path: childPath, children: [] }
        node.children!.push(child)
      }
      node = child
    })
  }
  const sort = (nodes: TreeNode[]): TreeNode[] =>
    nodes
      .sort((a, b) => Number(!!b.children) - Number(!!a.children) || a.name.localeCompare(b.name))
      .map((node) => (node.children ? { ...node, children: sort(node.children) } : node))
  return sort(root.children!)
}

/** Every ancestor folder of a path, e.g. "a/b/c.ts" → ["a", "a/b"]. */
export const ancestorsOf = (path: string) =>
  path
    .split('/')
    .slice(0, -1)
    .map((_, index, parts) => parts.slice(0, index + 1).join('/'))
