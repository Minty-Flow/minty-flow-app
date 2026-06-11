import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgVersionsOff = (props: SvgProps) => (
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
    <Path d="M10.184 6.162a2 2 0 0 1 1.816 -1.162h6a2 2 0 0 1 2 2v9m-1.185 2.827a1.993 1.993 0 0 1 -.815 .173h-6a2 2 0 0 1 -2 -2v-7" />
    <Path d="M7 7v10" />
    <Path d="M4 8v8" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgVersionsOff;
