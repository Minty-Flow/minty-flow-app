import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEscalatorDown = (props: SvgProps) => (
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
    <Path d="M4.5 7h2.733a2 2 0 0 1 1.337 .513l9.43 8.487h1.5a2.5 2.5 0 1 1 0 5h-2.733a2 2 0 0 1 -1.337 -.513l-9.43 -8.487h-1.5a2.5 2.5 0 1 1 0 -5" />
    <Path d="M18 3v7" />
    <Path d="M15 7l3 3l3 -3" />
  </Svg>
);
export default SvgEscalatorDown;
