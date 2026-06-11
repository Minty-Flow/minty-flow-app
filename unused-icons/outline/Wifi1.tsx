import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWifi1 = (props: SvgProps) => (
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
    <Path d="M12 18l.01 0" />
    <Path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
  </Svg>
);
export default SvgWifi1;
