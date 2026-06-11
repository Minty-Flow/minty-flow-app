import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgTimeDuration15 = (props: SvgProps) => (
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
    <Path d="M12 15h2a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-2v-3h3" />
    <Path d="M9 9v6" />
    <Path d="M3 12v.01" />
    <Path d="M12 21v.01" />
    <Path d="M7.5 4.2v.01" />
    <Path d="M16.5 19.8v.01" />
    <Path d="M7.5 19.8v.01" />
    <Path d="M4.2 16.5v.01" />
    <Path d="M19.8 16.5v.01" />
    <Path d="M4.2 7.5v.01" />
    <Path d="M21 12a9 9 0 0 0 -9 -9" />
  </Svg>
);
export default SvgTimeDuration15;
