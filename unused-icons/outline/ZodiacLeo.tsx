import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacLeo = (props: SvgProps) => (
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
    <Path d="M13 17a4 4 0 1 0 8 0" />
    <Path d="M3 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M7 7a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
    <Path d="M7 7c0 3 2 5 2 9" />
    <Path d="M15 7c0 4 -2 6 -2 10" />
  </Svg>
);
export default SvgZodiacLeo;
