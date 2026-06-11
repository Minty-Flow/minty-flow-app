import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgApiOff = (props: SvgProps) => (
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
    <Path d="M4 13h5" />
    <Path d="M12 16v-4m0 -4h3a2 2 0 0 1 2 2v1c0 .554 -.225 1.055 -.589 1.417m-3.411 .583h-1" />
    <Path d="M20 8v8" />
    <Path d="M9 16v-5.5a2.5 2.5 0 0 0 -5 0v5.5" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgApiOff;
