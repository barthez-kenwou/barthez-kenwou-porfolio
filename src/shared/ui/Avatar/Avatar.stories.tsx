import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar.ui';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    fallback: 'JD',
    src: '/avatar.png',
  },
};
