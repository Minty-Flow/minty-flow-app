import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgWifi = (props: SvgProps) => (
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
    <Path d="M6.343 12.343a8 8 0 0 1 11.314 0" />
    <Path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" />
  </Svg>
);
export default SvgWifi;
