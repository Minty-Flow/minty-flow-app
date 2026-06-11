import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgZodiacCancer = (props: SvgProps) => (
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
    <Path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M15 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <Path d="M3 12a10 6.5 0 0 1 14 -6.5" />
    <Path d="M21 12a10 6.5 0 0 1 -14 6.5" />
  </Svg>
);
export default SvgZodiacCancer;
