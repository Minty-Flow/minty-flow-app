import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgBrandDoctrine = (props: SvgProps) => (
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
    <Path d="M5 14a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <Path d="M9 14h6" />
    <Path d="M12 11l3 3l-3 3" />
    <Path d="M10 3l6.9 6" />
  </Svg>
);
export default SvgBrandDoctrine;
