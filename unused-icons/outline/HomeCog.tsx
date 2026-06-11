import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeCog = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h1.6" />
    <Path d="M20 11l-8 -8l-9 9h2v7a2 2 0 0 0 2 2h4.159" />
    <Path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M18 14.5v1.5" />
    <Path d="M18 20v1.5" />
    <Path d="M21.032 16.25l-1.299 .75" />
    <Path d="M16.27 19l-1.3 .75" />
    <Path d="M14.97 16.25l1.3 .75" />
    <Path d="M19.733 19l1.3 .75" />
  </Svg>
);
export default SvgHomeCog;
