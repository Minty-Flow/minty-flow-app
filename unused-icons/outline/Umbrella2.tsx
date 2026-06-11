import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUmbrella2 = (props: SvgProps) => (
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
    <Path d="M5.343 7.343a8 8 0 1 1 11.314 11.314l-11.314 -11.314" />
    <Path d="M10.828 13.34l-4.242 4.243a2 2 0 1 0 2.828 2.828" />
  </Svg>
);
export default SvgUmbrella2;
