import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCompass = (props: SvgProps) => (
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
    <Path d="M8 16l2 -6l6 -2l-2 6l-6 2" />
    <Path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <Path d="M12 3l0 2" />
    <Path d="M12 19l0 2" />
    <Path d="M3 12l2 0" />
    <Path d="M19 12l2 0" />
  </Svg>
);
export default SvgCompass;
