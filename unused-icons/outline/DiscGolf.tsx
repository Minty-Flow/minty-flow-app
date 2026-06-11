import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDiscGolf = (props: SvgProps) => (
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
    <Path d="M5 5h14" />
    <Path d="M6 5c.32 6.744 2.74 9.246 6 10" />
    <Path d="M18 5c-.32 6.744 -2.74 9.246 -6 10" />
    <Path d="M10 5c0 4.915 .552 7.082 2 10" />
    <Path d="M14 5c0 4.915 -.552 7.082 -2 10" />
    <Path d="M12 15v6" />
    <Path d="M12 3v2" />
    <Path d="M7 16c.64 .64 1.509 1 2.414 1h5.172c.905 0 1.774 -.36 2.414 -1" />
    <Path d="M11 21h2" />
  </Svg>
);
export default SvgDiscGolf;
