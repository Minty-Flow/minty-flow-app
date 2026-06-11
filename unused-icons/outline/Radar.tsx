import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRadar = (props: SvgProps) => (
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
    <Path d="M21 12h-8a1 1 0 1 0 -1 1v8a9 9 0 0 0 9 -9" />
    <Path d="M16 9a5 5 0 1 0 -7 7" />
    <Path d="M20.486 9a9 9 0 1 0 -11.482 11.495" />
  </Svg>
);
export default SvgRadar;
