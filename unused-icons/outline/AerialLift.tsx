import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAerialLift = (props: SvgProps) => (
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
    <Path d="M4 5l16 -2" />
    <Path d="M12 4v10" />
    <Path d="M6.894 8h10.306c2.45 3 2.45 9 -.2 12h-10.106c-2.544 -3 -2.544 -9 0 -12" />
    <Path d="M5 14h14" />
  </Svg>
);
export default SvgAerialLift;
