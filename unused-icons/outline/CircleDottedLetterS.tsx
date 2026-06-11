import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCircleDottedLetterS = (props: SvgProps) => (
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
    <Path d="M10 15a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1v-2a1 1 0 0 0 -1 -1h-2a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1" />
    <Path d="M7.5 4.21v.01" />
    <Path d="M4.21 7.5v.01" />
    <Path d="M3 12v.01" />
    <Path d="M4.21 16.5v.01" />
    <Path d="M7.5 19.79v.01" />
    <Path d="M12 21v.01" />
    <Path d="M16.5 19.79v.01" />
    <Path d="M19.79 16.5v.01" />
    <Path d="M21 12v.01" />
    <Path d="M19.79 7.5v.01" />
    <Path d="M16.5 4.21v.01" />
    <Path d="M12 3v.01" />
  </Svg>
);
export default SvgCircleDottedLetterS;
