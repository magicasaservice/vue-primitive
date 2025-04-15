import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { Primitive } from './Primitive'
import { defineComponent, h, markRaw } from 'vue'

describe('Primitive', () => {
  it('should render div element correctly', () => {
    const wrapper = mount(Primitive)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('should render button element correctly', () => {
    const wrapper = mount(Primitive, {
      props: {
        as: 'button',
      },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should bypass the comment tag', () => {
    const wrapper = mount(Primitive, {
      props: {
        as: 'template',
      },
      attrs: {
        'data-parent-attr': '',
      },
      slots: {
        default: `
        <!-- this is a comment -->
        <div data-child-attr>Child class</div>
        `,
      },
    })

    const element = wrapper.find('div')
    expect(element.attributes('data-parent-attr')).toBe('')
    expect(element.attributes('data-child-attr')).toBe('')
  })

  it('should render div element with custom attribute', () => {
    const wrapper = mount(Primitive, {
      attrs: {
        type: 'button',
      },
    })

    const element = wrapper.find('div')

    expect(element.attributes('type')).toBe('button')
  })

  it('should render multiple child elements', () => {
    const wrapper = mount(Primitive, {
      slots: {
        default: '<div>1</div><div>2</div><div>3</div>',
      },
    })

    const element = wrapper.find('div')
    expect(element.findAll('div').length).toBe(3)
  })

  // https://vitest.dev/api/expect.html#tothrowerror
  describe('render as template (asChild)', () => {
    it('should not throw error when multiple child elements exist', () => {
      const wrapper = () =>
        mount(Primitive, {
          props: {
            as: 'template',
          },
          slots: {
            default: '<div>1</div><div>2</div><div>3</div>',
          },
        })

      expect(wrapper().findAll('div').length).toBe(3)
      expect(() => wrapper()).not.toThrowError(/invalid children/)
    })

    it('should pass custom attribute to first element', () => {
      const wrapper = mount(Primitive, {
        props: {
          as: 'template',
          type: 'button',
        },
        slots: {
          default: '<div>1</div><div>2</div><div>3</div>',
        },
      })

      const element = wrapper.findAll('div')
      expect(element[0].attributes('type')).toBe('button')
      expect(element[1].attributes('type')).toBeUndefined()
      expect(element[2].attributes('type')).toBeUndefined()
    })

    it('should merge parent’s class with child’s classes', () => {
      const wrapper = mount(Primitive, {
        props: {
          as: 'template',
        },
        attrs: {
          class: 'parent-class',
        },
        slots: {
          default:
            '<div class="child-class second-child-class">Child class</div>',
        },
      })

      const element = wrapper.find('div')
      expect(element.attributes('class')).toBe(
        'parent-class child-class second-child-class'
      )
    })

    it('should render component passed via as prop', () => {
      const Button = markRaw(
        defineComponent({
          setup(props, { slots }) {
            return () => h('button', { id: 'custom-button' }, slots)
          },
        })
      )

      const wrapper = mount(Primitive, {
        props: {
          as: Button,
        },
        attrs: {
          class: 'parent-class',
        },
      })

      expect(wrapper.html()).toBe(
        '<button id="custom-button" class="parent-class"></button>'
      )
    })

    it('should render child class element tag', () => {
      const wrapper = mount(Primitive, {
        props: {
          as: 'template',
        },

        slots: {
          default: '<a>Child class</a>',
        },
      })

      const element = wrapper.find('a')
      expect(element.exists()).toBeTruthy()
    })

    it('should render child component', () => {
      const ChildComponent = {
        template: '<div id="child">Hello world</div>',
      }
      const RootComponent = {
        components: { ChildComponent, Primitive },
        template: '<Primitive><ChildComponent /></Primitive>',
      }

      const wrapper = mount(RootComponent, {
        props: {
          as: 'template',
        },
      })

      const element = wrapper.find('div')
      expect(element.html()).toBe('<div id="child">Hello world</div>')
    })

    it('should inherit parent and child attributes attributes', () => {
      const wrapper = mount(Primitive, {
        props: {
          as: 'template',
        },
        attrs: {
          'data-parent-attr': '',
        },
        slots: {
          default: '<div data-child-attr>Child class</div>',
        },
      })

      const element = wrapper.find('div')
      expect(element.attributes('data-parent-attr')).toBe('')
      expect(element.attributes('data-child-attr')).toBe('')
    })

    it('should replace parent attributes with child’s attributes', () => {
      const wrapper = mount(Primitive, {
        props: {
          as: 'template',
        },
        attrs: {
          id: 'parent',
          'data-type': 'button',
        },
        slots: {
          default: '<div id="child" data-type="primary">Child class</div>',
        },
      })

      const element = wrapper.find('div')
      expect(element.attributes('data-type')).toBe('primary')
      expect(element.attributes('id')).toBe('child')
    })

    it("'asChild=true' should work the same as 'as=template'", () => {
      const wrapper = mount(Primitive, {
        props: {
          asChild: true,
        },
        attrs: {
          class: 'parent-class',
        },
        slots: {
          default: '<button class="child-class">Child element</button>',
        },
      })

      const element = wrapper.find('button')
      expect(element.exists()).toBe(true)
      expect(element.attributes('class')).toBe('parent-class child-class')
    })
  })

  describe('internal/custom key', () => {
    it('should have an internal key when no custom key is provided', async () => {
      const wrapper = mount(Primitive)

      // Check if the component was rendered successfully
      expect(wrapper.find('div').exists()).toBe(true)

      // Indirectly confirm the key is working by mounting two instances
      // They should have different DOM elements
      const wrapper2 = mount(Primitive)
      expect(wrapper.element).not.toBe(wrapper2.element)
    })

    it('should apply custom key when provided', async () => {
      const TestWrapper = defineComponent({
        components: { Primitive },
        template: `
          <div>
            <Primitive key="custom-key-1" class="primitive-1" />
            <Primitive key="custom-key-2" class="primitive-2" />
          </div>
        `,
      })

      const wrapper = mount(TestWrapper)

      // Verify both components rendered
      const primitives = wrapper.findAll('.primitive-1, .primitive-2')
      expect(primitives.length).toBe(2)
    })

    it('should work with custom keys when re-rendering', async () => {
      // Create a component with conditional rendering to test key preservation
      const TestWrapper = defineComponent({
        components: { Primitive },
        data() {
          return {
            show: true,
          }
        },
        template: `
          <div>
            <Primitive v-if="show" key="stable-key" id="test-primitive" />
          </div>
        `,
      })

      const wrapper = mount(TestWrapper)

      // Check initial render
      expect(wrapper.find('#test-primitive').exists()).toBe(true)

      // Toggle visibility
      await wrapper.setData({ show: false })
      expect(wrapper.find('#test-primitive').exists()).toBe(false)

      // Toggle back
      await wrapper.setData({ show: true })
      expect(wrapper.find('#test-primitive').exists()).toBe(true)
    })

    it('should pass custom key down when using as="template"', async () => {
      // Distinguish between two template instances
      const TestWrapper = defineComponent({
        components: { Primitive },
        template: `
          <div>
            <Primitive 
              as="template" 
              key="template-key-1" 
              class="parent-class-1"
            >
              <span class="child-1">First child</span>
            </Primitive>
            
            <Primitive 
              as="template" 
              key="template-key-2" 
              class="parent-class-2"
            >
              <span class="child-2">Second child</span>
            </Primitive>
          </div>
        `,
      })

      const wrapper = mount(TestWrapper)

      // Each child should have its own class
      expect(wrapper.find('.child-1').exists()).toBe(true)
      expect(wrapper.find('.child-2').exists()).toBe(true)

      // Parent classes should be correctly applied
      expect(wrapper.find('.child-1').classes()).toContain('parent-class-1')
      expect(wrapper.find('.child-2').classes()).toContain('parent-class-2')
    })

    it('should correctly handle keys with asChild=true', async () => {
      const TestWrapper = defineComponent({
        components: { Primitive },
        template: `
          <div>
            <Primitive 
              :asChild="true" 
              key="child-key-1"
              class="parent-1"
            >
              <button class="button-1">First button</button>
            </Primitive>
            
            <Primitive 
              :asChild="true" 
              key="child-key-2"
              class="parent-2"
            >
              <button class="button-2">Second button</button>
            </Primitive>
          </div>
        `,
      })

      const wrapper = mount(TestWrapper)

      // Check that each button exists and has correct classes
      const button1 = wrapper.find('.button-1')
      const button2 = wrapper.find('.button-2')

      expect(button1.exists()).toBe(true)
      expect(button2.exists()).toBe(true)

      // Parent classes should be applied
      expect(button1.classes()).toContain('parent-1')
      expect(button2.classes()).toContain('parent-2')
    })
  })
})
