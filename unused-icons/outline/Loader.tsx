import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLoader = (props: SvgProps) => (
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
    <Path d="M12 6l0 -3" />
    <Path d="M16.25 7.75l2.15 -2.15" />
    <Path d="M18 12l3 0" />
    <Path d="M16.25 16.25l2.15 2.15" />
    <Path d="M12 18l0 3" />
    <Path d="M7.75 16.25l-2.15 2.15" />
    <Path d="M6 12l-3 0" />
    <Path d="M7.75 7.75l-2.15 -2.15" />
  </Svg>
);
export default SvgLoader;
