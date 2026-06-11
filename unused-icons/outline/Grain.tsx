import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrain = (props: SvgProps) => (
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
    <Path d="M3.5 9.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M8.5 4.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M8.5 14.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M3.5 19.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M13.5 9.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M18.5 4.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M13.5 19.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M18.5 14.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgGrain;
