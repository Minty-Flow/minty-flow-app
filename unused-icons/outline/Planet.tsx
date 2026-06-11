import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlanet = (props: SvgProps) => (
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
    <Path d="M18.816 13.58c2.292 2.138 3.546 4 3.092 4.9c-.745 1.46 -5.783 -.259 -11.255 -3.838c-5.47 -3.579 -9.304 -7.664 -8.56 -9.123c.464 -.91 2.926 -.444 5.803 .805" />
    <Path d="M5 12a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
  </Svg>
);
export default SvgPlanet;
