import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgUserMinus = (props: SvgProps) => (
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
    <Path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <Path d="M6 21v-2a4 4 0 0 1 4 -4h4c.348 0 .686 .045 1.009 .128" />
    <Path d="M16 19h6" />
  </Svg>
);
export default SvgUserMinus;
