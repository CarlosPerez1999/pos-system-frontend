import type { Meta, StoryObj } from '@storybook/angular';
import { AppButton } from './app-button';

const meta: Meta<AppButton> = {
  title: 'Shared/Button',
  component: AppButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: [
        'primary',
        'secondary',
        'ghost',
        'destructive',
        'success',
        'danger',
        'info',
      ],
    },
    size: {
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg', 'icon'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<AppButton>;

export const Default: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled" [variant]="variant" [size]="size"><span label>Save</span></app-button>`,
  }),
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Primary</span></app-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Secondary</span></app-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Ghost</span></app-button>`,
  }),
};

export const Success: Story = {
  args: {
    variant: 'success',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Success</span></app-button>`,
  }),
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Destructive</span></app-button>`,
  }),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Danger</span></app-button>`,
  }),
};

export const Info: Story = {
  args: {
    variant: 'info',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size"><span label>Info</span></app-button>`,
  }),
};

export const Icon: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
  },
  render: (args) => ({
    props: args,
    template: `<app-button [disabled]="disabled"  [variant]="variant" [size]="size">
        <span label>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h3m6-9v3M7.8 7.8L5.6 5.6m10.6 2.2l2.2-2.2M7.8 16.2l-2.2 2.2M12 12l9 3l-4 2l-2 4z" />
            </svg>
        </span>
    </app-button>`,
  }),
};

export const WithIconLeft: Story = {
  args: {
    variant: 'success',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
      <app-button [disabled]="disabled"  [variant]="variant" [size]="size">
        <svg icon-left xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 5v14m-7-7h14" />
        </svg>
        <span label> Add </span>
      </app-button>
    `,
  }),
};

export const WithIconRight: Story = {
  args: {
    variant: 'success',
    size: 'md',
  },
  render: (args) => ({
    props: args,
    template: `
    <app-button [disabled]="disabled"  [variant]="variant" [size]="size">
      <span label> Add </span>
      <svg icon-right xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m-7-7h14" />
      </svg>
    </app-button>
    `,
  }),
};
