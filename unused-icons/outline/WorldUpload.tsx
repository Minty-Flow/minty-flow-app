import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWorldUpload = (props: SvgProps) => (
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
    <Path d="M21 12a9 9 0 1 0 -9 9" />
    <Path d="M3.6 9h16.8" />
    <Path d="M3.6 15h8.4" />
    <Path d="M11.578 3a17 17 0 0 0 0 18" />
    <Path d="M12.5 3c1.719 2.755 2.5 5.876 2.5 9" />
    <Path d="M18 21v-7m3 3l-3 -3l-3 3" />
  </Svg>
);
export default SvgWorldUpload;
