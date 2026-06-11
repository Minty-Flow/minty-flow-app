import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCactus = (props: SvgProps) => (
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
    <Path d="M6 9v1a3 3 0 0 0 3 3h1" />
    <Path d="M18 8v5a3 3 0 0 1 -3 3h-1" />
    <Path d="M10 21v-16a2 2 0 1 1 4 0v16" />
    <Path d="M7 21h10" />
  </Svg>
);
export default SvgCactus;
