import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgSourceCode = (props: SvgProps) => (
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
    <Path d="M14.5 4h2.5a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-5" />
    <Path d="M6 5l-2 2l2 2" />
    <Path d="M10 9l2 -2l-2 -2" />
  </Svg>
);
export default SvgSourceCode;
