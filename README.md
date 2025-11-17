# 🥚 Vue Primitive

## 📦 Install

```
pnpm install @maas/vue-primitive
```

## 🪄 Use

### import

```ts
import { Primitive } from '@maas/vue-primitive'
```

> [!TIP]
> To avoid a clash of names when using TresJs you can also import an alias

```ts
import { VuePrimitive } from '@maas/vue-primitive's
```

### as

```vue
<template>
  <Primitive as="button" type="button" @click="handleClick">
    Click me
  </Primitive>
</template>
```

```html
<button type="button">Click me</button>
```

### asChild

```vue
<template>
  <Primitive as-child type="button" class="my-button" @click="handleClick">
    <button>Click me</button>
  </Primitive>
</template>
```

```html
<button type="button" class="my-button">Click me</button>
```

## 🐛 Found a Bug?

If you see something that doesn’t look right, [submit a bug report](https://github.com/magicasaservice/vue-primitive/issues/new?assignees=&labels=bug%2Cpending+triage&template=bug_report.yml). See it. Say it. Sorted.

## 🤝 Credit

This package is mostly a port of [Radix Vue](https://github.com/unovue/reka-ui/tree/v1)’s `Primitive` component. The original concept of the `asChild` prop was invented by the creators of [Radix Primitives](https://github.com/radix-ui/primitives) as far as we know.

## 📄 License

[MIT License](https://github.com/magicasaservice/vue-primitive/blob/main/LICENSE) © 2024-PRESENT [Magic as a Service GmbH](https://github.com/magicasaservice)
