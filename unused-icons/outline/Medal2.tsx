import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgMedal2 = (props: SvgProps) => (
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
    <Path d="M9 3h6l3 7l-6 2l-6 -2l3 -7" />
    <Path d="M12 12l-3 -9" />
    <Path d="M15 11l-3 -8" />
    <Path d="M12 19.5l-3 1.5l.5 -3.5l-2 -2l3 -.5l1.5 -3l1.5 3l3 .5l-2 2l.5 3.5l-3 -1.5" />
  </Svg>
);
export default SvgMedal2;
