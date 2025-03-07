import {
  Comment,
  Fragment,
  cloneVNode,
  defineComponent,
  mergeProps,
  useId,
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
    // Generate a unique ID for this component instance
    const id = useId()

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

      // Use the child’s key if present, otherwise use our generated ID
      const childKey = nonCommentChild.key !== null ? nonCommentChild.key : id

      let mergedProps = nonCommentChild.props
        ? mergeProps(attrs, nonCommentChild.props)
        : attrs

      // Ensure the key is included in mergedProps
      mergedProps = { ...mergedProps, key: childKey }

      // Prevent class duplication
      if (attrs.class && nonCommentChild.props?.class) {
        delete nonCommentChild.props.class
      }

      const cloned = cloneVNode(nonCommentChild, mergedProps)

      // Explicitly override props starting with `on`
      // cloneVNode from Vue does not override `onXXX` props
      for (const prop in mergedProps) {
        if (prop.startsWith('on')) {
          cloned.props ||= {}
          cloned.props[prop] = mergedProps[prop]
        }
      }

      console.log(cloned.props)

      if (children.length === 1) {
        return cloned
      } else {
        children[nonCommentChildIndex] = cloned
        return children
      }
    }
  },
})
