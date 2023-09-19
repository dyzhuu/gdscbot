import { ColorResolvable } from 'discord.js';

const colors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];

export default function googleColor(
  colorName: 'blue' | 'red' | 'yellow' | 'green' | null = null
): ColorResolvable {
  if (colorName === 'blue') return colors[0] as ColorResolvable;
  if (colorName === 'red') return colors[1] as ColorResolvable;
  if (colorName === 'yellow') return colors[2] as ColorResolvable;
  if (colorName === 'green') return colors[3] as ColorResolvable;
  return colors[Math.floor(Math.random() * 4)] as ColorResolvable;
}
