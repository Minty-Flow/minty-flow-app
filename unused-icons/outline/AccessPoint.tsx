import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgAccessPoint = (props: SvgProps) => (
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
    <Path d="M12 12l0 .01" />
    <Path d="M14.828 9.172a4 4 0 0 1 0 5.656" />
    <Path d="M17.657 6.343a8 8 0 0 1 0 11.314" />
    <Path d="M9.168 14.828a4 4 0 0 1 0 -5.656" />
    <Path d="M6.337 17.657a8 8 0 0 1 0 -11.314" />
  </Svg>
);
export default SvgAccessPoint;
