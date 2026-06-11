import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSnowboarding = (props: SvgProps) => (
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
    <Path d="M15 3a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M7 19l4 -2.5l-.5 -1.5" />
    <Path d="M16 21l-1 -6l-4.5 -3l3.5 -6" />
    <Path d="M7 9l1.5 -3h5.5l2 4l3 1" />
    <Path d="M3 17c.399 1.154 .899 1.805 1.5 1.951c6 1.464 10.772 2.262 13.5 2.927c1.333 .325 2.333 0 3 -.976" />
  </Svg>
);
export default SvgSnowboarding;
