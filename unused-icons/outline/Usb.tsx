import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUsb = (props: SvgProps) => (
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
    <Path d="M10 19a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <Path d="M12 17v-11.5" />
    <Path d="M7 10v3l5 3" />
    <Path d="M12 14.5l5 -2v-2.5" />
    <Path d="M16 10h2v-2h-2l0 2" />
    <Path d="M6 9a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <Path d="M10 5.5h4l-2 -2.5l-2 2.5" />
  </Svg>
);
export default SvgUsb;
