import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgClockHour9 = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <Path d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-4.883 9.653a1 1 0 0 0 .883 -.993v-5a1 1 0 0 0 -2 0v4h-2.5a1 1 0 0 0 -.993 .883l-.007 .117a1 1 0 0 0 1 1h3.5z" />
  </Svg>
);
export default SvgClockHour9;
