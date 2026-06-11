import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCardboardsOff = (props: SvgProps) => (
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
    <Path d="M20.96 16.953c.026 -.147 .04 -.298 .04 -.453v-8.5a2 2 0 0 0 -2 -2h-9m-4 0h-1a2 2 0 0 0 -2 2v8.5a2.5 2.5 0 0 0 2.5 2.5h1.06a3 3 0 0 0 2.34 -1.13l1.54 -1.92a2 2 0 0 1 3.12 0l1.54 1.92a3 3 0 0 0 2.34 1.13h1.06c.155 0 .307 -.014 .454 -.041" />
    <Path d="M7 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M16.714 12.7a1 1 0 0 0 -1.417 -1.411l1.417 1.41" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgCardboardsOff;
