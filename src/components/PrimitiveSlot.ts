import {
  Comment,
  Fragment,
  cloneVNode,
  defineComponent,
  mergeProps,
  type VNode,
} from 'vue'

function renderSlotFragments(children?: VNode[]): VNode[] {
  if (!children) return []
  return children.flatMap((child) => {
    if (child.type === Fragment)
      return renderSlotFragments(child.children as VNode[])

    return [child]
  })
}

export const PrimitiveSlot = defineComponent({
  name: 'PrimitiveSlot',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      if (!slots.default) return null

      const children = renderSlotFragments(slots.default())

      // If there are no children, return null
      if (children.length === 0) {
        return null
      }

      const nonCommentChildIndex = children.findIndex(
        (child) => child.type !== Comment
      )

      // If there is no non-comment child, return the children as is
      if (nonCommentChildIndex === -1) {
        return children
      }

      const nonCommentChild = children[nonCommentChildIndex]

      const mergedProps = nonCommentChild.props
        ? mergeProps(attrs, nonCommentChild.props)
        : attrs

      const cloned = cloneVNode(nonCommentChild, mergedProps)

      // cloneVNode merges `class` and `onXXX` props with the child’s own, which
      // would duplicate them. Override them with the merged values instead of
      // deleting from the child’s props, which Vue may hoist and reuse across
      // renders.
      for (const prop in mergedProps) {
        if (prop === 'class' || prop.startsWith('on')) {
          cloned.props ||= {}
          cloned.props[prop] = mergedProps[prop]
        }
      }

      if (children.length === 1) {
        return cloned
      } else {
        children[nonCommentChildIndex] = cloned
        return children
      }
    }
  },
})
