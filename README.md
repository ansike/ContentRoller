# ContentRoller

A React component that displays a list of messages in a carousel.

## Installation

```bash
npm install contentroller

# OR
yarn add contentroller
```

## Usage

```tsx
import { ContentRoller } from 'contentroller';

<ContentRoller messages={['Hello', 'World']} containerHeight={20} />
```

## Props

| Prop            | Type       | Default | Description                             |
| --------------- | ---------- | ------- | --------------------------------------- |
| messages        | `string[]` | `[]`    | The messages to display in the carousel |
| containerHeight | `number`   | `20`    | The height of the container             |
| stayDuration    | `number`   | `3000`  | The duration of the message            |
