import { ColorResolvable } from "discord.js";

const colors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];

export default function googleColor(): ColorResolvable {
    return colors[Math.floor(Math.random() * 4)] as ColorResolvable;
}
