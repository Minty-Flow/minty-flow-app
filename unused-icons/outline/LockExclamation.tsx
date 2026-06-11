import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLockExclamation = (props: SvgProps) => (
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
    <Path d="M15 21h-8a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2h10a2 2 0 0 1 1.734 1.002" />
    <Path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <Path d="M8 11v-4a4 4 0 1 1 8 0v4" />
    <Path d="M19 16v3" />
    <Path d="M19 22v.01" />
  </Svg>
);
export default SvgLockExclamation;
