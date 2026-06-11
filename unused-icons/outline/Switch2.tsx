import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSwitch2 = (props: SvgProps) => (
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
    <Path d="M3 17h5l1.67 -2.386m3.66 -5.227l1.67 -2.387h6" />
    <Path d="M18 4l3 3l-3 3" />
    <Path d="M3 7h5l7 10h6" />
    <Path d="M18 20l3 -3l-3 -3" />
  </Svg>
);
export default SvgSwitch2;
