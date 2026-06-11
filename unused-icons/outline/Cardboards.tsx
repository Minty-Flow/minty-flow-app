import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCardboards = (props: SvgProps) => (
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
    <Path d="M3 8v8.5a2.5 2.5 0 0 0 2.5 2.5h1.06a3 3 0 0 0 2.34 -1.13l1.54 -1.92a2 2 0 0 1 3.12 0l1.54 1.92a3 3 0 0 0 2.34 1.13h1.06a2.5 2.5 0 0 0 2.5 -2.5v-8.5a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2" />
    <Path d="M7 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M15 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  </Svg>
);
export default SvgCardboards;
