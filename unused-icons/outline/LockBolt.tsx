import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLockBolt = (props: SvgProps) => (
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
    <Path d="M13.5 21h-6.5a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 1.74 1.012" />
    <Path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M8 11v-4a4 4 0 1 1 8 0v4" />
    <Path d="M19 16l-2 3h4l-2 3" />
  </Svg>
);
export default SvgLockBolt;
