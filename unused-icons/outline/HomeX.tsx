import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgHomeX = (props: SvgProps) => (
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
    <Path d="M19 13.4v-1.4h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h5.5" />
    <Path d="M9 21v-6a2 2 0 0 1 2 -2h2c.402 0 .777 .119 1.091 .323" />
    <Path d="M21.5 21.5l-5 -5" />
    <Path d="M16.5 21.5l5 -5" />
  </Svg>
);
export default SvgHomeX;
