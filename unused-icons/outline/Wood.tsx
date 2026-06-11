import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWood = (props: SvgProps) => (
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
    <Path d="M6 5.5a6 2.5 0 1 0 12 0a6 2.5 0 1 0 -12 0" />
    <Path d="M18 5.5v4.626a1.415 1.415 0 0 1 1.683 2.18l-.097 .108l-1.586 1.586v4c0 1.61 -2.54 2.925 -5.725 3l-.275 0c-3.314 0 -6 -1.343 -6 -3v-2l-1.586 -1.586a1.414 1.414 0 0 1 1.586 -2.287v-6.627" />
    <Path d="M10 12.5v1.5" />
    <Path d="M14 16v1" />
  </Svg>
);
export default SvgWood;
