import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeDuration5 = (props: SvgProps) => (
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
    <Path d="M10 15h2a1.5 1.5 0 0 0 0 -3h-2v-3h3.5" />
    <Path d="M3 12v.01" />
    <Path d="M21 12v.01" />
    <Path d="M12 21v.01" />
    <Path d="M7.5 4.2v.01" />
    <Path d="M16.5 19.8v.01" />
    <Path d="M7.5 19.8v.01" />
    <Path d="M4.2 16.5v.01" />
    <Path d="M19.8 16.5v.01" />
    <Path d="M19.8 7.5v.01" />
    <Path d="M4.2 7.5v.01" />
    <Path d="M16.5 4.206a9.042 9.042 0 0 0 -4.5 -1.206" />
  </Svg>
);
export default SvgTimeDuration5;
