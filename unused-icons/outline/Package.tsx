import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPackage = (props: SvgProps) => (
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
    <Path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
    <Path d="M12 12l8 -4.5" />
    <Path d="M12 12l0 9" />
    <Path d="M12 12l-8 -4.5" />
    <Path d="M16 5.25l-8 4.5" />
  </Svg>
);
export default SvgPackage;
