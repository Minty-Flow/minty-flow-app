import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDna2 = (props: SvgProps) => (
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
    <Path d="M17 3v1c-.01 3.352 -1.68 6.023 -5.008 8.014c-3.328 1.99 3.336 -2 .008 -.014c-3.328 1.99 -5 4.662 -5.008 8.014v1" />
    <Path d="M17 21.014v-1c-.01 -3.352 -1.68 -6.023 -5.008 -8.014c-3.328 -1.99 3.336 2 .008 .014c-3.328 -1.991 -5 -4.662 -5.008 -8.014v-1" />
    <Path d="M7 4h10" />
    <Path d="M7 20h10" />
    <Path d="M8 8h8" />
    <Path d="M8 16h8" />
  </Svg>
);
export default SvgDna2;
