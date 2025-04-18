import { type PropType, defineComponent, h } from 'vue'
import { PrimitiveSlot } from './PrimitiveSlot'
import type { ElementOrComponent } from '../types'

export interface PrimitiveProps {
  asChild?: boolean
  as?: ElementOrComponent
}

export const Primitive = defineComponent({
  name: 'Primitive',
  inheritAttrs: false,
  props: {
    asChild: {
      type: Boolean,
      default: false,
    },
    as: {
      type: [String, Object] as PropType<ElementOrComponent>,
      default: 'div',
    },
  },
  setup(props, { attrs, slots }) {
    // For self closing tags, don’t provide default slots because of hydration issue
    const SELF_CLOSING_TAGS = ['area', 'img', 'input']
    const asTag = props.asChild ? 'template' : props.as

    return () => {
      switch (true) {
        // Self closing tags
        case typeof asTag === 'string' && SELF_CLOSING_TAGS.includes(asTag):
          return h(asTag, attrs)
        // as prop
        case asTag !== 'template':
          return h(props.as, attrs, { default: slots.default })
        default:
          return h(PrimitiveSlot, attrs, { default: slots.default })
      }
    }
  },
})
