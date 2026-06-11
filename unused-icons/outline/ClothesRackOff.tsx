import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClothesRackOff = (props: SvgProps) => (
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
    <Path d="M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M12 7v1m0 4v9" />
    <Path d="M9 21h6" />
    <Path d="M7.757 9.243a6 6 0 0 0 3.129 1.653m3.578 -.424a6 6 0 0 0 1.779 -1.229" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgClothesRackOff;
