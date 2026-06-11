import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgDnaOff = (props: SvgProps) => (
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
    <Path d="M16 12a3.898 3.898 0 0 0 -1.172 -2.828a4.027 4.027 0 0 0 -2.828 -1.172m-2.828 1.172a4 4 0 1 0 5.656 5.656" />
    <Path d="M9.172 20.485a4 4 0 1 0 -5.657 -5.657" />
    <Path d="M14.828 3.515a4 4 0 1 0 5.657 5.657" />
    <Path d="M3 3l18 18" />
  </Svg>
);
export default SvgDnaOff;
